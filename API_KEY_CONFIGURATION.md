# API Key Configuration for AI Model Integrations

## 🚀 Quick Start

ApexForge now supports **real AI model integrations**! This means your app can make actual API calls to OpenAI, Anthropic, xAI, Google, and Meta to power intelligent code generation and AI debates.

### What Changed?

- ✅ **Real API validation** - Keys are tested against actual provider endpoints
- ✅ **Live AI debates** - Multiple models respond with real opinions
- ✅ **Production-ready code** - AI generates actual code, not simulations
- ✅ **Secure storage** - Keys encrypted and masked for security
- ✅ **Cost transparency** - Understand token usage and pricing

## 📋 Prerequisites

You'll need API keys from at least one AI provider. We recommend:

1. **Google Gemini** (Free tier, great for testing)
2. **Together AI** (for Llama - $25 free credits)
3. **OpenAI** (Most capable, requires billing)

## 🔑 Getting Your First API Key

### Option 1: Google Gemini (Recommended for Beginners)

**Why?** Free tier, no billing required, 60 requests/minute

1. Visit https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API key"
4. Create an API key in your project
5. Copy the key (starts with `AIza...`)

**Cost:** FREE ✨

### Option 2: Together AI for Llama (Best Value)

**Why?** $25 free credits, open source models, great pricing

1. Visit https://api.together.xyz/signup
2. Sign up for an account
3. Get $25 in free credits
4. Go to Settings → API Keys
5. Generate a new key
6. Copy the key

**Cost:** FREE $25 credits, then ~$0.88/1M tokens

### Option 3: OpenAI (Most Capable)

**Why?** Best performance, most advanced models, industry standard

1. Visit https://platform.openai.com/signup
2. Create an account
3. Add billing information (prepaid)
4. Go to API Keys section
5. Click "Create new secret key"
6. Name it "ApexForge"
7. Copy immediately (shown only once!)

**Cost:** ~$2.50/1M input tokens, ~$10/1M output (GPT-4o)
**Tip:** Use GPT-4o-mini for 10x lower cost

## 🎯 Adding Keys to ApexForge

### Method 1: Setup Wizard (Easiest)

1. Navigate to **Dashboard** or **CEO Dashboard**
2. Look for the **Keys Manager** card
3. Click **"Setup Wizard"** button
4. Choose your provider
5. Follow step-by-step instructions
6. Copy your key and paste it
7. Click **"Test"** to validate

### Method 2: Direct Input

1. Open **Integrations Hub** (Keys tab in CEO Dashboard)
2. Find your provider in the **AI Models** tab
3. Paste your API key
4. Click **"Test"** button
5. Wait for green ✓ validation

## 🔒 Security Features

### Key Masking
Your keys are displayed as: `sk_••••••••1234`
- Only first 4 and last 4 characters shown
- Click eye icon to toggle visibility

### Secure Storage
- Encrypted in Spark KV storage
- Never logged to console
- Only sent to official API endpoints

### Status Indicators
- **✓ Valid (Green)**: Key tested and working
- **✗ Invalid (Red)**: Test failed, check key
- **Gray**: Not yet tested

## 🎨 Supported AI Models

| Provider | Model | Use Case | Pricing | Free Tier |
|----------|-------|----------|---------|-----------|
| **OpenAI** | GPT-4o | Best overall performance | $2.50-$10/1M tokens | ❌ |
| **OpenAI** | GPT-4o Mini | Fast & cost-effective | 10x cheaper | ❌ |
| **Anthropic** | Claude 3.5 Sonnet | Security-focused | $3-$15/1M tokens | ❌ |
| **xAI** | Grok-2 | Fast, edgy responses | Variable | ❌ |
| **Google** | Gemini 1.5 Pro | Beautiful UI focus | FREE | ✅ 60 RPM |
| **Meta** | Llama 3.1 70B | Open source | $0.88/1M tokens | ✅ $25 credits |

## 💰 Cost Estimation

### Per Generation (5 AI agents debate)
- **Input**: ~2,500 tokens (500 per agent × 5)
- **Output**: ~500 tokens (100 per agent × 5)
- **Cost**: $0.03 - $0.10

### Per Code Generation
- **Input**: ~1,000 tokens
- **Output**: ~3,000 tokens
- **Cost**: $0.05 - $0.30

### Monthly Usage (50 generations)
- **Gemini**: FREE (under limits)
- **Together AI**: $1.50 (from $25 credits)
- **OpenAI GPT-4o-mini**: $3-5
- **OpenAI GPT-4o**: $15-25

## 🛠️ How It Works

### Technical Implementation

1. **User adds API key** → Stored in KV with `untested` status
2. **User clicks "Test"** → Real API call to provider
3. **Validation succeeds** → Status changes to `valid`
4. **User starts generation** → System checks for valid keys
5. **AI Service created** → Loads all valid keys
6. **Multiple models called** → Parallel requests to selected AIs
7. **Responses streamed** → Real debate messages appear
8. **Code generated** → Production-ready output

### Code Flow

