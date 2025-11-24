# Campaign Automation System

## Overview

The Campaign Automation System is an intelligent scheduler that automatically triggers email campaigns based on customer payment status and behavior. It eliminates manual campaign management by detecting payment events in real-time and executing appropriate recovery campaigns at optimal times.

## Architecture

### Components

1. **CampaignScheduler** (`/src/lib/campaignScheduler.ts`)
   - Core automation engine
   - Background job scheduler
   - Event detection system
   - Job queue management
   - Email execution engine

2. **CampaignAutomation** (`/src/components/CampaignAutomation.tsx`)
   - User interface for rule management
   - Job queue monitoring
   - Scheduler controls
   - Analytics dashboard

3. **Integration Points**
   - Email Campaigns (`EmailCampaigns.tsx`)
   - Customer Management (`CustomerManagement.tsx`)
   - CEO Dashboard (`CEODashboard.tsx`)

## Key Features

### 1. Automation Rules Engine

Create intelligent rules that define when and how campaigns should be triggered:

```typescript
interface AutomationRule {
  id: string
  name: string                    // "Auto-send 3-Day Past Due Reminder"
  trigger: string                 // past_due | failed_payment | churned | expiring_soon
  conditions: {
    daysAfterEvent: number        // Delay after event (e.g., 3 days)
    minAmount?: number            // Optional: Only trigger for amounts >= $10
    maxAmount?: number            // Optional: Only trigger for amounts <= $1000
    planTypes?: string[]          // Optional: Only for ['Pro', 'Enterprise']
    excludeStatuses?: string[]    // Optional: Don't trigger for ['churned']
  }
  campaignId: string              // Link to email campaign
  enabled: boolean                // Active/paused
  priority: number                // Execution order
  totalExecutions: number         // Metrics
}
```

### 2. Background Scheduler

Runs continuously in the background:

- **Default Check Interval**: 1 minute (configurable 1-60 minutes)
- **Auto-Start**: Initializes on CEO Dashboard load
- **Persistent**: Survives page reloads via state management
- **Controls**: Start/Stop/Run Now buttons

### 3. Intelligent Event Detection

Automatically detects customer payment events:

#### Past Due Detection
- Triggers when `customer.status === 'past_due'`
- Calculates days since last payment attempt
- Tracks `daysPastDue` for urgency levels

#### Failed Payment Detection
- Detects immediate payment failures
- Separate from past due for different messaging

#### Churned Customer Detection
- Identifies `status === 'cancelled'`
- Only triggers for cancellations 7+ days old
- Win-back campaign timing

#### Expiring Soon Detection
- Monitors active subscriptions
- Alerts 7 days before billing date
- Proactive retention

### 4. Smart Job Scheduling

Prevents duplicate jobs and manages execution:

```typescript
interface ScheduledJob {
  id: string                      // Unique: job_timestamp_random
  campaignId: string              // Which campaign to send
  customerId: string              // Who to send to
  scheduledFor: Date              // When to execute
  status: 'pending' | 'executed' | 'failed' | 'cancelled'
  trigger: string                 // Event type
  attempts: number                // Retry counter (max 3)
  lastAttempt?: Date              // Last execution attempt
  error?: string                  // Failure reason
}
```

**Duplicate Prevention**: Checks if customer already received same campaign within time window (daysDelay + 1 day buffer).

### 5. Email Personalization

Dynamic variable replacement in campaigns:

```
Subject: Payment Failed - Update Your Payment Method
Body: Hi {{name}},

We noticed your recent payment for {{plan}} didn't go through.
Amount due: ${{amount}}

Update payment: {{payment_link}}
```

Supported variables:
- `{{name}}` - Customer name
- `{{plan}}` - Subscription plan
- `{{amount}}` - Amount due
- `{{payment_link}}` - Payment update URL
- `{{reactivate_link}}` - Reactivation URL

### 6. Retry Logic

Automatic retry for transient failures:

- **Max Attempts**: 3
- **Retry Strategy**: Immediate on first failure, then exponential backoff
- **Failure Handling**: Mark as failed after 3 attempts with error message
- **Status Tracking**: Logs each attempt with timestamp

## Usage Guide

### Creating an Automation Rule

1. Navigate to **CEO Dashboard → Automation tab**
2. Click **"Create Rule"** button
3. Fill in rule details:
   ```
   Name: "Auto-send 3-Day Past Due Reminder"
   Trigger: Past Due Payment
   Days After Event: 3
   Campaign: [Select from dropdown]
   ```
4. Add optional conditions:
   ```
   Min Amount: $10
   Max Amount: $1000
   Plan Types: Pro, Enterprise
   ```
5. Toggle **"Enable immediately"** if ready to activate
6. Click **"Create Rule"**

### Monitoring Scheduled Jobs

View the job queue in the **Scheduled Jobs** tab:

- **Job ID**: Unique identifier
- **Customer**: Target customer ID
- **Trigger**: Event type (past_due, churned, etc.)
- **Scheduled For**: Execution timestamp
- **Status**: pending/executed/failed
- **Attempts**: Retry count

### Managing the Scheduler

**Scheduler Controls**:
- **Status Badge**: Shows running/stopped state
- **Start/Stop**: Toggle scheduler on/off
- **Run Now**: Force immediate execution
- **Check Interval**: Adjust frequency (1-60 minutes)

**Scheduler Status Display**:
- Current state (Running/Stopped)
- Last check timestamp
- Next check countdown
- Check interval setting

