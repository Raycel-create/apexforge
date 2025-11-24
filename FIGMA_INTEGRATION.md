# Figma Two-Way Sync Integration

ApexForge's design-to-code workflow system with enterprise-grade security for seamless collaboration between designers and developers.

**Experience Qualities**:
1. **Secure** - Military-grade IP whitelisting ensures only authorized personnel can access Figma credentials and sync operations
2. **Seamless** - Intuitive interface makes complex design-to-code workflows feel effortless and natural
3. **Intelligent** - AI-powered code generation transforms Figma components into production-ready React code

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Requires authentication and security layers
- Integrates with external Figma API
- Uses AI for code generation
- Maintains sync history and state management

## Essential Features

### 1. Secure Credential Management
- **Functionality**: Store and manage Figma personal access tokens with encryption
- **Purpose**: Enable authenticated API access to Figma files while maintaining security
- **Trigger**: User clicks "Setup Figma Access" button
- **Progression**: View empty state → Open setup dialog → Enter token and optional team ID → Validate token → Save credentials → Display masked token with validation status
- **Success criteria**: Token is validated, stored securely, and can be used for API calls without exposing raw token in UI

### 2. IP Whitelisting Security Layer
- **Functionality**: Restrict access to Figma credentials and sync operations by IP address
- **Purpose**: Prevent unauthorized access even if someone gains dashboard access
- **Trigger**: CEO enables IP whitelist in Security tab
- **Progression**: View current IP → Add IP to whitelist with label → Toggle whitelist on/off → Monitor access logs → View blocked attempts
- **Success criteria**: Only whitelisted IPs can read/write Figma credentials and perform sync operations, all attempts are logged

### 3. File Watching & Monitoring
- **Functionality**: Track Figma files that should be monitored for changes
- **Purpose**: Maintain awareness of which design files are in active development
- **Trigger**: User pastes Figma file URL and clicks "Add File"
- **Progression**: Enter Figma file URL → Extract file ID → Add to watch list → Display file details → Mark sync status
- **Success criteria**: Files are tracked with their sync status and last sync timestamp

### 4. Design-to-Code Sync
- **Functionality**: Convert Figma designs into React TypeScript components
- **Purpose**: Accelerate development by automating component scaffolding from designs
- **Trigger**: User clicks "Design → Code" button on a watched file
- **Progression**: Click sync button → Fetch file details from Figma → Extract components → Generate code with AI → Save to history → Display success/failure
- **Success criteria**: Figma components are converted to valid React TypeScript code with proper types and Tailwind styling

### 5. Sync History & Analytics
- **Functionality**: Track all sync operations with detailed logs and statistics
- **Purpose**: Provide visibility into sync activity and troubleshoot issues
- **Trigger**: Automatic logging after each sync operation
- **Progression**: Sync operation completes → Log entry created → Display in history list → Update statistics dashboard
- **Success criteria**: All syncs are logged with timestamp, direction, changes count, and status

### 6. Access Control & Audit Logging
- **Functionality**: Log all credential access and sync operations with IP tracking
- **Purpose**: Maintain security audit trail for compliance and investigation
- **Trigger**: Any operation that touches credentials or performs sync
- **Progression**: Operation requested → Check IP whitelist → Log access attempt → Allow or deny → Record in audit log
- **Success criteria**: Every access attempt is logged with IP, timestamp, endpoint, and result

## Edge Case Handling

- **Invalid Token** - Display validation error, prevent saving, guide user to regenerate token
- **Network Failure** - Show friendly error message, maintain previous state, allow retry
- **Rate Limiting** - Detect 429 responses, implement exponential backoff, notify user
- **Large Files** - Show progress indicator, handle timeouts gracefully, paginate results
- **IP Change** - Detect when user's IP changes, warn before blocking, suggest adding new IP
- **Expired Token** - Auto-detect invalid token, prompt for refresh, mark as invalid in UI
- **Concurrent Syncs** - Prevent multiple simultaneous syncs, queue operations, show in-progress status
- **Missing Components** - Handle files with no components gracefully, show empty state with guidance

## Design Direction

The design should feel professional, secure, and trustworthy - like enterprise software that handles sensitive data responsibly. The interface should balance power-user features with approachable simplicity, using clear visual hierarchy to guide users through complex workflows without overwhelming them.

## Color Selection

