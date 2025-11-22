# Planning Guide

ApexForge is the first AI app builder that feels like you hired a world-class 5-person AI dev team that argues, brainstorms, and ships production-ready apps in real time — all with live domains in ONE browser tab.

**Experience Qualities**:
1. **Addictive** - Real-time AI debates + drag-and-drop Fusion Mode creates TikTok-level engagement
2. **Alive** - 5+ AI agents arguing, flaming, and shipping feels like watching a startup war room, not a loading screen
3. **Viral** - Every project gets a shareable "Forge Card" + instant HTTPS domain → screenshot-worthy moments

**Complexity Level**: Complex Application (advanced functionality with real-time state, multiple interactive features, gamified elements)
- Full AI debate simulation with 5+ agents, live chat UI with voting, Fusion Mode drag-and-drop, Idea Incubator, Evolve mode, heatmap visualization, CEO Whisper mode, and $500 security upsell. Every feature designed for virality and differentiation from emergent.sh/v0.

## Essential Features

### Real-Time "The Forge" AI Debate Panel (🔥 #1 Viral Feature)
- **Functionality**: Live sidebar with 5-6 AI agents (GPT-4o, Claude, Grok, Gemini, Llama) chatting, arguing, and debating in real-time like a Slack channel
- **Purpose**: Make passive generation feel like watching a live startup war room → addictive + screenshot-worthy
- **Trigger**: Automatically appears during any generation
- **Progression**: Agent posts suggestion → Others argue/agree → User thumbs up/down → Winning ideas auto-applied → Flame icons on hotly-debated files
- **Success criteria**: Messages appear every 2-3 seconds, distinct AI personalities ("Grok is edgy, Claude is security-focused"), feel alive and chaotic

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

### CEO "Whisper Mode" (🎭 Fun Easter Egg)
- **Functionality**: Secret toggle in CEO dashboard to type hidden instructions that override AI behavior
- **Purpose**: Fun power-user feature + useful for business strategy
- **Trigger**: CEO dashboard only, hidden toggle
- **Progression**: Enable Whisper → Type "Always suggest Pro plan" → All future AI debates subtly push Pro features
- **Success criteria**: Works silently, no user-facing indication, truly feels like secret influence

## Edge Case Handling
- **Empty States**: Beautiful illustrations and clear CTAs when no projects exist or credits are depleted
- **Loading States**: Skeleton screens and progress indicators for all async operations
- **Error Handling**: Graceful fallbacks with helpful messaging if simulation fails
- **Credit Limits**: Clear warnings before generation, upgrade prompts when out of credits
- **Mobile Responsiveness**: Collapsible debate panel, stacked layouts for small screens

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
  - Debate panel slides up as bottom sheet on mobile
  - Pricing cards stack vertically
  - Dashboard uses single column layout
  - Navigation collapses to hamburger menu
  - Hero text scales down proportionally
  - Touch-friendly 44px minimum tap targets
