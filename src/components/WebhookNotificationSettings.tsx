import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Bell, Plus, Trash, CheckCircle, XCircle, TestTube } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { testWebhook } from '@/lib/webhookNotificationService'

interface WebhookConfig {
  id: string
  url: string
  enabled: boolean
  type: 'slack' | 'webhook'
  name: string
}

export function WebhookNotificationSettings() {
  const [webhooks, setWebhooks] = useKV<WebhookConfig[]>('webhook-configs', [])
  const [isCreating, setIsCreating] = useState(false)
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null)
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    name: '',
    url: '',
    type: 'slack',
    enabled: true,
  })

  const createWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!newWebhook.url.startsWith('http://') && !newWebhook.url.startsWith('https://')) {
      toast.error('URL must start with http:// or https://')
      return
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name!,
      url: newWebhook.url!,
      type: newWebhook.type as 'slack' | 'webhook',
      enabled: newWebhook.enabled ?? true,
    }

    setWebhooks((current) => [...(current || []), webhook])
    setIsCreating(false)
    setNewWebhook({
      name: '',
      url: '',
      type: 'slack',
      enabled: true,
    })
    toast.success('Webhook added successfully')
  }

  const deleteWebhook = (webhookId: string) => {
    setWebhooks((current) => (current || []).filter((w) => w.id !== webhookId))
    toast.success('Webhook removed')
  }

  const toggleWebhook = (webhookId: string) => {
    setWebhooks((current) =>
      (current || []).map((w) =>
        w.id === webhookId ? { ...w, enabled: !w.enabled } : w
      )
    )
  }

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhookId(webhook.id)
    
    try {
      const result = await testWebhook(webhook)
      
      if (result.success) {
        toast.success(`Test notification sent to ${webhook.name}`)
      } else {
        toast.error(`Failed to send test notification: ${result.error}`)
      }
    } catch (error) {
      toast.error('Failed to send test notification')
    } finally {
      setTestingWebhookId(null)
    }
  }

  const activeWebhooks = (webhooks || []).filter((w) => w.enabled).length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Bell weight="fill" className="text-accent" size={32} />
            Webhook Notifications
          </h2>
          <p className="text-muted-foreground mt-1">
            Get notified when A/B test winners are automatically selected
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="glow-accent">
              <Plus weight="bold" size={16} />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Webhook</DialogTitle>
              <DialogDescription>
                Configure a webhook to receive A/B test winner notifications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., Marketing Slack Channel"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="webhook-type">Type</Label>
                <Select
                  value={newWebhook.type}
                  onValueChange={(value) => setNewWebhook({ ...newWebhook, type: value as 'slack' | 'webhook' })}
                >
                  <SelectTrigger id="webhook-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="webhook">Generic Webhook</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {newWebhook.type === 'slack' 
                    ? 'Formatted for Slack incoming webhooks'
                    : 'Standard JSON webhook payload'
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder={
                    newWebhook.type === 'slack'
                      ? 'https://hooks.slack.com/services/...'
                      : 'https://your-endpoint.com/webhook'
                  }
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
                {newWebhook.type === 'slack' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your Slack webhook URL from{' '}
                    <a
                      href="https://api.slack.com/messaging/webhooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Slack API
                    </a>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <Label htmlFor="webhook-enabled" className="cursor-pointer">
                  Enable webhook
                </Label>
                <Switch
                  id="webhook-enabled"
                  checked={newWebhook.enabled ?? true}
                  onCheckedChange={(checked) => setNewWebhook({ ...newWebhook, enabled: checked })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={createWebhook}>Add Webhook</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Active Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              {activeWebhooks} of {(webhooks || []).length} webhooks enabled
            </p>
          </div>
          <Badge variant={activeWebhooks > 0 ? 'default' : 'outline'} className="text-sm">
            {activeWebhooks > 0 ? (
              <>
                <CheckCircle weight="fill" size={16} />
                Active
              </>
            ) : (
              <>
                <XCircle weight="fill" size={16} />
                Inactive
              </>
            )}
          </Badge>
        </div>

        {(webhooks || []).length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Bell weight="thin" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h4 className="text-lg font-semibold mb-2">No webhooks configured</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add a webhook to receive notifications when A/B test winners are selected
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus weight="bold" size={16} />
              Add First Webhook
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {(webhooks || []).map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={() => toggleWebhook(webhook.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{webhook.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {webhook.type === 'slack' ? 'Slack' : 'Webhook'}
                      </Badge>
                      {webhook.enabled && (
                        <Badge variant="default" className="text-xs bg-accent">
                          Enabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-mono truncate max-w-md">
                      {webhook.url}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestWebhook(webhook)}
                    disabled={!webhook.enabled || testingWebhookId === webhook.id}
                  >
                    <TestTube size={16} />
                    {testingWebhookId === webhook.id ? 'Testing...' : 'Test'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-muted/30 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Bell weight="fill" className="text-accent" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">How webhook notifications work</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Notifications are sent automatically when a winner is selected at 95%+ confidence</li>
              <li>• Both manual and automatic winner selections trigger webhooks</li>
              <li>• Slack webhooks receive rich formatted messages with test details</li>
              <li>• Generic webhooks receive JSON payloads with full test data</li>
              <li>• Use the test button to verify your webhook is working correctly</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
