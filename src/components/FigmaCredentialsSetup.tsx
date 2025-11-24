import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Key, CheckCircle, XCircle, Trash, Shield, Info } from '@phosphor-icons/react'
import { figmaSyncService, FigmaCredentials } from '@/lib/figmaSyncService'
import { toast } from 'sonner'

export function FigmaCredentialsSetup() {
  const [credentials, setCredentials] = useState<FigmaCredentials | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState('')
  const [teamId, setTeamId] = useState('')
  const [setupDialogOpen, setSetupDialogOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    setLoading(true)
    try {
      const creds = await figmaSyncService.getCredentials()
      setCredentials(creds)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted for Figma credentials')
      } else {
        console.error('Failed to load credentials:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCredentials = async () => {
    if (!accessToken.trim()) {
      toast.error('Access token is required')
      return
    }

    setValidating(true)
    try {
      await figmaSyncService.setCredentials(accessToken.trim(), teamId.trim() || undefined)
      toast.success('Figma credentials saved successfully')
      setAccessToken('')
      setTeamId('')
      setSetupDialogOpen(false)
      loadCredentials()
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted')
      } else {
        toast.error('Failed to save credentials')
      }
      console.error(error)
    } finally {
      setValidating(false)
    }
  }

  const handleDeleteCredentials = async () => {
    try {
      await figmaSyncService.deleteCredentials()
      toast.success('Figma credentials deleted')
      setCredentials(null)
      setDeleteDialogOpen(false)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        toast.error('Access denied: IP not whitelisted')
      } else {
        toast.error('Failed to delete credentials')
      }
      console.error(error)
    }
  }

  const maskToken = (token: string) => {
    if (token.length <= 8) return '****'
    return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="text-primary" size={24} />
            Figma Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="text-primary" size={24} />
              Figma Credentials
            </CardTitle>
            <CardDescription className="mt-2">
              Securely store your Figma access token for design sync
            </CardDescription>
          </div>
          {credentials && (
            <Badge variant={credentials.isValid ? 'default' : 'destructive'}>
              {credentials.isValid ? (
                <CheckCircle size={14} className="mr-1" />
              ) : (
                <XCircle size={14} className="mr-1" />
              )}
              {credentials.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Security Notice:</strong> Your Figma token is stored securely and protected by IP whitelisting. 
            Only whitelisted IPs can access or modify these credentials.
          </AlertDescription>
        </Alert>

        {!credentials ? (
          <div className="text-center py-8">
            <Key size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No Figma credentials configured yet
            </p>
            <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Key size={16} className="mr-2" />
                  Setup Figma Access
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Setup Figma Access</DialogTitle>
                  <DialogDescription>
                    Enter your Figma personal access token to enable design sync
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-sm">
                      <strong>How to get your Figma token:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Go to Figma → Settings → Account</li>
                        <li>Scroll to "Personal access tokens"</li>
                        <li>Click "Generate new token"</li>
                        <li>Copy the token and paste it below</li>
                      </ol>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="access-token">
                      Personal Access Token <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="access-token"
                      type="password"
                      placeholder="figd_xxxxxxxxxxxxxxxxxxxxx"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your token will be encrypted and stored securely
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-id">Team ID (Optional)</Label>
                    <Input
                      id="team-id"
                      placeholder="1234567890"
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your Figma team URL
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCredentials} disabled={validating}>
                    {validating ? 'Validating...' : 'Save Credentials'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Access Token</Label>
                  <p className="font-mono text-sm mt-1">{maskToken(credentials.accessToken)}</p>
                </div>
                <Badge variant={credentials.isValid ? 'default' : 'destructive'}>
                  {credentials.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>

              {credentials.teamId && (
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Team ID</Label>
                    <p className="font-mono text-sm mt-1">{credentials.teamId}</p>
                  </div>
                </div>
              )}

              {credentials.lastValidated && (
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Last Validated</Label>
                    <p className="text-sm mt-1">
                      {new Date(credentials.lastValidated).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Update Credentials
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Update Figma Credentials</DialogTitle>
                    <DialogDescription>
                      Update your Figma personal access token
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-token-update">
                        Personal Access Token <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="access-token-update"
                        type="password"
                        placeholder="figd_xxxxxxxxxxxxxxxxxxxxx"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team-id-update">Team ID (Optional)</Label>
                      <Input
                        id="team-id-update"
                        placeholder="1234567890"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCredentials} disabled={validating}>
                      {validating ? 'Validating...' : 'Update'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Figma Credentials?</DialogTitle>
                    <DialogDescription>
                      This will permanently remove your Figma access token. You'll need to set it up again to use Figma sync features.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteCredentials}>
                      Delete Credentials
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
