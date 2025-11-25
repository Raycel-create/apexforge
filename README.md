# ApexForge - AI App Builder Platform

**Production-Ready Application**

ApexForge is a cutting-edge AI-powered application builder that lets users watch a team of AI agents collaborate, debate, and build applications in real-time.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## ✨ Features

### Core Functionality
- **AI Team Debate**: Watch 5 AI agents argue and collaborate in real-time
- **Multi-Model Support**: 70+ AI models from 8 providers (OpenAI, Anthropic, Google, Meta, Mistral, Cohere, xAI, Hugging Face)
- **Fusion Mode**: Enhanced output by combining multiple AI models
- **Live Code Generation**: Real-time application building
- **Instant Deployment**: Simulated deployment with custom domains
- **Idea Incubator**: FREE tool for generating app ideas

### Authentication & Security
- Google OAuth integration
- Magic Link authentication
- OTP verification (SMS/Email)
- Multi-factor authentication (TOTP)
- IP whitelisting
- Session management with timeout
- Secure CEO dashboard with stealth access

### Integrations
- **Stripe**: Payment processing and subscriptions
- **Figma**: Design synchronization
- **Resend**: Email services
- **Twilio**: SMS/OTP services
- **Webhooks**: Event notifications
- **Campaign Automation**: Marketing workflows

### User Experience
- Fully responsive design (mobile, tablet, desktop)
- Accessibility features built-in
- Dark mode support
- Cursor trail effects
- Sparkle click animations
- 24/7 AI chatbot support
- Interactive 3D hero animations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Build Tool**: Vite 6
- **State Management**: React Hooks + Spark KV Storage

### Production Optimizations
- ✅ Terser minification enabled
- ✅ Console logs stripped in production
- ✅ Code splitting with vendor/UI chunks
- ✅ Tree-shaking unused dependencies
- ✅ Error boundaries for graceful failures
- ✅ Optimized bundle sizes

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── pages/          # Page components
│   ├── ui/             # Shadcn UI components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
│   ├── aiService.ts    # AI provider integration
│   ├── CEOAuthContext.tsx
│   └── ...
├── assets/             # Static assets
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔒 Security Features

### CEO Dashboard Access
The CEO dashboard is protected with multiple security layers:
- **Hidden UI Element**: 0.003 opacity (virtually invisible)
- **Keyboard Shortcut**: Shift + Ctrl + M (or ⇧ + ⌃ + M on Mac)
- **Multi-Factor Auth**: TOTP 2FA required
- **IP Whitelist**: Optional IP restriction
- **Session Timeout**: 30-minute inactivity limit
- **Audit Logging**: All actions logged

### Data Protection
- Spark KV storage for persistent data
- Encrypted credential storage
- Secure API key management
- Input validation on all forms
- XSS protection via React

## 📖 Documentation

- **[BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md)** - Complete build and deployment guide
- **[PRODUCTION_RELEASE_VERIFICATION.md](PRODUCTION_RELEASE_VERIFICATION.md)** - Production readiness checklist
- **[PRD.md](PRD.md)** - Product requirements document
- **[SECURITY.md](SECURITY.md)** - Security policies and best practices

## 🎯 Key Pages

- **Home** (`/`) - Landing page with hero and features
- **Dashboard** - User dashboard and analytics
- **Generator** - AI app generation interface
- **Pricing** - Subscription plans and pricing
- **Figma Integration** - Design sync tools
- **CEO Dashboard** - Admin panel (hidden, secured)

## 🛠️ Development

### Commands
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup
No environment variables required! The application uses:
- Spark SDK for runtime configuration
- UI-based settings management
- KV storage for persistence

### Adding Features
1. Create components in `src/components/`
2. Add utilities in `src/lib/`
3. Use existing hooks from `src/hooks/`
4. Follow TypeScript best practices
5. Use Tailwind CSS for styling
6. Leverage Shadcn UI components

## 🎨 Design System

### Color Palette
- **Primary**: Deep rose/pink tones
- **Secondary**: Light rose accents
- **Accent**: Warm highlights
- **Background**: Soft off-white
- **Foreground**: Deep charcoal

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Responsive with clamp()
- **Line Height**: 1.6 for body, 1.2 for headings

### Components
- Shadcn UI v4 (latest)
- Custom branded components
- Consistent spacing using Tailwind
- Smooth animations via Framer Motion

## 📊 Performance

### Targets
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

### Optimizations Applied
- Code splitting by route
- Lazy loading of heavy components
- Image optimization
- Font preloading
- Asset fingerprinting
- Minification and compression

## 🧪 Testing Production Build

```bash
# 1. Build the application
npm run build

# 2. Preview locally
npm run preview

# 3. Open in browser
# Visit http://localhost:4173

# 4. Test checklist
# ✓ No console errors
# ✓ All pages load
# ✓ Authentication works
# ✓ CEO access hidden (Shift+Ctrl+M)
# ✓ Responsive on mobile
# ✓ Animations smooth
```

## 🚦 Deployment

### Recommended: Spark Platform
This application is optimized for the Spark platform with automatic deployment.

### Alternative: Static Hosting
Deploy the `dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any static hosting service

See [BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md) for detailed instructions.

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🎉 Production Status

**✅ PRODUCTION READY**

This application has been optimized and verified for production deployment:
- All debug code removed
- Console logs stripped
- Minification enabled
- Error handling production-ready
- Security features active
- Performance optimized

See [PRODUCTION_RELEASE_VERIFICATION.md](PRODUCTION_RELEASE_VERIFICATION.md) for full verification details.

---

**Built with ❤️ using Spark**
