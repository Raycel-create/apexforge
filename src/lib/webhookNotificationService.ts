interface WebhookConfig {
  url: string
  enabled: boolean
  type: 'slack' | 'webhook'
  name: string
}

interface ABTestWinnerPayload {
  testId: string
  testName: string
  campaignName: string
  winnerVariant: {
    id: string
    name: string
    subject: string
    stats: {
      sent: number
      opened: number
      clicked: number
      recovered: number
      openRate: string
      clickRate: string
      recoveryRate: string
    }
  }
  confidence: number
  timestamp: string
}

const formatSlackMessage = (payload: ABTestWinnerPayload) => {
  const { winnerVariant, confidence, testName, campaignName } = payload
  
  return {
    text: `🎉 A/B Test Winner Selected!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🏆 A/B Test Winner Selected!',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Test Name:*\n${testName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Campaign:*\n${campaignName}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Winner:*\n${winnerVariant.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Confidence:*\n${confidence}%`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Winning Subject Line:*\n_${winnerVariant.subject}_`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*📧 Sent:*\n${winnerVariant.stats.sent.toLocaleString()}`,
          },
          {
            type: 'mrkdwn',
            text: `*📬 Open Rate:*\n${winnerVariant.stats.openRate}%`,
          },
          {
            type: 'mrkdwn',
            text: `*👆 Click Rate:*\n${winnerVariant.stats.clickRate}%`,
          },
          {
            type: 'mrkdwn',
            text: `*💰 Recovery Rate:*\n${winnerVariant.stats.recoveryRate}%`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*✅ Recovered:*\n${winnerVariant.stats.recovered} customers`,
          },
          {
            type: 'mrkdwn',
            text: `*💵 Revenue:*\n$${(winnerVariant.stats.recovered * 19).toLocaleString()}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Selected automatically at ${confidence}% confidence | ${new Date(payload.timestamp).toLocaleString()}`,
          },
        ],
      },
    ],
  }
}

const formatWebhookPayload = (payload: ABTestWinnerPayload) => {
  return {
    event: 'ab_test.winner_selected',
    data: payload,
  }
}

export const sendWebhookNotification = async (
  config: WebhookConfig,
  payload: ABTestWinnerPayload
): Promise<{ success: boolean; error?: string }> => {
  if (!config.enabled || !config.url) {
    return { success: false, error: 'Webhook not configured or disabled' }
  }

  try {
    const body = config.type === 'slack' 
      ? formatSlackMessage(payload)
      : formatWebhookPayload(payload)

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook notification failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const sendMultipleWebhooks = async (
  configs: WebhookConfig[],
  payload: ABTestWinnerPayload
): Promise<Array<{ config: WebhookConfig; result: { success: boolean; error?: string } }>> => {
  const enabledConfigs = configs.filter((config) => config.enabled)
  
  const results = await Promise.all(
    enabledConfigs.map(async (config) => ({
      config,
      result: await sendWebhookNotification(config, payload),
    }))
  )

  return results
}

export const testWebhook = async (config: WebhookConfig): Promise<{ success: boolean; error?: string }> => {
  const testPayload: ABTestWinnerPayload = {
    testId: 'test-123',
    testName: 'Test Notification',
    campaignName: 'Sample Campaign',
    winnerVariant: {
      id: 'a',
      name: 'Variant A',
      subject: 'This is a test subject line',
      stats: {
        sent: 100,
        opened: 75,
        clicked: 45,
        recovered: 20,
        openRate: '75.0',
        clickRate: '45.0',
        recoveryRate: '20.0',
      },
    },
    confidence: 95,
    timestamp: new Date().toISOString(),
  }

  return sendWebhookNotification(config, testPayload)
}
