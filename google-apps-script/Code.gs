/**
 * ═══════════════════════════════════════════════════════════
 * PORTFOLIO CONTACT FORM - GOOGLE APPS SCRIPT BACKEND
 * ═══════════════════════════════════════════════════════════
 *
 * Purpose: Serverless backend for portfolio contact form
 * Features:
 *   - Saves form submissions to Google Sheets
 *   - Sends HTML email notifications to your Gmail
 *   - Returns JSON response to frontend
 *   - Zero-cost solution using Google's free tier
 *
 * Setup Instructions: See SETUP_GUIDE.md
 * ═══════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

/**
 * ⚠️ IMPORTANT: Update these values before deploying
 */
const CONFIG = {
  // Your Gmail address to receive notifications
  emailTo: 'jaudianhabib879@gmail.com',

  // Email subject prefix (final subject: "[Portfolio] {subject} — {name}")
  emailSubjectPrefix: '[Portfolio]',

  // Google Sheet name (will be created if doesn't exist)
  sheetName: 'Contact Form Submissions',

  // Timezone for timestamps (Philippines)
  timezone: 'Asia/Manila'
};

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER - DO NOT MODIFY
// ═══════════════════════════════════════════════════════════

/**
 * Main entry point for POST requests
 * Handles form submissions from the frontend
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!data.firstName || !data.email || !data.message) {
      return createResponse(false, 'Missing required fields');
    }

    // Save to Google Sheet
    saveToSheet(data);

    // Send email notification
    sendEmailNotification(data);

    // Return success response
    return createResponse(true, 'Form submitted successfully');

  } catch (error) {
    // Log error and return failure response
    console.error('Error processing form:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * Test function for GET requests
 * Visit the web app URL to verify it's working
 */
function doGet() {
  return HtmlService.createHtmlOutput(`
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #2da44e; margin: 0 0 10px; }
          .status { color: #666; margin: 20px 0; }
          .check { color: #2da44e; font-size: 48px; margin: 0; }
          code {
            background: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: Monaco, monospace;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <p class="check">✓</p>
          <h1>Contact Form API Active</h1>
          <p class="status">Your Google Apps Script backend is running successfully!</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Email recipient: <code>${CONFIG.emailTo}</code></li>
            <li>Sheet name: <code>${CONFIG.sheetName}</code></li>
            <li>Timezone: <code>${CONFIG.timezone}</code></li>
          </ul>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            <strong>Next step:</strong> Copy this Web App URL and paste it into your JavaScript file's <code>GOOGLE_SCRIPT_URL</code> variable.
          </p>
        </div>
      </body>
    </html>
  `);
}

// ═══════════════════════════════════════════════════════════
// GOOGLE SHEETS INTEGRATION
// ═══════════════════════════════════════════════════════════

/**
 * Saves form data to Google Sheet
 * Creates sheet and headers if they don't exist
 */
function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.sheetName);

      // Add header row with formatting
      const headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Subject', 'Message', 'Status'];
      sheet.appendRow(headers);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2da44e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');

      // Freeze header row
      sheet.setFrozenRows(1);

      // Set column widths
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(2, 120); // First Name
      sheet.setColumnWidth(3, 120); // Last Name
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 150); // Subject
      sheet.setColumnWidth(6, 400); // Message
      sheet.setColumnWidth(7, 100); // Status
    }

    // Format timestamp
    const timestamp = Utilities.formatDate(
      new Date(),
      CONFIG.timezone,
      'yyyy-MM-dd HH:mm:ss'
    );

    // Append form data
    sheet.appendRow([
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      'New'
    ]);

    // Auto-resize message column if needed
    sheet.autoResizeColumn(6);

    console.log('Data saved to sheet successfully');

  } catch (error) {
    console.error('Error saving to sheet:', error);
    throw new Error('Failed to save data to Google Sheet');
  }
}

// ═══════════════════════════════════════════════════════════
// EMAIL NOTIFICATION
// ═══════════════════════════════════════════════════════════

