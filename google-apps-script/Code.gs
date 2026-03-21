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
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const timestamp = Utilities.formatDate(
      new Date(),
      CONFIG.timezone,
      'EEEE, MMMM dd, yyyy \'at\' hh:mm a z'
    );

    // Modern HTML Email with iconography and streamlined layout
    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0; padding:0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #eef2f7 0%, #f8fafc 100%);">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:48px 16px; background: linear-gradient(135deg, #eef2f7 0%, #f8fafc 100%);">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(24,39,75,0.10); border:1px solid #e5e7eb;">

          <!-- Hero -->
          <tr>
            <td style="background:linear-gradient(135deg, #0f172a 0%, #111827 50%, #0b1224 100%); padding:30px 36px; color:#e5e7eb;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align: middle;">
                    <span style="display:inline-flex; align-items:center; padding:6px 12px; background:rgba(59,130,246,0.14); color:#c7d2fe; border-radius:999px; font-size:12px; letter-spacing:0.6px; text-transform:uppercase; font-weight:700;">
                      <span style="display:inline-flex; margin-right:8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 7.75L11.25 12.25C11.7 12.56 12.3 12.56 12.75 12.25L19.5 7.75" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="#93c5fd" stroke-width="1.5"/>
                        </svg>
                      </span>
                      Portfolio Contact
                    </span>
                    <h1 style="margin:14px 0 8px; font-size:26px; font-weight:700; letter-spacing:-0.4px; color:#f8fafc;">New message received</h1>
                    <p style="margin:0; font-size:14px; color:#cbd5e1; line-height:1.5;">A visitor reached out via your portfolio contact form.</p>
                  </td>
                  <td style="width:72px; text-align:right; vertical-align:top;">
                    <span style="display:inline-block; padding:10px; background:rgba(59,130,246,0.18); border-radius:12px;">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 6H17C18.1 6 19 6.9 19 8V16C19 17.1 18.1 18 17 18H7C5.9 18 5 17.1 5 16V8C5 6.9 5.9 6 7 6Z" stroke="#bfdbfe" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19 8L12.48 12.66C12.19 12.86 11.81 12.86 11.52 12.66L5 8" stroke="#bfdbfe" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status & timestamp -->
          <tr>
            <td style="padding:18px 28px; background:#0ea5e9; color:#f8fafc; font-weight:600; letter-spacing:0.3px; text-transform:uppercase; font-size:12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:10px;">
                          <span style="display:inline-block; width:20px; height:20px; background:rgba(255,255,255,0.14); border-radius:50%; text-align:center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle; margin-top:3px;">
                              <path d="M9.5 12.5L11.5 14.5L15 10" stroke="#f8fafc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <circle cx="12" cy="12" r="9" stroke="#f8fafc" stroke-width="1.6"/>
                            </svg>
                          </span>
                        </td>
                        <td style="font-weight:700; color:#f8fafc;">New submission</td>
                      </tr>
                    </table>
                  </td>
                  <td style="text-align:right; font-weight:600; font-size:12px; color:#e0f2fe;">${timestamp}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:48px 40px; background:#ffffff;">

              <!-- Contact Information Cards -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">

                <!-- Name Card -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:24px; border:1px solid #e5e7eb; border-radius:16px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow:0 4px 6px rgba(0,0,0,0.04);">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="width:56px; vertical-align:top; padding-right:20px;">
                                <div style="width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(59,130,246,0.25);">
                                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="white"/>
                                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                              </td>
                              <td style="vertical-align:top;">
                                <p style="margin:0 0 6px; font-size:13px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">Contact Name</p>
                                <h2 style="margin:0 0 8px; font-size:24px; color:#111827; font-weight:800; line-height:1.2; letter-spacing:-0.5px;">${fullName || 'Anonymous User'}</h2>
                                <p style="margin:0; font-size:14px; color:#6b7280; font-weight:500;">New portfolio inquiry</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email Card -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:24px; border:1px solid #e5e7eb; border-radius:16px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow:0 4px 6px rgba(0,0,0,0.04);">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="width:56px; vertical-align:top; padding-right:20px;">
                                <div style="width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, #10b981 0%, #047857 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(16,185,129,0.25);">
                                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="4" width="20" height="16" rx="4" fill="none" stroke="white" stroke-width="2"/>
                                    <path d="m6 8 6 4 6-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                              </td>
                              <td style="vertical-align:top;">
                                <p style="margin:0 0 6px; font-size:13px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">Email Address</p>
                                <a href="mailto:${data.email}" style="display:block; margin:0 0 8px; font-size:20px; color:#3b82f6; font-weight:700; text-decoration:none; line-height:1.3; letter-spacing:-0.3px;">${data.email}</a>
                                <p style="margin:0; font-size:14px; color:#6b7280; font-weight:500;">Click to reply directly</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Subject Card -->
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:24px; border:1px solid #e5e7eb; border-radius:16px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); box-shadow:0 4px 6px rgba(0,0,0,0.04);">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="width:56px; vertical-align:top; padding-right:20px;">
                                <div style="width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(245,158,11,0.25);">
                                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414L8 18h8l5.414-5.414A2 2 0 0 0 22 11.172V4a2 2 0 0 0-2-2h-7.172a2 2 0 0 0-1.242.414L12.586 2.586z" fill="white"/>
                                    <circle cx="8" cy="8" r="2" fill="#f59e0b"/>
                                  </svg>
                                </div>
                              </td>
                              <td style="vertical-align:top;">
                                <p style="margin:0 0 6px; font-size:13px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">Subject Category</p>
                                <h2 style="margin:0 0 12px; font-size:20px; color:#111827; font-weight:700; line-height:1.3; letter-spacing:-0.3px;">${data.subject || 'General Inquiry'}</h2>
                                <span style="display:inline-block; padding:8px 16px; background:linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%); color:#1e40af; font-size:12px; font-weight:800; border-radius:24px; text-transform:uppercase; letter-spacing:0.6px; border:1px solid #93c5fd; box-shadow:0 2px 4px rgba(30,64,175,0.1);">${data.subject || 'General'}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Message Section -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:40px;">
                <tr>
                  <td style="border:1px solid #e5e7eb; border-radius:20px; background:#ffffff; box-shadow:0 8px 16px rgba(0,0,0,0.06); overflow:hidden;">

                    <!-- Message Header -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:28px 32px 20px; background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-bottom:1px solid #e5e7eb;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align:middle; padding-right:16px;">
                                <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 6px 12px rgba(139,92,246,0.25);">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="white" stroke-width="2"/>
                                    <path d="M8 10h8M8 14h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                                  </svg>
                                </div>
                              </td>
                              <td style="vertical-align:middle;">
                                <h3 style="margin:0 0 4px; font-size:20px; font-weight:800; color:#111827; letter-spacing:-0.4px; line-height:1.2;">Message Content</h3>
                                <p style="margin:0; font-size:14px; color:#6b7280; font-weight:600;">Received ${timestamp.split(',')[0]}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Body -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:32px;">
                          <div style="padding:28px; background:linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius:16px; border-left:6px solid #10b981; box-shadow:0 4px 6px rgba(0,0,0,0.04);">
                            <p style="margin:0; font-size:17px; color:#374151; line-height:1.8; white-space:pre-wrap; word-break:break-word; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight:500;">
