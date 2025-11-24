# Email Service Integration Guide

## Overview

ApexForge now includes **production-ready email service integration** with support for SendGrid and AWS SES. This enables real email delivery for:
- OTP verification codes (Email & GitHub authentication)
- Magic link authentication emails
- Daily CEO report notifications
- Email campaigns and notifications

## Features

### Supported Email Providers

1. **SendGrid** (Recommended for most users)
   - Easy setup with single API key
   - Reliable delivery and analytics
   - Free tier: 100 emails/day
   - Professional tier: Starting at $15/month for 50K emails

2. **AWS SES** (Best for high volume)
   - AWS infrastructure reliability
   - Cost-effective at scale ($0.10 per 1,000 emails)
   - Requires AWS account and SES verification
   - More complex setup but powerful features

3. **Development Mode**
   - Logs emails to browser console only
   - Perfect for testing and development
   - No actual emails sent

### Email Service Configuration

Access the email service configuration in:
**CEO Dashboard → Settings → Email Service**

#### Configuration Fields

- **Email Provider**: Choose between SendGrid, AWS SES, or Development mode
- **From Email Address**: The email address emails will be sent from (must be verified)
- **From Name**: Display name for outgoing emails (e.g., "ApexForge")

#### SendGrid Setup

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender email address
3. Navigate to Settings → API Keys
4. Create a new API key with "Mail Send" permissions
5. Copy the API key (starts with `SG.`)
6. Paste into ApexForge Email Service Configuration
7. Click "Save Configuration"
8. Click "Send Test Email" to verify

#### AWS SES Setup

1. Sign in to [AWS Console](https://console.aws.amazon.com)
2. Navigate to Amazon SES service
3. Verify your email address or domain under "Verified identities"
4. Create IAM user with SES permissions:
   - `ses:SendEmail`
   - `ses:SendRawEmail`
5. Generate access keys for the IAM user
6. Enter the following in ApexForge:
   - AWS Access Key ID
   - AWS Secret Access Key
   - AWS Region (e.g., us-east-1)
7. Click "Save Configuration"
8. Click "Send Test Email" to verify

### Email Features Integration

#### OTP Authentication Emails

When users authenticate via OTP (One-Time Password), they receive a professionally designed email containing:
- 6-digit verification code in large, prominent display
- Code expiration time (10 minutes)
- Security information
- Provider branding (Gmail or GitHub)

**Automatic Fallback**: If the email service is not configured or fails, the OTP code is logged to the browser console for development testing.

#### Magic Link Emails

Passwordless authentication via magic links sends users:
- One-click sign-in button
- Secure, time-limited link (15 minutes)
- Plain text link copy option
- Security disclaimers

**Automatic Fallback**: Links are always logged to console in development mode.

#### Daily CEO Reports

Automated email notifications containing:
- Revenue metrics and growth statistics
- User growth and engagement data
- Customer complaints summary
- Support metrics and satisfaction scores
- AI-generated insights and recommendations
- Revenue forecasts

Reports are sent automatically at the configured time (default: 12:00 PM Philippine time).

### Email Templates

All emails use responsive HTML templates with:
- Dark theme design matching ApexForge branding
- Mobile-optimized layouts
- Fallback plain text versions
- Professional typography
- Brand-consistent styling

### Email Logs

Track all sent emails in the **Email Logs** tab:
- Recipient email addresses
- Email subjects
- Send timestamps
- Provider used (SendGrid, AWS SES, Development)
- Message IDs for tracking
- Success/failure status

Logs are stored locally and limited to the most recent 100 emails.

## Security & Privacy

### API Key Security

- All API keys are stored encrypted in browser storage
- Keys are never transmitted to third parties
- API keys are masked in the UI (`sk_••••••••1234`)
- Keys can be deleted at any time

### Email Privacy

- Emails are sent directly from your chosen provider (SendGrid/AWS)
- ApexForge does not store email content
- Only send logs (metadata) are retained locally
- No third-party tracking or analytics

### Best Practices

1. **Use Production Providers**: Configure SendGrid or AWS SES for production apps
2. **Verify Sender Email**: Always verify your sender email address with your provider
3. **Test First**: Use "Send Test Email" before enabling notifications
4. **Monitor Logs**: Check email logs regularly for delivery issues
5. **Keep Keys Secure**: Never share your API keys publicly
6. **Use Development Mode**: For testing, use Development mode to avoid sending actual emails

## Troubleshooting

### Common Issues

**"Email service is not configured"**
- Configure your email provider in CEO Dashboard → Settings → Email Service
- Ensure you've saved the configuration
- Verify your API key is valid

**"Configuration error: SendGrid API key appears to be invalid"**
- Check that your API key starts with `SG.`
- Verify the key has "Mail Send" permissions
- Generate a new API key if needed

**"Test email failed"**
- Verify your sender email is verified in SendGrid/AWS SES
- Check API key permissions
- Ensure your account has sufficient credits/quota
- Review error message in toast notification

**"Email not received"**
- Check spam/junk folder
- Verify recipient email is correct
- Review email logs for send confirmation
- Check provider dashboard for delivery status

**AWS SES "Email address not verified"**
- Sender email must be verified in AWS SES
- If using SES sandbox, recipient must also be verified
- Request production access to remove sandbox restrictions

## API Reference

### Email Service API

```typescript
import { emailService } from '@/lib/emailService'

// Send an email
const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to ApexForge',
  html: '<h1>Hello World</h1>',
  text: 'Hello World'
})

if (result.success) {
  console.log('Email sent!', result.messageId)
} else {
  console.error('Email failed:', result.error)
}
```

### Configuration Management

```typescript
// Get current configuration
const config = await emailService.getConfig()

// Save configuration
await emailService.saveConfig({
  provider: 'sendgrid',
  sendgridApiKey: 'SG.xxxxx',
  fromEmail: 'noreply@yourdomain.com',
  fromName: 'Your App Name'
})

// Validate configuration
const validation = await emailService.validateConfig(config)
if (!validation.valid) {
  console.error(validation.errors)
}
```

### Email Logs

```typescript
// Get recent email logs
const logs = await emailService.getEmailLogs(50)

// Clear all logs
await emailService.clearLogs()
```

## Pricing Comparison

### SendGrid Pricing
- **Free**: 100 emails/day forever
- **Essentials**: $15/month - 50,000 emails
- **Pro**: $90/month - 100,000 emails + advanced features

### AWS SES Pricing
- **Pay-as-you-go**: $0.10 per 1,000 emails
- **No monthly fees** (except AWS account costs)
- **Data transfer**: $0.12/GB outbound
- **Best for**: High-volume senders

### Recommendation
- **Small apps**: SendGrid Free tier
- **Growing apps**: SendGrid Essentials
- **High volume**: AWS SES for cost efficiency

## Integration Checklist

- [ ] Sign up for SendGrid or AWS account
- [ ] Verify sender email address
- [ ] Generate API credentials
- [ ] Configure email service in ApexForge
- [ ] Send test email successfully
- [ ] Enable OTP/Magic Link authentication
- [ ] Configure CEO email notifications (optional)
- [ ] Monitor email logs for delivery

## Support

For issues specific to:
- **SendGrid**: Visit [SendGrid Support](https://support.sendgrid.com)
- **AWS SES**: Visit [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- **ApexForge**: Check browser console for detailed error messages

---

**Last Updated**: 2024
**Status**: ✅ Production Ready
