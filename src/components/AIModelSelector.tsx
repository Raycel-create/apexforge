import { useState } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Sparkle, Lightning, Shield, Palette, Code, Eye, Check } from '@phosphor-icons/react'
import { AI_MODEL_CONFIGS, AI_PROVIDERS, AIModelConfig, AIProvider } from '../lib/aiService'
import { motion } from 'framer-motion'

interface AIModelSelectorProps {
  selectedModels: string[]
  onToggleModel: (modelId: string) => void
  availableProviders: string[]
}

const categoryIcons = {
  flagship: { icon: Sparkle, color: 'text-yellow-400' },
  mini: { icon: Lightning, color: 'text-cyan-400' },
  fast: { icon: Lightning, color: 'text-green-400' },
  instruct: { icon: Shield, color: 'text-orange-400' },
  vision: { icon: Eye, color: 'text-purple-400' },
  code: { icon: Code, color: 'text-blue-400' }
}

export function AIModelSelector({ selectedModels, onToggleModel, availableProviders }: AIModelSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredModels = AI_MODEL_CONFIGS.filter(model => {
    const providerMatch = selectedProvider === 'all' || model.provider === selectedProvider
    const categoryMatch = selectedCategory === 'all' || model.category === selectedCategory
    const hasAPIKey = availableProviders.includes(model.apiKeyId)
    return providerMatch && categoryMatch && hasAPIKey
  })

  const getProviderIcon = (provider: AIProvider) => {
    const providerData = AI_PROVIDERS.find(p => p.id === provider)
    return providerData?.icon || '🤖'
  }

  const getCategoryIcon = (category?: string) => {
    if (!category) return Lightning
    return categoryIcons[category as keyof typeof categoryIcons]?.icon || Lightning
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return 'text-gray-400'
    return categoryIcons[category as keyof typeof categoryIcons]?.color || 'text-gray-400'
  }

  return (
    <Card className="p-4 sm:p-5 lg:p-6 border-primary/30">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
          <Sparkle weight="fill" className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
          AI Model Selector
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected • {availableProviders.length} provider{availableProviders.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <Tabs value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as AIProvider | 'all')} className="mb-4">
        <TabsList className="w-full grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-9 mb-4 h-auto gap-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-2">
            All
          </TabsTrigger>
          {AI_PROVIDERS.map(provider => (
            <TabsTrigger
              key={provider.id}
              value={provider.id}
              disabled={!availableProviders.includes(provider.id)}
              className="text-xs sm:text-sm px-2 data-[state=active]:bg-primary/20"
            >
              <span className="mr-1">{provider.icon}</span>
              <span className="hidden sm:inline">{provider.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="text-xs"
        >
          All Categories
        </Button>
        {Object.keys(categoryIcons).map(category => {
          const Icon = getCategoryIcon(category)
          const color = getCategoryColor(category)
          return (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              <Icon className={`${color} w-3.5 h-3.5`} weight="fill" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          )
        })}
      </div>

      {availableProviders.length === 0 ? (
        <Card className="p-6 sm:p-8 border-yellow-500/30 bg-yellow-500/10 text-center">
          <Shield className="mx-auto mb-3 text-yellow-500 w-10 h-10 sm:w-12 sm:h-12" weight="fill" />
          <h4 className="font-semibold mb-2 text-sm sm:text-base">No API Keys Configured</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Please configure at least one AI provider API key to use model selection.
          </p>
        </Card>
      ) : filteredModels.length === 0 ? (
        <Card className="p-6 sm:p-8 border-border text-center">
          <Sparkle className="mx-auto mb-3 text-muted-foreground w-10 h-10 sm:w-12 sm:h-12" weight="thin" />
          <h4 className="font-semibold mb-2 text-sm sm:text-base">No Models Available</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Try selecting a different provider or category.
          </p>
        </Card>
      ) : (
        <ScrollArea className="h-[400px] sm:h-[450px] pr-2 sm:pr-4">
          <div className="space-y-2">
            {filteredModels.map(model => {
              const isSelected = selectedModels.includes(model.id)
              const Icon = getCategoryIcon(model.category)
              const categoryColor = getCategoryColor(model.category)
              
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`p-3 sm:p-4 cursor-pointer transition-all hover:border-primary/50 ${
                      isSelected ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => onToggleModel(model.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg sm:text-xl">{getProviderIcon(model.provider)}</span>
                          <h4 className="font-semibold text-sm sm:text-base truncate">{model.name}</h4>
                          {isSelected && (
                            <Check weight="fill" className="text-primary w-4 h-4 flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                          {model.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[10px] sm:text-xs border-border">
                            {model.provider}
                          </Badge>
                          {model.category && (
                            <Badge variant="outline" className={`text-[10px] sm:text-xs ${categoryColor} border-current`}>
                              <Icon className="w-3 h-3" weight="fill" />
                              {model.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      )}

      <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Pro tip:</strong> Select multiple models to enable AI debate mode with diverse perspectives. 
          Different categories serve different purposes: Flagship (most capable), Mini (fast & affordable), 
          Code (specialized for coding), Vision (image understanding).
        </p>
      </div>
    </Card>
  )
}
