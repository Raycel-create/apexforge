import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs'
import {
  Robot,
  Lightning,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
  Plus,
  Trash,
  Play,
  Pause,
  Gear,
  ArrowsClockwise,
  Calendar,
  EnvelopeSimple,
  ListChecks,
  ChartLine,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { campaignScheduler } from '../lib/campaignScheduler'

interface AutomationRule {
  id: string
  name: string
  trigger: 'past_due' | 'failed_payment' | 'churned' | 'expiring_soon'
  conditions: {
    daysAfterEvent: number
    minAmount?: number
    maxAmount?: number
    planTypes?: string[]
    excludeStatuses?: string[]
  }
  campaignId: string
  enabled: boolean
  priority: number
  createdAt: Date
  lastRun?: Date
  totalExecutions: number
}

interface ScheduledJob {
  id: string
  campaignId: string
  customerId: string
  scheduledFor: Date
  status: 'pending' | 'executed' | 'failed' | 'cancelled'
  trigger: string
  attempts: number
}

const DEFAULT_RULES: AutomationRule[] = [
  {
    id: 'rule_1',
    name: 'Auto-send 3-Day Past Due Reminder',
    trigger: 'past_due',
    conditions: {
      daysAfterEvent: 3,
      minAmount: 10,
    },
    campaignId: '1',
    enabled: true,
    priority: 1,
    createdAt: new Date('2025-01-15'),
    totalExecutions: 234,
    lastRun: new Date('2025-02-19T14:30:00'),
  },
  {
    id: 'rule_2',
    name: 'Auto-send 7-Day Final Notice',
    trigger: 'past_due',
    conditions: {
      daysAfterEvent: 7,
    },
    campaignId: '2',
    enabled: true,
    priority: 2,
    createdAt: new Date('2025-01-15'),
    totalExecutions: 156,
    lastRun: new Date('2025-02-18T14:30:00'),
  },
  {
    id: 'rule_3',
    name: 'Win-Back Churned Users (14 days)',
    trigger: 'churned',
    conditions: {
      daysAfterEvent: 14,
      planTypes: ['Pro', 'Launch', 'Enterprise'],
    },
    campaignId: '3',
    enabled: true,
    priority: 3,
    createdAt: new Date('2025-02-01'),
    totalExecutions: 89,
    lastRun: new Date('2025-02-17T14:30:00'),
  },
]

export function CampaignAutomation() {
  const [rules, setRules] = useKV<AutomationRule[]>('automation-rules', DEFAULT_RULES)
  const [scheduledJobs, setScheduledJobs] = useKV<ScheduledJob[]>('scheduled-jobs', [])
  const [campaigns] = useKV<any[]>('email-campaigns', [])
  const [isCreating, setIsCreating] = useState(false)
  const [schedulerStatus, setSchedulerStatus] = useState<any>(null)
  const [checkInterval, setCheckInterval] = useState(1)
  const [editingRule, setEditingRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: 'past_due',
    conditions: {
      daysAfterEvent: 3,
    },
    campaignId: '',
    enabled: true,
    priority: 1,
  })

  useEffect(() => {
    campaignScheduler.initialize()
    updateSchedulerStatus()

    const statusInterval = setInterval(() => {
      updateSchedulerStatus()
      refreshScheduledJobs()
    }, 5000)

    return () => {
      clearInterval(statusInterval)
    }
  }, [])

  const updateSchedulerStatus = () => {
    setSchedulerStatus(campaignScheduler.getStatus())
  }

  const refreshScheduledJobs = async () => {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const jobs = await window.spark.kv.get<ScheduledJob[]>('scheduled-jobs') || []
      setScheduledJobs(jobs)
    }
  }

  const toggleRule = (ruleId: string) => {
    setRules((current) =>
      (current || []).map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
    toast.success('Automation rule updated')
  }

  const deleteRule = (ruleId: string) => {
    setRules((current) => (current || []).filter((rule) => rule.id !== ruleId))
    toast.success('Automation rule deleted')
  }

  const createRule = () => {
    if (!editingRule.name || !editingRule.campaignId) {
      toast.error('Please fill in all required fields')
      return
    }

    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: editingRule.name,
      trigger: editingRule.trigger || 'past_due',
      conditions: editingRule.conditions || { daysAfterEvent: 3 },
      campaignId: editingRule.campaignId,
      enabled: editingRule.enabled ?? true,
      priority: editingRule.priority || 1,
      createdAt: new Date(),
      totalExecutions: 0,
    }

    setRules((current) => [...(current || []), newRule])
    setIsCreating(false)
    setEditingRule({
      name: '',
      trigger: 'past_due',
      conditions: { daysAfterEvent: 3 },
      campaignId: '',
      enabled: true,
      priority: 1,
    })
    toast.success('Automation rule created')
  }

  const runSchedulerNow = async () => {
    toast.info('Running campaign scheduler...')
    await campaignScheduler.processScheduledCampaigns()
    await refreshScheduledJobs()
    toast.success('Scheduler executed successfully')
  }

  const toggleScheduler = () => {
    if (schedulerStatus?.isRunning) {
      campaignScheduler.stopScheduler()
      toast.info('Campaign scheduler stopped')
    } else {
      campaignScheduler.startScheduler()
      toast.success('Campaign scheduler started')
    }
    updateSchedulerStatus()
  }

  const updateCheckInterval = () => {
    campaignScheduler.setCheckInterval(checkInterval)
    toast.success(`Check interval updated to ${checkInterval} minute(s)`)
    updateSchedulerStatus()
  }

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'past_due':
        return 'Past Due Payment'
      case 'failed_payment':
        return 'Failed Payment'
      case 'churned':
        return 'Churned Customer'
      case 'expiring_soon':
        return 'Expiring Soon'
      default:
        return trigger
    }
  }

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'past_due':
        return 'text-destructive'
      case 'failed_payment':
        return 'text-destructive'
      case 'churned':
        return 'text-muted-foreground'
      case 'expiring_soon':
        return 'text-accent'
      default:
        return ''
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-accent'
      case 'executed':
        return 'text-primary'
      case 'failed':
        return 'text-destructive'
      case 'cancelled':
        return 'text-muted-foreground'
      default:
        return ''
    }
  }

  const pendingJobs = (scheduledJobs || []).filter((j) => j.status === 'pending').length
  const executedJobs = (scheduledJobs || []).filter((j) => j.status === 'executed').length
  const failedJobs = (scheduledJobs || []).filter((j) => j.status === 'failed').length
  const activeRules = (rules || []).filter((r) => r.enabled).length
  const totalExecutions = (rules || []).reduce((sum, r) => sum + r.totalExecutions, 0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Robot weight="fill" className="text-primary" size={32} />
            Campaign Automation
          </h2>
          <p className="text-muted-foreground mt-1">
            Scheduled triggers based on customer payment status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={runSchedulerNow}
            className="gap-2"
          >
            <ArrowsClockwise weight="bold" size={16} />
            Run Now
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="glow-primary gap-2">
                <Plus weight="bold" size={16} />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>
                  Set up an automated trigger for email campaigns
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="e.g., Auto-send 5-Day Reminder"
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trigger">Trigger Event</Label>
                    <Select
                      value={editingRule.trigger}
                      onValueChange={(value: any) => setEditingRule({ ...editingRule, trigger: value })}
                    >
                      <SelectTrigger id="trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="past_due">Past Due Payment</SelectItem>
                        <SelectItem value="failed_payment">Failed Payment</SelectItem>
                        <SelectItem value="churned">Churned Customer</SelectItem>
                        <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="days-delay">Days After Event</Label>
                    <Input
                      id="days-delay"
                      type="number"
                      min="0"
                      value={editingRule.conditions?.daysAfterEvent || 3}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          conditions: {
                            ...editingRule.conditions,
                            daysAfterEvent: parseInt(e.target.value) || 3,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="campaign">Email Campaign</Label>
                  <Select
                    value={editingRule.campaignId}
                    onValueChange={(value) => setEditingRule({ ...editingRule, campaignId: value })}
                  >
                    <SelectTrigger id="campaign">
                      <SelectValue placeholder="Select campaign..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(campaigns || []).map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Conditions (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-amount">Min Amount ($)</Label>
                      <Input
                        id="min-amount"
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
                        value={editingRule.conditions?.minAmount || ''}
                        onChange={(e) =>
                          setEditingRule({
                            ...editingRule,
                            conditions: {
                              ...editingRule.conditions,
                              daysAfterEvent: editingRule.conditions?.daysAfterEvent || 3,
                              minAmount: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-amount">Max Amount ($)</Label>
                      <Input
                        id="max-amount"
                        type="number"
                        min="0"
                        placeholder="e.g., 1000"
                        value={editingRule.conditions?.maxAmount || ''}
                        onChange={(e) =>
                          setEditingRule({
                            ...editingRule,
                            conditions: {
                              ...editingRule.conditions,
                              daysAfterEvent: editingRule.conditions?.daysAfterEvent || 3,
                              maxAmount: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="enable"
                      checked={editingRule.enabled ?? true}
                      onCheckedChange={(checked) =>
                        setEditingRule({ ...editingRule, enabled: checked })
                      }
                    />
                    <Label htmlFor="enable" className="cursor-pointer">
                      Enable immediately
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createRule}>Create Rule</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Active Rules</h4>
            <CheckCircle weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">{activeRules}</p>
          <p className="text-xs text-muted-foreground mt-1">
            of {(rules || []).length} total
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Pending Jobs</h4>
            <Clock weight="fill" className="text-accent" size={20} />
          </div>
          <p className="text-3xl font-bold text-accent">{pendingJobs}</p>
          <p className="text-xs text-muted-foreground mt-1">scheduled to run</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Executed</h4>
            <EnvelopeSimple weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{executedJobs}</p>
          <p className="text-xs text-muted-foreground mt-1">emails sent</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Failed</h4>
            <XCircle weight="fill" className="text-destructive" size={20} />
          </div>
          <p className="text-3xl font-bold text-destructive">{failedJobs}</p>
          <p className="text-xs text-muted-foreground mt-1">need attention</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Sent</h4>
            <ChartLine weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{totalExecutions}</p>
          <p className="text-xs text-muted-foreground mt-1">all time</p>
        </Card>
      </div>

      <Card className="p-6 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Gear weight="fill" className="text-primary" size={20} />
              Scheduler Status
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={schedulerStatus?.isRunning ? 'default' : 'outline'}
              className={schedulerStatus?.isRunning ? 'bg-primary/20 text-primary border-primary/40' : ''}
            >
              {schedulerStatus?.isRunning ? (
                <>
                  <Lightning weight="fill" size={14} />
                  Running
                </>
              ) : (
                <>
                  <Pause weight="fill" size={14} />
                  Stopped
                </>
              )}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleScheduler}
            >
              {schedulerStatus?.isRunning ? (
                <>
                  <Pause size={16} />
                  Stop
                </>
              ) : (
                <>
                  <Play size={16} />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Check Interval</p>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={checkInterval}
                onChange={(e) => setCheckInterval(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm self-center">minute(s)</span>
              <Button size="sm" variant="outline" onClick={updateCheckInterval}>
                Update
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Check</p>
            <p className="text-sm font-mono">
              {schedulerStatus?.lastCheck
                ? new Date(schedulerStatus.lastCheck).toLocaleTimeString()
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Next Check</p>
            <p className="text-sm font-mono">
              {schedulerStatus?.isRunning
                ? `In ${Math.floor(schedulerStatus.checkInterval / 60000)} min`
                : 'Stopped'}
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="jobs">Scheduled Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {(rules || []).map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{rule.name}</h3>
                    <Badge
                      variant={rule.enabled ? 'default' : 'outline'}
                      className={rule.enabled ? 'bg-primary/20 text-primary border-primary/40' : ''}
                    >
                      {rule.enabled ? (
                        <>
                          <CheckCircle weight="fill" size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <Pause weight="fill" size={14} />
                          Paused
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className={getTriggerColor(rule.trigger)}>
                      {getTriggerLabel(rule.trigger)}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Trigger:</strong> {rule.conditions.daysAfterEvent} days after {rule.trigger.replace('_', ' ')}
                    </p>
                    {rule.conditions.minAmount && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Min Amount:</strong> ${rule.conditions.minAmount}
                      </p>
                    )}
                    {rule.conditions.maxAmount && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Max Amount:</strong> ${rule.conditions.maxAmount}
                      </p>
                    )}
                    {rule.conditions.planTypes && rule.conditions.planTypes.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Plans:</strong> {rule.conditions.planTypes.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Executions</p>
                      <p className="text-2xl font-bold">{rule.totalExecutions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Run</p>
                      <p className="text-sm">
                        {rule.lastRun
                          ? new Date(rule.lastRun).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="text-sm">{new Date(rule.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRule(rule.id)}
                  >
                    {rule.enabled ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Enable
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {(rules || []).length === 0 && (
            <Card className="p-12 text-center">
              <Robot weight="thin" className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h3 className="text-xl font-bold mb-2">No Automation Rules</h3>
              <p className="text-muted-foreground mb-4">
                Create your first automation rule to trigger campaigns automatically
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus weight="bold" size={16} />
                Create First Rule
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold">Job ID</th>
                    <th className="text-left p-3 text-sm font-semibold">Customer</th>
                    <th className="text-left p-3 text-sm font-semibold">Trigger</th>
                    <th className="text-center p-3 text-sm font-semibold">Scheduled For</th>
                    <th className="text-center p-3 text-sm font-semibold">Status</th>
                    <th className="text-center p-3 text-sm font-semibold">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {(scheduledJobs || []).slice(0, 50).map((job) => (
                    <tr key={job.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3">
                        <p className="font-mono text-xs">{job.id.substring(0, 12)}...</p>
                      </td>
                      <td className="p-3">
                        <p className="font-mono text-xs">{job.customerId}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={getTriggerColor(job.trigger)}>
                          {getTriggerLabel(job.trigger)}
                        </Badge>
                      </td>
                      <td className="p-3 text-center text-sm">
                        {new Date(job.scheduledFor).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={job.status === 'executed' ? 'default' : 'outline'}
                          className={getStatusColor(job.status)}
                        >
                          {job.status === 'pending' && <Clock weight="fill" size={14} />}
                          {job.status === 'executed' && <CheckCircle weight="fill" size={14} />}
                          {job.status === 'failed' && <XCircle weight="fill" size={14} />}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-semibold">{job.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(scheduledJobs || []).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ListChecks size={48} className="mx-auto mb-4 opacity-50" />
                <p>No scheduled jobs yet</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
