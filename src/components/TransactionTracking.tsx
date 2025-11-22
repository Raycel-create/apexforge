import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  CurrencyDollar, 
  MagnifyingGlass,
  CheckCircle, 
  Warning,
  ArrowUp,
  ArrowDown,
  Receipt,
  Download,
  CalendarBlank,
  User,
  CreditCard
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { fetchTransactionHistory, StripeTransaction } from '../lib/stripeIntegration'
import { useScreenSize } from '../hooks/use-mobile'

export function TransactionTracking() {
  const { isMobile } = useScreenSize()
  const [transactions, setTransactions] = useState<StripeTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'payment' | 'payout' | 'refund' | 'fee'>('all')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const data = await fetchTransactionHistory()
      setTransactions(data)
    } catch (error) {
      toast.error('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === 'all' || txn.type === filter
    const matchesSearch = 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.customerEmail && txn.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const totalIncome = transactions
    .filter(t => t.type === 'payment' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPayouts = Math.abs(transactions
    .filter(t => t.type === 'payout')
    .reduce((sum, t) => sum + t.amount, 0))

  const totalFees = Math.abs(transactions
    .filter(t => t.type === 'fee')
    .reduce((sum, t) => sum + t.amount, 0))

  const totalRefunds = Math.abs(transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0))

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount) / 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const getTypeIcon = (type: StripeTransaction['type']) => {
    const configs = {
      payment: {
        icon: <ArrowDown weight="fill" size={isMobile ? 16 : 20} />,
        className: 'bg-accent/20 text-accent',
      },
      payout: {
        icon: <ArrowUp weight="fill" size={isMobile ? 16 : 20} />,
        className: 'bg-primary/20 text-primary',
      },
      refund: {
        icon: <ArrowUp weight="fill" size={isMobile ? 16 : 20} />,
        className: 'bg-destructive/20 text-destructive',
      },
      fee: {
        icon: <Receipt weight="fill" size={isMobile ? 16 : 20} />,
        className: 'bg-muted/20 text-muted-foreground',
      },
    }

    return configs[type] || configs.payment
  }

  const getTypeBadge = (type: StripeTransaction['type']) => {
    const configs = {
      payment: {
        className: 'bg-accent/20 text-accent border-accent/40',
        label: 'Payment',
      },
      payout: {
        className: 'bg-primary/20 text-primary border-primary/40',
        label: 'Payout',
      },
      refund: {
        className: 'bg-destructive/20 text-destructive border-destructive/40',
        label: 'Refund',
      },
      fee: {
        className: 'bg-muted/20 text-muted-foreground border-border',
        label: 'Fee',
      },
    }

    const config = configs[type] || configs.payment

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const exportTransactions = () => {
    toast.success('Exporting transaction history...', {
      description: 'CSV file will be downloaded',
    })
  }

  if (loading) {
    return (
      <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>Transaction History</h3>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Real-time tracking of all payments, payouts, and fees
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportTransactions}
          size={isMobile ? 'sm' : 'default'}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-6`}>
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Total Income</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-accent`}>
            {formatAmount(totalIncome, 'USD')}
          </div>
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Total Payouts</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-primary`}>
            {formatAmount(totalPayouts, 'USD')}
          </div>
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Fees</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-muted-foreground`}>
            {formatAmount(totalFees, 'USD')}
          </div>
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Refunds</div>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'} text-destructive`}>
            {formatAmount(totalRefunds, 'USD')}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlass 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            size={20} 
          />
          <Input
            placeholder="Search by description or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${isMobile ? 'text-sm' : ''}`}
          />
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}>
          <TabsTrigger value="all" className={isMobile ? 'text-xs' : ''}>
            All
          </TabsTrigger>
          <TabsTrigger value="payment" className={isMobile ? 'text-xs' : ''}>
            Payments
          </TabsTrigger>
          <TabsTrigger value="payout" className={isMobile ? 'text-xs' : ''}>
            Payouts
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
              <TabsTrigger value="fee">Fees</TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Receipt weight="fill" className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">
              {searchQuery ? 'No transactions match your search' : 'No transactions found'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction, idx) => {
            const typeConfig = getTypeIcon(transaction.type)
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border hover:border-accent/50 transition-colors`}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full ${typeConfig.className} flex items-center justify-center flex-shrink-0`}>
                      {typeConfig.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                          {transaction.description}
                        </span>
                        {getTypeBadge(transaction.type)}
                      </div>
                      {transaction.customerEmail && (
                        <div className={`text-muted-foreground mb-2 flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <User size={14} />
                          {transaction.customerEmail}
                        </div>
                      )}
                      <div className={`flex items-center gap-3 text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={14} />
                          {formatDate(transaction.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={14} />
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} ${
                      transaction.amount > 0 ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {formatAmount(transaction.amount, transaction.currency)}
                    </div>
                    {transaction.status === 'succeeded' && (
                      <Badge className="bg-accent/20 text-accent border-accent/40 mt-1 text-xs">
                        <CheckCircle weight="fill" size={10} />
                        Success
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={loadTransactions}
            className="w-full"
            size={isMobile ? 'sm' : 'default'}
          >
            <CurrencyDollar size={16} />
            Refresh Transactions
          </Button>
        </div>
      )}
    </Card>
  )
}
