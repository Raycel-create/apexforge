import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MagnifyingGlass, Cube, Download, CheckCircle } from '@phosphor-icons/react'
import { figmaComponentService, FigmaComponent } from '@/lib/figmaComponentService'
import { toast } from 'sonner'
import { FigmaComponentBrowser } from './FigmaComponentBrowser'

export function FigmaQuickBrowser() {
  const [recentComponents, setRecentComponents] = useState<FigmaComponent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentComponents()
  }, [])

  const loadRecentComponents = async () => {
    setLoading(true)
    try {
      const allComponents = await figmaComponentService.getAllComponents()
      const sorted = allComponents
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 6)
      setRecentComponents(sorted)
    } catch (error) {
      console.error('Failed to load recent components:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickSync = async (component: FigmaComponent) => {
    try {
      await figmaComponentService.syncComponents([component])
      toast.success(`Synced ${component.name}`)
      loadRecentComponents()
    } catch (error) {
      toast.error('Failed to sync component')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cube size={20} className="text-primary" />
            Recent Figma Components
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            Quick access to your latest design components
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <MagnifyingGlass size={16} className="mr-2" />
              Browse All
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-6">
            <FigmaComponentBrowser />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentComponents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Cube size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recentComponents.map((component) => (
              <div
                key={component.id}
                className="group relative bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-all border border-border"
              >
                <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center text-xs text-muted-foreground">
                  {component.thumbnailUrl ? (
                    <img 
                      src={component.thumbnailUrl} 
                      alt={component.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Cube size={24} />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-sm truncate">{component.name}</h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {component.category}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2"
                  onClick={() => quickSync(component)}
                >
                  <Download size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
