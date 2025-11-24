import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowsLeftRight, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Upload,
  FilePlus,
  Trash,
  Play,
  File,
  Cube,
  Info
} from '@phosphor-icons/react'
import { figmaSyncService, FigmaFile, SyncHistory } from '@/lib/figmaSyncService'
import { toast } from 'sonner'

export function FigmaSyncPanel() {
  const [watchedFiles, setWatchedFiles] = useState<FigmaFile[]>([])
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [newFileUrl, setNewFileUrl] = useState('')
  const [stats, setStats] = useState({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    designToCode: 0,
    codeToDesign: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [files, history, statsData] = await Promise.all([
        figmaSyncService.getWatchedFiles(),
        figmaSyncService.getSyncHistory(20),
        figmaSyncService.getSyncStats(),
      ])

      setWatchedFiles(files)
      setSyncHistory(history)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load Figma sync data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFile = async () => {
    if (!newFileUrl.trim()) {
      toast.error('Please enter a Figma file URL')
      return
    }

    const fileIdMatch = newFileUrl.match(/file\/([a-zA-Z0-9]+)/)
    if (!fileIdMatch) {
      toast.error('Invalid Figma file URL')
      return
    }

    const fileId = fileIdMatch[1]

    try {
      const newFile: FigmaFile = {
        id: fileId,
        name: 'Figma File',
        lastModified: new Date().toISOString(),
        version: '1.0',
        synced: false,
      }

      await figmaSyncService.addWatchedFile(newFile)
      toast.success('File added to watch list')
      setNewFileUrl('')
      loadData()
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted')
      } else {
        toast.error('Failed to add file')
      }
      console.error(error)
    }
  }

  const handleRemoveFile = async (fileId: string) => {
    try {
      await figmaSyncService.removeWatchedFile(fileId)
      toast.success('File removed from watch list')
      loadData()
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted')
      } else {
        toast.error('Failed to remove file')
      }
      console.error(error)
    }
  }

  const handleSyncDesignToCode = async (fileId: string) => {
    setSyncing(true)
    try {
      const result = await figmaSyncService.syncDesignToCode(fileId)
      if (result.status === 'success') {
        toast.success(result.message || 'Design synced to code successfully')
      } else {
        toast.error(result.message || 'Sync failed')
      }
      loadData()
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted')
      } else {
        toast.error('Failed to sync design to code')
      }
      console.error(error)
    } finally {
      setSyncing(false)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowsLeftRight className="text-primary" size={24} />
            Figma Two-Way Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <span className="font-medium">New:</span> Use the Component Browser tab to preview and search individual Figma components before syncing them to your project.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowsLeftRight className="text-primary" size={24} />
            Figma Two-Way Sync
          </CardTitle>
          <CardDescription>
            Sync designs between Figma and code automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalSyncs}</div>
                <div className="text-xs text-muted-foreground">Total Syncs</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-500">{stats.successfulSyncs}</div>
                <div className="text-xs text-muted-foreground">Successful</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-500">{stats.failedSyncs}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-500">{stats.designToCode}</div>
                <div className="text-xs text-muted-foreground">Design → Code</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-500">{stats.codeToDesign}</div>
                <div className="text-xs text-muted-foreground">Code → Design</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Watched Files</CardTitle>
          <CardDescription>
            Figma files being monitored for changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste Figma file URL (e.g., https://figma.com/file/...)"
              value={newFileUrl}
              onChange={(e) => setNewFileUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
            />
            <Button onClick={handleAddFile}>
              <FilePlus size={16} className="mr-2" />
              Add File
            </Button>
          </div>

          {watchedFiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <File size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No files being watched</p>
              <p className="text-sm text-muted-foreground">
                Add a Figma file URL above to start syncing
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {watchedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{file.name}</p>
                        <Badge variant={file.synced ? 'default' : 'secondary'}>
                          {file.synced ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <Clock size={12} className="mr-1" />
                          )}
                          {file.synced ? 'Synced' : 'Not synced'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        File ID: {file.id}
                      </p>
                      {file.lastSyncedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last synced: {formatRelativeTime(file.lastSyncedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncDesignToCode(file.id)}
                        disabled={syncing}
                      >
                        <Download size={16} className="mr-1" />
                        Design → Code
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <Trash size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>Recent sync operations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {syncHistory.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sync history yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {syncHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border ${
                      entry.status === 'success'
                        ? 'bg-green-500/5 border-green-500/20'
                        : entry.status === 'failed'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-blue-500/5 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {entry.status === 'success' ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : entry.status === 'failed' ? (
                            <XCircle size={20} className="text-red-500" />
                          ) : (
                            <Clock size={20} className="text-blue-500" />
                          )}
                          <p className="font-medium">{entry.fileName}</p>
                          <Badge
                            variant={
                              entry.status === 'success'
                                ? 'default'
                                : entry.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {entry.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {entry.direction === 'design-to-code' ? (
                              <>
                                <Download size={14} />
                                Design → Code
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                Code → Design
                              </>
                            )}
                          </span>
                          <span>{entry.changes} changes</span>
                          <span>{formatTimestamp(entry.timestamp)}</span>
                        </div>
                        {entry.message && (
                          <p className="text-xs text-muted-foreground mt-2">{entry.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {syncing && (
        <Alert>
          <Play className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Syncing in progress... This may take a few moments.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
