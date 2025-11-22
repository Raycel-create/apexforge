# AI Model Integration Guide

## Overview

ApexForge now supports **real AI model integrations** using your own API keys. The system makes actual API calls to OpenAI, Anthropic, xAI, Google, and Meta to power code generation and AI debates.

## Supported AI Models

### 1. **OpenAI (GPT-4o & GPT-4o Mini)**
- **Provider**: OpenAI
- **Models**: 
  - `gpt-4o` - Most capable model
  - `gpt-4o-mini` - Faster, cost-effective
- **API Key Format**: `sk-proj-...` or `sk-...`
- **Get Your Key**: https://platform.openai.com/api-keys
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Pricing**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens (GPT-4o)

### 2. **Anthropic (Claude 3.5 Sonnet)**
- **Provider**: Anthropic
- **Model**: `claude-3-5-sonnet-20241022`
- **API Key Format**: `sk-ant-...`
- **Get Your Key**: https://console.anthropic.com/settings/keys
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Pricing**: ~$3 per 1M input tokens, ~$15 per 1M output tokens

### 3. **xAI (Grok-2)**
- **Provider**: xAI
- **Model**: `grok-2-latest`
- **API Key Format**: `xai-...`
- **Get Your Key**: https://console.x.ai/
- **Endpoint**: `https://api.x.ai/v1/chat/completions`
- **Pricing**: Check xAI console for latest pricing

### 4. **Google (Gemini 1.5 Pro)**
- **Provider**: Google
- **Model**: `gemini-1.5-pro`
- **API Key Format**: `AIza...`
- **Get Your Key**: https://aistudio.google.com/app/apikey
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`
- **Pricing**: Free tier available, then pay-as-you-go

### 5. **Meta (Llama 3.1 via Together AI)**
- **Provider**: Meta (via Together AI)
- **Model**: `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- **API Key Format**: Together AI API key
- **Get Your Key**: https://api.together.xyz/settings/api-keys
- **Endpoint**: `https://api.together.xyz/v1/chat/completions`
- **Pricing**: ~$0.88 per 1M tokens

## How to Configure API Keys

### Step 1: Get Your API Keys

1. Visit the provider's website (links above)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Create a new API key
5. Copy the key immediately (some providers only show it once)

### Step 2: Add Keys to ApexForge

#### Method A: User Dashboard
1. Navigate to **Dashboard**
2. You'll see a red alert: "API Keys Required"
3. Click **"Setup API Keys Now"**
4. The Keys Manager will open inline

#### Method B: CEO Dashboard
1. Log in to **CEO Dashboard** (requires authentication)
2. Navigate to **"Keys"** tab in Integrations Hub
3. Full management interface with all key categories

### Step 3: Configure Each Key

1. Find the AI model you want to use (e.g., "OpenAI (GPT-4o)")
2. Paste your API key in the input field
3. Click **"Test"** to validate the key
4. Wait for validation (makes a real API call)
5. Status will change to ✓ Valid or ✗ Invalid

### Step 4: Start Generating

Once you have at least one valid AI key:
- Green "AI Ready" badge appears in navigation
- You can use the Generator to create apps
- Real AI models will power the debates and code generation

## Key Security Features

### Masked Display
- Keys are shown as `sk_••••••••1234`
- Only last 4 characters visible by default
- Click eye icon to toggle visibility

### Secure Storage
- Keys stored in Spark KV (encrypted storage)
- Keys never logged or exposed in console
- Only sent to respective API endpoints

### Status Validation
- **Valid** (green checkmark): Key tested and working
- **Invalid** (red X): Key test failed
- **Untested** (gray): Key not yet validated

### Actions Available
- **Test**: Validate key against real API
- **Copy**: Copy full key to clipboard
- **Delete**: Remove key from storage
- **Toggle Visibility**: Show/hide key

## How AI Integration Works

### Generation Flow

1. **User enters prompt** in Generator
2. **System checks** for valid API keys
3. **If no keys**: Shows error + opens Keys Manager
4. **If keys exist**: Proceeds with generation

### Real-Time AI Debates

When generating an app:
1. System creates AI Service instance with your keys
2. Multiple AI models called in parallel
3. Each model gets a persona-based system prompt:
   - GPT-4o: "Clean, organized, best practices"
   - Claude: "Security-first, edge cases"
   - Grok: "Fast, edgy, performance"
   - Gemini: "Beautiful UI/UX"
   - Llama: "Open source alternatives"
4. Responses appear as debate messages
5. Real opinions from real models

### Code Generation

For actual code output:
1. System uses the model with lowest latency
2. Framework-specific system prompt
3. Temperature: 0.3 (more deterministic)
4. Max tokens: 4000
5. Returns production-ready code