```typescript
// 1. Load stored keys
const [aiKeys] = useKV('ceo-keys-ai', [])

// 2. Create AI service with valid keys
const aiService = new AIService(
  aiKeys.filter(k => k.status === 'valid')
)

// 3. Get available models
const models = aiService.getAvailableModels()

// 4. Generate with real AI
const response = await aiService.generateDebateResponse(
  prompt,
  modelConfig,
  agentPersonality
)

// 5. Display real AI response
addDebateMessage(agent, response.content)
```

### API Endpoints Used

- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic**: `https://api.anthropic.com/v1/messages`
- **xAI**: `https://api.x.ai/v1/chat/completions`
- **Google**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`
- **Meta (via Together)**: `https://api.together.xyz/v1/chat/completions`

## 🚨 Troubleshooting

### "API key test failed"

**Possible causes:**
1. Key copied incorrectly (extra spaces, incomplete)
2. Key has been revoked or expired
3. Billing not set up (OpenAI, Anthropic)
4. API access not enabled (some providers have waitlists)
5. Rate limits exceeded

**Solutions:**
- Copy key again carefully
- Check provider dashboard
- Set up billing if required
- Wait a few minutes and retry
- Contact provider support

### "No valid API keys found"

**Solution:**
- Add at least one API key
- Click "Test" to validate
- Ensure status shows green ✓
- Refresh page if needed

### "Generation blocked"

**Reason:** System requires at least one valid AI model key before generation

**Solution:**
1. Click "Setup API Keys Now" in alert
2. Add a key from any provider
3. Test to validate
4. Try generation again

### Rate limit errors

**What it means:** You've hit the provider's request limit

**Solutions:**
- Wait a few minutes
- Check provider dashboard for limits
- Upgrade to higher tier
- Use a different model temporarily

## 📊 Monitoring Usage

### Check Your Usage

Each provider has a dashboard to monitor usage:

- **OpenAI**: https://platform.openai.com/usage
- **Anthropic**: https://console.anthropic.com/settings/usage
- **Google**: https://aistudio.google.com/app/apikey (project settings)
- **Together AI**: https://api.together.xyz/settings/billing

### Set Spending Limits

Protect yourself from unexpected charges:

1. Go to provider's billing settings
2. Set monthly spending cap
3. Enable usage alerts
4. Monitor regularly

**Recommended limits for testing:**
- OpenAI: $10/month
- Anthropic: $10/month
- Together AI: Use free credits first

## 🔐 Best Practices

### Key Management
1. ✅ **Rotate keys quarterly** (every 3 months)
2. ✅ **Use separate keys** for dev/production
3. ✅ **Never commit keys** to git
4. ✅ **Revoke immediately** if exposed
5. ✅ **Monitor usage** weekly

### Cost Control
1. ✅ **Start with free tiers** (Google, Together)
2. ✅ **Set spending limits** on all providers
3. ✅ **Use GPT-4o-mini** instead of GPT-4o
4. ✅ **Test with fewer AI agents** initially
5. ✅ **Monitor token usage** per generation

### Security
1. ✅ **Use masked display** (eye icon)
2. ✅ **Don't share keys** with others
3. ✅ **Check provider security** settings
4. ✅ **Enable 2FA** on provider accounts
5. ✅ **Review API logs** regularly

## 🎓 Next Steps

### 1. Get Your First Key (5 minutes)
→ Start with Google Gemini (free, no billing)

### 2. Add to ApexForge (2 minutes)
→ Use Setup Wizard for guided instructions

### 3. Test Validation (30 seconds)
→ Click "Test" to verify connection

### 4. Generate Your First App (10 seconds)
→ Watch real AI agents collaborate!

### 5. Explore Other Models (optional)
→ Add more providers for diversity

## 📚 Additional Resources

### Documentation
- [AI Integration Guide](./AI_INTEGRATION_GUIDE.md) - Technical deep dive
- [API Key Integration](./API_KEY_INTEGRATION.md) - Implementation details
- [PRD](./PRD.md) - Product requirements

### Provider Docs
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Anthropic Documentation](https://docs.anthropic.com)
- [xAI API Docs](https://docs.x.ai)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Together AI Docs](https://docs.together.ai)

### Support
- Check console for error messages
- Review provider status pages
- Contact provider support for API issues
- Open GitHub issue for ApexForge bugs

## 🎉 Success Checklist

- [ ] Chose a provider (Google or Together recommended)
- [ ] Created API key on provider's site
- [ ] Added key to ApexForge Keys Manager
- [ ] Clicked "Test" and saw green ✓
- [ ] "AI Ready" badge appears in navigation
- [ ] Generated first app successfully
- [ ] Saw real AI debate messages
- [ ] Set spending limit on provider dashboard
- [ ] Bookmarked usage monitoring URL

## 💡 Pro Tips

1. **Use Google for testing** - Free tier is generous for experimentation
2. **Combine multiple models** - Each has unique strengths
3. **GPT-4o-mini is underrated** - 90% of GPT-4o quality, 10% of cost
4. **Monitor the first week closely** - Understand your usage patterns
5. **Take advantage of free credits** - Together AI gives $25 free

---

**Ready to build with real AI?** Start with the Setup Wizard in your dashboard! 🚀

**Last Updated:** December 2024
