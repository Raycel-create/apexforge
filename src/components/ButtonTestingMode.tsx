import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  Square, 
  Trash, 
  DownloadSimple, 
  UploadSimple, 
  FloppyDisk, 
  PaperPlaneTilt, 
  CheckCircle, 
  XCircle,
  Gear,
  User,
  Heart,
  Star,
  ShareNetwork,
  Copy,
  PencilSimple,
  Plus,
  Minus,
  CaretRight,
  CircleNotch
} from '@phosphor-icons/react'
import { useScreenSize } from '@/hooks/use-mobile'

export function ButtonTestingMode({ onClose }: { onClose: () => void }) {
  const [isTracking, setIsTracking] = useState(true)
  const [lastInteraction, setLastInteraction] = useState<string | null>(null)
  const [interactionCount, setInteractionCount] = useState(0)
  const { isMobile, isTablet, isDesktop } = useScreenSize()

  const trackInteraction = (label: string, type: 'hover' | 'click' | 'focus') => {
    if (isTracking) {
      setLastInteraction(`${label} - ${type}`)
      setInteractionCount(prev => prev + 1)
    }
  }

  const screenSize = isMobile ? 'Mobile (<640px)' : isTablet ? 'Tablet (640-1023px)' : 'Desktop (≥1024px)'

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Button Testing Mode</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Interactive button responsiveness testing across all screen sizes
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              <XCircle className="mr-2" />
              Exit Testing
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Test Environment</CardTitle>
              <CardDescription>
                Current viewport: <Badge variant="secondary">{screenSize}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tracking" 
                    checked={isTracking}
                    onCheckedChange={setIsTracking}
                  />
                  <Label htmlFor="tracking">Track Interactions</Label>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-6" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Interactions: </span>
                  <Badge>{interactionCount}</Badge>
                </div>
              </div>
              {lastInteraction && (
                <div className="p-3 rounded-md bg-accent/50 text-sm">
                  <strong>Last:</strong> {lastInteraction}
                </div>
              )}
            </CardContent>
          </Card>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Button Sizes - Default Variant</CardTitle>
                  <CardDescription>Testing responsive sizing across breakpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm"
                      onMouseEnter={() => trackInteraction('Small Button', 'hover')}
                      onClick={() => trackInteraction('Small Button', 'click')}
                      onFocus={() => trackInteraction('Small Button', 'focus')}
                    >
                      <Play className="mr-2" />
                      Small
                    </Button>
                    <Button 
                      size="default"
                      onMouseEnter={() => trackInteraction('Default Button', 'hover')}
                      onClick={() => trackInteraction('Default Button', 'click')}
                      onFocus={() => trackInteraction('Default Button', 'focus')}
                    >
                      <Play className="mr-2" />
                      Default
                    </Button>
                    <Button 
                      size="lg"
                      onMouseEnter={() => trackInteraction('Large Button', 'hover')}
                      onClick={() => trackInteraction('Large Button', 'click')}
                      onFocus={() => trackInteraction('Large Button', 'focus')}
                    >
                      <Play className="mr-2" />
                      Large
                    </Button>
                    <Button 
                      size="icon"
                      onMouseEnter={() => trackInteraction('Icon Button', 'hover')}
                      onClick={() => trackInteraction('Icon Button', 'click')}
                      onFocus={() => trackInteraction('Icon Button', 'focus')}
                    >
                      <Gear />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>All shadcn button variants with interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="default"
                      onMouseEnter={() => trackInteraction('Default Variant', 'hover')}
                      onClick={() => trackInteraction('Default Variant', 'click')}
                    >
                      <CheckCircle className="mr-2" />
                      Default
                    </Button>
                    <Button 
                      variant="secondary"
                      onMouseEnter={() => trackInteraction('Secondary Variant', 'hover')}
                      onClick={() => trackInteraction('Secondary Variant', 'click')}
                    >
                      <User className="mr-2" />
                      Secondary
                    </Button>
                    <Button 
                      variant="outline"
                      onMouseEnter={() => trackInteraction('Outline Variant', 'hover')}
                      onClick={() => trackInteraction('Outline Variant', 'click')}
                    >
                      <PencilSimple className="mr-2" />
                      Outline
                    </Button>
                    <Button 
                      variant="ghost"
                      onMouseEnter={() => trackInteraction('Ghost Variant', 'hover')}
                      onClick={() => trackInteraction('Ghost Variant', 'click')}
                    >
                      <ShareNetwork className="mr-2" />
                      Ghost
                    </Button>
                    <Button 
                      variant="destructive"
                      onMouseEnter={() => trackInteraction('Destructive Variant', 'hover')}
                      onClick={() => trackInteraction('Destructive Variant', 'click')}
                    >
                      <Trash className="mr-2" />
                      Destructive
                    </Button>
                    <Button 
                      variant="link"
                      onMouseEnter={() => trackInteraction('Link Variant', 'hover')}
                      onClick={() => trackInteraction('Link Variant', 'click')}
                    >
                      Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button States</CardTitle>
                  <CardDescription>Testing disabled and loading states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>
                      <Pause className="mr-2" />
                      Disabled
                    </Button>
                    <Button disabled variant="secondary">
                      Disabled Secondary
                    </Button>
                    <Button disabled variant="outline">
                      Disabled Outline
                    </Button>
                    <Button disabled variant="destructive">
                      <Trash className="mr-2" />
                      Disabled Destructive
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <CircleNotch className="mr-2 animate-spin" />
                      Loading
                    </Button>
                    <Button variant="secondary">
                      <CircleNotch className="mr-2 animate-spin" />
                      Processing
                    </Button>
                    <Button variant="outline">
                      <CircleNotch className="mr-2 animate-spin" />
                      Saving
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Icon Buttons - All Sizes</CardTitle>
                  <CardDescription>Testing icon-only buttons with responsive sizing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Small Icons</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="icon" 
                          variant="default"
                          onMouseEnter={() => trackInteraction('Play Icon', 'hover')}
                          onClick={() => trackInteraction('Play Icon', 'click')}
                        >
                          <Play />
                        </Button>
                        <Button size="icon" variant="secondary">
                          <Pause />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Square />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <DownloadSimple />
                        </Button>
                        <Button size="icon" variant="destructive">
                          <Trash />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">With Text Labels</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="default">
                          <DownloadSimple className="mr-2" />
                          Download
                        </Button>
                        <Button variant="secondary">
                          <UploadSimple className="mr-2" />
                          Upload
                        </Button>
                        <Button variant="outline">
                          <FloppyDisk className="mr-2" />
                          Save
                        </Button>
                        <Button variant="ghost">
                          <Copy className="mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interactive Actions</CardTitle>
                  <CardDescription>Buttons with specific action purposes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Button 
                      className="w-full justify-start"
                      onMouseEnter={() => trackInteraction('Send Message', 'hover')}
                      onClick={() => trackInteraction('Send Message', 'click')}
                    >
                      <PaperPlaneTilt className="mr-2" />
                      Send Message
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="secondary"
                      onMouseEnter={() => trackInteraction('Add Item', 'hover')}
                      onClick={() => trackInteraction('Add Item', 'click')}
                    >
                      <Plus className="mr-2" />
                      Add Item
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onMouseEnter={() => trackInteraction('Edit Profile', 'hover')}
                      onClick={() => trackInteraction('Edit Profile', 'click')}
                    >
                      <PencilSimple className="mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="ghost"
                      onMouseEnter={() => trackInteraction('View Details', 'hover')}
                      onClick={() => trackInteraction('View Details', 'click')}
                    >
                      <CaretRight className="mr-2" />
                      View Details
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onMouseEnter={() => trackInteraction('Share', 'hover')}
                      onClick={() => trackInteraction('Share', 'click')}
                    >
                      <ShareNetwork className="mr-2" />
                      Share
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="destructive"
                      onMouseEnter={() => trackInteraction('Remove', 'hover')}
                      onClick={() => trackInteraction('Remove', 'click')}
                    >
                      <Minus className="mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social & Engagement Buttons</CardTitle>
                  <CardDescription>Like, favorite, and social action buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline"
                      onMouseEnter={() => trackInteraction('Like', 'hover')}
                      onClick={() => trackInteraction('Like', 'click')}
                    >
                      <Heart className="mr-2" />
                      Like
                    </Button>
                    <Button 
                      variant="outline"
                      onMouseEnter={() => trackInteraction('Favorite', 'hover')}
                      onClick={() => trackInteraction('Favorite', 'click')}
                    >
                      <Star className="mr-2" />
                      Favorite
                    </Button>
                    <Button 
                      variant="secondary"
                      onMouseEnter={() => trackInteraction('Share', 'hover')}
                      onClick={() => trackInteraction('Share', 'click')}
                    >
                      <ShareNetwork className="mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost"
                      onMouseEnter={() => trackInteraction('Copy Link', 'hover')}
                      onClick={() => trackInteraction('Copy Link', 'click')}
                    >
                      <Copy className="mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mobile Touch Targets</CardTitle>
                  <CardDescription>
                    Minimum 44px touch targets for accessibility (WCAG AAA)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="touch-target w-full sm:w-auto"
                        onMouseEnter={() => trackInteraction('Primary Action', 'hover')}
                        onClick={() => trackInteraction('Primary Action', 'click')}
                      >
                        Primary Action
                      </Button>
                      <Button 
                        className="touch-target w-full sm:w-auto" 
                        variant="secondary"
                        onMouseEnter={() => trackInteraction('Secondary Action', 'hover')}
                        onClick={() => trackInteraction('Secondary Action', 'click')}
                      >
                        Secondary Action
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Touch targets automatically scale: h-10 (mobile) → h-9 (tablet) → h-10 (desktop)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hover & Active Effects</CardTitle>
                  <CardDescription>
                    Test scale transformations and visual feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Hover: Scale to 105%</Label>
                      <Button 
                        className="interactive-hover"
                        onMouseEnter={() => trackInteraction('Hover Scale', 'hover')}
                        onClick={() => trackInteraction('Hover Scale', 'click')}
                      >
                        Hover Over Me
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Active: Scale to 95%</Label>
                      <Button 
                        className="interactive-press"
                        onMouseEnter={() => trackInteraction('Active Scale', 'hover')}
                        onClick={() => trackInteraction('Active Scale', 'click')}
                      >
                        Click and Hold
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Full Interactive: Hover + Active</Label>
                      <Button 
                        className="interactive-full"
                        onMouseEnter={() => trackInteraction('Full Interactive', 'hover')}
                        onClick={() => trackInteraction('Full Interactive', 'click')}
                      >
                        Full Experience
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsive Button Groups</CardTitle>
                  <CardDescription>Testing button layouts at different breakpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Stack on Mobile</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="w-full sm:w-auto">Action 1</Button>
                        <Button className="w-full sm:w-auto" variant="secondary">Action 2</Button>
                        <Button className="w-full sm:w-auto" variant="outline">Action 3</Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Equal Width Grid</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button className="w-full">One</Button>
                        <Button className="w-full" variant="secondary">Two</Button>
                        <Button className="w-full" variant="outline">Three</Button>
                        <Button className="w-full" variant="ghost">Four</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Testing</CardTitle>
                  <CardDescription>Keyboard navigation and focus indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Use Tab key to navigate between buttons. Focus ring should be clearly visible.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onFocus={() => trackInteraction('Focus 1', 'focus')}
                      >
                        Tab Stop 1
                      </Button>
                      <Button 
                        variant="secondary"
                        onFocus={() => trackInteraction('Focus 2', 'focus')}
                      >
                        Tab Stop 2
                      </Button>
                      <Button 
                        variant="outline"
                        onFocus={() => trackInteraction('Focus 3', 'focus')}
                      >
                        Tab Stop 3
                      </Button>
                      <Button 
                        variant="ghost"
                        onFocus={() => trackInteraction('Focus 4', 'focus')}
                      >
                        Tab Stop 4
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
