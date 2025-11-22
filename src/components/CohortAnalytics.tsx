import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ChartLine, TrendUp, TrendDown, Users, CurrencyDollar, Download, Calendar, Funnel } from '@phosphor-icons/react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Area,
} from 'recharts'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface CohortData {
  cohort: string
  month0: number
  month1: number
  month2: number
  month3: number
  month4: number
  month5: number
  month6: number
}

interface RetentionMetrics {
  cohortSize: number
  retentionRate: number
  churnRate: number
  ltv: number
  avgRevenue: number
}

const COHORT_DATA: CohortData[] = [
  { cohort: 'Jan 2025', month0: 100, month1: 82, month2: 71, month3: 65, month4: 61, month5: 58, month6: 56 },
  { cohort: 'Feb 2025', month0: 100, month1: 85, month2: 74, month3: 68, month4: 64, month5: 61, month6: 0 },
  { cohort: 'Mar 2025', month0: 100, month1: 88, month2: 78, month3: 72, month4: 68, month5: 0, month6: 0 },
  { cohort: 'Apr 2025', month0: 100, month1: 90, month2: 81, month3: 75, month4: 0, month5: 0, month6: 0 },
  { cohort: 'May 2025', month0: 100, month1: 92, month2: 84, month3: 0, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Jun 2025', month0: 100, month1: 93, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Jul 2025', month0: 100, month1: 0, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
]

const REVENUE_COHORT_DATA = [
  { cohort: 'Jan 2025', month0: 1900, month1: 2340, month2: 2180, month3: 2450, month4: 2600, month5: 2720, month6: 2890 },
  { cohort: 'Feb 2025', month0: 2100, month1: 2560, month2: 2390, month3: 2680, month4: 2820, month5: 2940, month6: 0 },
  { cohort: 'Mar 2025', month0: 2450, month1: 2890, month2: 2720, month3: 3100, month4: 3280, month5: 0, month6: 0 },
  { cohort: 'Apr 2025', month0: 2780, month1: 3240, month2: 3080, month3: 3420, month4: 0, month5: 0, month6: 0 },
  { cohort: 'May 2025', month0: 3100, month1: 3680, month2: 3520, month3: 0, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Jun 2025', month0: 3450, month1: 4120, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Jul 2025', month0: 3890, month1: 0, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
]

const LTV_BY_COHORT = [
  { cohort: 'Jan 2025', ltv: 892, arpu: 156 },
  { cohort: 'Feb 2025', ltv: 945, arpu: 168 },
  { cohort: 'Mar 2025', ltv: 1024, arpu: 182 },
  { cohort: 'Apr 2025', ltv: 1156, arpu: 195 },
  { cohort: 'May 2025', ltv: 1289, arpu: 208 },
  { cohort: 'Jun 2025', ltv: 1367, arpu: 224 },
  { cohort: 'Jul 2025', ltv: 1445, arpu: 239 },
]

const ENGAGEMENT_DATA = [
  { metric: 'Daily Active', jan: 67, feb: 72, mar: 78, apr: 82, may: 85, jun: 88, jul: 91 },
  { metric: 'Weekly Active', jan: 82, feb: 84, mar: 87, apr: 89, may: 91, jun: 93, jul: 94 },
  { metric: 'Monthly Active', jan: 91, feb: 92, mar: 93, apr: 94, may: 95, jun: 96, jul: 97 },
]

export function CohortAnalytics() {
  const [timeframe, setTimeframe] = useState('6months')
  const [metric, setMetric] = useState('retention')
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const calculateRetentionMetrics = (cohort: CohortData): RetentionMetrics => {
    const activeMonths = Object.values(cohort).filter((v) => typeof v === 'number' && v > 0)
    const lastRetention = activeMonths[activeMonths.length - 1] || 0
    const retentionRate = lastRetention
    const churnRate = 100 - retentionRate
    const ltv = LTV_BY_COHORT.find((l) => l.cohort === cohort.cohort)?.ltv || 0
    const avgRevenue = LTV_BY_COHORT.find((l) => l.cohort === cohort.cohort)?.arpu || 0

    return {
      cohortSize: cohort.month0,
      retentionRate,
      churnRate,
      ltv,
      avgRevenue,
    }
  }

  const getRetentionColor = (value: number) => {
    if (value >= 80) return 'oklch(0.70 0.25 142)'
    if (value >= 60) return 'oklch(0.75 0.20 85)'
    if (value >= 40) return 'oklch(0.78 0.18 60)'
    if (value >= 20) return 'oklch(0.70 0.20 30)'
    return 'oklch(0.65 0.25 15)'
  }

  const exportData = async (format: 'csv' | 'pdf') => {
    setExporting(true)
    toast.info(`Exporting cohort analysis as ${format.toUpperCase()}...`)
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setExporting(false)
    toast.success(`Cohort analysis exported as ${format.toUpperCase()} ✓`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <ChartLine weight="fill" className="text-primary" size={32} />
            Cohort Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Track user retention, lifetime value, and behavioral patterns by cohort
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[160px]">
              <Calendar size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[160px]">
              <Funnel size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retention">Retention Rate</SelectItem>
              <SelectItem value="revenue">Revenue Cohorts</SelectItem>
              <SelectItem value="ltv">Lifetime Value</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => exportData('csv')}
            disabled={exporting}
          >
            <Download size={16} />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData('pdf')}
            disabled={exporting}
          >
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="heatmap" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ltv">LTV</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Retention Heatmap</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Percentage of users remaining active over time by cohort
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold">Cohort</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 0</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 1</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 2</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 3</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 4</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 5</th>
                    <th className="text-center p-3 text-sm font-semibold">Month 6</th>
                  </tr>
                </thead>
                <tbody>
                  {COHORT_DATA.map((cohort, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCohort(cohort.cohort)}
                    >
                      <td className="p-3 font-semibold text-sm">{cohort.cohort}</td>
                      {[0, 1, 2, 3, 4, 5, 6].map((month) => {
                        const key = `month${month}` as keyof CohortData
                        const value = cohort[key] as number
                        return (
                          <td
                            key={month}
                            className="p-3 text-center text-sm font-medium"
                            style={{
                              backgroundColor: value > 0 ? getRetentionColor(value) : 'transparent',
                              color: value > 0 ? 'white' : 'var(--muted-foreground)',
                            }}
                          >
                            {value > 0 ? `${value}%` : '-'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedCohort && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 rounded-lg bg-muted/30 border border-border"
              >
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  {selectedCohort} Cohort Metrics
                  <Badge variant="outline">{calculateRetentionMetrics(COHORT_DATA.find((c) => c.cohort === selectedCohort)!).cohortSize} users</Badge>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const metrics = calculateRetentionMetrics(COHORT_DATA.find((c) => c.cohort === selectedCohort)!)
                    return (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Retention Rate</p>
                          <p className="text-2xl font-bold text-primary">{metrics.retentionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Churn Rate</p>
                          <p className="text-2xl font-bold text-destructive">{metrics.churnRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">LTV</p>
                          <p className="text-2xl font-bold text-accent">${metrics.ltv}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">ARPU</p>
                          <p className="text-2xl font-bold">${metrics.avgRevenue}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </motion.div>
            )}
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Avg 3-Month Retention</h4>
                <TrendUp weight="fill" className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-bold">72.3%</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendUp size={12} className="text-primary" />
                +4.2% from last period
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Avg Cohort LTV</h4>
                <CurrencyDollar weight="fill" className="text-accent" size={20} />
              </div>
              <p className="text-3xl font-bold">$1,159</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendUp size={12} className="text-primary" />
                +12.8% from last period
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Best Performing Cohort</h4>
                <Users weight="fill" className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-bold">Jul 2025</p>
              <p className="text-xs text-muted-foreground mt-1">
                93% month-1 retention
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Retention Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={COHORT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="cohort" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="month1" stroke="oklch(0.60 0.30 285)" strokeWidth={2} name="Month 1" />
                <Line type="monotone" dataKey="month3" stroke="oklch(0.80 0.18 195)" strokeWidth={2} name="Month 3" />
                <Line type="monotone" dataKey="month6" stroke="oklch(0.70 0.25 142)" strokeWidth={2} name="Month 6" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Revenue by Cohort</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={REVENUE_COHORT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="cohort" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="month0" fill="oklch(0.60 0.30 285)" name="Launch" />
                <Bar dataKey="month1" fill="oklch(0.80 0.18 195)" name="Month 1" />
                <Bar dataKey="month3" fill="oklch(0.70 0.25 142)" name="Month 3" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="ltv" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Customer Lifetime Value by Cohort</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={LTV_BY_COHORT}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="cohort" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="ltv" fill="oklch(0.60 0.30 285 / 0.2)" stroke="oklch(0.60 0.30 285)" strokeWidth={2} name="LTV" />
                <Line type="monotone" dataKey="arpu" stroke="oklch(0.80 0.18 195)" strokeWidth={2} name="ARPU" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">LTV Growth Analysis</h4>
              <div className="space-y-4">
                {LTV_BY_COHORT.slice(-4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.cohort}</p>
                      <p className="text-xs text-muted-foreground">ARPU: ${item.arpu}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${item.ltv}</p>
                      {idx > 0 && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <TrendUp size={12} className="text-primary" />
                          +{((item.ltv / LTV_BY_COHORT.slice(-4)[idx - 1].ltv - 1) * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Key Insights</h4>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm font-semibold text-primary mb-1">Strong LTV Growth</p>
                  <p className="text-xs text-muted-foreground">
                    Recent cohorts show 62% higher LTV compared to Jan 2025
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm font-semibold text-accent mb-1">ARPU Increasing</p>
                  <p className="text-xs text-muted-foreground">
                    Average revenue per user up 53% across cohorts
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted border border-border">
                  <p className="text-sm font-semibold mb-1">Recommendation</p>
                  <p className="text-xs text-muted-foreground">
                    Focus on replicating Jul 2025 cohort acquisition strategies
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">User Engagement by Cohort</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="metric" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="jan" fill="oklch(0.50 0.15 285)" name="Jan" />
                <Bar dataKey="mar" fill="oklch(0.60 0.20 285)" name="Mar" />
                <Bar dataKey="may" fill="oklch(0.70 0.25 285)" name="May" />
                <Bar dataKey="jul" fill="oklch(0.80 0.30 285)" name="Jul" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Daily Active Users</h4>
                <TrendUp weight="fill" className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-bold">91%</p>
              <p className="text-xs text-muted-foreground mt-1">Jul 2025 cohort</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Weekly Active Users</h4>
                <TrendUp weight="fill" className="text-accent" size={20} />
              </div>
              <p className="text-3xl font-bold">94%</p>
              <p className="text-xs text-muted-foreground mt-1">Jul 2025 cohort</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Monthly Active Users</h4>
                <Users weight="fill" className="text-primary" size={20} />
              </div>
              <p className="text-3xl font-bold">97%</p>
              <p className="text-xs text-muted-foreground mt-1">Jul 2025 cohort</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
