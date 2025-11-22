import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Users,
  MagnifyingGlass,
  CreditCard,
  Calendar,
  Warning,
  CheckCircle,
  XCircle,
  PencilSimple,
  Trash,
  Crown,
  Rocket,
  Sparkle,
  CaretUp,
  CaretDown,
  DotsThree,
  Envelope,
  DownloadSimple,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  email: string
  plan: 'Free' | 'Pro' | 'Launch' | 'Enterprise'
  status: 'active' | 'cancelled' | 'past_due'
  mrr: number
  joinedDate: string
  nextBilling: string
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cus_1',
    name: 'Sarah Johnson',
    email: 'sarah.j@techstartup.io',
    plan: 'Enterprise',
    status: 'active',
    mrr: 250,
    joinedDate: '2024-01-15',
    nextBilling: '2024-07-15',
  },
  {
    id: 'cus_2',
    name: 'Michael Chen',
    email: 'mchen@devagency.com',
    plan: 'Launch',
    status: 'active',
    mrr: 39,
    joinedDate: '2024-02-20',
    nextBilling: '2024-07-20',
  },
  {
    id: 'cus_3',
    name: 'Emily Rodriguez',
    email: 'emily.r@freelance.net',
    plan: 'Pro',
    status: 'active',
    mrr: 19,
    joinedDate: '2024-03-10',
    nextBilling: '2024-07-10',
  },
  {
    id: 'cus_4',
    name: 'David Park',
    email: 'dpark@startup.co',
    plan: 'Pro',
    status: 'past_due',
    mrr: 19,
    joinedDate: '2024-04-05',
    nextBilling: '2024-06-28',
  },
  {
    id: 'cus_5',
    name: 'Alex Thompson',
    email: 'alex.t@builder.app',
    plan: 'Free',
    status: 'active',
    mrr: 0,
    joinedDate: '2024-05-12',
    nextBilling: '-',
  },
  {
    id: 'cus_6',
    name: 'Lisa Wang',
    email: 'lwang@design.studio',
    plan: 'Launch',
    status: 'cancelled',
    mrr: 0,
    joinedDate: '2024-01-08',
    nextBilling: '-',
  },
]

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<keyof Customer>('joinedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(customerId)) {
        newSet.delete(customerId)
      } else {
        newSet.add(customerId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set())
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map((c) => c.id)))
    }
  }

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlan = filterPlan === 'all' || customer.plan === filterPlan
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
      return matchesSearch && matchesPlan && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Crown weight="fill" className="text-primary" size={16} />
      case 'Launch':
        return <Rocket weight="fill" className="text-accent" size={16} />
      case 'Pro':
        return <Sparkle weight="fill" className="text-primary" size={16} />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-accent/20 text-accent border-accent/40">
            <CheckCircle weight="fill" size={12} />
            Active
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-muted/20 text-muted-foreground border-border">
            <XCircle weight="fill" size={12} />
            Cancelled
          </Badge>
        )
      case 'past_due':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/40">
            <Warning weight="fill" size={12} />
            Past Due
          </Badge>
        )
      default:
        return null
    }
  }

  const handleChangePlan = (customerId: string, newPlan: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const mrrMap: Record<string, number> = {
            Free: 0,
            Pro: 19,
            Launch: 39,
            Enterprise: 250,
          }
          return { ...c, plan: newPlan as any, mrr: mrrMap[newPlan] || 0 }
        }
        return c
      })
    )
    toast.success(`Plan changed to ${newPlan}`, {
      description: 'Customer subscription updated successfully',
    })
  }

  const handleCancelSubscription = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return { ...c, status: 'cancelled', mrr: 0, plan: 'Free' }
        }
        return c
      })
    )
    toast.success('Subscription cancelled', {
      description: 'Customer downgraded to free plan',
    })
  }

  const handleReactivate = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return { ...c, status: 'active' }
        }
        return c
      })
    )
    toast.success('Subscription reactivated', {
      description: 'Customer is now active again',
    })
  }

  const totalMRR = customers
    .filter((c) => c.status === 'active')
    .reduce((sum, c) => sum + c.mrr, 0)
  const activeCustomers = customers.filter((c) => c.status === 'active').length
  const pastDueCustomers = customers.filter((c) => c.status === 'past_due').length

  const bulkCancelSubscriptions = () => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (selectedCustomers.has(c.id)) {
          return { ...c, status: 'cancelled' as const, mrr: 0, plan: 'Free' as const }
        }
        return c
      })
    )
    toast.success(`${selectedCustomers.size} subscriptions cancelled`)
    setSelectedCustomers(new Set())
  }

  const bulkChangePlan = (newPlan: string) => {
    const mrrMap: Record<string, number> = {
      Free: 0,
      Pro: 19,
      Launch: 39,
      Enterprise: 250,
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (selectedCustomers.has(c.id)) {
          return { ...c, plan: newPlan as any, mrr: mrrMap[newPlan] || 0 }
        }
        return c
      })
    )
    toast.success(`${selectedCustomers.size} customers moved to ${newPlan} plan`)
    setSelectedCustomers(new Set())
  }

  const bulkSendEmail = () => {
    toast.success(`Email sent to ${selectedCustomers.size} customers`, {
      description: 'Marketing campaign delivered successfully',
    })
    setSelectedCustomers(new Set())
  }

  const exportCustomers = () => {
    const headers = ['Name', 'Email', 'Plan', 'Status', 'MRR', 'Joined Date', 'Next Billing']
    const csvData = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.plan,
      c.status,
      c.mrr,
      c.joinedDate,
      c.nextBilling,
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
      '',
      `Total Customers: ${filteredCustomers.length}`,
      `Active Customers: ${activeCustomers}`,
      `Total MRR: $${totalMRR}`,
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Customer data exported!')
  }

  const SortIcon = ({ field }: { field: keyof Customer }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <CaretUp size={14} className="inline" />
    ) : (
      <CaretDown size={14} className="inline" />
    )
  }

  return (
    <Card className="p-6 border-primary/20">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Users weight="fill" className="text-primary" size={28} />
              Customer Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage subscriptions and customer accounts
            </p>
          </div>
          <Button onClick={exportCustomers} variant="outline" className="gap-2">
            <DownloadSimple size={16} />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Active Customers</div>
            <div className="text-2xl font-bold text-accent">{activeCustomers}</div>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Total MRR</div>
            <div className="text-2xl font-bold text-primary">${totalMRR.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Past Due</div>
            <div className="text-2xl font-bold text-destructive">{pastDueCustomers}</div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search customers
            </Label>
            <div className="relative">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Launch">Launch</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedCustomers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="text-primary" size={20} />
              <span className="font-semibold">{selectedCustomers.size} customers selected</span>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <DotsThree size={16} />
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={bulkSendEmail} className="gap-2">
                    <Envelope size={16} />
                    Send Marketing Email
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => bulkChangePlan('Pro')}
                    className="gap-2"
                  >
                    <Sparkle size={16} />
                    Move to Pro Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => bulkChangePlan('Launch')}
                    className="gap-2"
                  >
                    <Rocket size={16} />
                    Move to Launch Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={bulkCancelSubscriptions}
                    className="gap-2 text-destructive"
                  >
                    <XCircle size={16} />
                    Cancel Subscriptions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCustomers(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('name')}
              >
                Customer <SortIcon field="name" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('plan')}
              >
                Plan <SortIcon field="plan" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('mrr')}
              >
                MRR <SortIcon field="mrr" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('joinedDate')}
              >
                Joined <SortIcon field="joinedDate" />
              </TableHead>
              <TableHead>Next Billing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, idx) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-border hover:bg-muted/30"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedCustomers.has(customer.id)}
                    onCheckedChange={() => toggleCustomerSelection(customer.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPlanIcon(customer.plan)}
                    <span>{customer.plan}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>
                  <span className="font-semibold">${customer.mrr}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar size={14} className="text-muted-foreground" />
                    {new Date(customer.joinedDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.nextBilling !== '-' ? (
                    <div className="flex items-center gap-1 text-sm">
                      <CreditCard size={14} className="text-muted-foreground" />
                      {new Date(customer.nextBilling).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <PencilSimple size={16} />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage Subscription</DialogTitle>
                        <DialogDescription>
                          {customer.name} - {customer.email}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="plan-change" className="mb-2 block">
                            Change Plan
                          </Label>
                          <Select
                            value={customer.plan}
                            onValueChange={(value) => handleChangePlan(customer.id, value)}
                          >
                            <SelectTrigger id="plan-change">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Free">Free</SelectItem>
                              <SelectItem value="Pro">Pro - $19/mo</SelectItem>
                              <SelectItem value="Launch">Launch - $39/mo</SelectItem>
                              <SelectItem value="Enterprise">Enterprise - $250/mo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium">Current Status</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.status}
                            </div>
                          </div>
                          {getStatusBadge(customer.status)}
                        </div>

                        <div className="flex gap-2">
                          {customer.status === 'active' && (
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleCancelSubscription(customer.id)}
                            >
                              <XCircle size={16} />
                              Cancel Subscription
                            </Button>
                          )}
                          {(customer.status === 'cancelled' ||
                            customer.status === 'past_due') && (
                            <Button
                              variant="default"
                              className="flex-1"
                              onClick={() => handleReactivate(customer.id)}
                            >
                              <CheckCircle size={16} />
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>No customers found matching your filters</p>
        </div>
      )}
    </Card>
  )
}
