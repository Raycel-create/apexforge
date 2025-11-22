import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { 
  EnvelopeSimple, 
  PaperPlaneTilt, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Warning,
  Plus,
  Trash,
  Eye,
  Play,
  Pause,
  Calendar,
  Users,
  CurrencyDollar
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface EmailCampaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft'
  trigger: 'past_due' | 'failed_payment' | 'churned' | 'expiring_soon'
  daysDelay: number
  subject: string
  body: string
  sent: number
  opened: number
  clicked: number
  recovered: number
  createdAt: string
}

interface PastDueCustomer {
  id: string
  email: string
  name: string
  plan: string
  amount: number
  daysPastDue: number
  lastPaymentAttempt: string
  emailsSent: number
  status: 'pending' | 'contacted' | 'recovered' | 'churned'
}

const DEFAULT_CAMPAIGNS: EmailCampaign[] = [
  {
    id: '1',
    name: '3-Day Past Due Reminder',
    status: 'active',
    trigger: 'past_due',
    daysDelay: 3,
    subject: 'Payment Failed - Update Your Payment Method',
    body: 'Hi {{name}},\n\nWe noticed your recent payment for {{plan}} didn\'t go through. Please update your payment method to continue enjoying your subscription.\n\nAmount due: ${{amount}}\n\nUpdate payment: {{payment_link}}',
    sent: 234,
    opened: 178,
    clicked: 89,
    recovered: 45,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    name: '7-Day Final Notice',
    status: 'active',
    trigger: 'past_due',
    daysDelay: 7,
    subject: 'Final Notice - Your Subscription Will Be Cancelled',
    body: 'Hi {{name}},\n\nYour account is 7 days past due. To avoid service interruption, please update your payment immediately.\n\nAmount due: ${{amount}}\n\nThis is your final notice before cancellation.\n\nUpdate now: {{payment_link}}',
    sent: 156,
    opened: 142,
    clicked: 98,
    recovered: 67,
    createdAt: '2025-01-15',
  },
  {
    id: '3',
    name: 'Win-Back Offer',
    status: 'active',
    trigger: 'churned',
    daysDelay: 14,
    subject: 'We Miss You! Get 30% Off Your Next Month',
    body: 'Hi {{name}},\n\nWe noticed you cancelled your {{plan}} subscription. We\'d love to have you back!\n\nUse code COMEBACK30 for 30% off your next month.\n\nReactivate now: {{reactivate_link}}',
    sent: 89,
    opened: 67,
    clicked: 34,
    recovered: 18,
    createdAt: '2025-02-01',
  },
]

const PAST_DUE_CUSTOMERS: PastDueCustomer[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Smith',
    plan: 'Pro',
    amount: 19,
    daysPastDue: 5,
    lastPaymentAttempt: '2025-02-15',
    emailsSent: 1,
    status: 'contacted',
  },
  {
    id: '2',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    plan: 'Enterprise',
    amount: 250,
    daysPastDue: 8,
    lastPaymentAttempt: '2025-02-12',
    emailsSent: 2,
    status: 'contacted',
  },
  {
    id: '3',
    email: 'mike@example.com',
    name: 'Mike Davis',
    plan: 'Gold',
    amount: 180,
    daysPastDue: 2,
    lastPaymentAttempt: '2025-02-18',
    emailsSent: 0,
    status: 'pending',
  },
  {
    id: '4',
    email: 'emily@example.com',
    name: 'Emily Chen',
    plan: 'Pro',
    amount: 19,
    daysPastDue: 12,
    lastPaymentAttempt: '2025-02-08',
    emailsSent: 3,
    status: 'churned',
  },
]

