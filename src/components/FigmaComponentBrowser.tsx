import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  MagnifyingGlass, 
  Cube, 
  Eye, 
  Download, 
  Funnel,
  GridFour,
  List,
  FileCode,
  PaintBrush,
  CheckCircle,
  Stack,
  CaretDown,
  Tag,
  Calendar,
  Sparkle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { figmaComponentService, FigmaComponent, ComponentCategory } from '@/lib/figmaComponentService'

interface FigmaComponentBrowserProps {
  fileId?: string
  onSync?: (components: FigmaComponent[]) => void
}

export function FigmaComponentBrowser({ fileId, onSync }: FigmaComponentBrowserProps) {
  const [components, setComponents] = useState<FigmaComponent[]>([])
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ComponentCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [previewComponent, setPreviewComponent] = useState<FigmaComponent | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('name')

  useEffect(() => {
    loadComponents()
  }, [fileId])

  const loadComponents = async () => {
    setLoading(true)
    try {
      const data = fileId 
        ? await figmaComponentService.getComponentsFromFile(fileId)
        : await figmaComponentService.getAllComponents()
      setComponents(data)
    } catch (error) {
      console.error('Failed to load components:', error)
      toast.error('Failed to load Figma components')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedComponents = useMemo(() => {
    let filtered = components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || component.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  }, [components, searchQuery, categoryFilter, sortBy])

  const toggleComponentSelection = (componentId: string) => {
    const newSelection = new Set(selectedComponents)
    if (newSelection.has(componentId)) {
      newSelection.delete(componentId)
    } else {
      newSelection.add(componentId)
    }
    setSelectedComponents(newSelection)
  }

  const selectAll = () => {
    setSelectedComponents(new Set(filteredAndSortedComponents.map(c => c.id)))
  }

  const deselectAll = () => {
    setSelectedComponents(new Set())
  }

  const handleSyncSelected = async () => {
    if (selectedComponents.size === 0) {
      toast.error('Please select at least one component')
      return
    }

    const componentsToSync = components.filter(c => selectedComponents.has(c.id))
    
    try {
      await figmaComponentService.syncComponents(componentsToSync)
      toast.success(`Successfully synced ${selectedComponents.size} component(s)`)
      if (onSync) {
        onSync(componentsToSync)
      }
      deselectAll()
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('Failed to sync components')
    }
  }

  const getCategoryIcon = (category: ComponentCategory) => {
    const icons = {
      button: <Cube size={16} />,
      input: <FileCode size={16} />,
      card: <Stack size={16} />,
      navigation: <List size={16} />,
      layout: <GridFour size={16} />,
      icon: <Sparkle size={16} />,
      other: <Tag size={16} />,
    }
    return icons[category] || icons.other
  }

  const getCategoryColor = (category: ComponentCategory) => {
    const colors = {
      button: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      input: 'bg-green-500/10 text-green-500 border-green-500/20',
      card: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      navigation: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      layout: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      icon: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    }
    return colors[category] || colors.other
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cube className="text-primary" size={24} />
            Component Library Browser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <Cube size={48} className="text-primary" />
            </div>
            <p className="text-muted-foreground">Loading components...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cube className="text-primary" size={24} />
            Component Library Browser
          </CardTitle>
          <CardDescription>
            Preview and search Figma components before syncing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Search components by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Funnel size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="button">Buttons</SelectItem>
                  <SelectItem value="input">Inputs</SelectItem>
                  <SelectItem value="card">Cards</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="layout">Layouts</SelectItem>
                  <SelectItem value="icon">Icons</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <CaretDown size={16} className="mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Last Modified</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={viewMode === 'grid' ? () => setViewMode('list') : () => setViewMode('grid')}
                >
                  {viewMode === 'grid' ? <List size={16} /> : <GridFour size={16} />}
                  <span className="ml-2 hidden sm:inline">{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedComponents.length} component{filteredAndSortedComponents.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Clear
                </Button>
                {selectedComponents.size > 0 && (
                  <Button size="sm" onClick={handleSyncSelected}>
                    <Download size={16} className="mr-2" />
                    Sync {selectedComponents.size} Selected
                  </Button>
                )}
              </div>
            </div>
          </div>

          {filteredAndSortedComponents.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
              <Cube size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No components found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Connect a Figma file to see components'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedComponents.map((component) => (
                    <Card 
                      key={component.id}
                      className={`group cursor-pointer transition-all hover:border-primary/50 ${
                        selectedComponents.has(component.id) 
                          ? 'ring-2 ring-primary border-primary' 
                          : ''
                      }`}
                      onClick={() => toggleComponentSelection(component.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="aspect-video bg-muted/30 rounded-md flex items-center justify-center relative overflow-hidden">
                          {component.thumbnailUrl ? (
                            <img 
                              src={component.thumbnailUrl} 
                              alt={component.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PaintBrush size={32} className="text-muted-foreground" />
                          )}
                          
                          {selectedComponents.has(component.id) && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle size={32} className="text-primary" weight="fill" />
                            </div>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewComponent(component)
                                }}
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm line-clamp-1">{component.name}</h3>
                            <Checkbox
                              checked={selectedComponents.has(component.id)}
                              onCheckedChange={() => toggleComponentSelection(component.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {component.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {component.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryColor(component.category)}`}
                            >
                              {getCategoryIcon(component.category)}
                              <span className="ml-1 capitalize">{component.category}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            {formatDate(component.lastModified)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSortedComponents.map((component) => (
                    <Card 
                      key={component.id}
                      className={`group cursor-pointer transition-all hover:border-primary/50 ${
                        selectedComponents.has(component.id) 
                          ? 'ring-2 ring-primary border-primary' 
                          : ''
                      }`}
                      onClick={() => toggleComponentSelection(component.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedComponents.has(component.id)}
                            onCheckedChange={() => toggleComponentSelection(component.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          
                          <div className="w-20 h-20 bg-muted/30 rounded-md flex items-center justify-center flex-shrink-0 relative">
                            {component.thumbnailUrl ? (
                              <img 
                                src={component.thumbnailUrl} 
                                alt={component.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <PaintBrush size={24} className="text-muted-foreground" />
                            )}
                            {selectedComponents.has(component.id) && (
                              <div className="absolute inset-0 bg-primary/20 rounded-md flex items-center justify-center">
                                <CheckCircle size={24} className="text-primary" weight="fill" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium mb-1">{component.name}</h3>
                            {component.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                {component.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getCategoryColor(component.category)}`}
                              >
                                {getCategoryIcon(component.category)}
                                <span className="ml-1 capitalize">{component.category}</span>
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(component.lastModified)}
                              </span>
                              {component.variants && component.variants.length > 0 && (
                                <span>{component.variants.length} variant{component.variants.length > 1 ? 's' : ''}</span>
                              )}
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewComponent(component)
                                }}
                              >
                                <Eye size={16} className="mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {previewComponent && (
        <ComponentPreviewDialog
          component={previewComponent}
          open={!!previewComponent}
          onClose={() => setPreviewComponent(null)}
          onSync={(component) => {
            toggleComponentSelection(component.id)
            setPreviewComponent(null)
          }}
          isSelected={selectedComponents.has(previewComponent.id)}
        />
      )}
    </div>
  )
}

interface ComponentPreviewDialogProps {
  component: FigmaComponent
  open: boolean
  onClose: () => void
  onSync: (component: FigmaComponent) => void
  isSelected: boolean
}

function ComponentPreviewDialog({ component, open, onClose, onSync, isSelected }: ComponentPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cube size={24} className="text-primary" />
            {component.name}
          </DialogTitle>
          <DialogDescription>
            {component.description || 'Preview and sync this component'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
            {component.thumbnailUrl ? (
              <img 
                src={component.thumbnailUrl} 
                alt={component.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <PaintBrush size={64} className="text-muted-foreground" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline" className="capitalize">
                    {component.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Last Modified:</span>
                  <span>{new Date(component.lastModified).toLocaleDateString()}</span>
                </div>
                {component.variants && component.variants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Variants:</span>
                    <span>{component.variants.length}</span>
                  </div>
                )}
              </div>
            </div>

            {component.variants && component.variants.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Variants</h4>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {component.variants.map((variant, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-1">
                        {variant}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {component.properties && Object.keys(component.properties).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Properties</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(component.properties).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{String(value)}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onSync(component)}>
              {isSelected ? (
                <>
                  <CheckCircle size={16} className="mr-2" weight="fill" />
                  Selected
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Select for Sync
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
