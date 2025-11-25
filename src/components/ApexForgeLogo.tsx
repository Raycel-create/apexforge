interface ApexForgeLogoProps {
  className?: string
  variant?: 'default' | 'watermark'
}

export function ApexForgeLogo({ className = '', variant = 'default' }: ApexForgeLogoProps) {
  const isWatermark = variant === 'watermark'
  
  return (
    <svg 
      viewBox="0 0 1080 1080" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: isWatermark ? 0.03 : 1,
        mixBlendMode: isWatermark ? 'multiply' : 'normal'
      }}
    >
      <g transform="translate(540, 540)">
        <g className={isWatermark ? '' : 'dark:invert'}>
          <path
            d="M -250 150 L -200 150 Q -190 140 -185 120 L -180 100 Q -175 75 -165 60 L -150 40 Q -145 30 -140 30 L -130 30 L -130 20 L -125 20 Q -120 20 -120 15 L -120 5 Q -120 0 -115 -5 L -110 -10"
            fill="currentColor"
            stroke="none"
          />
          
          <ellipse cx="-180" cy="70" rx="35" ry="45" fill="currentColor" opacity="0.3" />
          <ellipse cx="-165" cy="50" rx="25" ry="35" fill="currentColor" opacity="0.2" />
          
          <path
            d="M -250 180 L -230 180 L -230 160 L -225 150 L -220 150 L -220 160 L -210 165 L -200 165 L -200 150 L -180 150"
            fill="currentColor"
          />
          
          <path
            d="M 250 150 L 200 150 Q 190 140 185 120 L 180 100 Q 175 75 165 60 L 150 40 Q 145 30 140 30 L 130 30 L 130 20 L 125 20 Q 120 20 120 15 L 120 5 Q 120 0 115 -5 L 110 -10"
            fill="currentColor"
            stroke="none"
          />
          
          <ellipse cx="180" cy="70" rx="35" ry="45" fill="currentColor" opacity="0.3" />
          <ellipse cx="165" cy="50" rx="25" ry="35" fill="currentColor" opacity="0.2" />
          
          <path
            d="M 250 180 L 230 180 L 230 160 L 225 150 L 220 150 L 220 160 L 210 165 L 200 165 L 200 150 L 180 150"
            fill="currentColor"
          />
          
          <path
            d="M -90 -280 Q -70 -290 0 -290 Q 70 -290 90 -280"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          <circle cx="0" cy="0" r="200" fill="none" stroke="currentColor" strokeWidth="2" />
          
          <line x1="-140" y1="-100" x2="140" y2="-100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="-140" y1="0" x2="140" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="-140" x2="0" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          
          <path
            d="M -120 100 L 0 -150 L 120 100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          
          <path
            d="M -90 65 L 0 -100 L 90 65 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          <g>
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180
              const startRadius = 85
              const endRadius = i % 2 === 0 ? 115 : 105
              const x1 = Math.cos(angle - Math.PI / 2) * startRadius
              const y1 = Math.sin(angle - Math.PI / 2) * startRadius
              const x2 = Math.cos(angle - Math.PI / 2) * endRadius
              const y2 = Math.sin(angle - Math.PI / 2) * endRadius
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              )
            })}
          </g>
          
          <circle cx="0" cy="20" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          
          <path
            d="M -10 10 Q -5 0 0 -5 Q 5 0 10 10 Q 5 25 0 30 Q -5 25 -10 10 Z"
            fill="currentColor"
            opacity="0.15"
          />
          
          <circle cx="-20" cy="220" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="-20" cy="265" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="220" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="265" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="240" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          
          <circle cx="-20" cy="300" r="8" fill="currentColor" />
          <circle cx="20" cy="300" r="8" fill="currentColor" />
          <circle cx="0" cy="280" r="8" fill="currentColor" />
          
          <line x1="-20" y1="190" x2="-20" y2="205" stroke="currentColor" strokeWidth="2" />
          <line x1="20" y1="190" x2="20" y2="205" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="190" x2="0" y2="230" stroke="currentColor" strokeWidth="2" />
        </g>
      </g>
    </svg>
  )
}
