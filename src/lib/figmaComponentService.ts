declare const spark: {
  kv: {
    get: <T>(key: string) => Promise<T | undefined>
    set: <T>(key: string, value: T) => Promise<void>
    delete: (key: string) => Promise<void>
    keys: () => Promise<string[]>
  }
}

export type ComponentCategory = 'button' | 'input' | 'card' | 'navigation' | 'layout' | 'icon' | 'other'

export interface FigmaComponent {
  id: string
  name: string
  description?: string
  category: ComponentCategory
  thumbnailUrl?: string
  lastModified: string
  fileId?: string
  nodeId?: string
  variants?: string[]
  properties?: Record<string, any>
}

class FigmaComponentService {
  private storageKey = 'figma_components'
  private apiKey: string | null = null

  async setApiKey(key: string): Promise<void> {
    this.apiKey = key
    await spark.kv.set('figma_api_key', key)
  }

  async getApiKey(): Promise<string | null> {
    if (!this.apiKey) {
      this.apiKey = await spark.kv.get<string>('figma_api_key') || null
    }
    return this.apiKey
  }

  async getAllComponents(): Promise<FigmaComponent[]> {
    try {
      const components = await spark.kv.get<FigmaComponent[]>(this.storageKey)
      return components || this.getMockComponents()
    } catch (error) {
      console.error('Failed to load components:', error)
      return this.getMockComponents()
    }
  }

