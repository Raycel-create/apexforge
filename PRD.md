# Planning Guide

ApexForge is the first AI app builder that feels like you hired a world-class 5-person AI dev team that argues, brainstorms, and ships production-ready apps in real time — all with live domains in ONE browser tab. Now with 11 killer integrations including native mobile builds, desktop apps, browser extensions, Figma sync, AI voice co-pilot, and more.

**Experience Qualities**:
1. **Addictive** - Real-time AI debates + drag-and-drop Fusion Mode creates TikTok-level engagement
2. **Alive** - 5+ AI agents arguing, flaming, and shipping feels like watching a startup war room, not a loading screen
3. **Viral** - Every project gets a shareable "Forge Card" + instant HTTPS domain → screenshot-worthy moments
4. **All-in-One** - Native builds, desktop exports, extensions, Figma sync, voice control - users never need another tool

**Complexity Level**: Complex Application (advanced functionality with real-time state, multiple interactive features, gamified elements, 11 integrations)
- Full AI debate simulation with 5+ agents, live chat UI with voting, Fusion Mode drag-and-drop, Idea Incubator, Evolve mode, heatmap visualization, CEO Whisper mode, $500 security upsell, plus 11 killer integrations (Native Mobile, Desktop Apps, Browser Extensions, Figma Two-Way, AI Voice Co-Pilot, Live User Testing, App Store Submission, Backend Wizard, AI SEO, White-Label, AI PM). Every feature designed for virality and differentiation from emergent.sh/v0.

## Essential Features

### Magic Link Email Verification (🪄 Passwordless Authentication)
- **Functionality**: Passwordless authentication system using magic links sent to user's email. Users can sign in or verify their email by clicking a secure, time-limited link. Supports both new user registration and email verification for existing users.
- **Purpose**: Modern, secure authentication that removes password friction and increases conversion while providing email verification
- **Trigger**: Accessible from auth page via "Magic Link" tab, or from dashboard verification banner for unverified users
- **Progression**: User enters email → Clicks "Send Magic Link" → Receives unique link (console in dev mode) → Clicks link → Auto-authenticated & email verified → Redirected to dashboard
- **Success criteria**:
  - Links expire after 15 minutes with countdown timer
  - One-time use enforcement (links marked as used)
  - Unique ULID token generation for each link
  - Visual verification badges and status indicators
  - Verification banner for unverified users
  - Dialog flow for verification from dashboard
  - Seamless integration with existing password auth
  - Console logging of magic links in development mode

