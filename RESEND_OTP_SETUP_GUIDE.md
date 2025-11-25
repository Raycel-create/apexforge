# Resend Email Setup Guide for Real-Time OTP Verification

## Overview

This guide walks CEOs through setting up Resend email service for sending real-time OTP (One-Time Password) verification codes to users. Resend is recommended for its simplicity, reliability, and developer-friendly API.

## Why Resend?

- **Easy Setup**: Simple API with clear documentation
- **Generous Free Tier**: 100 emails/day, 3,000 emails/month free
- **Fast Delivery**: Optimized for transactional emails like OTP codes
- **Domain Verification**: Professional email delivery from your own domain
- **Test Mode**: Use `onboarding@resend.dev` for testing without domain setup

## Step-by-Step Setup

### 1. Create a Resend Account

1. Visit [resend.com](https://resend.com)
2. Click "Sign Up" or "Get Started"
3. Create your account with email and password
4. Verify your email address

### 2. Get Your API Key

1. After logging in, navigate to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name (e.g., "ApexForge OTP Production")
4. Select permissions: **"Sending access"** (default)
5. Click **"Create"**
6. **IMPORTANT**: Copy your API key immediately - it starts with `re_`
7. Save it securely (you won't be able to see it again)

### 3. Verify Your Domain (Production)

For production use, you need to verify your domain:

1. Go to **Domains** section in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Resend will provide DNS records to add:
   - **SPF Record**: TXT record for authentication
   - **DKIM Records**: TXT records for email signing
   - **DMARC Record**: TXT record for email policy

5. Add these DNS records to your domain provider:
   - Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Navigate to DNS settings
   - Add each TXT record exactly as shown
   - Wait 10-60 minutes for DNS propagation

6. Return to Resend and click **"Verify DNS Records"**
7. Once verified, you can send from any email at your domain

### 4. Configure in ApexForge

1. Navigate to **CEO Dashboard** → **Settings** → **Email Service** tab
2. Select **"Resend (Recommended)"** as your provider
3. Enter your **API Key** (starts with `re_`)
4. Set **From Email**: 
   - Production: `noreply@yourdomain.com` (must match verified domain)
   - Testing: `onboarding@resend.dev`
5. Set **From Name**: Your company name (e.g., "ApexForge")
6. Click **"Save Configuration"**
7. Click **"Send Test Email"** to verify setup

### 5. Testing Without Domain (Quick Start)

For immediate testing without domain verification:

1. Use the special testing address: `onboarding@resend.dev`
2. This is provided by Resend for testing purposes
3. **Note**: Test emails are sent but may not arrive (it's for API testing)
4. Check your browser console to see OTP codes during development

### 6. Production Checklist

Before going live with real users:

- [ ] Domain verified in Resend
- [ ] API key created and saved securely
- [ ] From email uses your verified domain
- [ ] Test email sent successfully
- [ ] OTP codes arriving in real user inboxes
- [ ] Email logs showing successful delivery

## Email Configuration Examples

### For Testing
```
Provider: Resend
API Key: re_123456789abcdefghijklmnop
From Email: onboarding@resend.dev
From Name: ApexForge Testing
```

### For Production
```
Provider: Resend
API Key: re_your_production_key_here
From Email: noreply@yourdomain.com
From Name: ApexForge
```

## DNS Records Example

When verifying `yourdomain.com`, add these to your DNS:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [Long DKIM key provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

## Troubleshooting

### "API key is invalid"
- Ensure you copied the entire key starting with `re_`
- Check for extra spaces before/after the key
- Verify the key wasn't revoked in Resend dashboard

### "Domain not verified"
- Check DNS records are correctly added
- Wait longer (DNS can take up to 48 hours, usually 10-60 minutes)
- Use online DNS checker: whatsmydns.net
- Verify records match exactly what Resend provided

### "Emails not arriving"
- Check spam/junk folder
- Verify "From Email" matches your verified domain
- Check Resend dashboard logs for delivery status
- Ensure recipient email is valid

### "Test email works, production doesn't"
- Confirm you switched from `onboarding@resend.dev` to your domain
- Verify your domain in Resend dashboard shows "Verified"
- Check SPF, DKIM, and DMARC records are all correct

## OTP Email Flow

1. User requests verification (enters email)
2. System generates 6-digit OTP code
3. Email sent via Resend API with OTP code
4. User receives email instantly (typically < 1 second)
5. User enters code to verify
6. System validates code (10-minute expiry)
7. User authenticated successfully

## Security Best Practices

1. **Never share your API key publicly**
2. **Use environment variables in production** (not hardcoded)
3. **Rotate API keys periodically** (every 90 days)
4. **Monitor email logs** for unusual activity
5. **Set up IP whitelist** if needed for extra security
6. **Use HTTPS only** for your application
7. **Implement rate limiting** to prevent abuse

## Cost Considerations

### Free Tier
- 100 emails per day
- 3,000 emails per month
- Perfect for small to medium apps

### Paid Plans (if you exceed free tier)
- $20/month for 50,000 emails
- $80/month for 100,000 emails
- Volume discounts available

## Support Resources

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **DNS Help**: Check with your domain registrar's support
- **ApexForge Support**: Check our documentation and guides

## Quick Commands (For Developers)

### Testing API key with curl:
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

## Next Steps

After configuring Resend:

1. Test OTP verification flow end-to-end
2. Monitor email delivery rates in Resend dashboard
3. Set up email templates for better branding (optional)
4. Configure webhooks for delivery tracking (optional)
5. Review email logs regularly for issues

## Alternative Email Providers

If Resend doesn't fit your needs, ApexForge also supports:

- **SendGrid**: Enterprise-grade, 100 emails/day free tier
- **AWS SES**: Pay-as-you-go, requires AWS account
- **Development Mode**: Console logging for testing

Choose the provider that best fits your needs and budget.

---

**Ready to send real-time OTP codes to your users!** 🚀
