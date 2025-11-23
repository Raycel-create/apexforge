# Code Generation & Deployment Guide

## Overview

ApexForge now supports **real AI-powered code generation** and simulated deployment using actual API integrations with 8 AI providers and 50+ models.

## New Features Added

### 1. Actual Code Generation Service

Location: `src/lib/codeGenerationService.ts`

The `CodeGenerationService` class provides:

- **Real AI Code Generation**: Uses configured API keys to generate actual code via AI models
- **Architecture Design**: Creates comprehensive application architecture based on requirements
- **Multi-File Generation**: Generates frontend components, backend services, and security middleware
- **AI Debate System**: Multiple AI models discuss and provide feedback on implementation
- **Deployment URL Generation**: Creates unique deployment URLs for generated apps

#### Key Methods:

```typescript
// Generate complete application
async generateApplication(request: GenerationRequest): Promise<GenerationResult>

// Generate AI debates/discussions
async generateDebates(request: GenerationRequest, selectedModels: AIModelConfig[]): Promise<DebateMessage[]>
```

### 2. Mistral AI Integration

Added full support for Mistral AI models:

- **Mistral Large** - Top-tier flagship model
- **Mistral Medium** - Balanced capabilities  
- **Mistral Small** - Fast and efficient
- **Mixtral 8x7B** - Mixture of experts architecture
- **Codestral** - Code generation specialist

API endpoint: `https://api.mistral.ai/v1/chat/completions`

### 3. Cohere Integration

Added full support for Cohere Command models:

- **Command R+** - Most capable model
- **Command R** - Balanced performance
- **Command** - Production-ready
- **Command Light** - Fast and lightweight  
- **Command Nightly** - Latest experimental features

API endpoint: `https://api.cohere.ai/v1/chat`

### 4. Re-enabled CEO Authentication

CEO Dashboard now requires proper authentication:

- **TOTP 2FA**: Time-based one-time passwords via authenticator apps
- **QR Code Setup**: Scan with Google Authenticator, Authy, etc.
- **Session Management**: Persistent sessions across page reloads
- **Protected Routes**: CEO dashboard only accessible when authenticated
- **Visual Indicators**: Authentication status shown in navigation

#### Default Credentials:
- **Username**: `adminadminadmin`
- **Password**: `19780111`
- **TOTP**: Setup required on first login

## How to Use Real Code Generation

### Step 1: Configure API Keys

1. Navigate to CEO Dashboard (click logo 5 times or use CEO button)
2. Login with credentials and TOTP code
3. Go to "Integrations Hub" tab
4. Add API keys for desired providers:
   - OpenAI (GPT-4o, GPT-3.5)
   - Anthropic (Claude 3.5 Sonnet, Claude 3 Opus)
   - xAI (Grok-2, Grok-2 Mini)
   - Google (Gemini 1.5 Pro, Gemini Flash)
   - Meta (Llama 3.1 405B, 70B, 8B)
   - **Mistral** (Large, Medium, Small, Codestral)
   - **Cohere** (Command R+, Command R, Command)
   - Hugging Face (15 open source models)

4. Click "Test" to validate each key
5. Keys with green ✓ status are ready to use

### Step 2: Enable Real Generation

1. Go to the Generator page (Ignite Forge)
2. You'll see an "🤖 Real AI Generation" toggle appear when API keys are configured
3. Click "Enable" to switch from simulated to real generation
4. The toggle will show "✓ Enabled" when active

### Step 3: Select AI Models

1. Click the "AI Models" selector
2. Browse 50+ models across 8 providers
3. Filter by:
   - **Provider**: OpenAI, Anthropic, xAI, Google, Meta, Mistral, Cohere, Hugging Face
   - **Category**: Flagship, Mini, Fast, Vision, Code
4. Select multiple models to enable AI debate mode
5. View selected models summary

### Step 4: Configure Generation

