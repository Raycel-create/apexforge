# ApexForge Quick Reference Card

## 🔑 CEO Dashboard Access

**Login Credentials:**
```
Username: adminadminadmin
Password: 19780111
TOTP: Setup via QR code on first login
```

**How to Access:**
1. Click "CEO" button in navigation (or click logo 5 times)
2. Scan QR code with authenticator app (first time only)
3. Enter username, password, and 6-digit TOTP code
4. Session persists until you logout

## 🤖 AI Providers (8 Total)

| Provider | Icon | Models | Best For |
|----------|------|--------|----------|
| OpenAI | 🧠 | 5 | General code, best quality |
| Anthropic | 🛡️ | 5 | Security, detailed responses |
| xAI | ⚡ | 5 | Fast generation, edgy |
| Google | 🎨 | 5 | UI/UX, large context (2M) |
| Meta | 🦙 | 5 | Open source, code |
| **Mistral** | 🌪️ | **5** | **Efficiency, European AI** |
| **Cohere** | 🎯 | **5** | **Enterprise, reliability** |
| Hugging Face | 🤗 | 15 | Open source variety |

**Total: 50+ Models**

## 🆕 New Mistral Models

| Model | Type | Use Case |
|-------|------|----------|
| Mistral Large | Flagship | Complex applications |
| Mistral Medium | Balanced | General purpose |
| Mistral Small | Mini | Fast prototyping |
| Mixtral 8x7B | Fast | Mixture of experts |
| Codestral | Code | Code generation |

## 🆕 New Cohere Models

| Model | Type | Use Case |
|-------|------|----------|
| Command R+ | Flagship | Complex tasks |
| Command R | Balanced | Production apps |
| Command | Fast | Standard use |
| Command Light | Mini | Quick tasks |
| Command Nightly | Experimental | Latest features |

## 🔧 API Key Setup

**Location:** CEO Dashboard → Integrations Hub Tab

**Steps:**
1. Login to CEO Dashboard
2. Click "Integrations Hub" tab
3. Select "AI Models" section
4. Click "+ Add Key" for desired provider
5. Paste your API key
6. Click "Test" to validate
7. Green ✓ = Ready to use

**Where to Get Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- xAI: https://console.x.ai/
- Google: https://makersuite.google.com/app/apikey
- Meta: https://together.ai/ (via Together AI)
- **Mistral: https://console.mistral.ai/**
- **Cohere: https://dashboard.cohere.com/**
- Hugging Face: https://huggingface.co/settings/tokens

## 🚀 Code Generation Quick Start

**3 Easy Steps:**

### 1. Enable Real Generation
```
Generator Page → Toggle "Real AI Generation" → ON
```

### 2. Select Models
```
Click "AI Models" → Choose 2-3 models → Done
```

### 3. Generate
```
Enter prompt → Choose frontend/backend → Click "Ignite The Forge"
```

## 📁 Generated Output

**You Get:**
- ✅ Frontend component (App.tsx)
- ✅ Backend server file
- ✅ Security middleware
- ✅ Real AI debates
- ✅ Deployment URL
- ✅ Downloadable JSON

**File Preview:**
- Shows first 300 characters
- Syntax highlighted
- Language tagged
- Description included

## 💡 Model Selection Tips

**For Quality:**
```
OpenAI GPT-4o + Anthropic Claude 3.5 Sonnet + Mistral Large
```

**For Speed:**
```
OpenAI GPT-4o Mini + xAI Grok-2 Mini + Cohere Command Light
```

**For Code:**
```
Mistral Codestral + Meta CodeLlama + Anthropic Claude 3.5
```

**For Cost:**
```
Hugging Face models + OpenAI GPT-4o Mini + Mistral Small
```

**For Enterprise:**
```
Cohere Command R+ + Anthropic Claude 3.5 + Google Gemini Pro
```

## 🎯 Model Categories

| Category | Count | Purpose |
|----------|-------|---------|
| Flagship | 11 | Most capable, complex tasks |
| Mini | 7 | Fast, affordable, simple tasks |
| Fast | 20 | Optimized speed, quick results |
| Vision | 3 | Image understanding |
| Code | 7 | Code generation specialists |

## 🔄 Generation Modes

### Simulated Mode (Default)
- ❌ No API keys required
- ✅ Instant generation
- ✅ Pre-written debates
- ✅ Free unlimited
- ❌ Mock code only

### Real Mode (New!)
- ✅ Actual API calls
- ✅ Real code generation
- ✅ Live AI debates
- ✅ Production-ready output
- ❌ Costs API credits

**Toggle:** Generator → "Real AI Generation" switch

## 🎨 Framework Options

**Frontend:**
- React ⚛️
- Vue 💚
- Angular 🅰️
- Svelte 🧡
- Next.js ▲

**Backend:**
- Node.js 🟢
- Python 🐍
- Go 🔷
- Java ☕
- Rust 🦀

## 📊 Quick Stats

```
Total Models: 50+
Total Providers: 8
New Providers: 2 (Mistral, Cohere)
Generated Files: 2-4 per generation
Code Preview: 300 chars
Max Context: 2M tokens (Gemini)
Auth Method: TOTP 2FA
Session: Persistent
Storage: Local only
Cost: Pay per API call
```

## 🆘 Troubleshooting

### Error: "No valid AI keys"
**Fix:** Add and validate API keys in CEO Dashboard

### Error: "Generation failed"
**Fix:** Check API credits, try simulated mode

### Error: TOTP invalid
**Fix:** Sync authenticator app time, scan QR again

### Error: Toggle not showing
**Fix:** Add at least one valid API key first

### Error: No debates appearing
**Fix:** Ensure real generation enabled, check console

## 📱 Navigation

**Desktop:**
- Home | Dashboard | Pricing | **CEO** | Ignite Forge

**Mobile:**
- Menu (☰) → All pages + CEO Dashboard

**Indicators:**
- 🔥 Credits count
- ✓ AI Ready status
- ✓ CEO authenticated (when logged in)

## ⌨️ Keyboard Shortcuts

```
None currently - all click-based navigation
```

## 🔐 Security

**What's Stored:**
- ✅ API keys (localStorage, masked)
- ✅ TOTP secret (localStorage, encrypted)
- ✅ Session token (localStorage)
- ✅ Generated projects (localStorage)

**What's NOT Stored:**
- ❌ Passwords (checked only, never saved)
- ❌ Generated code on server (client-only)
- ❌ API calls logs
- ❌ User tracking data

## 📞 Support Links

- **User Guide:** `CODE_GENERATION_GUIDE.md`
- **Technical Docs:** `IMPLEMENTATION_SUMMARY.md`
- **What's New:** `WHATS_NEW.md`
- **PRD:** `PRD.md`
- **This Card:** `QUICK_REFERENCE.md`

---

**Version:** 2.0.0
**Last Updated:** 2024
**Status:** ✅ Production Ready

**Need help?** Check the console for detailed errors!
