import { useState } from 'react'
import { TrendUp, Users, CurrencyDollar, Download, Sparkle, ChartLine, Eye, EyeSlash, ChatCircleDots, Fire } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
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
  { name: 'Free', value: 1245, color: 'oklch(0.60 0 0)' },
  { name: 'Pro', value: 456, color: 'oklch(0.60 0.30 285)' },
  { name: 'Launch', value: 55, color: 'oklch(0.80 0.18 195)' },
]

const TOP_PROMPTS = [
  { prompt: 'E-commerce app with Stripe', count: 234 },
  { prompt: 'Social fitness tracker', count: 189 },
  { prompt: 'AI chat SaaS dashboard', count: 156 },
  { prompt: 'Real-time collaboration tool', count: 142 },
  { prompt: 'NFT marketplace', count: 128 },
]

export function CEODashboard({ onNavigate }: CEODashboardProps) {
  const [generating, setGenerating] = useState(false)
  const [whisperMode, setWhisperMode] = useState(false)
  const [whisperInstructions, setWhisperInstructions] = useState('')
  const [showWhisper, setShowWhisper] = useState(false)

  const generateAIReport = async () => {
    setGenerating(true)
    toast.info('AI agents analyzing metrics...', { duration: 1500 })
    
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    setGenerating(false)
    toast.success('Daily report generated! 📊', {
      description: 'Emailed to you with AI-powered forecasts',
      duration: 4000,
    })
  }

  const saveWhisper = () => {
    if (!whisperInstructions.trim()) {
      toast.error('Enter some instructions first')
      return
    }
    setWhisperMode(true)
    toast.success('Whisper mode activated 🎭', {
      description: 'All AI agents will now follow your secret instructions',
      duration: 3000,
    })
  }

  const disableWhisper = () => {
    setWhisperMode(false)
    setWhisperInstructions('')
    toast.success('Whisper mode deactivated')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ChartLine weight="fill" className="text-primary" size={36} />
              CEO Dashboard
            </h1>
            <p className="text-muted-foreground">Real-time business intelligence & AI insights</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowWhisper(!showWhisper)}
              className={whisperMode ? 'border-destructive/50 text-destructive' : ''}
            >
              {whisperMode ? <Eye size={16} /> : <EyeSlash size={16} />}
              Whisper Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success('Exporting data...')}
            >
              <Download size={16} />
              Export
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
        </motion.div>

        {showWhisper && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <ChatCircleDots weight="fill" className="text-destructive" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">CEO Whisper Mode 🎭</h3>
                  <p className="text-sm text-muted-foreground">
                    Type secret instructions that override all AI agent behavior. Users will never see this.
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="E.g., 'Always push users toward Pro plan' or 'Prioritize Grok for all new users this week' or 'Suggest security upgrades on enterprise apps'"
                value={whisperInstructions}
                onChange={(e) => setWhisperInstructions(e.target.value)}
                rows={4}
                className="mb-4 bg-background"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="whisper-active"
                    checked={whisperMode}
                    onCheckedChange={(checked) => {
                      if (!checked) disableWhisper()
                    }}
                  />
                  <Label htmlFor="whisper-active" className="cursor-pointer">
                    {whisperMode ? (
                      <span className="text-destructive font-semibold">🟢 Active - AIs following your orders</span>
                    ) : (
                      <span className="text-muted-foreground">Inactive</span>
                    )}
                  </Label>
                </div>
                <div className="flex gap-2">
                  {whisperMode && (
                    <Button variant="outline" size="sm" onClick={disableWhisper}>
                      Disable
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={saveWhisper}
                    disabled={!whisperInstructions.trim()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <Eye size={16} />
                    Activate Whisper
                  </Button>
                </div>
              </div>

              {whisperMode && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    💡 Active instruction: <span className="text-destructive font-medium">"{whisperInstructions}"</span>
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              <CurrencyDollar weight="fill" className="text-primary" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">$52,800</div>
            <Badge className="bg-accent/20 text-accent border-accent/40">
              <TrendUp size={12} />
              +28% vs last month
            </Badge>
          </Card>

          <Card className="p-6 border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <Users weight="fill" className="text-accent" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">1,756</div>
            <Badge className="bg-accent/20 text-accent border-accent/40">
              <TrendUp size={12} />
              +36% growth
            </Badge>
          </Card>

          <Card className="p-6 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Apps Generated</div>
              <Fire weight="fill" className="text-destructive" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">3,421</div>
            <Badge className="bg-destructive/20 text-destructive border-destructive/40">
              This month
            </Badge>
          </Card>

          <Card className="p-6 border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <Sparkle weight="fill" className="text-accent" size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">26%</div>
            <Badge className="bg-accent/20 text-accent border-accent/40">
              Free → Pro
            </Badge>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6 mb-8"
        >
          <Card className="p-6 border-primary/20">
            <h3 className="text-xl font-semibold mb-6">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="month" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.60 0.30 285)"
                  strokeWidth={3}
                  dot={{ fill: 'oklch(0.60 0.30 285)', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-accent/20">
            <h3 className="text-xl font-semibold mb-6">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={USER_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                <XAxis dataKey="month" stroke="oklch(0.60 0 0)" />
                <YAxis stroke="oklch(0.60 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="users" fill="oklch(0.80 0.18 195)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-6 mb-8"
        >
          <Card className="p-6 border-primary/20">
            <h3 className="text-xl font-semibold mb-6">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={PLAN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {PLAN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(0.25 0 0)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-accent/20">
            <h3 className="text-xl font-semibold mb-6">Top App Types</h3>
            <div className="space-y-4">
              {TOP_PROMPTS.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.prompt}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${(item.count / 234) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 border-primary/30 bg-primary/5 text-center">
            <Sparkle weight="fill" className="mx-auto mb-4 text-primary" size={48} />
            <h3 className="text-2xl font-bold mb-2">AI-Powered Forecasting</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Based on current trends, ApexForge is projected to hit <span className="text-primary font-semibold">$125K MRR</span> by Q4 2024,
              with <span className="text-accent font-semibold">5,000+ active users</span>.
            </p>
            <Button size="lg" onClick={generateAIReport} disabled={generating} className="glow-primary">
              <Sparkle weight="fill" size={20} />
              {generating ? 'Generating Report...' : 'Get Detailed AI Forecast'}
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