### API Key Management System (🔑 Security & Integration Feature)
- **Functionality**: Comprehensive API key management for AI models (OpenAI, Anthropic, xAI, Google, Meta, Mistral, Cohere, Hugging Face), services (Stripe, Supabase, Firebase, Vercel, Figma, Expo), and app stores (Apple, Google Play). Integrated into both CEO Dashboard and User Dashboard with validation, testing, and secure storage. **Now configured for actual AI model integrations** - keys are used to make real API calls to 8 AI providers with **50+ model variations** including GPT-4o, Claude 3.5 Sonnet, Grok-2, Gemini 1.5 Pro, Llama 3.1, Mistral Large, Command R+, and **15 Hugging Face open source models** for code generation and AI debates.
- **Purpose**: Enable users to bring their own API keys for AI generation, ensuring security and control over credentials while preventing unauthorized usage. Powers real-time AI collaboration with actual model responses across multiple providers and model variations. **Hugging Face integration provides access to 15 open source models including Falcon 180B, Mixtral 8x7B, WizardCoder, DeepSeek Coder, and more.**
- **Trigger**: Displayed prominently in CEO Dashboard Integrations Hub section and shown as alert/requirement in User Dashboard and Generator when keys are missing
- **Progression**: User navigates to dashboard → Sees API key requirement alert → Clicks "Setup API Keys" → Opens Integrations Hub → Adds API key (from provider's API dashboard) → Tests validation against live API → Status changes to valid/invalid → Can now access **50+ AI model variations** across 8 providers including open source Hugging Face models
- **Success criteria**: 
  - Alert shown when no valid AI keys configured
  - Generation blocked until at least one valid AI key is present
  - Real API validation with actual test requests to provider endpoints
  - Secure storage with masked display (sk_••••••••1234)
  - Copy, delete, and visibility toggle features work smoothly
  - Responsive across all screen sizes
  - CEO Dashboard shows full Integrations Hub with 3 tabs (AI Models, Services, App Stores)
  - User Dashboard shows compact key requirement alert with setup button
  - Live API integration with proper error handling and rate limiting
  - Support for multiple concurrent AI model calls across 8 providers
  - Token usage tracking per generation
  - Support for **50+ model variations** including flagship, mini, fast, vision, and code-specialized models
  - **Hugging Face API key support for 15 open source models**

### AI Model Selector (🤖 Multi-Model Selection System)
- **Functionality**: Advanced model selection interface allowing users to choose from **50+ AI model variations** across 8 providers (OpenAI, Anthropic, xAI, Google, Meta, Mistral, Cohere, Hugging Face). Each provider offers multiple model variations categorized by capability: Flagship (most capable), Mini (fast & affordable), Fast (optimized speed), Vision (image understanding), Code (specialized for coding). **Hugging Face provides 15 open source models** including Falcon 180B, Mixtral 8x7B, Zephyr 7B, WizardCoder Python 34B, CodeLlama 34B, DeepSeek Coder 33B, OpenChat 3.5, Yi 34B, Phi-2, Nous Hermes 2, and more. Includes provider filtering, category filtering, model descriptions, and visual selection interface with real-time availability based on configured API keys.
- **Purpose**: Give users granular control over AI model selection, enabling them to mix flagship models for complex tasks with mini models for speed, or combine code-specialized models with vision models for diverse capabilities. **Access to open source Hugging Face models provides cost-effective alternatives with specialized capabilities like code generation, multilingual support, and community-driven innovation.**
- **Trigger**: Accessed via "AI Models" selector in Generator page, expandable panel with full model browser
- **Progression**: Click AI Models selector → Opens model browser → Filter by provider (OpenAI, Anthropic, etc.) or category (Flagship, Mini, Code, Vision) → View model descriptions and capabilities → Select/deselect models → View selected models summary → Generate with chosen model mix
- **Success criteria**:
  - **50+ models available across 8 providers** (expanded from 40)
  - OpenAI (5 models), Anthropic (5 models), xAI (5 models), Google (5 models), Meta (5 models), Mistral (5 models), Cohere (5 models), **Hugging Face (15 models)**
  - Category filtering: Flagship (11 models), Mini (7 models), Fast (20 models), Vision (3 models), Code (7 models)
  - **Hugging Face models include**: Falcon family (180B, 40B, 7B), Mixtral 8x7B, Zephyr 7B, Mistral 7B, Starling 7B, WizardCoder (34B, 15B), CodeLlama 34B, DeepSeek Coder 33B, OpenChat 3.5, Yi 34B, Phi-2, Nous Hermes 2
  - Real-time availability checking based on configured API keys
  - Visual selection with checkmarks for selected models
  - Model cards showing provider icon, model name, category badge, and description
  - Disabled models when API key not configured
  - Selected models summary showing count and names
  - Minimum 1 model selection enforced
  - Smooth animations on model selection
  - Responsive design with scrollable model list
  - Pro tip showing benefits of multi-model selection
  - Integration with debate system for diverse AI perspectives
  - **Open source model badge/indicator for Hugging Face models**

### Hugging Face Integration (🤗 Open Source AI Models)
- **Functionality**: Full integration with Hugging Face Inference API enabling access to open-source models including Zephyr 7B, Falcon 180B, Mistral 7B Instruct, Starling 7B, and WizardCoder 34B. Supports text generation with customizable temperature and token limits. API key authentication and validation with proper error handling.
- **Purpose**: Provide access to cutting-edge open-source AI models, giving users more options and supporting the open-source AI community
- **Trigger**: Configure Hugging Face API key in Integrations Hub, then select Hugging Face models in Generator
- **Progression**: Add Hugging Face API key → Validate against Hugging Face API → Browse 5 available Hugging Face models → Select models → Generate with open-source AI
- **Success criteria**:
  - 5 Hugging Face models available: Zephyr 7B (fast), Falcon 180B (flagship), Mistral 7B Instruct (fast), Starling 7B (fast), WizardCoder 34B (code)
  - API key validation with Hugging Face Inference API
  - Support for inputs parameter and parameters configuration
  - Temperature and max_new_tokens control
  - Proper response parsing for generated_text
  - Error handling for rate limits and model loading
  - Integration with debate system
  - Model descriptions highlighting specializations

### Real-Time "The Forge" AI Debate Panel (🔥 #1 Viral Feature)
- **Functionality**: Live sidebar with 5-6 AI agents (GPT-4o, Claude, Grok, Gemini, Llama) chatting, arguing, and debating in real-time like a Slack channel. **Requires valid API keys** - users must configure at least one AI model API key before generation.
- **Purpose**: Make passive generation feel like watching a live startup war room → addictive + screenshot-worthy
- **Trigger**: Automatically appears during any generation (after API keys are configured)
- **Progression**: User sets up API keys → Agent posts suggestion → Others argue/agree → User thumbs up/down → Winning ideas auto-applied → Flame icons on hotly-debated files
- **Success criteria**: Messages appear every 2-3 seconds, distinct AI personalities ("Grok is edgy, Claude is security-focused"), feel alive and chaotic, API key validation prevents generation without proper credentials

### Fusion Mode (🎯 Killer Unique Feature)
- **Functionality**: After generation, show 3 final versions in split-screen: Fastest (Grok-optimized) | Most Secure (Claude) | Most Beautiful (Gemini)
- **Purpose**: No competitor has this → users drag-and-drop components between versions to create perfect hybrid app
- **Trigger**: Automatically shown after generation completes
- **Progression**: View 3 versions → Drag auth from Secure → Drag UI from Beautiful → Drag API from Fast → Click "Forge Hybrid" → Instant combined app
- **Success criteria**: Smooth drag-and-drop, visual diff highlighting, instant preview updates, feels like remixing music

### Free "Idea Incubator" (💰 Conversion Hook)
- **Functionality**: Huge green button on every page: "Not sure what to build? Try FREE Idea Incubator (no credits used)"
- **Purpose**: Massive free hook → generates 5 validated app ideas + wireframes + tech stack + revenue model in 30 sec using free-tier models
- **Trigger**: Click green button anywhere (pricing, dashboard, generator)
- **Progression**: Click → Answer 3 quick questions (industry, goal, budget) → Watch 5 AI-generated cards appear with full app plans → Pick one → Auto-fills generator
- **Success criteria**: Zero friction, genuinely useful ideas, seamless transition to paid generation

### "Evolve" Button (🧬 ChatGPT for Apps)
- **Functionality**: Big purple "Evolve This App →" button on every generated project
- **Purpose**: Feels like iterating with a team → remembers full context + same AI debate team
- **Trigger**: Click on any existing project
- **Progression**: Click Evolve → Type "Add AI chat" or "Make offline-first" → Same 5 AI agents debate again with full context → Instant upgrade
- **Success criteria**: Fast (10-20 sec), maintains design consistency, agents reference previous decisions

### Instant Live Deploy + Domain (⚡ Industry Breaker)
- **Functionality**: Every generation instantly deploys to live HTTPS subdomain: yourapp-7x9.apexforge.app
- **Purpose**: Kill the "download ZIP then figure out hosting" friction of emergent.sh/v0
- **Trigger**: Automatic on generation complete
- **Progression**: Generating → Deploying → LIVE! → Show iframe with app running + copy link button
- **Success criteria**: Under 5 seconds from generation to live URL, fullscreen iframe preview, one-click share

### Visual "Heatmap" of Debates (🔥 Engagement Feature)
- **Functionality**: Show flame icons next to files/components with the most AI debate activity
- **Purpose**: Gamifies the process → users want to see what AIs are fighting about
- **Trigger**: During and after generation
- **Progression**: See flame icon → Click → Opens debate thread showing all AI arguments → User can add vote retroactively
- **Success criteria**: Flame intensity (1-3 flames) based on debate count, smooth popover showing debate history

### Viral "Forge Card" Sharing (📱 Built-In Growth)
- **Functionality**: Every app gets a beautiful shareable card (like Pokémon card) showing AI contributors, debate winners, tech stack
- **Purpose**: One-click X sharing → built-in virality
- **Trigger**: After generation completes
- **Progression**: Click "Share Your Forge" → Preview card → Edit tagline → Post to X with attribution
- **Success criteria**: Beautifully designed card, pre-filled tweet text, tracks shares in dashboard

### $500 Enterprise Security Upgrade (💎 Premium Upsell)
- **Functionality**: Premium locked card offering "Man-in-the-Middle AI Security Shield" - AI agent that sits between app and internet scanning threats
- **Purpose**: High-margin one-time upsell (not subscription) → targets serious projects
- **Trigger**: Shown in project dashboard and after generation
- **Progression**: View card → Click "Fortify" → Stripe checkout $500 → Auto-deploys security agent → Project gets shield badge
- **Success criteria**: Compelling security copy, smooth Stripe flow, visual shield badge on protected projects

### CEO Dashboard Authentication (🔒 Security Feature)
- **Functionality**: Secure multi-factor authentication system protecting CEO Dashboard access with username/password and time-based one-time password (TOTP) authentication via QR code
- **Purpose**: Protect sensitive business controls, manipulation tools, and API key management from unauthorized access
- **Trigger**: Navigating to CEO Dashboard route without authentication
- **Progression**: Click CEO nav → Redirected to login page → Scan QR code with authenticator app (first time only) → Enter username/password → Enter 6-digit TOTP code from authenticator app → Authenticated and redirected to CEO Dashboard
- **Success criteria**: 
  - QR code generates on first visit for TOTP setup
  - Works with any standard authenticator app (Google Authenticator, Authy, etc.)
  - TOTP codes expire every 30 seconds and are one-time use only
  - Session persists across page refreshes
  - Logout clears session and requires re-authentication
  - Manual entry key provided as fallback to QR code
  - Clear setup instructions and helpful error messages
  - Credentials: username `adminadminadmin`, password `19780111`

### User Authentication Landing Page (🔐 Sign In/Sign Up)
- **Functionality**: Beautiful signin/signup landing page with animated transitions, form validation, password strength indicator, and secure local storage
- **Purpose**: Enable users to create accounts and authenticate to access platform features, maintain user sessions, and personalize experiences
- **Trigger**: Clicking "Sign In" button in navigation, "Get Started" on home page, or accessing protected features
- **Progression**: Click Sign In → View landing page → Toggle between Sign In/Sign Up → Fill form (name, email, password) → Password strength indicator updates → Submit → Success toast → Redirect to dashboard
- **Success criteria**:
  - Clean, modern design with gradient backgrounds and glass morphism
  - Smooth animated transitions between sign in/sign up modes
  - Real-time form validation (email format, password length)
  - Password strength indicator (Weak/Good/Strong)
  - Password visibility toggle
  - Confirm password match validation on signup
  - User data persists in KV storage
  - Session management with current user tracking
  - Display user name in navigation when authenticated
  - Logout functionality clears session
  - Responsive on all screen sizes
  - Consistent with ApexForge design language (electric purple, neon cyan accents)

### CEO Dashboard with Advanced Analytics (🎯 Complete Control Center)
- **Functionality**: Comprehensive business intelligence dashboard with real-time metrics, revenue forecasting, customer management, transaction tracking, payout history, webhook simulation, **advanced cohort analytics**, and **automated email campaign management**. Includes CEO "Whisper Mode" and full Integrations Hub for API key management.
- **Purpose**: Give CEO complete visibility and control over business operations with data-driven insights, automated customer recovery tools, and behavioral manipulation capabilities
- **Trigger**: Accessible via secure authentication (username: adminadminadmin, password: 19780111, with TOTP authentication)
- **Progression**: Login with credentials → Authenticate via TOTP → Access dashboard with 8 tabs: Forecast, Customers, Cohorts, Campaigns, Webhooks, Keys, Payouts, Transactions
- **Success criteria**: 
  - Real-time revenue and user growth charts
  - AI-powered forecasting with predictions and export functionality
  - Customer management with subscription controls and bulk actions
  - **Cohort retention heatmap with 6-month tracking and LTV analysis**
  - **Automated email campaigns for past due customers with recovery tracking**
  - CSV/PDF export for all analytics data
  - Webhook simulation for testing payment flows
  - Complete API key management hub
  - Transaction tracking with filtering and search
  - Payout history with Stripe integration
  - Whisper Mode for AI behavior manipulation
  - Black Forge Mode toggle (Konami code)

### Advanced Cohort Analytics (📊 Data Intelligence Feature)
- **Functionality**: Comprehensive cohort analysis dashboard tracking user retention, lifetime value, revenue by cohort, and engagement metrics over time. Interactive heatmap visualization with month-over-month retention rates (0-100% scale, color-coded in 5 tiers), detailed cohort metrics, LTV growth analysis, and engagement tracking (DAU/WAU/MAU).
- **Purpose**: Provide deep insights into customer behavior patterns, retention trends, and revenue opportunities by analyzing user cohorts from acquisition through their lifecycle
- **Trigger**: Accessed via CEO Dashboard → Cohorts tab
- **Progression**: View cohort heatmap → Select timeframe (3/6/12 months/all) → Select metric type (retention/revenue/LTV/engagement) → Click cohort row for detailed metrics (retention rate, churn rate, LTV, ARPU) → Switch between tabs (heatmap/trends/LTV/engagement) → Export data as CSV or PDF
- **Success criteria**:
  - Color-coded retention heatmap with 7 months × 7 cohorts showing percentage retained each month
  - Interactive cohort selection revealing expanded metrics panel
  - Summary cards showing avg 3-month retention (72.3%), avg cohort LTV ($1,159), best performing cohort
  - Trend charts comparing month-1, month-3, month-6 retention across all cohorts
  - Revenue cohort analysis showing MRR growth by cohort over time (bar chart)
  - LTV growth visualization with ARPU overlay (composed area + line chart)
  - Engagement metrics by cohort showing DAU/WAU/MAU percentages (bar chart)
  - Key insights panel with actionable recommendations
  - Export functionality for both CSV and PDF formats with loading states
  - Fully responsive design with horizontal scroll on mobile for wide tables
  - Real-time metric calculations and filtering

### Automated Email Campaigns (📧 Customer Recovery & Retention System)
- **Functionality**: Comprehensive email campaign automation system for recovering past due customers, preventing churn, and re-engaging churned users. Create custom email sequences triggered by payment events (past_due, failed_payment, churned, expiring_soon) with configurable day delays, customizable subject lines and body text using dynamic variables ({{name}}, {{plan}}, {{amount}}, {{payment_link}}, {{reactivate_link}}). Track comprehensive performance metrics (sent, opened, clicked, recovered) with calculated rates. Manage past due customer queue with status tracking and manual override capabilities.
- **Purpose**: Automate customer recovery to maximize revenue retention and reduce churn through timely, personalized email outreach with measurable ROI
- **Trigger**: Accessed via CEO Dashboard → Campaigns tab, or auto-triggered by payment events based on active campaign rules
- **Progression**: Create campaign → Set trigger event and delay (0-30 days) → Write subject/body with variable placeholders → Toggle activate immediately or save as draft → View campaign in list → Monitor past due customers table → Send manual emails or let automation run → Track recovery metrics and revenue impact → Preview/test campaigns before sending → Export campaign performance data
- **Success criteria**:
  - Campaign builder dialog with all required fields (name, trigger, delay, subject, body, status)
  - Support for 4 trigger types: past_due, failed_payment, churned, expiring_soon
  - Configurable day delays (0-30 days) as number input
  - Dynamic variable support: {{name}}, {{plan}}, {{amount}}, {{payment_link}}, {{reactivate_link}}
  - Campaign status management with visual badges (active/paused/draft)
  - Summary cards: Active campaigns (3), past due customers (3), total past due ($449), recovery rate (41.2%)
  - Real-time metrics per campaign: sent, opened (with open rate %), clicked (with click rate %), recovered (with recovery rate %), revenue generated
  - Past due customer table showing: name, email, plan, amount, days past due (color-coded: <5 normal, 5-10 warning, >10 danger), emails sent count, status (pending/contacted/recovered/churned)
  - Manual "Send Now" button for individual customers in table
  - Bulk "Run Now" functionality to send campaign to all eligible customers immediately
  - Campaign actions: Pause/Activate toggle, Preview with test email capability, Run Now, Delete
  - Test email dialog with email input and send functionality
  - Campaign preview showing full subject and body text
  - Performance tracking with color-coded status badges
  - Empty state with CTA when no campaigns exist
  - Variable hint text below body textarea
  - Responsive layout with horizontal scroll on mobile for customer table
  - All customer and campaign data persists in KV storage
  - Real-time toast notifications for all actions

### CEO "Whisper Mode" (🎭 Behavioral Manipulation Tool)
- **Functionality**: Secret toggle in CEO dashboard to type hidden instructions that override AI behavior. **Includes Integrations Hub** - full API key management system for AI models, services, and app stores with validation and testing capabilities. **Protected by authentication** - only accessible after successful login.
- **Purpose**: Fun power-user feature + useful for business strategy, plus centralized key management
- **Trigger**: CEO dashboard only (after authentication), hidden toggle + Integrations Hub card
- **Progression**: Authenticate → Enable Whisper → Type "Always suggest Pro plan" → All future AI debates subtly push Pro features. For keys: Add key → Test validation → Use in generation
- **Success criteria**: Works silently, no user-facing indication, truly feels like secret influence. Keys manager validates all API keys, stores securely, and prevents generation without valid AI keys. All features only accessible after authentication

### Stripe Connect Integration (💳 Global Payment System)
- **Functionality**: Real Stripe Connect integration for connecting bank accounts worldwide. Users can add bank accounts from 40+ countries (US, UK, Canada, Australia, Germany, France, Netherlands, Spain, Italy, Japan, Singapore, Hong Kong, India, Brazil, Mexico, etc.) to receive payouts in local currency. Features account status tracking, multiple bank account support, verification status, and secure credential management.
- **Purpose**: Enable users to receive real payments from customers globally, supporting worldwide bank connections with proper currency handling and compliance
- **Trigger**: Available in Dashboard and Pricing pages via dedicated Stripe Connect card
- **Progression**: Click "Connect with Stripe" → Account created with unique ID → Add bank details (country, email, business name, account holder, account number, routing/sort code) → Verify account → Status changes to active with charges and payouts enabled → Can add multiple bank accounts → View all connected accounts with status badges
- **Success criteria**:
  - Stripe account creation with unique account ID
  - Support for 15+ countries with proper currency mapping (USD, GBP, EUR, CAD, AUD, JPY, SGD, HKD, INR, BRL, MXN)
  - Bank account verification and status tracking (pending/verified/failed)
  - Multiple bank account support per user
  - Status badges showing charges enabled, payouts enabled, account active
  - Secure credential display with masked account numbers (••••1234)
  - Copy account ID functionality
  - Beautiful onboarding flow with security badges and trust indicators
  - Country-specific field labels (Routing Number vs Sort Code vs Bank Code)
  - Disconnect functionality
  - Data persistence via KV storage
  - Responsive design across all screen sizes
  - Integration with real Stripe Dashboard link

### Landscape Preview Frame with AI Robot Builders (🤖 THE #1 Viral Hook)
- **Functionality**: After generation, show massive 1280×720px landscape iframe (desktop) with 5-7 animated 3D robots circling around it holding tools (hammer, wrench, paintbrush, rocket, shield)
- **Purpose**: The most screenshot-able, impossibly cute, emotionally addictive builder interface of 2026 - robots literally debate in speech bubbles above their heads
- **Trigger**: Automatically appears during and after generation as final section
- **Progression**: Robots spawn → Wave "Ready to build!" → During generation they walk/fly around preview box → Stop to "work" on it → Speech bubbles show real debate text → Consensus meter fills 0→100% → At 100% all robots jump, throw confetti, hold "SHIPPED" sign together
- **Success criteria**: Robots feel alive (not subtle), each has distinct personality (Grok=silver rocket robot, Claude=purple owl robot, Gemini=rainbow prism), mobile auto-switches to portrait with robot list below, confetti explosion on ship, feels like directing a tiny construction crew

### Robot Personality & Behaviors (🎭 Cuteness Rules)
- **On First Load**: All robots wave and say "Ready to build your dream!" in bubbles (Black Forge: "Let's forge something dark! 🔥😈")
- **During Typing**: Robots lean in and look at prompt box with anticipation
- **During Debate**: Speech bubbles pop up with actual debate text from The Forge panel (Black Forge: Speech bubbles turn red with destructive borders)
- **When Stuck**: Robots shrug, one facepalms, another pulls hair dramatically
- **On Credit Deduction**: One robot runs with tiny coin to piggy bank in corner
- **On 100% Consensus**: All robots jump together, throw confetti, victory fanfare (Black Forge: "FORGED!" with demonic celebration)
- **Black Forge Mode**: ✅ IMPLEMENTED - Robots turn demonic with glowing red eyes, fire above heads, and pulsing red auras. Activated via CEO Dashboard toggle or Konami code (↑↑↓↓←→←→BA)

### Black Forge Dark Mode (🔥 Secret Feature)
- **Functionality**: Hidden dark theme that transforms all AI robots into demonic variants with fire effects, red glowing auras, and dark messages
- **Purpose**: Easter egg feature that adds personality and fun surprise for power users, makes the experience feel alive and customizable
- **Trigger**: Two ways to activate - (1) Manual toggle in CEO Dashboard Whisper Mode section (2) Konami code sequence: ↑↑↓↓←→←→BA
- **Progression**: Toggle switch → All robots instantly transform → Speech bubbles turn red/destructive styled → Preview frame gets destructive borders → Consensus meter becomes "Dark Consensus" → Success message changes to "FORGED IN SHADOWS! 😈🔥" → Persists across sessions via KV storage
- **Success criteria**: Smooth visual transformation, persistent state, robots feel genuinely demonic (not subtle), toast notifications on activation/deactivation, welcome message changes to dark variant
- **Visual Changes**:
  - Robot avatars: 🧠→👹, 🛡️→💀, ⚡→⚡, 🎨→🔥, 🦙→😈
  - Fire icons above robot heads
  - Red pulsing auras around robots
  - Destructive color borders (red) on all elements
  - Speech bubbles with red/destructive styling
  - Preview frame border changes to destructive
  - Consensus meter labeled "Dark Consensus Meter"
  - Success message: "FORGED IN SHADOWS!" with demon emoji
  - Card backgrounds tinted with destructive colors


## Edge Case Handling
- **Empty States**: Beautiful illustrations and clear CTAs when no projects exist or credits are depleted
- **Loading States**: Skeleton screens and progress indicators for all async operations
- **Error Handling**: Graceful fallbacks with helpful messaging if simulation fails
- **Credit Limits**: Clear warnings before generation, upgrade prompts when out of credits
- **Mobile Responsiveness**: 
  - Fully responsive layouts with no horizontal overflow
  - Auto-adjusting container widths (max-width: 1400px with proper gutters)
  - Collapsible debate panel and mobile sheet navigation
  - Stacked layouts for small screens (cards, pricing tiers)
  - Breakpoint-adjusted typography (mobile: 640px, tablet: 1024px)
  - Flexible grid systems (1-col mobile → 2-col tablet → 3-5 col desktop)
  - Touch-optimized button sizes and spacing
  - Properly truncated text with ellipsis to prevent overflow
  - Flexible badge and icon sizing across screen sizes

## Design Direction
ApexForge should feel playful, fast, and chaotic-yet-organized — like Cursor + Figma + Twitter had a baby. Deep black background (not navy — true #000) with electric purple + neon cyan that POP. Fast, snappy animations that feel instant. The AI debate panel should feel ALIVE — like a Discord server during a raid. Make users want to screenshot every interaction.

## Color Selection
Custom palette - True black with neon electric accents

- **Primary Color**: Electric Purple (oklch(0.60 0.30 285)) - Hyper-saturated purple for Evolve button, premium features, represents raw AI power
- **Secondary Colors**: 
  - True Black (oklch(0.10 0 0)) - Deep, pure black background like pro design tools
  - Dark Card (oklch(0.15 0 0)) - Slightly elevated surfaces
- **Accent Color**: Neon Cyan (oklch(0.80 0.18 195)) - Bright, energetic cyan for wins, approvals, live indicators
- **Destructive**: Hot Magenta (oklch(0.60 0.28 340)) - For flames, intense debates, controversial suggestions
- **Foreground/Background Pairings**:
  - Background (True Black oklch(0.10 0 0)): White text (oklch(0.98 0 0)) - Ratio 18.5:1 ✓
  - Card (Dark oklch(0.15 0 0)): White text (oklch(0.98 0 0)) - Ratio 15.1:1 ✓
  - Primary (Purple oklch(0.60 0.30 285)): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Accent (Neon Cyan oklch(0.80 0.18 195)): Black text (oklch(0.10 0 0)) - Ratio 11.2:1 ✓
  - Destructive (Hot Magenta oklch(0.60 0.28 340)): White text (oklch(1 0 0)) - Ratio 5.5:1 ✓

## Font Selection
Modern, technical, and highly legible fonts that convey professionalism and innovation - Inter for its perfect tech aesthetic and geometric proportions.

- **Typographic Hierarchy**:
  - H1 (Hero Title): Inter Bold/48px/tight (-0.02em) - Maximum impact
  - H2 (Section Headers): Inter SemiBold/32px/tight (-0.01em) - Clear hierarchy
  - H3 (Card Titles): Inter SemiBold/20px/normal - Readable focus points
  - Body (Main Content): Inter Regular/16px/relaxed (1.6) - Comfortable reading
  - Small (Captions): Inter Medium/14px/normal - Clear but compact
  - Code/Technical: Inter Regular/15px/normal - Monospace feel for tech content

## Animations
Animations should feel intelligent and purposeful - like the AI is actively working. Smooth, physics-based motion that suggests speed and efficiency without being distracting. Key moments: AI agents "appearing" in debate panel, progress bars filling with slight easing, cards sliding in when projects load.

- **Purposeful Meaning**: Every animation reinforces the "AI at work" narrative - pulsing indicators during generation, smooth transitions between debate proposals, celebratory micro-interactions on completion
- **Hierarchy of Movement**: Most motion in the debate panel (center of attention during generation), subtle hover states on cards, smooth page transitions

## Component Selection
- **Components**: 
  - Card (project displays, pricing tiers, metric cards)
  - Button (primary CTAs with variants for states)
  - Input/Textarea (prompt entry with character counter)
  - Badge (credit indicators, status tags, model labels)
  - Progress (generation progress with multiple stages)
  - Tabs (dashboard sections, model selection)
  - Dialog (API key setup, upgrade prompts)
  - Avatar (AI agent representations in debate panel)
  - Separator (section dividers)
  - ScrollArea (debate panel, project lists)
  - Switch (settings, model toggles)
  - Tooltip (helpful hints on features)
- **Customizations**: 
  - AI Debate Panel (custom component with animated agent cards)
  - Generation Progress Timeline (custom multi-stage progress indicator)
  - Pricing Comparison Grid (enhanced cards with feature checklists)
  - Metric Dashboard (custom chart layouts with Recharts)
- **States**: 
  - Buttons: Default, hover (slight scale + glow), active (pressed), loading (spinner), disabled (opacity)
  - Inputs: Default, focus (border glow), error (red border + shake), filled (subtle highlight)
  - Cards: Default, hover (slight lift + shadow), selected (border accent), loading (shimmer)
- **Icon Selection**: 
  - Sparkles/Stars for AI features
  - Code/Terminal for generation
  - Rocket for deployment
  - Lightning for speed/fast generation
  - Users for collaboration
  - Shield for security
  - CreditCard for billing
  - Chart for analytics
- **Spacing**: Consistent 4px grid - xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)
- **Mobile**: 
  - Auto-adjusting responsive structure with proper overflow handling
  - Debate panel slides up as bottom sheet on mobile
  - Pricing cards use 1-col mobile → 2-col tablet → 3-col desktop → 5-col wide layouts
  - Dashboard uses single column on mobile with optimized spacing
  - Navigation collapses to hamburger sheet menu on mobile/tablet
  - Hero text scales dynamically (clamp-based responsive sizing)
  - Touch-friendly 44px minimum tap targets
  - Proper text truncation and wrapping to prevent layout breaks
  - Flexible padding/margins that scale with viewport (3-4-6 pattern)
  - No horizontal scrolling or content overflow on any screen size
  - Container max-width of 1400px with proper gutters (3-4-6 px)
  - Icon sizes that scale: mobile(10-14px) → tablet(16-18px) → desktop(20-24px)