${data.message || 'No message content provided'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>

                        <!-- Primary Action - Reply -->
                        <td style="width:48%; padding-right:16px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius:16px; box-shadow:0 10px 20px rgba(59,130,246,0.3); transition:all 0.2s;">
                                <a href="mailto:${data.email}" style="display:block; padding:20px 28px; text-decoration:none;">
                                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                                          <tr>
                                            <td style="vertical-align:middle; padding-right:12px;">
                                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 17L4 12L9 7V10H20V14H9V17Z" fill="white"/>
                                              </svg>
                                            </td>
                                            <td style="vertical-align:middle;">
                                              <span style="color:#ffffff; font-size:16px; font-weight:800; letter-spacing:0.3px;">
                                                Reply to ${data.firstName || 'Contact'}
                                              </span>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>

                        <!-- Secondary Action - View Data -->
                        <td style="width:48%; padding-left:16px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="background:#ffffff; border:2px solid #e5e7eb; border-radius:16px; box-shadow:0 6px 12px rgba(0,0,0,0.06); transition:all 0.2s;">
                                <a href="https://docs.google.com/spreadsheets" style="display:block; padding:20px 28px; text-decoration:none;">
                                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                                          <tr>
                                            <td style="vertical-align:middle; padding-right:12px;">
                                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="4" width="18" height="15" rx="3" fill="none" stroke="#6b7280" stroke-width="2"/>
                                                <path d="M8 9h8M8 13h6M8 17h4" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"/>
                                              </svg>
                                            </td>
                                            <td style="vertical-align:middle;">
                                              <span style="color:#6b7280; font-size:16px; font-weight:800; letter-spacing:0.3px;">
                                                View in Sheets
                                              </span>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>

                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Enhanced Footer -->
          <tr>
            <td style="background:linear-gradient(135deg, #1e293b 0%, #334155 100%); padding:32px 40px; border-top:1px solid rgba(255,255,255,0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle; padding-right:16px;">
                          <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #10b981 0%, #047857 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 8px rgba(16,185,129,0.25);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" fill="white"/>
                              <path d="m9 12 2 2 4-4" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </td>
                        <td style="vertical-align:middle;">
                          <h4 style="margin:0 0 4px; color:#e2e8f0; font-size:15px; font-weight:700; line-height:1.3;">Secure Portfolio Contact System</h4>
                          <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.4; font-weight:500;">Automated • Encrypted • Backed up to Google Sheets • ${new Date().getFullYear()}</p>
                        </td>
                      </tr>
                    </table>
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

    // Plain text version (fallback)
    const plainBody = `
New Contact Form Submission

Name: ${fullName}
Email: ${data.email}
Subject: ${data.subject || 'General Inquiry'}

Message:
${data.message}

Received: ${timestamp}

---
This email was automatically generated by your portfolio contact form.
    `.trim();

    // Send email
    MailApp.sendEmail({
      to: CONFIG.emailTo,
      subject: CONFIG.emailSubject,
      htmlBody: htmlBody,
      body: plainBody,
      replyTo: data.email,
      name: 'Portfolio Contact Form'
    });

    console.log('Email notification sent successfully');

  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - email failure shouldn't break the whole submission
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
