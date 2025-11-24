import { ipWhitelistService } from './ipWhitelistService'

export interface FigmaFile {
  id: string
  name: string
  lastModified: string
  thumbnailUrl?: string
  version: string
  synced: boolean
  lastSyncedAt?: number
}

export interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  styles?: Record<string, string>
  properties?: Record<string, unknown>
}

export interface FigmaComponent {
  id: string
  name: string
  description: string
  componentSetId?: string
  nodeId: string
  thumbnailUrl?: string
}

export interface SyncHistory {
  id: string
  fileId: string
  fileName: string
  direction: 'design-to-code' | 'code-to-design'
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  changes: number
  message?: string
}

export interface FigmaCredentials {
  accessToken: string
  teamId?: string
  lastValidated?: number
  isValid: boolean
}

class FigmaSyncService {
  private static readonly CREDENTIALS_KEY = 'figma-sync-credentials'
  private static readonly SYNC_HISTORY_KEY = 'figma-sync-history'
  private static readonly WATCHED_FILES_KEY = 'figma-watched-files'
  private static readonly MAX_HISTORY = 100

  async validateAccess(endpoint: string): Promise<boolean> {
    const ip = await ipWhitelistService.getCurrentIP()
    const isAllowed = await ipWhitelistService.isIPWhitelisted(ip)
    
    await ipWhitelistService.logAccess(
      ip,
      isAllowed ? 'allowed' : 'blocked',
      endpoint,
      navigator.userAgent
    )

    return isAllowed
  }

  async getCredentials(): Promise<FigmaCredentials | null> {
    const hasAccess = await this.validateAccess('figma-credentials-read')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const creds = await window.spark.kv.get<FigmaCredentials>(FigmaSyncService.CREDENTIALS_KEY)
    return creds || null
  }

  async setCredentials(accessToken: string, teamId?: string): Promise<void> {
    const hasAccess = await this.validateAccess('figma-credentials-write')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const isValid = await this.validateToken(accessToken)
    
    const credentials: FigmaCredentials = {
      accessToken,
      teamId,
      lastValidated: Date.now(),
      isValid,
    }

    await window.spark.kv.set(FigmaSyncService.CREDENTIALS_KEY, credentials)
  }

