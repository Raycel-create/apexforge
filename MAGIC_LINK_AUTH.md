# Magic Link Email Verification

## Overview

ApexForge now supports **passwordless authentication** via magic link email verification. Users can sign in or verify their email address without remembering passwords - just click a secure link sent to their inbox.

## Features

### 🪄 Magic Link Authentication
- **Passwordless sign-in**: No need to remember passwords
- **Secure tokens**: Each link uses a unique ULID token
- **Time-limited**: Links expire after 15 minutes
- **One-time use**: Links can only be used once
- **Auto-verification**: Email is verified on successful magic link click

### 🔐 Security Features
- Unique token generation using ULID
- Expiration timestamps to prevent replay attacks
- Single-use enforcement
- Secure token storage in browser KV store

### 📧 Email Verification Status
- Visual badges showing verification status
- Banner prompts for unverified users
- Easy re-send functionality
- Real-time countdown timer

## How It Works

### For Users

#### Sign In with Magic Link
1. Navigate to the Auth page
2. Select the "Magic Link" tab
3. Enter your email address
4. Click "Send Magic Link"
5. Check your email (or browser console in dev mode)
6. Click the link to instantly sign in

#### Verify Email from Dashboard
1. If your email is unverified, you'll see a banner
2. Click "Send verification link"
3. A magic link dialog will appear
4. Follow the same process as signing in
5. Your email will be marked as verified

### For Developers

#### Magic Link Generation
```typescript
import { generateMagicLink, formatMagicLinkUrl } from './lib/magicLinkAuth'

const magicLink = generateMagicLink(email)
const url = formatMagicLinkUrl(magicLink.token)
// Send url via email
```

#### Verification
```typescript
import { isMagicLinkValid } from './lib/magicLinkAuth'

const link = magicLinks[token]
if (isMagicLinkValid(link)) {
  // Mark as used and sign in user
}
```

#### Email Verification Status
```typescript
import { EmailVerificationStatus } from './components/EmailVerificationStatus'

<EmailVerificationStatus email={userEmail} />
```

## Components

### `MagicLinkAuth`
Main component for magic link authentication flow.

**Props:**
- `onSuccess: (email: string) => void` - Called when verification succeeds
- `onCancel?: () => void` - Optional cancel handler

**Usage:**
```tsx
<MagicLinkAuth 
  onSuccess={(email) => console.log('Verified:', email)}
  onCancel={() => setAuthMode('password')}
/>
```

### `EmailVerificationStatus`
Displays verification badge for an email address.

**Props:**
- `email: string` - Email to check verification status
- `className?: string` - Optional CSS classes

**Usage:**
```tsx
<EmailVerificationStatus email={user.email} />
```

### `EmailVerificationBanner`
Banner that prompts unverified users to verify their email.

**Props:**
- `email: string` - Email to check
- `onVerifyClick: () => void` - Handler for verify button

**Usage:**
```tsx
<EmailVerificationBanner 
  email={user.email}
  onVerifyClick={() => setShowDialog(true)}
/>
```

## Data Structure

### MagicLink
```typescript
interface MagicLink {
  token: string          // Unique ULID token
  email: string          // User's email address
  createdAt: number      // Timestamp of creation
  expiresAt: number      // Timestamp of expiration
  used: boolean          // Whether link has been used
  userId?: string        // Optional user ID
}
```

### EmailVerification
```typescript
interface EmailVerification {
  email: string          // Verified email address
  verified: boolean      // Verification status
  verifiedAt?: number    // Timestamp of verification
}
```

## Storage Keys

The following keys are used in the KV store:

- `apexforge-magic-links`: Record<string, MagicLink> - All magic links by token
- `apexforge-verifications`: Record<string, EmailVerification> - Verification status by email
- `apexforge-current-user`: string | null - Currently signed in user's email

## Development Mode

In development, magic link URLs are logged to the browser console for testing:

```
╔════════════════════════════════════════════════════════════════╗
║                   ✉️  MAGIC LINK EMAIL SENT                    ║
╠════════════════════════════════════════════════════════════════╣
║ To: user@example.com                                           ║
║                                                                ║
║ Subject: Sign in to ApexForge                                  ║
║                                                                ║
║ Click the link below to sign in:                              ║
║                                                                ║
║ http://localhost:5173/?magic_token=01JBCD...                  ║
║                                                                ║
║ This link expires in 15 minutes.                              ║
╚════════════════════════════════════════════════════════════════╝
```

You can also click "Copy Link (Dev Mode)" to copy the URL and paste it in a new tab.

## User Experience Flow

### New User Journey
1. User visits /auth page
2. Chooses "Magic Link" tab (default)
3. Enters email and clicks "Send Magic Link"
4. Sees success message with countdown timer
5. Clicks link in email (or console)
6. Automatically signed in and redirected to dashboard
7. Email is marked as verified

### Existing User Journey
1. User signs in with password
2. Sees verification banner on dashboard (if unverified)
3. Clicks "Send verification link"
4. Dialog opens with magic link form
5. Email is pre-filled, clicks "Send Magic Link"
6. Clicks link to verify
7. Email is marked as verified, banner disappears

## API Reference

### `generateMagicLink(email: string): MagicLink`
Generates a new magic link for the given email.

### `isMagicLinkValid(link: MagicLink): boolean`
Checks if a magic link is valid (not expired or used).

### `formatMagicLinkUrl(token: string): string`
Formats a token into a complete URL.

### `simulateEmailSend(email: string, url: string): Promise<void>`
Simulates sending an email (logs to console in dev mode).

### `verifyEmail(email: string): EmailVerification`
Creates a verified email record.

### `getTimeRemaining(expiresAt: number): string`
Returns formatted time remaining for expiration (MM:SS).

## Future Enhancements

Potential improvements for production deployment:

1. **Real Email Integration**
   - Connect to SendGrid, Mailgun, or AWS SES
   - Beautiful HTML email templates
   - Email delivery tracking

2. **Enhanced Security**
   - Rate limiting on magic link requests
   - IP address tracking
   - Suspicious activity detection

3. **User Preferences**
   - Remember authentication method preference
   - Option to disable password auth
   - Multiple email addresses per account

4. **Analytics**
   - Track magic link usage vs password auth
   - Monitor verification rates
   - Measure conversion impact

## Testing

### Test Magic Link Flow
1. Navigate to http://localhost:5173/
2. Click on "Sign In" or navigate to auth page
3. Select "Magic Link" tab
4. Enter any valid email format
5. Click "Send Magic Link"
6. Open browser console
7. Copy the magic_token URL
8. Paste in address bar or open in new tab
9. Verify successful authentication

### Test Email Verification
1. Sign in with password (unverified user)
2. Go to dashboard
3. You should see verification banner
4. Click "Send verification link"
5. Complete magic link flow
6. Verify banner disappears and badge shows "Verified"

## Support

For issues or questions about magic link authentication:
- Check browser console for magic link URLs in development
- Ensure cookies and localStorage are enabled
- Links expire after 15 minutes - request a new one if needed
- Each link can only be used once