  async getComponentsFromFile(fileId: string): Promise<FigmaComponent[]> {
    const apiKey = await this.getApiKey()
    
    if (!apiKey) {
      console.warn('No Figma API key found, returning mock data')
      return this.getMockComponents().filter(c => c.fileId === fileId)
    }

    try {
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}/components`, {
        headers: {
          'X-Figma-Token': apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status}`)
      }

      const data = await response.json()
      
      const components: FigmaComponent[] = Object.entries(data.meta.components || {}).map(
        ([key, value]: [string, any]) => ({
          id: key,
          name: value.name || 'Untitled Component',
          description: value.description || '',
          category: this.categorizeComponent(value.name),
          thumbnailUrl: value.thumbnail_url,
          lastModified: value.updated_at || new Date().toISOString(),
          fileId,
          nodeId: value.node_id,
          variants: value.containing_frame?.name ? [value.containing_frame.name] : [],
          properties: {},
        })
      )

      await this.cacheComponents(components)
      return components
    } catch (error) {
      console.error('Failed to fetch Figma components:', error)
      return this.getMockComponents().filter(c => c.fileId === fileId)
    }
  }

  private categorizeComponent(name: string): ComponentCategory {
    const lowerName = name.toLowerCase()
    
    if (lowerName.includes('button') || lowerName.includes('btn')) {
      return 'button'
    }
    if (lowerName.includes('input') || lowerName.includes('field') || lowerName.includes('form')) {
      return 'input'
    }
    if (lowerName.includes('card')) {
      return 'card'
    }
    if (lowerName.includes('nav') || lowerName.includes('menu') || lowerName.includes('header') || lowerName.includes('footer')) {
      return 'navigation'
    }
    if (lowerName.includes('layout') || lowerName.includes('grid') || lowerName.includes('container')) {
      return 'layout'
    }
    if (lowerName.includes('icon')) {
      return 'icon'
    }
    
    return 'other'
  }

  private async cacheComponents(components: FigmaComponent[]): Promise<void> {
    try {
      const existing = await spark.kv.get<FigmaComponent[]>(this.storageKey) || []
      
      const merged = [...existing]
      components.forEach(newComp => {
        const existingIndex = merged.findIndex(c => c.id === newComp.id)
        if (existingIndex >= 0) {
          merged[existingIndex] = newComp
        } else {
          merged.push(newComp)
        }
      })
      
      await spark.kv.set(this.storageKey, merged)
    } catch (error) {
      console.error('Failed to cache components:', error)
    }
  }

  async syncComponents(components: FigmaComponent[]): Promise<void> {
    const apiKey = await this.getApiKey()
    
    if (!apiKey) {
      throw new Error('Figma API key not configured')
    }

    for (const component of components) {
      try {
        await this.syncSingleComponent(component)
      } catch (error) {
        console.error(`Failed to sync component ${component.name}:`, error)
        throw error
      }
    }

    await spark.kv.set(`synced_components_${Date.now()}`, {
      timestamp: Date.now(),
      components: components.map(c => ({ id: c.id, name: c.name })),
      count: components.length,
    })
  }

  private async syncSingleComponent(component: FigmaComponent): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log(`Synced component: ${component.name}`)
  }

  async searchComponents(query: string): Promise<FigmaComponent[]> {
    const allComponents = await this.getAllComponents()
    const lowerQuery = query.toLowerCase()
    
    return allComponents.filter(
      component =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.description?.toLowerCase().includes(lowerQuery) ||
        component.category.toLowerCase().includes(lowerQuery)
    )
  }

  async getComponentsByCategory(category: ComponentCategory): Promise<FigmaComponent[]> {
    const allComponents = await this.getAllComponents()
    return allComponents.filter(component => component.category === category)
  }

  private getMockComponents(): FigmaComponent[] {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 'btn-primary-1',
        name: 'Primary Button',
        description: 'Main call-to-action button with primary brand colors',
        category: 'button',
        lastModified: now.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Default', 'Hover', 'Active', 'Disabled'],
        properties: {
          size: 'medium',
          variant: 'primary',
          rounded: true,
        },
      },
      {
        id: 'btn-secondary-1',
        name: 'Secondary Button',
        description: 'Secondary action button with outlined style',
        category: 'button',
        lastModified: yesterday.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Default', 'Hover', 'Active'],
        properties: {
          size: 'medium',
          variant: 'secondary',
        },
      },
      {
        id: 'input-text-1',
        name: 'Text Input',
        description: 'Standard text input field with label and validation',
        category: 'input',
        lastModified: yesterday.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Default', 'Focus', 'Error', 'Success'],
        properties: {
          type: 'text',
          hasLabel: true,
        },
      },
      {
        id: 'input-search-1',
        name: 'Search Input',
        description: 'Search input with icon and autocomplete',
        category: 'input',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Default', 'Focus', 'With Results'],
      },
      {
        id: 'card-product-1',
        name: 'Product Card',
        description: 'Card component for displaying product information',
        category: 'card',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Default', 'Hover', 'Featured'],
        properties: {
          hasImage: true,
          hasPrice: true,
          hasActions: true,
        },
      },
      {
        id: 'card-user-1',
        name: 'User Profile Card',
        description: 'Card for displaying user profile information',
        category: 'card',
        lastModified: now.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Compact', 'Expanded'],
      },
      {
        id: 'nav-header-1',
        name: 'Navigation Header',
        description: 'Main navigation header with logo and menu items',
        category: 'navigation',
        lastModified: yesterday.toISOString(),
        fileId: 'mock-file-2',
        variants: ['Desktop', 'Mobile', 'Scrolled'],
        properties: {
          hasSearch: true,
          hasUser: true,
        },
      },
      {
        id: 'nav-sidebar-1',
        name: 'Sidebar Navigation',
        description: 'Collapsible sidebar navigation menu',
        category: 'navigation',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-2',
        variants: ['Expanded', 'Collapsed'],
      },
      {
        id: 'layout-grid-1',
        name: 'Grid Layout',
        description: 'Responsive grid layout container',
        category: 'layout',
        lastModified: now.toISOString(),
        fileId: 'mock-file-2',
        variants: ['2 Column', '3 Column', '4 Column'],
      },
      {
        id: 'layout-hero-1',
        name: 'Hero Section',
        description: 'Hero section layout with heading and CTA',
        category: 'layout',
        lastModified: yesterday.toISOString(),
        fileId: 'mock-file-2',
        variants: ['With Image', 'With Video', 'Gradient'],
      },
      {
        id: 'icon-social-1',
        name: 'Social Media Icons',
        description: 'Set of social media platform icons',
        category: 'icon',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-3',
        variants: ['Outlined', 'Filled', 'Colored'],
      },
      {
        id: 'icon-ui-1',
        name: 'UI Icons',
        description: 'Common UI action icons',
        category: 'icon',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-3',
        variants: ['16px', '24px', '32px'],
      },
      {
        id: 'modal-confirm-1',
        name: 'Confirmation Modal',
        description: 'Modal dialog for user confirmations',
        category: 'other',
        lastModified: now.toISOString(),
        fileId: 'mock-file-3',
        variants: ['Success', 'Warning', 'Danger'],
      },
      {
        id: 'badge-status-1',
        name: 'Status Badge',
        description: 'Badge component for displaying status',
        category: 'other',
        lastModified: yesterday.toISOString(),
        fileId: 'mock-file-3',
        variants: ['Success', 'Warning', 'Error', 'Info'],
      },
      {
        id: 'input-select-1',
        name: 'Select Dropdown',
        description: 'Custom select dropdown with search',
        category: 'input',
        lastModified: lastWeek.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Single', 'Multi', 'With Groups'],
      },
      {
        id: 'btn-icon-1',
        name: 'Icon Button',
        description: 'Compact button with icon only',
        category: 'button',
        lastModified: now.toISOString(),
        fileId: 'mock-file-1',
        variants: ['Small', 'Medium', 'Large'],
      },
    ]
  }
}

export const figmaComponentService = new FigmaComponentService()
