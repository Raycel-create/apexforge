import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FigmaCredentialsSetup } from '@/components/FigmaCredentialsSetup'
import { FigmaSyncPanel } from '@/components/FigmaSyncPanel'
import { IPWhitelistManager } from '@/components/IPWhitelistManager'
import { Shield, ArrowsLeftRight, Key } from '@phosphor-icons/react'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth' | 'figma'

interface FigmaIntegrationProps {
  onNavigate: (page: Page) => void
}

export function FigmaIntegration({ onNavigate }: FigmaIntegrationProps) {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Figma Integration</h1>
          <p className="text-muted-foreground text-lg">
            Two-way sync between Figma designs and code with enterprise-grade security
          </p>
        </div>

        <Tabs defaultValue="sync" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <ArrowsLeftRight size={18} />
              Sync Panel
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Key size={18} />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={18} />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-6">
            <FigmaSyncPanel />
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <FigmaCredentialsSetup />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <IPWhitelistManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
