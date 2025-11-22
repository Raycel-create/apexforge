import { useState } from 'react'
import { Lock, Check, Info } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { INTEGRATIONS, Integration } from '../lib/integrations'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface IntegrationsPanelProps {
  selectedIntegrations: string[]
  onToggleIntegration: (id: string) => void
  userTier: 'free' | 'pro' | 'gold' | 'enterprise'
  onUpgrade: () => void
}

export function IntegrationsPanel({
  selectedIntegrations,
  onToggleIntegration,
  userTier,
  onUpgrade
}: IntegrationsPanelProps) {
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null)

  const canUseIntegration = (integration: Integration): boolean => {
    const tierLevel = { free: 0, pro: 1, gold: 2, enterprise: 3 }
    return tierLevel[userTier] >= tierLevel[integration.tier]
  }

  const handleToggle = (integration: Integration) => {
    if (!canUseIntegration(integration)) {
      toast.error(`${integration.name} requires ${integration.tier.toUpperCase()} tier`, {
        description: 'Upgrade your plan to unlock this integration',
        action: {
          label: 'Upgrade',
          onClick: onUpgrade
        }
      })
      return
    }

    onToggleIntegration(integration.id)
    
    if (!selectedIntegrations.includes(integration.id)) {
      toast.success(`${integration.name} enabled! (+${integration.credits} credits)`, {
        description: integration.shortDesc
      })
    } else {
      toast.info(`${integration.name} disabled`)
    }
  }

  const getTotalCredits = (): number => {
    return INTEGRATIONS
      .filter(int => selectedIntegrations.includes(int.id))
      .reduce((sum, int) => sum + int.credits, 2)
  }

  return (
    <Card className="p-4 sm:p-5 lg:p-6 border-primary/30">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            🔧 11 Killer Integrations
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Toggle features to add to your build
          </p>
        </div>
        <Badge className="bg-accent/20 text-accent border-accent/40 text-sm">
          {getTotalCredits()} credits
        </Badge>
      </div>

      <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
        <div className="space-y-2 sm:space-y-3">
          {INTEGRATIONS.map((integration) => {
            const Icon = integration.icon
            const isSelected = selectedIntegrations.includes(integration.id)
            const canUse = canUseIntegration(integration)
            const isExpanded = expandedIntegration === integration.id

            return (
              <motion.div
                key={integration.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={`p-3 sm:p-4 border transition-all ${
                    isSelected
                      ? 'border-primary/50 bg-primary/5'
                      : canUse
                      ? 'border-border hover:border-primary/30'
                      : 'border-border/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary/20' : 'bg-muted/20'
                        }`}
                      >
                        <Icon
                          className={integration.color}
                          weight={isSelected ? 'fill' : 'regular'}
                          size={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm sm:text-base truncate">
                            {integration.name}
                          </h4>
                          {!canUse && (
                            <Lock className="text-muted-foreground flex-shrink-0" size={14} />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
                          {integration.shortDesc}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] sm:text-xs ${
                              canUse ? 'border-primary/50 text-primary' : 'border-border'
                            }`}
                          >
                            {integration.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {integration.credits} credits
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedIntegration(isExpanded ? null : integration.id)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Info size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(integration)}
                        disabled={!canUse}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {integration.description}
                          </p>
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold">Features:</p>
                            {integration.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check
                                  className={`${integration.color} flex-shrink-0 mt-0.5`}
                                  size={14}
                                />
                                <span className="text-xs text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>

      {userTier === 'free' && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              🔒 Unlock all 11 integrations with Pro or higher
            </p>
            <Button onClick={onUpgrade} className="w-full glow-primary">
              Upgrade to Unlock
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
