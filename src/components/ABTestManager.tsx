import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { 
  Flask, 
  ChartLine,
  Trophy,
  Play,
  Pause,
  Plus,
  Trash,
  CheckCircle,
  XCircle,
  ArrowsClockwise,
  Lightning
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { sendMultipleWebhooks } from '@/lib/webhookNotificationService'

interface WebhookConfig {
  id: string
  url: string
  enabled: boolean
  type: 'slack' | 'webhook'
  name: string
}

interface ABTestVariant {
  id: string
  name: string
  subject: string
  body: string
  sent: number
  opened: number
  clicked: number
  recovered: number
}

interface ABTest {
  id: string
  campaignId: string
  campaignName: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABTestVariant[]
  winnerVariantId?: string
  totalSent: number
  startDate?: string
  endDate?: string
  testPercentage: number
  minSampleSize: number
  createdAt: string
  autoSelectWinner?: boolean
}

const DEFAULT_AB_TESTS: ABTest[] = [
  {
    id: '1',
    campaignId: '1',
    campaignName: '3-Day Past Due Reminder',
    name: 'Subject Line Test',
    status: 'running',
    testPercentage: 50,
    minSampleSize: 100,
    totalSent: 234,
    startDate: '2025-02-10',
    autoSelectWinner: true,
    variants: [
      {
        id: 'a',
        name: 'Variant A - Direct',
        subject: 'Payment Failed - Update Your Payment Method',
        body: 'Hi {{name}},\n\nWe noticed your recent payment for {{plan}} didn\'t go through. Please update your payment method to continue enjoying your subscription.\n\nAmount due: ${{amount}}\n\nUpdate payment: {{payment_link}}',
        sent: 117,
        opened: 89,
        clicked: 45,
        recovered: 23,
      },
      {
        id: 'b',
        name: 'Variant B - Friendly',
        subject: 'Quick Heads Up About Your Account',
        body: 'Hi {{name}},\n\nJust a friendly reminder that we couldn\'t process your last payment. No worries - it happens!\n\nTo keep your {{plan}} plan active, please update your payment info.\n\nAmount: ${{amount}}\n\nFix it now: {{payment_link}}',
        sent: 117,
        opened: 102,
        clicked: 58,
        recovered: 31,
      },
    ],
    createdAt: '2025-02-10',
  },
  {
    id: '2',
    campaignId: '3',
    campaignName: 'Win-Back Offer',
    name: 'Discount Amount Test',
    status: 'completed',
    testPercentage: 50,
    minSampleSize: 50,
    totalSent: 89,
    startDate: '2025-02-01',
    endDate: '2025-02-15',
    winnerVariantId: 'b',
    autoSelectWinner: true,
    variants: [
      {
        id: 'a',
        name: 'Variant A - 30% Off',
        subject: 'We Miss You! Get 30% Off Your Next Month',
        body: 'Hi {{name}},\n\nWe noticed you cancelled your {{plan}} subscription. We\'d love to have you back!\n\nUse code COMEBACK30 for 30% off your next month.\n\nReactivate now: {{reactivate_link}}',
        sent: 44,
        opened: 32,
        clicked: 15,
        recovered: 7,
      },
      {
        id: 'b',
        name: 'Variant B - 50% Off',
        subject: 'We Miss You! Get 50% Off Your Next Month',
        body: 'Hi {{name}},\n\nWe noticed you cancelled your {{plan}} subscription. We want you back!\n\nUse code COMEBACK50 for 50% off your next month - our best offer ever.\n\nReactivate now: {{reactivate_link}}',
        sent: 45,
        opened: 35,
        clicked: 20,
        recovered: 11,
      },
    ],
    createdAt: '2025-02-01',
  },
]

interface ABTestManagerProps {
  campaigns?: Array<{ id: string; name: string; subject: string; body: string }>
}

export function ABTestManager({ campaigns = [] }: ABTestManagerProps) {
  const [tests, setTests] = useKV<ABTest[]>('ab-tests', DEFAULT_AB_TESTS)
  const [webhooks] = useKV<WebhookConfig[]>('webhook-configs', [])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [newTest, setNewTest] = useState<Partial<ABTest>>({
    name: '',
    campaignId: '',
    testPercentage: 50,
    minSampleSize: 100,
    status: 'draft',
    autoSelectWinner: true,
    variants: [
      { id: 'a', name: 'Variant A', subject: '', body: '', sent: 0, opened: 0, clicked: 0, recovered: 0 },
      { id: 'b', name: 'Variant B', subject: '', body: '', sent: 0, opened: 0, clicked: 0, recovered: 0 },
    ],
  })

  useEffect(() => {
    const checkAutoWinner = () => {
      setTests((currentTests) => {
        if (!currentTests) return []

        let hasChanges = false
        const updatedTests = currentTests.map((test) => {
          if (
            test.status === 'running' &&
            test.autoSelectWinner &&
            !test.winnerVariantId &&
            test.variants.length === 2
          ) {
            const confidence = calculateConfidence(test.variants[0], test.variants[1])
            
            if (confidence >= 95) {
              const winner = getWinningVariant(test)
              if (winner && winner.sent >= test.minSampleSize) {
                hasChanges = true
                toast.success(`🎉 Winner automatically selected for "${test.name}"! ${winner.name} won with ${confidence}% confidence.`, {
                  duration: 8000,
                })
                
                sendWinnerNotifications(test, winner, confidence)
                
                return {
                  ...test,
                  status: 'completed' as const,
                  winnerVariantId: winner.id,
                  endDate: new Date().toISOString().split('T')[0],
                }
              }
            }
          }
          return test
        })

        return hasChanges ? updatedTests : currentTests
      })
    }

    const interval = setInterval(checkAutoWinner, 5000)
    checkAutoWinner()

    return () => clearInterval(interval)
  }, [setTests])

  const calculateOpenRate = (variant: ABTestVariant): string => {
    if (variant.sent === 0) return '0.0'
    return ((variant.opened / variant.sent) * 100).toFixed(1)
  }

  const calculateClickRate = (variant: ABTestVariant): string => {
    if (variant.sent === 0) return '0.0'
    return ((variant.clicked / variant.sent) * 100).toFixed(1)
  }

  const calculateRecoveryRate = (variant: ABTestVariant): string => {
    if (variant.sent === 0) return '0.0'
    return ((variant.recovered / variant.sent) * 100).toFixed(1)
  }

  const getWinningVariant = (test: ABTest) => {
    if (test.winnerVariantId) {
      return test.variants.find((v) => v.id === test.winnerVariantId)
    }
    
    return test.variants.reduce((best, current) => {
      const bestRate = best.sent > 0 ? best.recovered / best.sent : 0
      const currentRate = current.sent > 0 ? current.recovered / current.sent : 0
      return currentRate > bestRate ? current : best
    }, test.variants[0])
  }

  const calculateConfidence = (variantA: ABTestVariant, variantB: ABTestVariant) => {
    if (variantA.sent < 30 || variantB.sent < 30) return 0
    
    const rateA = variantA.sent > 0 ? variantA.recovered / variantA.sent : 0
    const rateB = variantB.sent > 0 ? variantB.recovered / variantB.sent : 0
    
    const diff = Math.abs(rateA - rateB)
    const avgRate = (rateA + rateB) / 2
    
    if (avgRate === 0) return 0
    
    const confidence = Math.min(95, (diff / avgRate) * 100 * Math.sqrt(Math.min(variantA.sent, variantB.sent) / 50))
    return Math.round(confidence)
  }

  const sendWinnerNotifications = async (test: ABTest, winner: ABTestVariant, confidence: number) => {
    if (!webhooks || webhooks.length === 0) return

    const payload = {
      testId: test.id,
      testName: test.name,
      campaignName: test.campaignName,
      winnerVariant: {
        id: winner.id,
        name: winner.name,
        subject: winner.subject,
        stats: {
          sent: winner.sent,
          opened: winner.opened,
          clicked: winner.clicked,
          recovered: winner.recovered,
          openRate: calculateOpenRate(winner),
          clickRate: calculateClickRate(winner),
          recoveryRate: calculateRecoveryRate(winner),
        },
      },
      confidence,
      timestamp: new Date().toISOString(),
    }

    try {
      const results = await sendMultipleWebhooks(webhooks, payload)
      const successCount = results.filter((r) => r.result.success).length
      const failCount = results.filter((r) => !r.result.success).length

      if (successCount > 0) {
        toast.success(`Sent notifications to ${successCount} webhook${successCount > 1 ? 's' : ''}`)
      }
      if (failCount > 0) {
        toast.error(`Failed to send ${failCount} webhook notification${failCount > 1 ? 's' : ''}`)
      }
    } catch (error) {
      console.error('Failed to send webhook notifications:', error)
    }
  }

  const createTest = () => {
    if (!newTest.name || !newTest.campaignId || !newTest.variants || newTest.variants.length < 2) {
      toast.error('Please fill in all required fields')
      return
    }

    const hasEmptyVariants = newTest.variants.some((v) => !v.subject || !v.body)
    if (hasEmptyVariants) {
      toast.error('All variants must have a subject and body')
      return
    }

    const campaign = campaigns.find((c) => c.id === newTest.campaignId)
    
    const test: ABTest = {
      id: Date.now().toString(),
      campaignId: newTest.campaignId!,
      campaignName: campaign?.name || 'Unknown Campaign',
      name: newTest.name!,
      status: newTest.status as any || 'draft',
      testPercentage: newTest.testPercentage || 50,
      minSampleSize: newTest.minSampleSize || 100,
      autoSelectWinner: newTest.autoSelectWinner ?? true,
      totalSent: 0,
      variants: newTest.variants!.map((v) => ({
        ...v,
        sent: 0,
        opened: 0,
        clicked: 0,
        recovered: 0,
      })),
      createdAt: new Date().toISOString().split('T')[0],
    }

    setTests((current) => [...(current || []), test])
    setIsCreating(false)
    setNewTest({
      name: '',
      campaignId: '',
      testPercentage: 50,
      minSampleSize: 100,
      status: 'draft',
      autoSelectWinner: true,
      variants: [
        { id: 'a', name: 'Variant A', subject: '', body: '', sent: 0, opened: 0, clicked: 0, recovered: 0 },
        { id: 'b', name: 'Variant B', subject: '', body: '', sent: 0, opened: 0, clicked: 0, recovered: 0 },
      ],
    })
    toast.success('A/B test created successfully')
  }

  const toggleTestStatus = (testId: string) => {
    setTests((current) =>
      (current || []).map((t) => {
        if (t.id === testId) {
          const newStatus = t.status === 'running' ? 'paused' : t.status === 'paused' ? 'running' : 'running'
          return {
            ...t,
            status: newStatus,
            startDate: newStatus === 'running' && !t.startDate ? new Date().toISOString().split('T')[0] : t.startDate,
          }
        }
        return t
      })
    )
    toast.success('Test status updated')
  }

  const declareWinner = (testId: string, variantId: string) => {
    const test = (tests || []).find((t) => t.id === testId)
    if (!test) return

    const winner = test.variants.find((v) => v.id === variantId)
    if (!winner) return

    const confidence = test.variants.length === 2 
      ? calculateConfidence(test.variants[0], test.variants[1])
      : 0

    setTests((current) =>
      (current || []).map((t) =>
        t.id === testId
          ? {
              ...t,
              status: 'completed',
              winnerVariantId: variantId,
              endDate: new Date().toISOString().split('T')[0],
            }
          : t
      )
    )
    
    sendWinnerNotifications(test, winner, confidence)
    toast.success('Winner declared! This variant will be used for future campaigns.')
  }

  const toggleAutoWinner = (testId: string) => {
    setTests((current) =>
      (current || []).map((t) =>
        t.id === testId
          ? { ...t, autoSelectWinner: !t.autoSelectWinner }
          : t
      )
    )
    const test = (tests || []).find((t) => t.id === testId)
    if (test?.autoSelectWinner) {
      toast.info('Auto-winner selection disabled')
    } else {
      toast.success('Auto-winner selection enabled - winner will be declared at 95% confidence')
    }
  }

  const deleteTest = (testId: string) => {
    setTests((current) => (current || []).filter((t) => t.id !== testId))
    toast.success('Test deleted')
  }

  const addVariant = () => {
    const nextLetter = String.fromCharCode(97 + (newTest.variants?.length || 0))
    setNewTest({
      ...newTest,
      variants: [
        ...(newTest.variants || []),
        {
          id: nextLetter,
          name: `Variant ${nextLetter.toUpperCase()}`,
          subject: '',
          body: '',
          sent: 0,
          opened: 0,
          clicked: 0,
          recovered: 0,
        },
      ],
    })
  }

  const removeVariant = (variantId: string) => {
    setNewTest({
      ...newTest,
      variants: (newTest.variants || []).filter((v) => v.id !== variantId),
    })
  }

  const updateVariant = (variantId: string, field: string, value: string) => {
    setNewTest({
      ...newTest,
      variants: (newTest.variants || []).map((v) =>
        v.id === variantId ? { ...v, [field]: value } : v
      ),
    })
  }

  const loadCampaignTemplate = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign && newTest.variants && newTest.variants.length > 0) {
      setNewTest({
        ...newTest,
        campaignId,
        variants: newTest.variants.map((v) => ({
          ...v,
          subject: v.subject || campaign.subject,
          body: v.body || campaign.body,
        })),
      })
    } else {
      setNewTest({
        ...newTest,
        campaignId,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-primary'
      case 'paused':
        return 'text-muted-foreground'
      case 'completed':
        return 'text-accent'
      case 'draft':
        return 'text-muted-foreground'
      default:
        return ''
    }
  }

  const runningTests = (tests || []).filter((t) => t.status === 'running').length
  const completedTests = (tests || []).filter((t) => t.status === 'completed').length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Flask weight="fill" className="text-accent" size={32} />
            A/B Testing
          </h2>
          <p className="text-muted-foreground mt-1">
            Test subject lines and content to optimize email performance
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="glow-accent">
              <Plus weight="bold" size={16} />
              Create A/B Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
              <DialogDescription>
                Test different subject lines and content to find what works best
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    placeholder="e.g., Subject Line Test"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="campaign">Campaign</Label>
                  <Select
                    value={newTest.campaignId}
                    onValueChange={loadCampaignTemplate}
                  >
                    <SelectTrigger id="campaign">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="percentage">Test Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="10"
                    max="100"
                    value={newTest.testPercentage}
                    onChange={(e) => setNewTest({ ...newTest, testPercentage: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    % of audience to include in test
                  </p>
                </div>
                <div>
                  <Label htmlFor="sample-size">Minimum Sample Size</Label>
                  <Input
                    id="sample-size"
                    type="number"
                    min="50"
                    value={newTest.minSampleSize}
                    onChange={(e) => setNewTest({ ...newTest, minSampleSize: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emails per variant before declaring winner
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Lightning weight="fill" className="text-accent" size={24} />
                  <div>
                    <Label htmlFor="auto-winner" className="text-sm font-semibold cursor-pointer">
                      Auto-Select Winner at 95% Confidence
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Automatically declare winner when confidence reaches 95%+
                    </p>
                  </div>
                </div>
                <Switch
                  id="auto-winner"
                  checked={newTest.autoSelectWinner ?? true}
                  onCheckedChange={(checked) => setNewTest({ ...newTest, autoSelectWinner: checked })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Variants ({newTest.variants?.length || 0})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    disabled={(newTest.variants?.length || 0) >= 4}
                  >
                    <Plus size={16} />
                    Add Variant
                  </Button>
                </div>

                {newTest.variants?.map((variant, index) => (
                  <Card key={variant.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Variant {variant.id.toUpperCase()}</h4>
                      {index > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                          className="text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`subject-${variant.id}`}>Subject Line</Label>
                        <Input
                          id={`subject-${variant.id}`}
                          placeholder="Email subject line"
                          value={variant.subject}
                          onChange={(e) => updateVariant(variant.id, 'subject', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`body-${variant.id}`}>Email Body</Label>
                        <Textarea
                          id={`body-${variant.id}`}
                          placeholder="Email content with {{variables}}"
                          rows={6}
                          value={variant.body}
                          onChange={(e) => updateVariant(variant.id, 'body', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={createTest}>Create Test</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Running Tests</h4>
            <Play weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{runningTests}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(tests || []).filter((t) => t.status === 'paused').length} paused
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Completed Tests</h4>
            <CheckCircle weight="fill" className="text-accent" size={20} />
          </div>
          <p className="text-3xl font-bold">{completedTests}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(tests || []).filter((t) => t.status === 'draft').length} drafts
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Sent</h4>
            <ChartLine weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">
            {(tests || []).reduce((sum, t) => sum + t.totalSent, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Across all tests</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Avg. Improvement</h4>
            <Trophy weight="fill" className="text-accent" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">
            {completedTests > 0
              ? (
                  (tests || [])
                    .filter((t) => t.status === 'completed' && t.variants.length === 2)
                    .reduce((sum, t) => {
                      const winner = getWinningVariant(t)
                      const loser = t.variants.find((v) => v.id !== winner?.id)
                      if (!winner || !loser || winner.sent === 0 || loser.sent === 0) return sum
                      const improvement = ((winner.recovered / winner.sent) - (loser.recovered / loser.sent)) / (loser.recovered / loser.sent) * 100
                      return sum + improvement
                    }, 0) / completedTests
                ).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">From winning variants</p>
        </Card>
      </div>

      <div className="space-y-4">
        {(tests || []).map((test) => {
          const winner = getWinningVariant(test)
          const confidence = test.variants.length === 2 ? calculateConfidence(test.variants[0], test.variants[1]) : 0

          return (
            <Card key={test.id} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{test.name}</h3>
                    <Badge
                      variant={test.status === 'running' ? 'default' : 'outline'}
                      className={getStatusColor(test.status)}
                    >
                      {test.status === 'running' && <Play weight="fill" size={14} />}
                      {test.status === 'paused' && <Pause weight="fill" size={14} />}
                      {test.status === 'completed' && <CheckCircle weight="fill" size={14} />}
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </Badge>
                    {test.status === 'completed' && winner && (
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        <Trophy weight="fill" size={14} />
                        Winner: {winner.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Campaign: {test.campaignName} • Created: {test.createdAt}
                    {test.startDate && ` • Started: ${test.startDate}`}
                    {test.endDate && ` • Ended: ${test.endDate}`}
                  </p>
                  {test.autoSelectWinner && test.status === 'running' && (
                    <div className="flex items-center gap-2 text-sm text-accent mb-2">
                      <Lightning weight="fill" size={16} />
                      <span>Auto-winner enabled</span>
                    </div>
                  )}
                  {test.status === 'running' && confidence > 0 && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Statistical Confidence</span>
                        <span className="text-sm font-bold text-primary">{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-2" />
                      {confidence >= 95 && test.autoSelectWinner && (
                        <p className="text-xs text-accent mt-2 flex items-center gap-1">
                          <Lightning weight="fill" size={14} />
                          Winner will be auto-selected when minimum sample size is reached
                        </p>
                      )}
                      {confidence >= 95 && !test.autoSelectWinner && (
                        <p className="text-xs text-primary mt-2">
                          ✓ Ready to declare winner (95%+ confidence)
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {test.status === 'running' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAutoWinner(test.id)}
                      className={test.autoSelectWinner ? 'border-accent text-accent' : ''}
                    >
                      <Lightning weight={test.autoSelectWinner ? 'fill' : 'regular'} size={16} />
                      Auto
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTestStatus(test.id)}
                    disabled={test.status === 'completed'}
                  >
                    {test.status === 'running' ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        {test.status === 'paused' ? 'Resume' : 'Start'}
                      </>
                    )}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTest(test)}
                      >
                        <ChartLine size={16} />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{test.name} - Details</DialogTitle>
                        <DialogDescription>{test.campaignName}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {test.variants.map((variant) => (
                          <Card key={variant.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{variant.name}</h4>
                              {test.winnerVariantId === variant.id && (
                                <Badge variant="default" className="bg-accent text-accent-foreground">
                                  <Trophy weight="fill" size={14} />
                                  Winner
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2 mb-4">
                              <div>
                                <Label className="text-xs">Subject</Label>
                                <p className="text-sm p-2 bg-muted rounded mt-1">{variant.subject}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Body Preview</Label>
                                <p className="text-sm p-2 bg-muted rounded mt-1 line-clamp-3">{variant.body}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground">Sent</p>
                                <p className="text-lg font-bold">{variant.sent}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Opened</p>
                                <p className="text-lg font-bold text-primary">{calculateOpenRate(variant)}%</p>
                                <p className="text-xs text-muted-foreground">{variant.opened}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Clicked</p>
                                <p className="text-lg font-bold text-accent">{calculateClickRate(variant)}%</p>
                                <p className="text-xs text-muted-foreground">{variant.clicked}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Recovered</p>
                                <p className="text-lg font-bold text-primary">{calculateRecoveryRate(variant)}%</p>
                                <p className="text-xs text-muted-foreground">{variant.recovered}</p>
                              </div>
                            </div>
                            {test.status !== 'completed' && test.status === 'running' && (
                              <Button
                                className="w-full mt-4"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  declareWinner(test.id, variant.id)
                                  setSelectedTest(null)
                                }}
                              >
                                <Trophy size={16} />
                                Declare Winner
                              </Button>
                            )}
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTest(test.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {test.variants.map((variant) => (
                  <div key={variant.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{variant.name}</h4>
                        {test.winnerVariantId === variant.id && (
                          <Trophy weight="fill" className="text-accent" size={18} />
                        )}
                      </div>
                      {test.status === 'running' && winner?.id === variant.id && (
                        <Badge variant="default" className="text-xs">Leading</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{variant.subject}</p>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sent</p>
                        <p className="text-xl font-bold">{variant.sent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Open Rate</p>
                        <p className="text-xl font-bold text-primary">{calculateOpenRate(variant)}%</p>
                        <p className="text-xs text-muted-foreground">{variant.opened} opens</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Click Rate</p>
                        <p className="text-xl font-bold text-accent">{calculateClickRate(variant)}%</p>
                        <p className="text-xs text-muted-foreground">{variant.clicked} clicks</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
                        <p className="text-xl font-bold text-primary">{calculateRecoveryRate(variant)}%</p>
                        <p className="text-xs text-muted-foreground">{variant.recovered} recovered</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                        <p className="text-xl font-bold text-primary">${(variant.recovered * 19).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}

        {(tests || []).length === 0 && (
          <Card className="p-12 text-center">
            <Flask weight="thin" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h3 className="text-xl font-bold mb-2">No A/B Tests Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first A/B test to optimize email campaign performance
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus weight="bold" size={16} />
              Create First Test
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