/**
 * Escapes user-supplied text for safe interpolation into HTML.
 */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sends the HTML email notification.
 * Design: compact "VS Code editor window" card in two variants —
 *   dark  = Tokyo Night ("Night")
 *   light = Tokyo Night Light (default)
 * The variant follows the theme the visitor was using on the site.
 * Table-based layout, all styles inline, no gradients, no remote
 * images — renders correctly in Gmail, Outlook, and Apple Mail
 * even with images blocked.
 */
function sendEmailNotification(data) {
  try {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Anonymous Visitor';
    const timestamp = Utilities.formatDate(
      new Date(),
      CONFIG.timezone,
      'EEEE, MMMM dd, yyyy \'at\' hh:mm a z'
    );
    const isDarkTheme = String(data.theme || '').toLowerCase() === 'dark';

    // Tokyo Night ("Night") — VS Code dark theme
    // Tokyo Night Light — VS Code light theme (default)
    const theme = isDarkTheme
      ? {
          name: 'Tokyo Night',
          pageBg: '#16161e',
          cardBg: '#1a1b26',
          chromeBg: '#1f2335',
          panelBg: '#16161e',
          border: '#3b4261',
          borderSubtle: '#292e42',
          text: '#c0caf5',
          textSecondary: '#a9b1d6',
          muted: '#8189af',
          blue: '#7aa2f7',
          green: '#9ece6a',
          orange: '#ff9e64',
          dotRed: '#f7768e',
          dotYellow: '#e0af68',
          dotGreen: '#9ece6a',
          buttonBg: '#7aa2f7',
          buttonText: '#1a1b26'
        }
      : {
          name: 'Tokyo Night Light',
          pageBg: '#d6d8df',
          cardBg: '#e6e7ed',
          chromeBg: '#dfe0e6',
          panelBg: '#ffffff',
          border: '#c1c2c7',
          borderSubtle: '#d1d3da',
          text: '#343b59',
          textSecondary: '#565a70',
          muted: '#5f6379',
          blue: '#2959aa',
          green: '#385f0d',
          orange: '#965027',
          dotRed: '#8c4351',
          dotYellow: '#8f5e15',
          dotGreen: '#385f0d',
          buttonBg: '#2959aa',
          buttonText: '#ffffff'
        };

    // Escape every user-supplied value before it touches HTML
    const safeFirst   = escapeHtml(data.firstName || 'Sender');
    const safeName    = escapeHtml(fullName);
    const safeEmail   = escapeHtml(data.email || '');
    const safeSubject = escapeHtml(data.subject || 'General Inquiry');
    const safeMessage = escapeHtml(data.message || 'No message content provided');

    const mono = "Consolas, 'SF Mono', Menlo, Monaco, monospace";
    const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    const subjectLine = `${CONFIG.emailSubjectPrefix} ${data.subject || 'General Inquiry'} — ${fullName}`;

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New portfolio message</title>
  <meta name="color-scheme" content="${isDarkTheme ? 'dark' : 'light'}">
  <meta name="supported-color-schemes" content="${isDarkTheme ? 'dark' : 'light'}">
</head>
<body style="margin:0; padding:0; background-color:${theme.pageBg}; font-family:${sans}; color:${theme.text};">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${safeFirst} sent you a message via your portfolio &mdash; ${safeSubject}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${theme.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; width:100%; background-color:${theme.cardBg}; border:1px solid ${theme.border}; border-radius:10px;">

          <!-- Editor chrome -->
          <tr>
            <td style="padding:13px 20px; background-color:${theme.chromeBg}; border-bottom:1px solid ${theme.borderSubtle}; border-radius:10px 10px 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="60" style="vertical-align:middle; line-height:10px;">
                    <span style="display:inline-block; width:10px; height:10px; border-radius:10px; background-color:${theme.dotRed};">&nbsp;</span>
                    <span style="display:inline-block; width:10px; height:10px; border-radius:10px; background-color:${theme.dotYellow}; margin-left:5px;">&nbsp;</span>
                    <span style="display:inline-block; width:10px; height:10px; border-radius:10px; background-color:${theme.dotGreen}; margin-left:5px;">&nbsp;</span>
                  </td>
                  <td align="right" style="font-family:${mono}; font-size:12px; color:${theme.muted}; vertical-align:middle;">portfolio &mdash; new-message</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject + sender -->
          <tr>
            <td style="padding:24px 28px 20px;">
              <div style="font-family:${mono}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:${theme.green}; padding-bottom:10px;">New message</div>
              <h1 style="margin:0 0 12px; font-family:${sans}; font-size:20px; line-height:1.35; font-weight:700; color:${theme.text};">${safeSubject}</h1>
              <div style="font-size:14px; line-height:1.6; color:${theme.textSecondary};">
                From <span style="font-weight:700; color:${theme.text};">${safeName}</span>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${safeEmail}" style="color:${theme.blue}; text-decoration:none;">${safeEmail}</a>
              </div>
              <div style="padding-top:6px; font-size:12px; line-height:1.5; color:${theme.muted};">${timestamp}</div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 28px 24px;">
              <div style="font-family:${mono}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:${theme.muted}; padding-bottom:8px;">Message</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${theme.panelBg}; border:1px solid ${theme.border}; border-radius:8px;">
                <tr>
                  <td style="padding:16px 18px; font-size:15px; line-height:1.7; color:${theme.text}; white-space:pre-wrap; word-break:break-word;">${safeMessage}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Actions -->
          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:8px; background-color:${theme.buttonBg};">
                    <a href="mailto:${safeEmail}?subject=${encodeURIComponent('Re: ' + (data.subject || 'your message'))}" style="display:inline-block; padding:12px 24px; font-family:${sans}; font-size:14px; line-height:20px; font-weight:700; color:${theme.buttonText}; text-decoration:none; border-radius:8px;">Reply to ${safeFirst}</a>
                  </td>
                  <td style="padding-left:18px;">
                    <a href="https://tsmhabib03.github.io/My-Portfolio-/" style="font-size:14px; font-weight:600; color:${theme.blue}; text-decoration:none;">View portfolio &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:14px 28px; background-color:${theme.chromeBg}; border-top:1px solid ${theme.borderSubtle}; border-radius:0 0 10px 10px; font-family:${mono}; font-size:11px; line-height:1.6; color:${theme.muted}; text-align:center;">
              Sent from the contact form on tsmhabib03.github.io &middot; ${theme.name}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const plainBody = `
New portfolio message

From: ${fullName}
Email: ${data.email}
Subject: ${data.subject || 'General Inquiry'}
Received: ${timestamp}

Message:
${data.message || 'No message content provided'}

Reply: mailto:${data.email}
Portfolio: https://tsmhabib03.github.io/My-Portfolio-/
    `.trim();

    MailApp.sendEmail({
      to: CONFIG.emailTo,
      subject: subjectLine,
      htmlBody: htmlBody,
      body: plainBody,
      replyTo: data.email,
      name: 'Portfolio Contact Form'
    });

    console.log(`Email notification sent successfully (${isDarkTheme ? 'dark' : 'light'} theme)`);

  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Creates standardized JSON response
 */
function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    ...data
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * (Optional) Function to manually test the script
 * Run this from Apps Script editor to verify everything works
 */
function testFormSubmission() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    subject: 'Project Collaboration',
    message: 'Hi! I would like to discuss a potential project collaboration.\n\nPlease let me know when you are available.',
    timestamp: new Date().toISOString()
  };

  try {
    saveToSheet(testData);
    // Light (Tokyo Night Light — default)
    sendEmailNotification(Object.assign({}, testData, { theme: 'light' }));
    // Dark (Tokyo Night)
    sendEmailNotification(Object.assign({}, testData, { theme: 'dark' }));
    console.log('✓ Test submission successful! Check your sheet and both emails (light + dark).');
  } catch (error) {
    console.error('✗ Test failed:', error);
  }
}