### Rule Management

**Per Rule Actions**:
- **Pause/Enable**: Toggle without deleting
- **Delete**: Remove rule permanently
- **View Metrics**: Total executions, last run time

**Rule Metrics**:
- Total executions all-time
- Last run timestamp
- Created date
- Enabled/disabled status

## Integration with Email Campaigns

### Campaign Setup

1. Create email campaign in **Campaigns tab**:
   - Define subject and body with variables
   - Set status (active/paused/draft)
   - Configure trigger type

2. Link to automation rule:
   - Select campaign in rule creation
   - Rule will auto-trigger campaign based on conditions

### Campaign Metrics Auto-Update

When automation executes:
- `campaign.sent` increments
- Customer `emailsSent` counter increments
- Customer status changes to 'contacted'
- Job marked as 'executed'

## Performance & Analytics

### Dashboard Metrics

**Summary Cards**:
- Active Rules: Count of enabled rules
- Pending Jobs: Scheduled but not yet executed
- Executed: Successfully sent emails
- Failed: Jobs that failed after retries
- Total Sent: All-time execution count

**Job Analytics**:
- Success rate calculation
- Average execution time
- Failed job reasons
- Retry statistics

### Rule Performance

Each rule tracks:
- Total executions
- Success rate (executed vs failed)
- Last run timestamp
- Customer reach

## Data Persistence

### Storage Keys

All data persists in KV storage:

```typescript
'automation-rules'   // AutomationRule[]
'scheduled-jobs'     // ScheduledJob[]
'email-campaigns'    // EmailCampaign[]
'past-due-customers' // PastDueCustomer[]
```

### State Management

- Rules and jobs survive page reloads
- Scheduler auto-restarts on dashboard load
- Customer status updates persist
- Campaign metrics accumulate

## Best Practices

### Rule Configuration

1. **Timing**: Set appropriate delays
   - Past Due: 3, 7, 14 days
   - Churned: 14, 30, 60 days
   - Expiring: 7, 3, 1 days before

2. **Conditions**: Use filters to target effectively
   - Minimum amounts prevent spam for small charges
   - Plan types focus on high-value customers
   - Status exclusions prevent duplicate outreach

3. **Priority**: Order rules by urgency
   - Higher priority = earlier execution
   - Use for time-sensitive campaigns

### Campaign Design

1. **Subject Lines**: Clear, action-oriented
   - "Payment Failed - Update Your Payment Method"
   - "We Miss You! Get 30% Off"

2. **Body Copy**: Personalized, concise
   - Use customer name
   - State clear next steps
   - Include action links

3. **Variable Usage**: Leverage all variables
   - Personalization increases engagement
   - Dynamic amounts show transparency

### Monitoring

1. **Check Scheduler Status**: Ensure running
2. **Review Failed Jobs**: Investigate errors
3. **Monitor Metrics**: Track recovery rates
4. **Adjust Rules**: Optimize based on performance

## Troubleshooting

### Scheduler Not Running

**Symptom**: Status shows "Stopped"

**Solution**:
1. Click "Start" button
2. Verify in browser console: `window.campaignScheduler.getStatus()`
3. Check interval setting (minimum 1 minute)

### Jobs Not Executing

**Symptom**: Jobs stay in "pending" status

**Possible Causes**:
1. Scheduler stopped - Start scheduler
2. Future scheduled time - Wait for scheduled time
3. No matching customers - Check customer data
4. Rule disabled - Enable rule

### Duplicate Jobs

**Symptom**: Same customer receives multiple emails

**Prevention**:
- System checks for existing jobs within time window
- Increase `daysAfterEvent` spacing between campaigns
- Review rule conditions to avoid overlaps

### Failed Jobs

**Symptom**: Jobs marked as "failed"

**Investigation**:
1. Check error message in job record
2. Verify campaign exists and is active
3. Ensure customer data is valid
4. Review retry attempts (max 3)

## API Reference

### CampaignScheduler Methods

```typescript
// Initialize and start scheduler
campaignScheduler.initialize()

// Start background scheduler
campaignScheduler.startScheduler()

// Stop background scheduler
campaignScheduler.stopScheduler()

// Manually execute pending jobs
await campaignScheduler.processScheduledCampaigns()

// Get current status
campaignScheduler.getStatus()
// Returns: { isRunning: boolean, checkInterval: number, lastCheck: string }

// Update check interval
campaignScheduler.setCheckInterval(minutes: number)

// Detect and schedule new events
await campaignScheduler.detectAndScheduleNewEvents()
```

### Global Access

Access scheduler from browser console:

```javascript
// Get status
window.campaignScheduler.getStatus()

// Force run
window.campaignScheduler.processScheduledCampaigns()

// Stop scheduler
window.campaignScheduler.stopScheduler()
```

## Future Enhancements

### Planned Features

1. **A/B Testing**: Test multiple campaign variants
2. **Advanced Scheduling**: Time-of-day optimization
3. **Email Templates**: Pre-built campaign templates
4. **Analytics Dashboard**: Detailed performance insights
5. **Webhook Integration**: External triggers
6. **SMS Support**: Multi-channel campaigns
7. **Machine Learning**: Optimal send time prediction
8. **Segmentation**: Advanced customer targeting
9. **Rate Limiting**: Prevent email overload
10. **Deliverability Tracking**: Bounce/spam monitoring

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify scheduler status in CEO Dashboard
4. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: 2025-02-20  
**Component**: Campaign Automation System