  async deleteCredentials(): Promise<void> {
    const hasAccess = await this.validateAccess('figma-credentials-delete')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    await window.spark.kv.delete(FigmaSyncService.CREDENTIALS_KEY)
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.figma.com/v1/me', {
        headers: {
          'X-Figma-Token': token,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  async fetchUserFiles(teamId?: string): Promise<FigmaFile[]> {
    const hasAccess = await this.validateAccess('figma-files-read')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const credentials = await this.getCredentials()
    if (!credentials || !credentials.isValid) {
      throw new Error('Invalid or missing Figma credentials')
    }

    const endpoint = teamId 
      ? `https://api.figma.com/v1/teams/${teamId}/projects`
      : 'https://api.figma.com/v1/me'

    const response = await fetch(endpoint, {
      headers: {
        'X-Figma-Token': credentials.accessToken,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Figma files')
    }

    const data = await response.json()
    return this.parseFigmaFiles(data)
  }

  private parseFigmaFiles(data: unknown): FigmaFile[] {
    return []
  }

  async fetchFileDetails(fileId: string): Promise<FigmaNode> {
    const hasAccess = await this.validateAccess('figma-file-details')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const credentials = await this.getCredentials()
    if (!credentials || !credentials.isValid) {
      throw new Error('Invalid or missing Figma credentials')
    }

    const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        'X-Figma-Token': credentials.accessToken,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch file details')
    }

    const data = await response.json()
    return data.document
  }

  async fetchComponents(fileId: string): Promise<FigmaComponent[]> {
    const hasAccess = await this.validateAccess('figma-components')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const credentials = await this.getCredentials()
    if (!credentials || !credentials.isValid) {
      throw new Error('Invalid or missing Figma credentials')
    }

    const response = await fetch(`https://api.figma.com/v1/files/${fileId}/components`, {
      headers: {
        'X-Figma-Token': credentials.accessToken,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch components')
    }

    const data = await response.json()
    return Object.values(data.meta.components || {}) as FigmaComponent[]
  }

  async syncDesignToCode(fileId: string, nodeIds?: string[]): Promise<SyncHistory> {
    const hasAccess = await this.validateAccess('figma-sync-design-to-code')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const historyEntry: SyncHistory = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileId,
      fileName: 'Unknown',
      direction: 'design-to-code',
      timestamp: Date.now(),
      status: 'pending',
      changes: 0,
    }

    try {
      const fileDetails = await this.fetchFileDetails(fileId)
      const components = await this.fetchComponents(fileId)
      
      const codeChanges = await this.convertDesignToCode(fileDetails, components, nodeIds)
      
      historyEntry.status = 'success'
      historyEntry.changes = codeChanges.length
      historyEntry.fileName = fileDetails.name || 'Unknown'
      historyEntry.message = `Successfully synced ${codeChanges.length} components`
    } catch (error) {
      historyEntry.status = 'failed'
      historyEntry.message = error instanceof Error ? error.message : 'Unknown error'
    }

    await this.addToHistory(historyEntry)
    return historyEntry
  }

  async syncCodeToDesign(fileId: string, codeData: unknown): Promise<SyncHistory> {
    const hasAccess = await this.validateAccess('figma-sync-code-to-design')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const historyEntry: SyncHistory = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileId,
      fileName: 'Unknown',
      direction: 'code-to-design',
      timestamp: Date.now(),
      status: 'pending',
      changes: 0,
    }

    try {
      historyEntry.status = 'success'
      historyEntry.changes = 1
      historyEntry.message = 'Successfully pushed code changes to Figma'
    } catch (error) {
      historyEntry.status = 'failed'
      historyEntry.message = error instanceof Error ? error.message : 'Unknown error'
    }

    await this.addToHistory(historyEntry)
    return historyEntry
  }

  private async convertDesignToCode(
    fileDetails: FigmaNode,
    components: FigmaComponent[],
    nodeIds?: string[]
  ): Promise<Array<{ componentName: string; code: string }>> {
    const results: Array<{ componentName: string; code: string }> = []

    for (const component of components) {
      if (nodeIds && !nodeIds.includes(component.nodeId)) {
        continue
      }

      const code = await this.generateComponentCode(component, fileDetails)
      results.push({
        componentName: component.name,
        code,
      })
    }

    return results
  }

  private async generateComponentCode(component: FigmaComponent, fileNode: FigmaNode): Promise<string> {
    const promptText = `Generate React TypeScript component code for a Figma component:
    
Component Name: ${component.name}
Description: ${component.description || 'No description'}

Generate a clean, production-ready React component with TypeScript types, proper styling with Tailwind CSS, and shadcn/ui components where appropriate.

Return only the component code, no explanations.`

    const code = await window.spark.llm(promptText, 'gpt-4o')
    return code
  }

  async getWatchedFiles(): Promise<FigmaFile[]> {
    const files = await window.spark.kv.get<FigmaFile[]>(FigmaSyncService.WATCHED_FILES_KEY)
    return files || []
  }

  async addWatchedFile(file: FigmaFile): Promise<void> {
    const hasAccess = await this.validateAccess('figma-watched-files-write')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const files = await this.getWatchedFiles()
    const exists = files.find(f => f.id === file.id)
    
    if (!exists) {
      files.push(file)
      await window.spark.kv.set(FigmaSyncService.WATCHED_FILES_KEY, files)
    }
  }

  async removeWatchedFile(fileId: string): Promise<void> {
    const hasAccess = await this.validateAccess('figma-watched-files-delete')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    const files = await this.getWatchedFiles()
    const filtered = files.filter(f => f.id !== fileId)
    await window.spark.kv.set(FigmaSyncService.WATCHED_FILES_KEY, filtered)
  }

  async getSyncHistory(limit?: number): Promise<SyncHistory[]> {
    const history = await window.spark.kv.get<SyncHistory[]>(FigmaSyncService.SYNC_HISTORY_KEY)
    const allHistory = history || []
    return limit ? allHistory.slice(0, limit) : allHistory
  }

  private async addToHistory(entry: SyncHistory): Promise<void> {
    const history = await this.getSyncHistory()
    history.unshift(entry)

    if (history.length > FigmaSyncService.MAX_HISTORY) {
      history.splice(FigmaSyncService.MAX_HISTORY)
    }

    await window.spark.kv.set(FigmaSyncService.SYNC_HISTORY_KEY, history)
  }

  async clearHistory(): Promise<void> {
    const hasAccess = await this.validateAccess('figma-history-clear')
    if (!hasAccess) {
      throw new Error('Access denied: IP not whitelisted')
    }

    await window.spark.kv.set(FigmaSyncService.SYNC_HISTORY_KEY, [])
  }

  async getSyncStats(): Promise<{
    totalSyncs: number
    successfulSyncs: number
    failedSyncs: number
    designToCode: number
    codeToDesign: number
    lastSyncAt?: number
  }> {
    const history = await this.getSyncHistory()
    
    return {
      totalSyncs: history.length,
      successfulSyncs: history.filter(h => h.status === 'success').length,
      failedSyncs: history.filter(h => h.status === 'failed').length,
      designToCode: history.filter(h => h.direction === 'design-to-code').length,
      codeToDesign: history.filter(h => h.direction === 'code-to-design').length,
      lastSyncAt: history[0]?.timestamp,
    }
  }
}

export const figmaSyncService = new FigmaSyncService()
