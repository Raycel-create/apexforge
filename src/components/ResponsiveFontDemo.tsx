import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { useResponsiveFont } from "@/hooks/use-responsive-font"
import { useScreenSize } from "@/hooks/use-mobile"

export function ResponsiveFontDemo() {
  const { screenSize, baseFontSize, scaleFactor } = useResponsiveFont()
  const { isMobile, isTablet, isDesktop } = useScreenSize()
  
  const getScreenType = () => {
    if (isMobile) return "Mobile"
    if (isTablet) return "Tablet"
    if (isDesktop) return "Desktop"
    return "Large Display"
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="heading-responsive-sm">Responsive Font System</CardTitle>
        <CardDescription className="text-responsive">
          Fonts automatically adjust based on your screen size
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Screen Type</p>
            <Badge variant="secondary" className="text-base">
              {getScreenType()}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Screen Size</p>
            <Badge variant="secondary" className="text-base">
              {screenSize}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Base Font Size</p>
            <Badge variant="outline" className="text-base">
              {baseFontSize}px
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Scale Factor</p>
            <Badge variant="outline" className="text-base">
              {scaleFactor.toFixed(4)}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <h1 className="heading-responsive">Heading 1 - Responsive</h1>
          <h2 className="heading-responsive-sm">Heading 2 - Responsive</h2>
          <h3>Heading 3 - Standard</h3>
          <p className="text-responsive-lg">Large responsive text example</p>
          <p className="text-responsive">Regular responsive text example</p>
          <p className="text-responsive-sm">Small responsive text example</p>
        </div>
      </CardContent>
    </Card>
  )
}