export function EmailCampaigns() {
  const [campaigns, setCampaigns] = useKV<EmailCampaign[]>('email-campaigns', DEFAULT_CAMPAIGNS)
  const [pastDueCustomers, setPastDueCustomers] = useKV<PastDueCustomer[]>('past-due-customers', PAST_DUE_CUSTOMERS)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [editingCampaign, setEditingCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    trigger: 'past_due',
    daysDelay: 3,
    subject: '',
    body: '',
    status: 'draft',
  })

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns((current) =>
      (current || []).map((c) =>
        c.id === campaignId
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
          : c
      )
    )
    toast.success('Campaign status updated')
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns((current) => (current || []).filter((c) => c.id !== campaignId))
    toast.success('Campaign deleted')
  }

  const sendTestEmail = async () => {
    if (!testEmail || !selectedCampaign) return

    setIsTesting(true)
    toast.info('Sending test email...')
    
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsTesting(false)
    toast.success(`Test email sent to ${testEmail}`)
    setTestEmail('')
  }

  const createCampaign = () => {
    if (!editingCampaign.name || !editingCampaign.subject || !editingCampaign.body) {
      toast.error('Please fill in all required fields')
      return
    }

    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: editingCampaign.name,
      status: editingCampaign.status || 'draft',
      trigger: editingCampaign.trigger || 'past_due',
      daysDelay: editingCampaign.daysDelay || 3,
      subject: editingCampaign.subject,
      body: editingCampaign.body,
      sent: 0,
      opened: 0,
      clicked: 0,
      recovered: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setCampaigns((current) => [...(current || []), newCampaign])
    setIsCreating(false)
    setEditingCampaign({
      name: '',
      trigger: 'past_due',
      daysDelay: 3,
      subject: '',
      body: '',
      status: 'draft',
    })
    toast.success('Campaign created successfully')
  }

  const runCampaignNow = async (campaignId: string) => {
    toast.info('Running campaign for all eligible customers...')
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const eligibleCount = (pastDueCustomers || []).filter((c) => c.status === 'pending').length
    
    setCampaigns((current) =>
      (current || []).map((c) =>
        c.id === campaignId
          ? { ...c, sent: c.sent + eligibleCount }
          : c
      )
    )
    
    setPastDueCustomers((current) =>
      (current || []).map((c) =>
        c.status === 'pending'
          ? { ...c, emailsSent: c.emailsSent + 1, status: 'contacted' }
          : c
      )
    )
    
    toast.success(`Campaign sent to ${eligibleCount} customers`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-primary'
      case 'paused':
        return 'text-muted-foreground'
      case 'draft':
        return 'text-accent'
      case 'pending':
        return 'text-accent'
      case 'contacted':
        return 'text-primary'
      case 'recovered':
        return 'text-primary'
      case 'churned':
        return 'text-destructive'
      default:
        return ''
    }
  }

  const calculateRecoveryRate = (campaign: EmailCampaign) => {
    if (campaign.sent === 0) return 0
    return ((campaign.recovered / campaign.sent) * 100).toFixed(1)
  }

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.sent === 0) return 0
    return ((campaign.opened / campaign.sent) * 100).toFixed(1)
  }

  const totalPastDue = (pastDueCustomers || []).reduce((sum, c) => sum + c.amount, 0)
  const totalRecoverable = (pastDueCustomers || []).filter((c) => c.status !== 'churned').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <EnvelopeSimple weight="fill" className="text-primary" size={32} />
            Email Campaigns
          </h2>
          <p className="text-muted-foreground mt-1">
            Automated campaigns for past due customers and win-back offers
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="glow-primary">
              <Plus weight="bold" size={16} />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Set up an automated email campaign for customer recovery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., 5-Day Payment Reminder"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trigger">Trigger Event</Label>
                  <Select
                    value={editingCampaign.trigger}
                    onValueChange={(value: any) => setEditingCampaign({ ...editingCampaign, trigger: value })}
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
                  <Label htmlFor="delay">Days Delay</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="0"
                    value={editingCampaign.daysDelay}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, daysDelay: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="Use {{name}}, {{plan}}, {{amount}} variables"
                  value={editingCampaign.subject}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, subject: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  placeholder="Use variables: {{name}}, {{plan}}, {{amount}}, {{payment_link}}"
                  rows={8}
                  value={editingCampaign.body}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, body: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Available variables: &#123;&#123;name&#125;&#125;, &#123;&#123;plan&#125;&#125;, &#123;&#123;amount&#125;&#125;, &#123;&#123;payment_link&#125;&#125;, &#123;&#123;reactivate_link&#125;&#125;
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="activate"
                    checked={editingCampaign.status === 'active'}
                    onCheckedChange={(checked) =>
                      setEditingCampaign({ ...editingCampaign, status: checked ? 'active' : 'draft' })
                    }
                  />
                  <Label htmlFor="activate" className="cursor-pointer">
                    Activate immediately
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createCampaign}>Create Campaign</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Active Campaigns</h4>
            <PaperPlaneTilt weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">
            {(campaigns || []).filter((c) => c.status === 'active').length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(campaigns || []).filter((c) => c.status === 'paused').length} paused
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Past Due Customers</h4>
            <Users weight="fill" className="text-accent" size={20} />
          </div>
          <p className="text-3xl font-bold">
            {(pastDueCustomers || []).filter((c) => c.status !== 'churned').length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(pastDueCustomers || []).filter((c) => c.status === 'pending').length} pending contact
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Total Past Due</h4>
            <Warning weight="fill" className="text-destructive" size={20} />
          </div>
          <p className="text-3xl font-bold text-destructive">${totalPastDue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ${totalRecoverable.toLocaleString()} recoverable
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Recovery Rate</h4>
            <CheckCircle weight="fill" className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">
            {(campaigns || []).length > 0
              ? (
                  ((campaigns || []).reduce((sum, c) => sum + c.recovered, 0) /
                    (campaigns || []).reduce((sum, c) => sum + c.sent, 0)) *
                  100
                ).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(campaigns || []).reduce((sum, c) => sum + c.recovered, 0)} customers recovered
          </p>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="customers">Past Due Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {(campaigns || []).map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{campaign.name}</h3>
                    <Badge
                      variant={campaign.status === 'active' ? 'default' : 'outline'}
                      className={getStatusColor(campaign.status)}
                    >
                      {campaign.status === 'active' && <CheckCircle weight="fill" size={14} />}
                      {campaign.status === 'paused' && <Pause weight="fill" size={14} />}
                      {campaign.status === 'draft' && <Clock weight="fill" size={14} />}
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Trigger: {campaign.trigger.replace('_', ' ')} • Delay: {campaign.daysDelay} days • Created: {campaign.createdAt}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Subject:</p>
                      <p className="text-sm">{campaign.subject}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                  >
                    {campaign.status === 'active' ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Activate
                      </>
                    )}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <Eye size={16} />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Campaign Preview</DialogTitle>
                        <DialogDescription>{campaign.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Subject</Label>
                          <p className="text-sm p-3 bg-muted rounded-md mt-1">{campaign.subject}</p>
                        </div>
                        <div>
                          <Label>Body</Label>
                          <p className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap">{campaign.body}</p>
                        </div>
                        <div className="border-t pt-4">
                          <Label htmlFor="test-email">Send Test Email</Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id="test-email"
                              type="email"
                              placeholder="your@email.com"
                              value={testEmail}
                              onChange={(e) => setTestEmail(e.target.value)}
                            />
                            <Button onClick={sendTestEmail} disabled={isTesting || !testEmail}>
                              <PaperPlaneTilt size={16} />
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runCampaignNow(campaign.id)}
                    disabled={campaign.status !== 'active'}
                  >
                    <PaperPlaneTilt weight="fill" size={16} />
                    Run Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCampaign(campaign.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sent</p>
                  <p className="text-2xl font-bold">{campaign.sent}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Opened</p>
                  <p className="text-2xl font-bold text-primary">{campaign.opened}</p>
                  <p className="text-xs text-muted-foreground">{calculateOpenRate(campaign)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Clicked</p>
                  <p className="text-2xl font-bold text-accent">{campaign.clicked}</p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recovered</p>
                  <p className="text-2xl font-bold text-primary">{campaign.recovered}</p>
                  <p className="text-xs text-muted-foreground">{calculateRecoveryRate(campaign)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-primary">${(campaign.recovered * 19).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}

          {(campaigns || []).length === 0 && (
            <Card className="p-12 text-center">
              <EnvelopeSimple weight="thin" className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h3 className="text-xl font-bold mb-2">No Campaigns Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first automated email campaign to recover past due customers
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus weight="bold" size={16} />
                Create First Campaign
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold">Customer</th>
                    <th className="text-left p-3 text-sm font-semibold">Plan</th>
                    <th className="text-right p-3 text-sm font-semibold">Amount</th>
                    <th className="text-center p-3 text-sm font-semibold">Days Past Due</th>
                    <th className="text-center p-3 text-sm font-semibold">Emails Sent</th>
                    <th className="text-center p-3 text-sm font-semibold">Status</th>
                    <th className="text-center p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(pastDueCustomers || []).map((customer) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3">
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{customer.plan}</Badge>
                      </td>
                      <td className="p-3 text-right font-semibold">${customer.amount}</td>
                      <td className="p-3 text-center">
                        <Badge
                          variant="outline"
                          className={
                            customer.daysPastDue > 10
                              ? 'border-destructive text-destructive'
                              : customer.daysPastDue > 5
                              ? 'border-accent text-accent'
                              : ''
                          }
                        >
                          {customer.daysPastDue} days
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-semibold">{customer.emailsSent}</td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={customer.status === 'recovered' ? 'default' : 'outline'}
                          className={getStatusColor(customer.status)}
                        >
                          {customer.status === 'pending' && <Clock weight="fill" size={14} />}
                          {customer.status === 'contacted' && <EnvelopeSimple weight="fill" size={14} />}
                          {customer.status === 'recovered' && <CheckCircle weight="fill" size={14} />}
                          {customer.status === 'churned' && <XCircle weight="fill" size={14} />}
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              toast.success(`Email sent to ${customer.name}`)
                              setPastDueCustomers((current) =>
                                (current || []).map((c) =>
                                  c.id === customer.id
                                    ? { ...c, emailsSent: c.emailsSent + 1, status: 'contacted' }
                                    : c
                                )
                              )
                            }}
                          >
                            <EnvelopeSimple size={16} />
                            Send Now
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
