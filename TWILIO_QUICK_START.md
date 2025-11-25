# Twilio SMS Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Get Twilio Credentials (2 minutes)
1. Go to [console.twilio.com](https://console.twilio.com)
2. Sign up or log in
3. Copy your **Account SID** (starts with "AC")
4. Copy your **Auth Token** (click to reveal)
5. Get a phone number with SMS capability

### Step 2: Configure in ApexForge (2 minutes)
1. Navigate to **CEO Dashboard**
2. Go to **Settings** → **SMS/Twilio** tab
3. Paste **Account SID**
4. Paste **Auth Token**
5. Paste **Twilio Phone Number** (e.g., +1 555 123 4567)
6. Click **Test Connection** ✅
7. Click **Save Configuration** 💾

### Step 3: Test It Out (1 minute)
1. Go to **Sign In** page
2. Select **SMS OTP** tab
3. Enter your phone number (include country code: +1...)
4. Click **Send Verification Code** 📱
5. Check your phone for SMS
6. Enter the 6-digit code
7. **Done!** You're authenticated! 🎉

---

## 💡 Development Mode (No Twilio Account Required)

**For testing without SMS charges:**

1. Skip Twilio configuration
2. Go to Auth page → SMS OTP tab
3. Enter any valid phone number
4. Click "Send Verification Code"
5. **Open browser console** (F12)
6. Find the 6-digit code in the console output
7. Paste code into input fields
8. Success! ✅

**Perfect for local development and testing!**

---

## 🎯 Key Features

✅ **Production SMS** - Real SMS delivery via Twilio
✅ **Development Mode** - Console logging for testing
✅ **Auto-Fallback** - Graceful degradation if Twilio fails
✅ **Secure Storage** - Encrypted credential storage
✅ **10-Minute Expiry** - Time-limited codes
✅ **3 Attempts Max** - Brute force protection
✅ **Smart Input** - Auto-advance and paste support
✅ **International** - Worldwide phone number support

---

## 🔒 Security Best Practices

1. **Never share Auth Token** - Keep it secret!
2. **Use environment variables** - Don't commit to code
3. **Enable 2FA on Twilio** - Protect your account
4. **Monitor usage** - Track SMS costs in Twilio console
5. **Test first** - Use Test Connection before saving

---

## 📞 Phone Number Format

**Always include country code!**

✅ **Correct:**
- `+1 555 123 4567` (US)
- `+44 20 7946 0958` (UK)
- `+63 917 123 4567` (Philippines)

❌ **Incorrect:**
- `555 123 4567` (missing country code)
- `15551234567` (missing + symbol)

---

## 🐛 Quick Troubleshooting

**SMS not received?**
- Verify phone number format (country code + area code + number)
- Check Twilio account has credits
- Try "Resend Code" button

**"Invalid credentials" error?**
- Re-copy Account SID from Twilio console
- Re-copy Auth Token (click "show" first)
- Ensure no extra spaces

**Code expired?**
- Click "Resend Code"
- You have 10 minutes to enter code

---

## 🎉 You're All Set!

Your ApexForge now has production-ready SMS OTP authentication powered by Twilio! 

**Questions?** Check the full guide: `TWILIO_SMS_CONFIGURATION.md`