## API Call Examples

### Debate Response Call
```typescript
const response = await aiService.generateDebateResponse(
  "Build a todo app with authentication",
  gptConfig,
  "Clean & Organized"
)
// Returns: Brief, opinionated feedback (~100 words)
```

### Code Generation Call
```typescript
const response = await aiService.generateCode(
  "Create a login form with validation",
  claudeConfig,
  "React",
  "Node.js"
)
// Returns: Full code with imports, error handling
```

### Key Validation Call
```typescript
const isValid = await aiService.validateAPIKey(
  'openai',
  'sk-proj-...'
)
// Returns: true/false after real API test
```

## Cost Management

### Estimate Costs Per Generation
- **Debate Mode** (5 AI agents, 5 messages each):
  - Input: ~500 tokens per agent = 2,500 total
  - Output: ~100 tokens per agent = 500 total
  - **Cost**: ~$0.03 - $0.10 per generation

- **Code Generation**:
  - Input: ~1,000 tokens
  - Output: ~3,000 tokens
  - **Cost**: ~$0.05 - $0.30 per generation

### Tips to Reduce Costs
1. Use **GPT-4o Mini** instead of GPT-4o (10x cheaper)
2. Select fewer AI agents in debate mode
3. Use **Gemini** (has generous free tier)
4. Set usage limits in provider dashboards
5. Monitor token usage in CEO Dashboard

## Troubleshooting

### "API key test failed"
- **Check**: Key copied correctly (no extra spaces)
- **Check**: Key hasn't expired or been revoked
- **Check**: Billing is set up on provider account
- **Check**: API access enabled (some require waitlist)

### "No valid API keys found"
- At least one key must have "valid" status
- Click "Test" button after adding each key
- Refresh page if status doesn't update

### "Rate limit exceeded"
- Provider API limits hit
- Wait a few minutes and try again
- Check provider dashboard for limit info
- Consider upgrading tier with provider

### CORS errors (in browser console)
- Some providers may block direct browser calls
- ApexForge handles this with proper headers
- If persistent, check provider's CORS policy

## Advanced Configuration

### Custom Model Selection
Edit `src/lib/aiService.ts` to add more models:

```typescript
{
  id: 'custom-model',
  name: 'Custom Model',
  provider: 'openai', // or other
  apiKeyId: 'custom',
  endpoint: 'https://api.example.com/v1/chat',
  modelName: 'custom-model-name'
}
```

### Adjust Generation Parameters

In `aiService.ts`, modify:
- `temperature`: 0.1 (deterministic) to 1.0 (creative)
- `maxTokens`: Control response length
- `systemPrompt`: Customize AI behavior

### Token Usage Tracking

Future enhancement will track:
- Total tokens used per session
- Cost estimation per generation
- Usage analytics in CEO Dashboard

## Provider-Specific Notes

### OpenAI
- Requires billing set up (prepaid)
- Rate limits: 10,000 RPM (requests per minute) on tier 1
- Monitor usage: https://platform.openai.com/usage

### Anthropic
- Credit card required for API access
- Rate limits: 50 RPM on free tier
- Monitor: https://console.anthropic.com/settings/usage

### xAI
- Newer provider, may have waitlist
- Competitive pricing
- Fast response times

### Google (Gemini)
- Generous free tier (60 requests/minute)
- No credit card required for free tier
- Best for testing/prototyping

### Together AI (for Llama)
- Credit-based system
- $25 free credits on signup
- Good for open-source models

## Security Best Practices

1. **Never commit API keys** to git repositories
2. **Rotate keys regularly** (every 3-6 months)
3. **Set spending limits** in provider dashboards
4. **Monitor usage** for unexpected spikes
5. **Use separate keys** for dev/production
6. **Revoke immediately** if key is exposed

## Support & Resources

### Provider Documentation
- OpenAI: https://platform.openai.com/docs
- Anthropic: https://docs.anthropic.com
- xAI: https://docs.x.ai
- Google: https://ai.google.dev/docs
- Together AI: https://docs.together.ai

### ApexForge Support
- Check API_KEY_INTEGRATION.md for implementation details
- See PRD.md for feature requirements
- Review code in `src/lib/aiService.ts`

## Roadmap

### Coming Soon
- [ ] Automatic key rotation
- [ ] Token usage dashboard
- [ ] Cost estimation before generation
- [ ] Bulk key import/export
- [ ] Team key sharing (enterprise)
- [ ] Key expiry notifications
- [ ] Usage analytics per model
- [ ] Custom model endpoints
- [ ] Fallback model configuration
- [ ] Streaming responses

---

**Last Updated**: December 2024
**Version**: 1.0.0
