# CEO Dashboard Authentication Guide

## Overview

The CEO Dashboard is now protected with a multi-factor authentication system that includes:
- Username & Password authentication
- Time-based One-Time Password (TOTP) authentication
- QR code setup for authenticator apps
- Persistent secure sessions

## Login Credentials

**Username:** `adminadminadmin`  
**Password:** `19780111`

## TOTP Setup Instructions

### First Time Setup

1. Navigate to the CEO Dashboard by clicking the "CEO" link in the navigation
2. You will be redirected to the CEO Authentication page
3. On the right side, you'll see a QR code that needs to be scanned

### Scanning the QR Code

1. **Download an authenticator app** (if you don't have one):
   - Google Authenticator (iOS/Android)
   - Microsoft Authenticator (iOS/Android)
   - Authy (iOS/Android/Desktop)
   - 1Password (with TOTP support)
   - Any other TOTP-compatible authenticator

2. **Open your authenticator app:**
   - Tap the "+" or "Add" button
   - Choose "Scan QR code" or "Scan a barcode"
   - Point your camera at the QR code on the screen
   - The app will automatically add "ApexForge - CEO Dashboard"

3. **Manual Entry (if QR code doesn't work):**
   - Choose "Enter a setup key" or "Manual entry" in your authenticator app
   - Account name: `ApexForge - CEO Dashboard`
   - Your key: Copy the secret key displayed below the QR code
   - Time-based: Yes
   - Digits: 6

### Logging In

1. Enter the username: `adminadminadmin`
2. Enter the password: `19780111`
3. Open your authenticator app and find "ApexForge - CEO Dashboard"
4. Enter the 6-digit code (it changes every 30 seconds)
5. Click "Login to CEO Dashboard"

## Security Features

### TOTP Security
- **One-time use only:** Each 6-digit code can only be used once
- **Time-limited:** Codes expire every 30 seconds
- **Offline generation:** Codes are generated on your device, not over the network
- **No SMS vulnerabilities:** More secure than SMS-based 2FA

### Session Management
- Sessions persist across page refreshes
- Logout button is available in the CEO Dashboard header
- Logging out clears the session and requires re-authentication

### Key Benefits
- **Phishing resistant:** Even if someone steals your password, they can't access without your authenticator
- **Industry standard:** Uses the same TOTP protocol as Google, GitHub, AWS, etc.
- **Multi-device support:** Set up on multiple devices by scanning the same QR code

## Troubleshooting

### "Authentication failed" error
- Make sure you're entering the correct username and password
- Verify you're entering the current 6-digit code from your authenticator app
- Wait for a new code if the current one is about to expire (usually shown with a countdown in the app)
- Check that your phone's time is synchronized (TOTP requires accurate time)

### QR code not loading
- Refresh the page
- Check your internet connection
- Try using the manual entry method instead

### Lost access to authenticator app
- If you lose access to your authenticator, you'll need to reset the TOTP setup
- Clear your browser storage/cache for the app
- The system will generate a new QR code on your next visit

### Code not working
- **Time sync issues:** Make sure your phone's time is set to automatic
- **Old code:** TOTP codes expire every 30 seconds - wait for a fresh code
- **Typo:** Double-check you're entering all 6 digits correctly
- **Wrong account:** Make sure you're looking at "ApexForge - CEO Dashboard" in your authenticator

## Technical Details

### TOTP Specifications
- **Algorithm:** SHA-1
- **Digits:** 6
- **Period:** 30 seconds
- **Issuer:** ApexForge
- **Label:** CEO Dashboard

### Storage
- TOTP secret is encrypted and stored securely using the KV persistence API
- Session state is maintained in secure browser storage
- No credentials are logged or transmitted insecurely

### Code Implementation
The authentication system uses:
- `otpauth` library for TOTP generation and validation
- `qrcode` library for QR code generation
- React Context API for authentication state management
- Persistent storage via Spark KV API

## Development Notes

### Testing
To test with a different authenticator:
1. Clear browser storage for the app
2. Refresh the page
3. A new QR code will be generated
4. Scan with your authenticator app

### Resetting Authentication
To reset the TOTP setup during development:
```javascript
// Open browser console and run:
await spark.kv.delete('ceo-totp-secret')
await spark.kv.delete('ceo-session-active')
// Then refresh the page
```

## Support

For any authentication issues or questions, please contact the development team.
