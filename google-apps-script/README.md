# 📬 Portfolio Contact Form - Backend

**Serverless backend for portfolio contact form using Google Apps Script**

---

## 🚀 Quick Start

### 1. Files in this folder:

- **`Code.gs`** → Google Apps Script backend code
- **`SETUP_GUIDE.md`** → Complete step-by-step setup instructions

### 2. Setup (5 minutes):

1. Create a Google Sheet
2. Open **Extensions** → **Apps Script**
3. Copy contents of `Code.gs` into the script editor
4. Update `CONFIG` settings (your email, timezone)
5. Deploy as Web App
6. Copy Web App URL
7. Paste URL into `assets/js/main.js` → `GOOGLE_SCRIPT_URL`

**📖 Full instructions:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## ⚙️ Configuration

Edit these values in `Code.gs`:

```javascript
const CONFIG = {
  emailTo: 'your-email@gmail.com',        // ← Change this
  emailSubject: '🔔 New Contact Form',
  sheetName: 'Contact Form Submissions',
  timezone: 'Asia/Manila'                  // ← Change this
};
```

---

## ✅ Features

- ✅ Save submissions to Google Sheets
- ✅ Send HTML email notifications
- ✅ Professional email template with styling
- ✅ Automatic timestamp in your timezone
- ✅ Error handling and validation
- ✅ Test function included
- ✅ 100% free (Google's free tier)

---

## 🧪 Testing

### Test from Apps Script:

Run the `testFormSubmission()` function in the script editor.

### Test from website:

1. Fill out your contact form
2. Check Google Sheet for new row
3. Check email for notification

---

## 📊 Data Storage

Form submissions are stored in Google Sheet with these columns:

| Column | Description |
|--------|-------------|
| Timestamp | Date & time (your timezone) |
| First Name | Contact's first name |
| Last Name | Contact's last name |
| Email | Contact's email address |
| Subject | Form subject selection |
| Message | Contact's message |
| Status | Submission status (default: "New") |

---

## 🔒 Security Notes

- Web App URL is private (don't share publicly)
- Access setting: **"Anyone"** (required for form to work)
- Add rate limiting to prevent spam (see SETUP_GUIDE.md)
- Consider adding Google reCAPTCHA for production

---

## 🐛 Troubleshooting

### Form not working?

1. **Check Web App URL** in `main.js`
2. **Verify access setting:** Must be "Anyone"
3. **Check browser console** for errors
4. **View Apps Script logs** for backend errors

### Not receiving emails?

1. Check spam folder
2. Verify `CONFIG.emailTo` is correct
3. Check Apps Script execution log

**📖 More help:** [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#troubleshooting)

---

## 📈 Monitoring

### Google Apps Script Dashboard

View execution logs and quota usage:
1. Apps Script editor → **Executions** (clock icon)
2. See all submissions + any errors

### Google Sheet

Your live database - sort, filter, export submissions anytime.

---

## 🎯 Next Steps

1. [ ] Set up Google Sheet
2. [ ] Deploy Apps Script
3. [ ] Update `GOOGLE_SCRIPT_URL` in frontend
4. [ ] Test form submission
5. [ ] Verify email notification
6. [ ] Go live!

---

## 💡 Tips

- **Test monthly** to ensure form is working
- **Export sheet to CSV** as backup
- **Create Gmail filter** to organize form emails
- **Monitor quota** (Google is generous but has limits)
- **Respond quickly** for better user experience

---

## 📚 Resources

- [Full Setup Guide](./SETUP_GUIDE.md)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet)
- [Mail Service](https://developers.google.com/apps-script/reference/mail/mail-app)

---

**Questions?** Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

**Author:** Habib Jaudian
**Portfolio:** [TsmHabib03](https://github.com/TsmHabib03)