1. Enter your app idea in the prompt field
2. Select frontend framework (React, Vue, Angular, Svelte, Next.js)
3. Select backend (Node.js, Python, Go, Java, Rust)
4. Optionally add integrations (Stripe, Auth, etc.)

### Step 5: Generate

1. Click "Ignite The Forge"
2. Watch AI models debate implementation in real-time
3. See actual code being generated (displayed in debates)
4. View generated files with syntax highlighting
5. Download generated code as JSON

## Generated Output

When real generation is enabled, you receive:

### Generated Files
- **Frontend Components**: Main app component with TypeScript + Tailwind
- **Backend Services**: API server with proper routing and error handling
- **Security Middleware**: Input validation, rate limiting, CORS, auth helpers
- **File Previews**: First 300 characters of each file shown in UI

### AI Debates
- Real responses from each selected AI model
- Technical feedback and suggestions
- Model personality reflected in responses (e.g., Claude focuses on security)
- Timestamped messages showing generation progress

### Deployment Info
- Unique deployment URL (e.g., `https://fitness-tracker-ab4k.apexforge.app`)
- Project saved to dashboard with all generated files
- Download code as JSON file for external use

## Simulated vs Real Generation

### Simulated Mode (Default)
- No API keys required
- Pre-written debate messages
- Instant generation
- Perfect for testing/demos
- Free unlimited generations

### Real Mode (When Enabled)
- Requires valid API keys for at least one provider
- Actual AI model responses
- Real code generation based on your prompt
- Costs depend on API usage
- Production-ready code output

## API Key Security

All API keys are:
- Stored securely in browser local storage
- Never sent to any server (client-side only)
- Masked in the UI (shows only last 4 characters)
- Can be copied, deleted, or hidden at any time
- Validated against actual provider APIs

## Model Recommendations

### For Code Generation:
- **OpenAI GPT-4o** - Best overall code quality
- **Anthropic Claude 3.5 Sonnet** - Security-focused, detailed
- **Mistral Codestral** - Code-specialized
- **Meta CodeLlama 70B** - Open source code expert
- **Cohere Command R+** - Enterprise-grade reliability

### For Fast Prototyping:
- **OpenAI GPT-4o Mini** - Fast and affordable
- **Anthropic Claude 3 Haiku** - Quick responses
- **Mistral Small** - Efficient
- **Cohere Command Light** - Lightweight
- **xAI Grok-2 Mini** - Rapid generation

### For Complex Applications:
- **Anthropic Claude 3.5 Sonnet** - Thoughtful architecture
- **OpenAI GPT-4o** - Comprehensive solutions
- **Google Gemini 1.5 Pro** - 2M context window
- **Meta Llama 3.1 405B** - Largest open model
- **Mistral Large** - European AI excellence

## Troubleshooting

### "No valid AI models selected" Error
- Ensure at least one API key is configured and validated
- Check that selected models belong to providers with valid keys
- Refresh the page if keys were just added

### Generation Fails
- Check API key validity (test in CEO Dashboard)
- Ensure API has sufficient credits/quota
- Try simulated mode first to verify prompt quality
- Check browser console for detailed error messages

### TOTP Issues
- Ensure authenticator app time is synced
- Try entering code quickly before it expires (30 second window)
- Rescan QR code if persistent issues
- Check that manual entry key matches exactly

## Best Practices

1. **Mix Model Types**: Combine flagship models with mini models for balanced quality/speed
2. **Use Multiple Models**: Enable AI debate mode for diverse perspectives
3. **Test API Keys**: Always test keys after adding to ensure validity
4. **Monitor Usage**: Track token consumption to manage API costs
5. **Save Projects**: Generated code is saved to dashboard - review later
6. **Download Code**: Export generated files for use in external projects

## Future Enhancements

Coming soon:
- Direct deployment to Vercel/Netlify
- GitHub repository creation
- Real-time code streaming
- Interactive code editing
- Multi-round refinement
- Visual design previews
