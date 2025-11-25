import { ButtonTestingMode } from '@/components/ButtonTestingMode'

interface ButtonTestPageProps {
  onNavigate: (page: string) => void
}

export function ButtonTestPage({ onNavigate }: ButtonTestPageProps) {
  return <ButtonTestingMode onClose={() => onNavigate('home')} />
}
