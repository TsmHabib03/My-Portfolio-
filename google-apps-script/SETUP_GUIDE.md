# 📧 Contact Form Setup Guide

Complete step-by-step guide to set up your serverless contact form backend using Google Sheets and Google Apps Script.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Google Sheet](#step-1-create-google-sheet)
4. [Step 2: Set Up Apps Script](#step-2-set-up-apps-script)
5. [Step 3: Deploy as Web App](#step-3-deploy-as-web-app)
6. [Step 4: Connect to Frontend](#step-4-connect-to-frontend)
7. [Step 5: Test the Form](#step-5-test-the-form)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)

---

## 🎯 Overview

This setup creates a **100% free, serverless backend** for your portfolio contact form:

- **Google Sheets** → Database to store submissions
- **Google Apps Script** → Backend logic (like a mini server)
- **Gmail** → Free email notifications
- **No servers** → No hosting costs!

**What happens when someone submits your form:**
1. Frontend sends data via `fetch()` API
2. Apps Script receives and validates data
3. Data is saved to Google Sheet
4. HTML email notification sent to your Gmail
5. Success message shown to user

---

## ✅ Prerequisites

Before starting, make sure you have:

- [x] A Google Account (Gmail)
- [x] Access to Google Sheets
- [x] Your portfolio website code
- [x] Basic understanding of JavaScript

**Estimated Setup Time:** 10-15 minutes

---

## 📝 Step 1: Create Google Sheet

### 1.1 Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to: **"Portfolio Contact Forms"**

### 1.2 (Optional) Set Up Columns

The script will auto-create columns, but you can set them up manually:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Timestamp | First Name | Last Name | Email | Subject | Message | Status |

**Note:** The script will automatically create these headers if they don't exist.

---

## ⚙️ Step 2: Set Up Apps Script

### 2.1 Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab will open with the Apps Script editor
3. Delete the default `myFunction()` code

### 2.2 Paste the Script

1. Copy the entire contents of `google-apps-script/Code.gs` from your project
2. Paste it into the Apps Script editor
3. The file should be named `Code.gs` (default)

### 2.3 Configure Settings

Find this section at the top of the script:

```javascript
const CONFIG = {
  emailTo: 'jaudianhabib879@gmail.com',  // ← Your email
  emailSubject: '🔔 New Portfolio Contact Form Submission',
  sheetName: 'Contact Form Submissions',
  timezone: 'Asia/Manila'  // ← Your timezone
};
```

**Update these values:**

- **`emailTo`**: Your Gmail address (where notifications will be sent)
- **`emailSubject`**: Email subject line (customize as you like)
- **`sheetName`**: Sheet name (leave default or customize)
- **`timezone`**: Your timezone ([list of timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))

### 2.4 Save the Script

1. Click the **💾 Save** icon (or press `Ctrl+S` / `Cmd+S`)
2. Name your project: **"Portfolio Contact Form Backend"**

---

## 🚀 Step 3: Deploy as Web App

This is the most important step! It creates your backend API endpoint.

### 3.1 Start Deployment

1. In Apps Script, click **Deploy** → **New deployment**
2. Click the **gear icon** (⚙️) next to "Select type"
3. Choose **Web app**

### 3.2 Configure Deployment

Fill in these settings:

| Setting | Value | Why |
|---------|-------|-----|
| **Description** | `Initial deployment` | Version tracking |
| **Execute as** | **Me** | Script runs with your permissions |
| **Who has access** | **Anyone** | ⚠️ Important! Allows form submissions from your website |

**⚠️ CRITICAL:** Make sure "Who has access" is set to **"Anyone"**!
Otherwise, your contact form won't work.

### 3.3 Authorize the Script

1. Click **Deploy**
2. You'll see a warning: **"Authorization required"**
3. Click **Authorize access**
4. Choose your Google account
5. Click **Advanced** → **Go to Portfolio Contact Form Backend (unsafe)**
   - This is safe - it's your own script!
6. Click **Allow**

### 3.4 Copy the Web App URL

After authorization:

1. You'll see a success message with a **Web app URL**
2. **COPY THIS URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
3. Click **Done**

**🔒 Security Note:** Don't share this URL publicly! Anyone with this URL can submit to your form.

---

## 🔗 Step 4: Connect to Frontend

### 4.1 Update JavaScript

Open your `assets/js/main.js` file and find this line:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

**Replace it with your Web App URL:**

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

### 4.2 Verify the Code

Your contact form JavaScript is already configured! It includes:

- ✅ Loading state ("Sending..." button)
- ✅ Success message
- ✅ Error handling
- ✅ Form reset after submission
- ✅ Auto-hide success message (5 seconds)

No additional changes needed!

---

## 🧪 Step 5: Test the Form

### 5.1 Test from Apps Script (Optional)

Before testing live, you can test from Apps Script:

1. In Apps Script editor, find the `testFormSubmission()` function
2. Click the **Run** button (▶️)
3. Check your email and Google Sheet
4. If successful, you'll see a test submission!

### 5.2 Test Live Form

1. **Open your website** in a browser
2. Navigate to your **Contact** section
3. Fill out the form with test data:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com` (use a real email you own)
   - Subject: `Project Collaboration`
   - Message: `This is a test message`
4. Click **Send Message**

### 5.3 Verify Success

Check these 3 places:

1. **✅ Website:** Green success message appears
2. **✅ Google Sheet:** New row with your test data
3. **✅ Gmail:** Email notification received

**If all 3 work → Success! 🎉**

---

## 🔧 Troubleshooting

### Problem: "Failed to send message"

**Possible causes:**

1. **Wrong Web App URL**
   - Verify the URL in `main.js` matches your deployment
   - URL should end with `/exec`

2. **Access Settings**
   - Check deployment: **Who has access** must be **"Anyone"**
   - Re-deploy if needed: **Deploy** → **Manage deployments** → **Edit** → Change access

3. **CORS Issues**
   - The script uses `mode: 'no-cors'` which is correct
   - No changes needed, but check browser console for errors

### Problem: Form submits but no email received

**Solutions:**

1. **Check Spam Folder**
   - Gmail might filter automated emails

2. **Verify Email Address**
   - Check `CONFIG.emailTo` in Apps Script
   - Must be a valid Gmail address

3. **Check Apps Script Logs**
   - In Apps Script: **Execution log** (icon on left sidebar)
   - Look for errors

### Problem: Data not showing in Google Sheet

**Solutions:**

1. **Check Sheet Name**
   - Verify `CONFIG.sheetName` matches your sheet
   - Name is case-sensitive!

2. **Check Permissions**
   - Script must be authorized (redo Step 3.3)

3. **Apps Script Logs**
   - Check for errors in execution log

### Problem: Button stuck on "Sending..."

**This means the fetch request failed.**

1. **Check Browser Console** (`F12` → Console tab)
2. **Look for errors** (red text)
3. **Common fixes:**
   - Verify Web App URL is correct
   - Check internet connection
   - Try in different browser

---

## 🔐 Advanced Configuration

### Custom Email Template

Edit the `sendEmailNotification()` function in `Code.gs`:

```javascript
const htmlBody = `
  <!-- Your custom HTML email template -->
`;
```

### Add More Form Fields

1. **Frontend (HTML):** Add new input field
2. **JavaScript:** Include field in `data` object:
   ```javascript
   const data = {
     ...
     phoneNumber: formData.get('phoneNumber'),  // New field
   };
   ```
3. **Apps Script:** Update sheet columns:
   ```javascript
   const headers = [..., 'Phone Number'];  // Add to headers
   sheet.appendRow([..., data.phoneNumber || '']);  // Add to data row
   ```
4. **Email:** Add to email template

### Rate Limiting (Prevent Spam)

Add this to `doPost()`:

```javascript
// Simple rate limiting - max 1 submission per IP per hour
const cache = CacheService.getScriptCache();
const ip = e.parameter.userIp || 'unknown';
const cacheKey = 'ratelimit_' + ip;

if (cache.get(cacheKey)) {
  return createResponse(false, 'Please wait before submitting again');
}

// Save to cache for 1 hour
cache.put(cacheKey, 'true', 3600);
```

### Auto-Respond to User

Add this to `sendEmailNotification()`:

```javascript
// Send confirmation email to user
MailApp.sendEmail({
  to: data.email,
  subject: 'Thanks for contacting me!',
  body: `Hi ${data.firstName},\n\nThank you for reaching out! I've received your message and will get back to you soon.\n\nBest regards,\nHabib`
});
```

### Google reCAPTCHA (Prevent Bots)

1. Get reCAPTCHA keys from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Add reCAPTCHA widget to your form
3. Verify token in Apps Script before saving

---

## 📊 Monitoring & Analytics

### View Form Submissions

**Google Sheet:** Your live database
- Sort by timestamp
- Filter by subject
- Export to CSV

### Email Notifications

**Gmail:** Instant alerts
- Create Gmail filter for organization
- Star important submissions
- Auto-archive old ones

### Apps Script Logs

**Execution Log:** Debug issues
- View all script executions
- See error messages
- Monitor API usage

**How to access:**
1. Apps Script editor → **Executions** (clock icon)
2. See all form submissions + any errors

---

## 🎯 Next Steps

### ✅ Checklist

- [ ] Google Sheet created
- [ ] Apps Script deployed
- [ ] Web App URL added to JavaScript
- [ ] Test submission successful
- [ ] Email notification received
- [ ] Form appears correctly on website

### 🚀 Go Live!

Once all tests pass:

1. **Deploy your website** to production
2. **Test once more** with real email
3. **Monitor first few submissions** to ensure everything works
4. **Done!** Your contact form is live 🎉

---

## ❓ FAQ

**Q: Is this really free?**
**A:** Yes! Google's free tier includes:
- Unlimited Google Sheets storage (up to 15GB total)
- 20,000 email sends per day
- Apps Script quotas are very generous

**Q: How secure is this?**
**A:** Reasonably secure:
- Web App URL is not easily guessable
- Data stored in your private Google Sheet
- Add rate limiting to prevent spam
- Consider reCAPTCHA for production

**Q: Can I use a custom domain?**
**A:** The Apps Script URL cannot be customized, but users never see it - it's hidden in your JavaScript.

**Q: What if I redeploy the script?**
**A:** If you create a new deployment, you'll get a new URL. Update it in your JavaScript. Or use **"Manage deployments" → Edit** to keep the same URL.

**Q: Can I use this with React/Vue/other frameworks?**
**A:** Yes! The backend is framework-agnostic. Just use the same `fetch()` request from any JavaScript framework.

---

## 📚 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [MailApp Reference](https://developers.google.com/apps-script/reference/mail/mail-app)
- [fetch() API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 💡 Tips & Best Practices

1. **Test regularly** - Check form monthly to ensure it's working
2. **Backup sheet** - Export to CSV periodically
3. **Monitor quota** - Google Apps Script has generous limits but monitor usage
4. **Clean data** - Remove test submissions from sheet
5. **Respond quickly** - Set up mobile Gmail alerts for faster responses

---

## 🎉 Conclusion

You now have a **professional, serverless contact form** that:

- ✅ Costs $0 to run
- ✅ Requires no server management
- ✅ Sends professional email notifications
- ✅ Stores all submissions in organized spreadsheet
- ✅ Works seamlessly with your portfolio

**Happy coding!** 🚀

---

*Last updated: March 2026*
*Author: Habib Jaudian*
*Portfolio: [github.com/TsmHabib03](https://github.com/TsmHabib03)*
