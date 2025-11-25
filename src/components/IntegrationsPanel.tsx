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
import { useScreenSize } from '../hooks/use-mobile'

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
  const { isMobile, isTablet } = useScreenSize()

  const canUseIntegration = (integration: Integration): boolean => {
    return true
  }

  const handleToggle = (integration: Integration) => {
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
    <Card className="p-3 sm:p-4 md:p-5 lg:p-6 border-primary/30 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5 lg:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg sm:text-xl'} font-bold flex items-center gap-2`}>
            <span>🔧</span>
            <span className="truncate">11 Killer Integrations</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {isMobile ? 'Toggle features' : 'Toggle features to add to your build'}
          </p>
        </div>
        <Badge className="bg-accent/20 text-accent border-accent/40 text-xs sm:text-sm whitespace-nowrap self-start sm:self-auto">
          {getTotalCredits()} {isMobile ? 'cr' : 'credits'}
        </Badge>
      </div>

      <ScrollArea className={`${isMobile ? 'h-[350px]' : isTablet ? 'h-[450px]' : 'h-[400px] sm:h-[500px]'} pr-2 sm:pr-3 lg:pr-4`}>
        <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
          {INTEGRATIONS.map((integration, index) => {
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
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`p-2.5 sm:p-3 lg:p-4 border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/50 bg-primary/5 shadow-sm'
                      : canUse
                      ? 'border-border hover:border-primary/30 hover:shadow-sm'
                      : 'border-border/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 flex-1 min-w-0">
                      <div
                        className={`${isMobile ? 'w-9 h-9' : 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10'} rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-primary/20' : 'bg-muted/20'
                        }`}
                      >
                        <Icon
                          className={integration.color}
                          weight={isSelected ? 'fill' : 'regular'}
                          size={isMobile ? 18 : 20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <h4 className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm sm:text-base'} truncate`}>
                            {integration.name}
                          </h4>
                          {!canUse && (
                            <Lock className="text-muted-foreground flex-shrink-0" size={isMobile ? 12 : 14} />
                          )}
                        </div>
                        <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} text-muted-foreground mb-1.5 sm:mb-2 ${isMobile ? 'line-clamp-2' : 'line-clamp-1'}`}>
                          {integration.shortDesc}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 ${
                              canUse ? 'border-primary/50 text-primary' : 'border-border'
                            }`}
                          >
                            {integration.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5">
                            {integration.credits} {isMobile ? 'cr' : 'credits'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
                      {!isMobile && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setExpandedIntegration(isExpanded ? null : integration.id)
                                }
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted/50"
                              >
                                <Info size={isMobile ? 14 : 16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">View details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {isMobile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedIntegration(isExpanded ? null : integration.id)
                          }
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <Info size={14} />
                        </Button>
                      )}

                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(integration)}
                        disabled={!canUse}
                        className={isMobile ? 'scale-90' : ''}
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
                        <Separator className="my-2 sm:my-2.5 lg:my-3" />
                        <div className="space-y-2 sm:space-y-2.5">
                          <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} text-muted-foreground leading-relaxed`}>
                            {integration.description}
                          </p>
                          <div className="space-y-1 sm:space-y-1.5">
                            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold`}>Features:</p>
                            {integration.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 sm:gap-2">
                                <Check
                                  className={`${integration.color} flex-shrink-0 mt-0.5`}
                                  size={isMobile ? 12 : 14}
                                />
                                <span className={`${isMobile ? 'text-[11px]' : 'text-xs'} text-muted-foreground leading-relaxed`}>{feature}</span>
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
        <div className="mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 lg:pt-6 border-t border-border">
          <div className="text-center space-y-2 sm:space-y-3">
            <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} text-muted-foreground`}>
              🔒 {isMobile ? 'Unlock all with Pro+' : 'Unlock all 11 integrations with Pro or higher'}
            </p>
            <Button 
              onClick={onUpgrade} 
              className={`w-full glow-primary ${isMobile ? 'h-9 text-sm' : 'h-10 text-sm sm:text-base'}`}
            >
              {isMobile ? 'Upgrade' : 'Upgrade to Unlock'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
