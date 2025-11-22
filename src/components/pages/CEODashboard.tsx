import { useState } from 'react'
import { TrendUp, Users, CurrencyDollar, Download, Sparkle, ChartLine } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface CEODashboardProps {
  onNavigate: (page: Page) => void
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18900 },
  { month: 'Mar', revenue: 25300 },
  { month: 'Apr', revenue: 32100 },
  { month: 'May', revenue: 41200 },
  { month: 'Jun', revenue: 52800 },
]

const USER_GROWTH_DATA = [
  { month: 'Jan', users: 245 },
  { month: 'Feb', users: 412 },
  { month: 'Mar', users: 678 },
  { month: 'Apr', users: 943 },
  { month: 'May', users: 1289 },
  { month: 'Jun', users: 1756 },
]

const PLAN_DISTRIBUTION = [
  { name: 'Free', value: 1245, color: 'oklch(0.35 0.01 250)' },
  { name: 'Pro', value: 456, color: 'oklch(0.55 0.25 270)' },
  { name: 'Enterprise', value: 55, color: 'oklch(0.75 0.15 195)' },
]

const TOP_PROMPTS = [
  { prompt: 'E-commerce app with Stripe', count: 234 },
  { prompt: 'Todo app with authentication', count: 189 },
  { prompt: 'Social media dashboard', count: 156 },
  { prompt: 'Real-time chat application', count: 142 },
  { prompt: 'Analytics dashboard', count: 128 },
]

export function CEODashboard({ onNavigate }: CEODashboardProps) {
  const [generating, setGenerating] = useState(false)

  const generateAIReport = async () => {
    setGenerating(true)
    toast.info('AI is analyzing metrics and generating report...')
    
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    setGenerating(false)
    toast.success('Daily report generated!', {
      description: 'Check your email for the full AI-powered insights report',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">CEO Dashboard</h1>
            <p className="text-muted-foreground">Real-time business intelligence and AI insights</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => toast.success('Exporting data...')}
            >
              <Download size={16} />
              Export Data
            </Button>
            <Button
              onClick={generateAIReport}
              disabled={generating}
              className="glow-primary"
            >
              <Sparkle weight="fill" size={16} />
              {generating ? 'Generating...' : 'Generate AI Report'}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-primary/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Revenue</span>
              <CurrencyDollar weight="fill" className="text-primary" size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">$52,800</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendUp weight="bold" size={14} />
              <span>+28% from last month</span>
            </div>
          </Card>

          <Card className="p-6 border-accent/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Users</span>
              <Users weight="fill" className="text-accent" size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">1,756</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendUp weight="bold" size={14} />
              <span>+36% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Generations</span>
              <Sparkle weight="fill" className="text-primary" size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">8,423</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendUp weight="bold" size={14} />
              <span>+42% from last month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Success Rate</span>
              <ChartLine weight="fill" className="text-accent" size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">96.8%</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendUp weight="bold" size={14} />
              <span>+2.1% from last month</span>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.01 250)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.20 0.01 250)',
                    border: '1px solid oklch(0.30 0.01 250)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.55 0.25 270)"
                  strokeWidth={3}
                  dot={{ fill: 'oklch(0.55 0.25 270)', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={USER_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.01 250)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.20 0.01 250)',
                    border: '1px solid oklch(0.30 0.01 250)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="users" fill="oklch(0.75 0.15 195)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={PLAN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PLAN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.20 0.01 250)',
                    border: '1px solid oklch(0.30 0.01 250)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {PLAN_DISTRIBUTION.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span>{plan.name}</span>
                  </div>
                  <span className="text-muted-foreground">{plan.value} users</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Top Generation Prompts</h3>
            <div className="space-y-3">
              {TOP_PROMPTS.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm">{item.prompt}</span>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {item.count} uses
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-xl font-semibold mb-3">AI-Generated Insights</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Sparkle weight="fill" className="text-accent shrink-0 mt-0.5" size={16} />
              <p>
                <strong className="text-accent">Revenue Forecast:</strong> Based on current growth trajectory,
                you're on track to reach $78K MRR by end of Q3 (+48% growth).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkle weight="fill" className="text-accent shrink-0 mt-0.5" size={16} />
              <p>
                <strong className="text-accent">Opportunity:</strong> E-commerce prompts are trending up 156%.
                Consider creating pre-built templates to capture this demand.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkle weight="fill" className="text-accent shrink-0 mt-0.5" size={16} />
              <p>
                <strong className="text-accent">User Behavior:</strong> 68% of Pro users generate apps within
                first 24 hours. Improve onboarding to increase free-to-paid conversion.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
