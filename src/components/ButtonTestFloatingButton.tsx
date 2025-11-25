import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TestTube } from '@phosphor-icons/react'
import { ButtonTestingMode } from './ButtonTestingMode'

export function ButtonTestFloatingButton() {
  const [showTesting, setShowTesting] = useState(false)

  if (showTesting) {
    return <ButtonTestingMode onClose={() => setShowTesting(false)} />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 glow-primary"
            onClick={() => setShowTesting(true)}
          >
            <TestTube size={24} weight="fill" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Button Testing Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