Complementary color scheme using existing ApexForge palette:
- **Primary Color**: Deep blue (oklch(52% 0.105 223.128)) - Communicates trust, security, and enterprise reliability
- **Secondary Colors**: Dark backgrounds (oklch(13% 0.028 261.692)) for professional depth, muted grays for supporting UI
- **Accent Color**: Bright blue (oklch(58.8% 0.158 241.966)) - Highlights CTAs and sync actions, draws attention to important operations
- **Foreground/Background Pairings**:
  - Background (Dark Blue oklch(13% 0.028 261.692)): White text (oklch(0.98 0 0)) - Ratio 15.2:1 ✓
  - Card (Dark oklch(12% 0.02 240)): White text (oklch(0.98 0 0)) - Ratio 15.8:1 ✓
  - Primary (Medium Blue oklch(52% 0.105 223.128)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Accent (Bright Blue oklch(58.8% 0.158 241.966)): Black text (oklch(0.10 0 0)) - Ratio 7.2:1 ✓
  - Muted (Subtle Gray oklch(25% 0.04 240)): Light gray text (oklch(70% 0.02 240)) - Ratio 4.8:1 ✓

## Font Selection

Inter font family conveys modern professionalism and excellent legibility for technical content, with strong tabular figure support for data display.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/36px/tight - Main section headers
  - H2 (Card Title): Inter Semibold/24px/tight - Subsection headers
  - H3 (Component Title): Inter Medium/18px/normal - Component and card titles
  - Body (Main Text): Inter Regular/14px/relaxed - Primary content
  - Small (Meta Text): Inter Regular/12px/normal - Timestamps, labels, meta info
  - Mono (Code/IDs): Inter Regular/13px/mono - File IDs, tokens, technical data

## Animations

Animations serve functional purposes: guiding attention to state changes, providing feedback on sync operations, and smoothing transitions between views. Subtle, purposeful motion reinforces the sense of a living, responsive system without distracting from the work.

- **Purposeful Meaning**: Loading spinners during sync operations, success checkmarks that fade in, error states that gently shake
- **Hierarchy of Movement**: 
  - Primary: Sync operation progress and completion states
  - Secondary: Tab transitions and dialog appearances
  - Tertiary: Hover states on interactive elements

## Component Selection

- **Components**: 
  - Tabs (shadcn) for organizing Sync/Credentials/Security sections with clear visual separation
  - Cards (shadcn) for grouping related information with subtle borders and backgrounds
  - Dialog (shadcn) for credential setup and confirmation actions, keeping context visible
  - Input (shadcn) for token entry with password masking and validation states
  - Badge (shadcn) to indicate sync status, validation state, security level
  - ScrollArea (shadcn) for file lists and history logs with smooth scrolling
  - Alert (shadcn) for important security notices and instructions
  - Button (shadcn) with clear hierarchy between primary sync actions and secondary operations

- **Customizations**: 
  - Custom sync status indicator combining badge with timestamp
  - IP address display with monospace font for readability
  - Access log entries with color-coded allowed/blocked states
  - File URL input with automatic ID extraction

- **States**: 
  - Buttons: Default (solid), Hover (slight scale), Active (pressed), Disabled (dimmed), Loading (spinner)
  - Inputs: Empty, Focused (ring), Valid (checkmark), Invalid (error border), Disabled
  - Badges: Active (green), Inactive (gray), Error (red), Pending (yellow)

- **Icon Selection**: 
  - ArrowsLeftRight for sync operations
  - Key for credentials management
  - Shield for security features
  - CheckCircle/XCircle for success/failure states
  - Download/Upload for sync direction indicators
  - Eye/EyeSlash for visibility toggles
  - Trash for deletion actions

- **Spacing**: 
  - Card padding: 24px (1.5rem)
  - Section gaps: 24px vertical
  - Button gaps: 8px horizontal
  - Form field spacing: 16px vertical
  - Icon-text gaps: 8px

- **Mobile**: 
  - Stack tabs vertically on mobile
  - Full-width buttons and inputs
  - Collapsible sections for file details
  - Simplified history view showing only essential info
  - Touch-friendly 44px minimum tap targets

## Security Architecture

### Multi-Layer Security
1. **CEO Authentication** - Must be logged into CEO dashboard to access Figma integration
2. **IP Whitelisting** - Optional but recommended layer to restrict credential access by IP
3. **Credential Encryption** - Tokens stored in encrypted KV store, never exposed in UI
4. **Audit Logging** - All access attempts logged with IP, timestamp, and result
5. **Token Validation** - Real-time validation against Figma API before saving

### Access Control Flow
```
User Request
  ↓
Check CEO Authentication
  ↓
Check IP Whitelist (if enabled)
  ↓
Log Access Attempt
  ↓
Grant/Deny Access
  ↓
Record in Audit Log
```

## Technical Implementation

### Services
- **figmaSyncService.ts** - Core service handling Figma API integration, sync operations, and security checks
- **ipWhitelistService.ts** - Existing service reused for IP-based access control

### Components
- **FigmaIntegration.tsx** - Main page with tabbed interface
- **FigmaSyncPanel.tsx** - File watching and sync operations
- **FigmaCredentialsSetup.tsx** - Secure token management
- **IPWhitelistManager.tsx** - Existing component for security configuration

### Data Storage (KV)
- `figma-sync-credentials` - Encrypted Figma access token and team ID
- `figma-sync-history` - Log of all sync operations
- `figma-watched-files` - List of monitored Figma files
- `ceo-ip-whitelist` - Whitelisted IP addresses (existing)
- `ceo-ip-access-log` - Access attempt logs (existing)

### AI Integration
Uses `spark.llm` to generate React TypeScript components from Figma component data, ensuring code follows project conventions and styling patterns.
