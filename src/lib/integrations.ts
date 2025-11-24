import { DeviceMobile, Desktop, PuzzlePiece, FigmaLogo, Microphone, ChartLineUp, GooglePlayLogo, Database, MagnifyingGlass, PaintBrush, Robot } from '@phosphor-icons/react'

export interface Integration {
  id: string
  name: string
  icon: any
  color: string
  tier: 'free' | 'pro' | 'gold' | 'enterprise'
  credits: number
  description: string
  shortDesc: string
  features: string[]
  enabled: boolean
}

export const INTEGRATIONS: Integration[] = [
  {
    id: 'native-mobile',
    name: 'Native Mobile (iOS/Android)',
    icon: DeviceMobile,
    color: 'text-accent',
    tier: 'gold',
    credits: 5,
    description: 'Generate React Native + Capacitor/Expo codebase with one-click EAS build',
    shortDesc: 'iOS & Android apps in 3-6 min',
    features: [
      'React Native Web + Capacitor',
      'One-click EAS build',
      'QR code for TestFlight/APK',
      'Auto-provisions Expo keys'
    ],
    enabled: false
  },
  {
    id: 'desktop-apps',
    name: 'Desktop Apps',
    icon: Desktop,
    color: 'text-primary',
    tier: 'gold',
    credits: 4,
    description: 'Wrap app with Tauri 2 for native desktop experience',
    shortDesc: 'macOS, Windows, Linux builds',
    features: [
      'Tauri 2 wrapper',
      '.dmg/.exe/.AppImage',
      'Auto-sign with keys',
      'System tray integration'
    ],
    enabled: false
  },
  {
    id: 'browser-extension',
    name: 'Browser Extensions',
    icon: PuzzlePiece,
    color: 'text-accent',
    tier: 'pro',
    credits: 3,
    description: 'Generate Manifest V3 browser extension with React popup',
    shortDesc: 'Chrome/Firefox extensions',
    features: [
      'Manifest V3 compliant',
      'React popup UI',
      '.zip generation',
      'Chrome Store link'
    ],
    enabled: false
  },
  {
    id: 'figma-sync',
    name: 'Figma Two-Way Sync',
    icon: FigmaLogo,
    color: 'text-primary',
    tier: 'enterprise',
    credits: 4,
    description: 'Import Figma designs or export live components back to Figma',
    shortDesc: 'Design ↔ Code sync',
    features: [
      'Import Figma URL',
      'AI converts to code',
      'Export components to Figma',
      'Real-time sync'
    ],
    enabled: false
  },
  {
    id: 'voice-copilot',
    name: 'AI Voice/Video Co-Pilot',
    icon: Microphone,
    color: 'text-destructive',
    tier: 'pro',
    credits: 2,
    description: 'Voice commands with Whisper API transcription',
    shortDesc: 'Voice-controlled editing',
    features: [
      'Whisper transcription',
      'Real-time SSE updates',
      'Floating mic button',
      'Video screen recording'
    ],
    enabled: false
  },
  {
    id: 'user-testing',
    name: 'Live User Testing/Heatmaps',
    icon: ChartLineUp,
    color: 'text-accent',
    tier: 'gold',
    credits: 3,
    description: 'Session recording and heatmap analysis with AI summaries',
    shortDesc: 'Real user behavior insights',
    features: [
      'Session recording',
      'Click heatmaps',
      'AI drop-off analysis',
      'Auto-fix suggestions'
    ],
    enabled: false
  },
  {
    id: 'app-store-submit',
    name: 'One-Click App Store Submission',
    icon: GooglePlayLogo,
    color: 'text-accent',
    tier: 'gold',
    credits: 8,
    description: 'Automated App Store and Play Store submission with AI-generated metadata',
    shortDesc: 'Auto-submit to stores',
    features: [
      'EAS Submit + Fastlane',
      'AI metadata generation',
      'Auto-screenshot capture',
      'Privacy policy generator'
    ],
    enabled: false
  },
  {
    id: 'backend-wizard',
    name: 'Backend-as-a-Service Wizard',
    icon: Database,
    color: 'text-primary',
    tier: 'pro',
    credits: 3,
    description: 'Auto-provision Supabase/Firebase project with API keys',
    shortDesc: 'Instant backend setup',
    features: [
      'Auto-creates project',
      'Returns API keys',
      'Wires DB & auth',
      'Real-time database'
    ],
    enabled: false
  },
  {
    id: 'ai-seo',
    name: 'AI SEO/Content Optimizer',
    icon: MagnifyingGlass,
    color: 'text-primary',
    tier: 'pro',
    credits: 2,
    description: 'AI-generated blog posts, meta tags, and schema markup',
    shortDesc: 'SEO & content automation',
    features: [
      'AI blog generation',
      'Meta tags & schema',
      'Google Analytics setup',
      'Vercel Edge integration'
    ],
    enabled: false
  },
  {
    id: 'white-label',
    name: 'White-Label',
    icon: PaintBrush,
    color: 'text-accent',
    tier: 'enterprise',
    credits: 10,
    description: 'Custom domain with removed branding and pricing overlay',
    shortDesc: 'Your brand, your domain',
    features: [
      'Custom domain setup',
      'Remove all branding',
      'Your pricing overlay',
      'Full customization'
    ],
    enabled: false
  },
  {
    id: 'ai-pm',
    name: 'AI PM (ForgeMaster)',
    icon: Robot,
    color: 'text-primary',
    tier: 'enterprise',
    credits: 5,
    description: 'AI project manager that creates tasks, assigns agents, and manages timelines',
    shortDesc: 'Auto project management',
    features: [
      'Auto task creation',
      'Agent assignment',
      'Linear/Notion sync',
      'Auto changelog/tweets'
    ],
    enabled: false
  }
]

export const ADDON_FEATURES = [
  {
    id: 'perfectionist-ai',
    name: 'Perfectionist AI',
    price: 20,
    description: 'Refines your prompts automatically with auto-suggestions',
    features: [
      'Prompt refiner in dropdown',
      'Auto-suggest essentials',
      'Smart completion',
      'Saves credits with better prompts'
    ]
  },
  {
    id: 'god-mode',
    name: 'God Mode',
    price: 29,
    description: 'Self-healing, vibe detection, quantum optimization',
    features: [
      'Auto-fix runtime errors',
      'Vibe-based design adjustments',
      'Quantum optimization',
      'Zero-downtime deploys'
    ]
  }
]

export const TIER_INTEGRATIONS = {
  free: [],
  pro: ['browser-extension', 'voice-copilot', 'backend-wizard', 'ai-seo'],
  gold: ['native-mobile', 'desktop-apps', 'user-testing', 'app-store-submit'],
  enterprise: ['figma-sync', 'white-label', 'ai-pm']
}

export const CREDIT_COSTS = {
  'simple-edit': 1,
  'basic-generation': 2,
  'complex-generation': 3,
  'with-integrations': 5
}
