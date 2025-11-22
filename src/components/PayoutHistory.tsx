import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  CurrencyDollar, 
  Bank, 
  CheckCircle, 
  Clock, 
  Warning,
  ArrowRight,
  Download,
  CalendarBlank,
  TrendUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { fetchPayoutHistory, StripePayout } from '../lib/stripeIntegration'
import { useScreenSize } from '../hooks/use-mobile'

export function PayoutHistory() {
  const { isMobile } = useScreenSize()
  const [payouts, setPayouts] = useState<StripePayout[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')

  useEffect(() => {
    loadPayouts()
  }, [])

  const loadPayouts = async () => {
    setLoading(true)
    try {
      const data = await fetchPayoutHistory()
      setPayouts(data)
    } catch (error) {
      toast.error('Failed to load payout history')
    } finally {
      setLoading(false)
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    if (filter === 'all') return true
    if (filter === 'paid') return payout.status === 'paid'
    if (filter === 'pending') return payout.status === 'pending' || payout.status === 'in_transit'
    return true
  })

  const totalPaid = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payouts
    .filter(p => p.status === 'pending' || p.status === 'in_transit')
    .reduce((sum, p) => sum + p.amount, 0)

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: StripePayout['status']) => {
    const configs = {
      paid: {
        icon: <CheckCircle weight="fill" size={12} />,
        className: 'bg-accent/20 text-accent border-accent/40',
        label: 'Paid',
      },
      in_transit: {
        icon: <Clock weight="fill" size={12} />,
        className: 'bg-primary/20 text-primary border-primary/40',
        label: 'In Transit',
      },
      pending: {
        icon: <Clock weight="fill" size={12} />,
        className: 'bg-muted/20 text-muted-foreground border-border',
        label: 'Pending',
      },
      canceled: {
        icon: <Warning weight="fill" size={12} />,
        className: 'bg-muted/20 text-muted-foreground border-border',
        label: 'Canceled',
      },
      failed: {
        icon: <Warning weight="fill" size={12} />,
        className: 'bg-destructive/20 text-destructive border-destructive/40',
        label: 'Failed',
      },
    }

    const config = configs[status] || configs.pending

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const exportPayouts = () => {
    toast.success('Exporting payout history...', {
      description: 'CSV file will be downloaded',
    })
  }

  if (loading) {
    return (
      <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/30`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/30`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>Payout History</h3>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Track all payouts to your connected bank accounts
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportPayouts}
          size={isMobile ? 'sm' : 'default'}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-6`}>
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Total Paid Out</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-accent`}>
            {formatAmount(totalPaid, 'USD')}
          </div>
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Pending</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-primary`}>
            {formatAmount(totalPending, 'USD')}
          </div>
        </div>
        
        <div className={`${isMobile ? 'p-3 col-span-2' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Total Payouts</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            {payouts.length}
          </div>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-3'}`}>
          <TabsTrigger value="all" className={isMobile ? 'text-xs' : ''}>All ({payouts.length})</TabsTrigger>
          <TabsTrigger value="paid" className={isMobile ? 'text-xs' : ''}>
            Paid ({payouts.filter(p => p.status === 'paid').length})
          </TabsTrigger>
          <TabsTrigger value="pending" className={isMobile ? 'text-xs' : ''}>
            Pending ({payouts.filter(p => p.status === 'pending' || p.status === 'in_transit').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <Bank weight="fill" className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">No payouts found</p>
          </div>
        ) : (
          filteredPayouts.map((payout, idx) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border hover:border-primary/50 transition-colors`}
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0`}>
                    <CurrencyDollar weight="fill" className="text-accent" size={isMobile ? 16 : 20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'} text-accent`}>
                        {formatAmount(payout.amount, payout.currency)}
                      </span>
                      {getStatusBadge(payout.status)}
                    </div>
                    <div className={`text-muted-foreground mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      To {payout.destination} • {payout.method === 'instant' ? 'Instant' : 'Standard'}
                    </div>
                    <div className={`flex items-center gap-3 text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} flex-wrap`}>
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={14} />
                        Created: {formatDate(payout.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRight size={14} />
                        Arrives: {formatDate(payout.arrivalDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.info(`Viewing details for ${payout.id}`)}
                  className={isMobile ? 'text-xs' : ''}
                >
                  Details
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {filteredPayouts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={loadPayouts}
            className="w-full"
            size={isMobile ? 'sm' : 'default'}
          >
            <TrendUp size={16} />
            Refresh Payouts
          </Button>
        </div>
      )}
    </Card>
  )
}
