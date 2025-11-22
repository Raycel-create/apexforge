import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Broadcast,
  CheckCircle,
  Warning,
  Lightning,
  Code,
  Play,
  ClockCounterClockwise,
  CreditCard,
  XCircle,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ScrollArea } from './ui/scroll-area'

interface WebhookEvent {
  id: string
  type: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
  payload: any
  response?: string
}

const WEBHOOK_EVENTS = [
  {
    type: 'customer.subscription.created',
    label: 'Subscription Created',
    icon: CreditCard,
    description: 'Customer subscribes to a plan',
  },
  {
    type: 'customer.subscription.updated',
    label: 'Subscription Updated',
    icon: ArrowsClockwise,
    description: 'Plan change or billing update',
  },
  {
    type: 'customer.subscription.deleted',
    label: 'Subscription Cancelled',
    icon: XCircle,
    description: 'Customer cancels subscription',
  },
  {
    type: 'invoice.payment_succeeded',
    label: 'Payment Succeeded',
    icon: CheckCircle,
    description: 'Successful payment processed',
  },
  {
    type: 'invoice.payment_failed',
    label: 'Payment Failed',
    icon: Warning,
    description: 'Payment failed or declined',
  },
  {
    type: 'charge.refunded',
    label: 'Charge Refunded',
    icon: ArrowsClockwise,
    description: 'Refund issued to customer',
  },
]

export function WebhookSimulator() {
  const [selectedEvent, setSelectedEvent] = useState('')
  const [customPayload, setCustomPayload] = useState('')
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [simulating, setSimulating] = useState(false)

  const generateSamplePayload = (eventType: string) => {
    const payloads: Record<string, any> = {
      'customer.subscription.created': {
        id: `sub_${Date.now()}`,
        customer: 'cus_mock123',
        status: 'active',
        plan: {
          id: 'price_pro',
          nickname: 'Pro Plan',
          amount: 1900,
          currency: 'usd',
        },
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
      },
      'customer.subscription.updated': {
        id: `sub_${Date.now()}`,
        customer: 'cus_mock123',
        status: 'active',
        previous_attributes: {
          plan: { id: 'price_free' },
        },
        plan: {
          id: 'price_launch',
          nickname: 'Launch Plan',
          amount: 3900,
          currency: 'usd',
        },
      },
      'customer.subscription.deleted': {
        id: `sub_${Date.now()}`,
        customer: 'cus_mock123',
        status: 'canceled',
        canceled_at: Math.floor(Date.now() / 1000),
      },
      'invoice.payment_succeeded': {
        id: `in_${Date.now()}`,
        customer: 'cus_mock123',
        amount_paid: 1900,
        currency: 'usd',
        status: 'paid',
        subscription: 'sub_mock789',
      },
      'invoice.payment_failed': {
        id: `in_${Date.now()}`,
        customer: 'cus_mock123',
        amount_due: 1900,
        currency: 'usd',
        status: 'open',
        attempt_count: 2,
        next_payment_attempt: Math.floor(Date.now() / 1000) + 86400,
      },
      'charge.refunded': {
        id: `ch_${Date.now()}`,
        amount: 1900,
        amount_refunded: 1900,
        currency: 'usd',
        refunded: true,
        customer: 'cus_mock123',
      },
    }

    return payloads[eventType] || {}
  }

  const simulateWebhook = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event type')
      return
    }

    setSimulating(true)

    const payload = customPayload
      ? JSON.parse(customPayload)
      : generateSamplePayload(selectedEvent)

    const newEvent: WebhookEvent = {
      id: `evt_${Date.now()}`,
      type: selectedEvent,
      timestamp: new Date().toISOString(),
      status: 'pending',
      payload,
    }

    setEvents((prev) => [newEvent, ...prev])

    toast.info('🚀 Webhook triggered', {
      description: 'Simulating payment flow...',
      duration: 1500,
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = Math.random() > 0.2

    setEvents((prev) =>
      prev.map((e) =>
        e.id === newEvent.id
          ? {
              ...e,
              status: success ? 'success' : 'failed',
              response: success
                ? 'Webhook processed successfully. Customer account updated.'
                : 'Webhook failed: Network timeout or endpoint error.',
            }
          : e
      )
    )

    if (success) {
      toast.success('✅ Webhook processed!', {
        description: 'Payment flow completed successfully',
        duration: 3000,
      })
    } else {
      toast.error('❌ Webhook failed', {
        description: 'Check logs for details',
        duration: 3000,
      })
    }

    setSimulating(false)
  }

  const handleEventSelect = (eventType: string) => {
    setSelectedEvent(eventType)
    const sample = generateSamplePayload(eventType)
    setCustomPayload(JSON.stringify(sample, null, 2))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-accent/20 text-accent border-accent/40">
            <CheckCircle weight="fill" size={12} />
            Success
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/40">
            <Warning weight="fill" size={12} />
            Failed
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse">
            <Lightning weight="fill" size={12} />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="p-6 border-primary/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Broadcast weight="fill" className="text-primary" size={28} />
          Webhook Simulator
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Test payment flows and webhook events in real-time
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-type" className="mb-2 block">
              Event Type
            </Label>
            <Select value={selectedEvent} onValueChange={handleEventSelect}>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Select webhook event" />
              </SelectTrigger>
              <SelectContent>
                {WEBHOOK_EVENTS.map((event) => (
                  <SelectItem key={event.type} value={event.type}>
                    <div className="flex items-center gap-2">
                      <event.icon size={16} />
                      {event.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEvent && (
              <p className="text-xs text-muted-foreground mt-2">
                {WEBHOOK_EVENTS.find((e) => e.type === selectedEvent)?.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="payload" className="mb-2 block flex items-center justify-between">
              <span>Event Payload (JSON)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedEvent) {
                    const sample = generateSamplePayload(selectedEvent)
                    setCustomPayload(JSON.stringify(sample, null, 2))
                  }
                }}
                disabled={!selectedEvent}
              >
                <Code size={14} />
                Reset
              </Button>
            </Label>
            <Textarea
              id="payload"
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              placeholder='{"id": "evt_123", "type": "payment.succeeded"}'
              rows={12}
              className="font-mono text-xs"
            />
          </div>

          <Button
            onClick={simulateWebhook}
            disabled={!selectedEvent || simulating}
            className="w-full glow-primary"
            size="lg"
          >
            <Play weight="fill" size={20} />
            {simulating ? 'Simulating...' : 'Trigger Webhook'}
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <ClockCounterClockwise weight="fill" className="text-primary" size={20} />
              Recent Events
            </Label>
            {events.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEvents([])}
              >
                Clear
              </Button>
            )}
          </div>

          <ScrollArea className="h-[500px] border border-border rounded-lg p-4">
            <AnimatePresence>
              {events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Broadcast size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No events triggered yet</p>
                  <p className="text-xs mt-2">Select an event type and click trigger</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{event.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>

                      {event.response && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground mb-1">Response:</div>
                          <div className="text-xs font-mono bg-muted/50 p-2 rounded">
                            {event.response}
                          </div>
                        </div>
                      )}

                      <details className="mt-3">
                        <summary className="text-xs text-primary cursor-pointer hover:underline">
                          View Payload
                        </summary>
                        <pre className="text-xs font-mono bg-muted/50 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </details>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightning weight="fill" className="text-primary mt-1" size={20} />
          <div>
            <div className="font-semibold mb-1">Real-Time Testing</div>
            <p className="text-xs text-muted-foreground">
              This simulator mimics Stripe webhook events for testing payment flows. Use it to verify
              subscription updates, payment processing, and error handling without real transactions.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
