import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, TextAa, Palette, Moon, Sun } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useScreenSize } from '@/hooks/use-mobile'

interface AccessibilitySettings {
  fontSize: number
  lineHeight: number
  letterSpacing: number
  highContrast: boolean
  reducedMotion: boolean
  focusIndicators: boolean
  textScale: 'small' | 'medium' | 'large' | 'x-large'
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineHeight: 1.6,
  letterSpacing: 0,
  highContrast: false,
  reducedMotion: false,
  focusIndicators: true,
  textScale: 'medium'
}

const textScalePresets = {
  small: { fontSize: 87.5, lineHeight: 1.5, label: 'Small (87.5%)' },
  medium: { fontSize: 100, lineHeight: 1.6, label: 'Medium (100%)' },
  large: { fontSize: 112.5, lineHeight: 1.7, label: 'Large (112.5%)' },
  'x-large': { fontSize: 125, lineHeight: 1.8, label: 'Extra Large (125%)' }
}

export function AccessibilitySettings() {
  const [settingsRaw, setSettings] = useKV<AccessibilitySettings>('accessibility-settings', defaultSettings)
  const [open, setOpen] = useState(false)
  const [themeRaw] = useKV<'light' | 'dark'>('theme', 'light')
  const { isMobile, isTablet } = useScreenSize()

  const settings = settingsRaw || defaultSettings
  const theme = themeRaw || 'light'

  useEffect(() => {
    applySettings(settings)
  }, [settings])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    root.style.setProperty('--accessibility-font-size', `${newSettings.fontSize}%`)
    root.style.setProperty('--accessibility-line-height', `${newSettings.lineHeight}`)
    root.style.setProperty('--accessibility-letter-spacing', `${newSettings.letterSpacing}em`)

    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((current) => {
      const base = current || defaultSettings
      const newSettings = {
        ...base,
        [key]: value
      }
      
      if (key === 'fontSize') {
        const matchingPreset = (Object.keys(textScalePresets) as Array<keyof typeof textScalePresets>).find(
          presetKey => textScalePresets[presetKey].fontSize === value
        )
        if (matchingPreset) {
          newSettings.textScale = matchingPreset
        }
      }
      
      return newSettings
    })
  }

  const handleTextScaleChange = (scale: AccessibilitySettings['textScale']) => {
    const preset = textScalePresets[scale]
    setSettings((current) => {
      const base = current || defaultSettings
      return {
        ...base,
        textScale: scale,
        fontSize: preset.fontSize,
        lineHeight: preset.lineHeight
      }
    })
    toast.success(`Text size changed to ${preset.label}`)
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
    toast.success('Accessibility settings reset to defaults')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "icon"} 
          className={`touch-target ${isMobile ? 'w-full' : ''}`}
          aria-label="Open accessibility settings"
        >
          <Eye className={isMobile ? "h-5 w-5 mr-2" : "h-5 w-5"} />
          {isMobile && <span>Accessibility</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className={`
        ${isMobile ? 'max-w-[95vw] w-[95vw] p-4' : isTablet ? 'max-w-[85vw]' : 'max-w-2xl'}
        max-h-[90vh] 
        overflow-y-auto
      `}>
        <DialogHeader className={isMobile ? 'space-y-2' : ''}>
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            <Eye className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
            <span className={isMobile ? 'text-lg' : ''}>Accessibility Settings</span>
          </DialogTitle>
          <DialogDescription className={isMobile ? 'text-sm' : ''}>
            Customize the appearance and behavior to suit your needs. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <div className={`space-y-${isMobile ? '6' : '8'} py-4`}>
          <Card className={`${isMobile ? 'p-4' : 'p-6'} space-y-4`}>
            <div className="flex items-center gap-2">
              <TextAa className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Text Size</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-scale" className={isMobile ? 'text-sm' : ''}>Quick Presets</Label>
                <Select value={settings.textScale} onValueChange={handleTextScaleChange}>
                  <SelectTrigger 
                    id="text-scale" 
                    className={`touch-target ${isMobile ? 'h-12 text-base' : ''}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(textScalePresets) as Array<keyof typeof textScalePresets>).map((key) => (
                      <SelectItem 
                        key={key} 
                        value={key}
                        className={isMobile ? 'py-3 text-base' : ''}
                      >
                        {textScalePresets[key].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
                  <Label htmlFor="font-size" className={isMobile ? 'text-sm' : ''}>
                    Font Size: {settings.fontSize}%
                  </Label>
                  <span className={`text-sm text-muted-foreground ${isMobile ? 'self-end' : ''}`}>
                    {settings.fontSize < 100 ? 'Smaller' : settings.fontSize > 100 ? 'Larger' : 'Default'}
                  </span>
                </div>
                <Slider
                  id="font-size"
                  min={75}
                  max={150}
                  step={5}
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  className={`touch-target ${isMobile ? 'h-12' : ''}`}
                  aria-label="Adjust font size percentage"
                />
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
                  <Label htmlFor="line-height" className={isMobile ? 'text-sm' : ''}>
                    Line Height: {settings.lineHeight.toFixed(1)}
                  </Label>
                  <span className={`text-sm text-muted-foreground ${isMobile ? 'self-end' : ''}`}>
                    {settings.lineHeight < 1.5 ? 'Compact' : settings.lineHeight > 1.7 ? 'Spacious' : 'Comfortable'}
                  </span>
                </div>
                <Slider
                  id="line-height"
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  value={[settings.lineHeight]}
                  onValueChange={([value]) => updateSetting('lineHeight', value)}
                  className={`touch-target ${isMobile ? 'h-12' : ''}`}
                  aria-label="Adjust line height"
                />
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
                  <Label htmlFor="letter-spacing" className={isMobile ? 'text-sm' : ''}>
                    Letter Spacing: {settings.letterSpacing.toFixed(2)}em
                  </Label>
                  <span className={`text-sm text-muted-foreground ${isMobile ? 'self-end' : ''}`}>
                    {settings.letterSpacing < 0 ? 'Tighter' : settings.letterSpacing > 0.02 ? 'Wider' : 'Normal'}
                  </span>
                </div>
                <Slider
                  id="letter-spacing"
                  min={-0.05}
                  max={0.1}
                  step={0.01}
                  value={[settings.letterSpacing]}
                  onValueChange={([value]) => updateSetting('letterSpacing', value)}
                  className={`touch-target ${isMobile ? 'h-12' : ''}`}
                  aria-label="Adjust letter spacing"
                />
              </div>
            </div>
          </Card>

          <Card className={`${isMobile ? 'p-4' : 'p-6'} space-y-4`}>
            <div className="flex items-center gap-2">
              <Palette className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Visual Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label className={isMobile ? 'text-sm' : 'text-base'}>Theme</Label>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {isMobile ? 'Toggle in nav' : 'Use the theme toggle button in the navigation'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
                  {theme === 'dark' ? <Moon className={isMobile ? "h-4 w-4" : "h-5 w-5"} /> : <Sun className={isMobile ? "h-4 w-4" : "h-5 w-5"} />}
                  <span className={isMobile ? "text-xs" : "text-sm"}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="high-contrast" className={isMobile ? 'text-sm' : 'text-base'}>
                    High Contrast
                  </Label>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {isMobile ? 'Better visibility' : 'Enhance contrast for better visibility'}
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => {
                    updateSetting('highContrast', checked)
                    toast.success(checked ? 'High contrast enabled' : 'High contrast disabled')
                  }}
                  className={isMobile ? 'touch-target scale-110' : ''}
                  aria-label="Toggle high contrast mode"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="reduced-motion" className={isMobile ? 'text-sm' : 'text-base'}>
                    Reduce Motion
                  </Label>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {isMobile ? 'Less animations' : 'Minimize animations and transitions'}
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => {
                    updateSetting('reducedMotion', checked)
                    toast.success(checked ? 'Animations reduced' : 'Animations enabled')
                  }}
                  className={isMobile ? 'touch-target scale-110' : ''}
                  aria-label="Toggle reduced motion"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="focus-indicators" className={isMobile ? 'text-sm' : 'text-base'}>
                    Enhanced Focus
                  </Label>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {isMobile ? 'Keyboard navigation' : 'Show prominent focus indicators for keyboard navigation'}
                  </p>
                </div>
                <Switch
                  id="focus-indicators"
                  checked={settings.focusIndicators}
                  onCheckedChange={(checked) => {
                    updateSetting('focusIndicators', checked)
                    toast.success(checked ? 'Enhanced focus enabled' : 'Standard focus enabled')
                  }}
                  className={isMobile ? 'touch-target scale-110' : ''}
                  aria-label="Toggle enhanced focus indicators"
                />
              </div>
            </div>
          </Card>

          <div className={`
            flex items-center justify-between pt-4 border-t
            ${isMobile ? 'flex-col gap-4' : ''}
          `}>
            <p className={`${isMobile ? 'text-xs w-full' : 'text-sm'} text-muted-foreground`}>
              Preview: <span 
                style={{ fontSize: `calc(1rem * ${settings.fontSize / 100})` }}
                className={isMobile ? 'block mt-2' : 'inline'}
              >
                The quick brown fox {isMobile ? '' : 'jumps over the lazy dog'}
              </span>
            </p>
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className={`touch-target ${isMobile ? 'w-full h-12' : ''}`}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
