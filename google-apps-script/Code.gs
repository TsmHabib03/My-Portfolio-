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

  // Email subject line (NO EMOJIS - professional SaaS style)
  emailSubject: '[Portfolio] New Contact Form Submission',

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
 * Sends ultra-modern HTML email notification
 * Design: Contemporary frontend aesthetic with SVG icons
 * Compatible with Gmail, Outlook, Apple Mail
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

    const theme = isDarkTheme
      ? {
          pageBg: '#0d1117',
          pageGradient: 'linear-gradient(135deg, #0d1117 0%, #111827 100%)',
          shellBg: '#0d1117',
          shellBorder: '#30363d',
          shellShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          heroBg: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
          heroAccent: '#58a6ff',
          heroText: '#f0f6fc',
          heroSubtext: '#8b949e',
          muted: '#8b949e',
          text: '#e6edf3',
          title: '#f0f6fc',
          surface: 'rgba(22, 27, 34, 0.92)',
          surfaceSolid: '#161b22',
          surfaceAlt: '#0f1720',
          border: '#30363d',
          cardGradient: 'linear-gradient(135deg, rgba(88,166,255,0.10) 0%, rgba(22,27,34,0.96) 100%)',
          pillBg: 'rgba(88,166,255,0.14)',
          pillText: '#79c0ff',
          statusBg: '#111827',
          statusText: '#c9d1d9',
          primary: '#58a6ff',
          secondary: '#1f6feb',
          success: '#3fb950',
          messageBg: '#0d1117',
          messageBorder: '#58a6ff',
          footerBg: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
          footerText: '#8b949e',
          buttonText: '#0d1117',
          secondaryButtonBg: '#161b22',
          secondaryButtonText: '#e6edf3',
          secondaryButtonBorder: '#30363d'
        }
      : {
          pageBg: '#f8fbff',
          pageGradient: 'linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)',
          shellBg: 'rgba(255,255,255,0.92)',
          shellBorder: '#dbeafe',
          shellShadow: '0 24px 60px rgba(37, 99, 235, 0.12)',
          heroBg: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          heroAccent: '#2563eb',
          heroText: '#0f172a',
          heroSubtext: '#475569',
          muted: '#64748b',
          text: '#334155',
          title: '#0f172a',
          surface: 'rgba(255,255,255,0.88)',
          surfaceSolid: '#ffffff',
          surfaceAlt: '#f8fbff',
          border: '#dbeafe',
          cardGradient: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
          pillBg: 'rgba(37,99,235,0.10)',
          pillText: '#1d4ed8',
          statusBg: '#eff6ff',
          statusText: '#1e3a8a',
          primary: '#2563eb',
          secondary: '#1d4ed8',
          success: '#16a34a',
          messageBg: '#f8fbff',
          messageBorder: '#60a5fa',
          footerBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          footerText: '#475569',
          buttonText: '#ffffff',
          secondaryButtonBg: '#ffffff',
          secondaryButtonText: '#1e293b',
          secondaryButtonBorder: '#bfdbfe'
        };

    const avatarUrl = data.profileImageUrl || data.avatarUrl || 'https://raw.githubusercontent.com/TsmHabib03/My-Portfolio-/main/assets/images/Habibprofile.jpg';
    const subjectText = data.subject || 'General Inquiry';
    const safeMessage = data.message || 'No message content provided';

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry</title>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
</head>
<body style="margin:0; padding:0; background:${theme.pageBg}; background-image:${theme.pageGradient}; font-family:Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:${theme.text};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; background:${theme.pageBg}; background-image:${theme.pageGradient};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px; width:100%; background:${theme.shellBg}; border:1px solid ${theme.shellBorder}; border-radius:28px; overflow:hidden; box-shadow:${theme.shellShadow};">

          <tr>
            <td style="padding:28px 24px; background:${theme.heroBg}; border-bottom:1px solid ${theme.border};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:76px; vertical-align:middle; padding-right:16px;">
                    <div style="width:64px; height:64px; border-radius:999px; background:linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%); border:3px solid rgba(255,255,255,0.22); overflow:hidden; text-align:center;">
                      <img src="${avatarUrl}" alt="Habib Avatar" width="64" height="64" style="display:block; width:64px; height:64px; border:0; outline:none; text-decoration:none; object-fit:cover;">
                    </div>
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="display:inline-block; padding:6px 12px; border-radius:999px; background:${theme.pillBg}; color:${theme.pillText}; font-size:12px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; border:1px solid ${theme.border};">
                      New Portfolio Inquiry
                    </div>
                    <h1 style="margin:12px 0 6px; font-size:28px; line-height:1.2; font-weight:800; color:${theme.heroText}; letter-spacing:-0.5px;">A new message landed in your inbox</h1>
                    <p style="margin:0; font-size:14px; line-height:1.6; color:${theme.heroSubtext};">Styled to match your portfolio’s glass cards, soft gradients, and rounded UI.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px; background:${theme.statusBg}; border-bottom:1px solid ${theme.border};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size:12px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:${theme.statusText};">
                    <span style="display:inline-block; width:10px; height:10px; border-radius:999px; background:${theme.success}; margin-right:8px;"></span>
                    Form submitted successfully
                  </td>
                  <td align="right" style="font-size:12px; line-height:1.5; color:${theme.muted};">
                    ${timestamp}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${theme.surface}; background-image:${theme.cardGradient}; border:1px solid ${theme.border}; border-radius:22px; box-shadow:0 12px 30px rgba(15,23,42,0.08);">
                      <tr>
                        <td style="padding:20px;">
                          <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:${theme.muted}; margin-bottom:8px;">Name</div>
                          <div style="font-size:22px; line-height:1.3; font-weight:800; color:${theme.title};">${fullName}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${theme.surface}; background-image:${theme.cardGradient}; border:1px solid ${theme.border}; border-radius:22px; box-shadow:0 12px 30px rgba(15,23,42,0.08);">
                      <tr>
                        <td style="padding:20px;">
                          <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:${theme.muted}; margin-bottom:8px;">Email</div>
                          <a href="mailto:${data.email}" style="font-size:18px; line-height:1.5; font-weight:700; color:${theme.primary}; text-decoration:none;">${data.email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${theme.surface}; background-image:${theme.cardGradient}; border:1px solid ${theme.border}; border-radius:22px; box-shadow:0 12px 30px rgba(15,23,42,0.08);">
                      <tr>
                        <td style="padding:20px;">
                          <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:${theme.muted}; margin-bottom:8px;">Subject</div>
                          <div style="font-size:18px; line-height:1.5; font-weight:700; color:${theme.title}; margin-bottom:10px;">${subjectText}</div>
                          <span style="display:inline-block; padding:8px 14px; border-radius:999px; background:${theme.pillBg}; border:1px solid ${theme.border}; color:${theme.pillText}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${subjectText}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${theme.surface}; background-image:${theme.cardGradient}; border:1px solid ${theme.border}; border-radius:24px; box-shadow:0 12px 30px rgba(15,23,42,0.08);">
                      <tr>
                        <td style="padding:20px 20px 0;">
                          <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:${theme.muted}; margin-bottom:8px;">Message</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 20px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${theme.messageBg}; border:1px solid ${theme.border}; border-left:4px solid ${theme.messageBorder}; border-radius:18px;">
                            <tr>
                              <td style="padding:18px;">
                                <div style="font-size:15px; line-height:1.8; color:${theme.text}; white-space:pre-wrap; word-break:break-word;">${safeMessage}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <a href="mailto:${data.email}" style="display:block; text-align:center; padding:16px 20px; background:linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%); color:${theme.buttonText}; font-size:15px; font-weight:800; text-decoration:none; border-radius:18px; box-shadow:0 10px 24px rgba(37,99,235,0.25);">
                            Reply to ${data.firstName || 'Sender'}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="https://tsmhabib03.github.io/My-Portfolio-/" style="display:block; text-align:center; padding:15px 20px; background:${theme.secondaryButtonBg}; color:${theme.secondaryButtonText}; font-size:15px; font-weight:700; text-decoration:none; border-radius:18px; border:1px solid ${theme.secondaryButtonBorder};">
                            View Portfolio
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 24px; background:${theme.footerBg}; border-top:1px solid ${theme.border};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size:13px; line-height:1.7; color:${theme.footerText}; text-align:center;">
                    Portfolio contact notification • Theme: ${isDarkTheme ? 'Dark' : 'Light'} • ${new Date().getFullYear()}<br>
                    Built to match Habib’s portfolio design system with glass cards, soft gradients, and rounded UI.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const plainBody = `
New Portfolio Inquiry

Theme: ${isDarkTheme ? 'Dark' : 'Light'}
Name: ${fullName}
Email: ${data.email}
Subject: ${subjectText}

Message:
${safeMessage}

Received: ${timestamp}

Portfolio: https://tsmhabib03.github.io/My-Portfolio-/
    `.trim();

    MailApp.sendEmail({
      to: CONFIG.emailTo,
      subject: CONFIG.emailSubject,
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
    message: 'Hi! I would like to discuss a potential project collaboration. Please let me know when you are available.',
    timestamp: new Date().toISOString()
  };

  try {
    saveToSheet(testData);
    sendEmailNotification(testData);
    console.log('✓ Test submission successful! Check your sheet and email.');
  } catch (error) {
    console.error('✗ Test failed:', error);
  }
}
