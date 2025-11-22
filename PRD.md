# Planning Guide

ApexForge is a modern AI-powered app builder prototype that demonstrates collaborative multi-model AI generation with a focus on speed, innovation, and user experience.

**Experience Qualities**:
1. **Futuristic** - Cutting-edge interface that feels like you're working with next-generation AI technology
2. **Collaborative** - Dynamic AI debate panel that shows multiple AI models working together in real-time
3. **Empowering** - Users feel confident building complex applications through simple natural language

**Complexity Level**: Light Application (multiple features with basic state)
- Showcases the core ApexForge concept with simulated AI generation, credit tracking, pricing tiers, and a CEO dashboard. Uses local state management to demonstrate the full user journey without requiring backend infrastructure.

## Essential Features

### AI App Generation Interface
- **Functionality**: Natural language prompt input that triggers simulated multi-model AI generation with real-time debate panel
- **Purpose**: Core value proposition - show how collaborative AI is faster and more innovative than single-model approaches
- **Trigger**: User enters prompt and clicks "Generate App" button
- **Progression**: Input prompt → Select AI models → Watch debate panel → See progress bars → View generated output with download/deploy options
- **Success criteria**: Smooth animations, realistic timing (2-3 min simulation), clear visual feedback of AI "collaboration"

### Credit & Billing System
- **Functionality**: Track generation credits, display pricing tiers, simulate subscription management
- **Purpose**: Demonstrate the business model and value proposition vs competitors
- **Trigger**: User views dashboard or pricing page
- **Progression**: View credits → Click upgrade → See pricing comparison → Select plan → Confirmation
- **Success criteria**: Clear credit visibility, compelling pricing presentation, smooth plan comparison

### AI Debate Panel
- **Functionality**: Real-time sidebar showing simulated AI agents proposing changes, with user approval mechanism
- **Purpose**: Unique differentiator - show collaborative AI process transparently
- **Trigger**: Automatically appears during generation
- **Progression**: Agent proposes change → User sees reasoning → Vote approve/reject → See impact on output
- **Success criteria**: Feels alive and intelligent, clear agent personalities, meaningful-looking proposals

### CEO Dashboard
- **Functionality**: Executive metrics view with simulated analytics and AI-generated reports
- **Purpose**: Showcase business intelligence features for enterprise tier
- **Trigger**: Navigate to /ceo route
- **Progression**: View metrics → Generate AI report → Read insights → Export
- **Success criteria**: Professional charts, realistic business metrics, credible AI insights

### Project Management
- **Functionality**: Dashboard showing generated projects with preview, download, and deployment options
- **Purpose**: Give users a home base to manage their creations
- **Trigger**: User navigates to dashboard after generation
- **Progression**: View projects → Select project → Preview/download/deploy
- **Success criteria**: Clean project cards, clear action buttons, organized layout

## Edge Case Handling
- **Empty States**: Beautiful illustrations and clear CTAs when no projects exist or credits are depleted
- **Loading States**: Skeleton screens and progress indicators for all async operations
- **Error Handling**: Graceful fallbacks with helpful messaging if simulation fails
- **Credit Limits**: Clear warnings before generation, upgrade prompts when out of credits
- **Mobile Responsiveness**: Collapsible debate panel, stacked layouts for small screens

## Design Direction
ApexForge should feel cutting-edge, professional, and trustworthy - like a product from a well-funded Silicon Valley startup. The interface should be polished and modern with subtle animations that convey intelligence and speed. Think dark mode as default with electric accent colors that suggest AI and technology. Minimal chrome, maximum content - let the AI debate panel and generation process be the star.

## Color Selection
Custom palette - Dark theme with vibrant tech accents

- **Primary Color**: Electric Purple/Blue (oklch(0.55 0.25 270)) - Represents AI, innovation, and premium technology. Used for primary CTAs and brand elements
- **Secondary Colors**: 
  - Deep Navy (oklch(0.15 0.02 250)) - Professional background that doesn't strain eyes
  - Slate Gray (oklch(0.25 0.01 250)) - Card backgrounds and surfaces
- **Accent Color**: Cyan/Teal (oklch(0.75 0.15 195)) - High-tech highlight for active states, success, and attention elements
- **Foreground/Background Pairings**:
  - Background (Deep Navy oklch(0.15 0.02 250)): Light gray text (oklch(0.95 0 0)) - Ratio 11.2:1 ✓
  - Card (Slate oklch(0.25 0.01 250)): White text (oklch(0.98 0 0)) - Ratio 12.1:1 ✓
  - Primary (Purple oklch(0.55 0.25 270)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Secondary (Medium Gray oklch(0.35 0.01 250)): White text (oklch(0.98 0 0)) - Ratio 8.3:1 ✓
  - Accent (Cyan oklch(0.75 0.15 195)): Dark Navy text (oklch(0.15 0.02 250)) - Ratio 9.8:1 ✓
  - Muted (Dark Slate oklch(0.20 0.01 250)): Gray text (oklch(0.65 0 0)) - Ratio 4.8:1 ✓

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
