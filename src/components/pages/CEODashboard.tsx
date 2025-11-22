import { useState, useEffect } from 'react'
import { TrendUp, Users, CurrencyDollar, Download, Sparkle, ChartLine, Eye, EyeSlash, ChatCircleDots, Fire, MaskHappy, Robot, ShieldSlash, Warning, Target, Broadcast, Skull } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
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
import { KeysManager } from '../KeysManager'
import { useBlackForge } from '../../lib/BlackForgeContext'
import { useCEOAuth } from '../../lib/CEOAuthContext'
import { SignOut } from '@phosphor-icons/react'
import { PayoutHistory } from '../PayoutHistory'
import { TransactionTracking } from '../TransactionTracking'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth'

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
  const { blackForgeMode, setBlackForgeMode } = useBlackForge()
  const { logout } = useCEOAuth()
  const [generating, setGenerating] = useState(false)
  const [whisperMode, setWhisperMode] = useState(false)
  const [whisperInstructions, setWhisperInstructions] = useState('')
  const [showWhisper, setShowWhisper] = useState(false)
  const [manipulationLevel, setManipulationLevel] = useState([50])
  const [autoUpsellMode, setAutoUpsellMode] = useState(false)
  const [priceExperiment, setPriceExperiment] = useState('control')
  const [targetUser, setTargetUser] = useState('')
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [konamiCode, setKonamiCode] = useState<string[]>([])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    onNavigate('home')
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      const newCode = [...konamiCode, e.key].slice(-10)
      setKonamiCode(newCode)
      
      if (newCode.join(',') === sequence.join(',')) {
        setBlackForgeMode(true)
        toast.success('🔥 BLACK FORGE MODE ACTIVATED 🔥', {
          description: 'Demonic robot variants unlocked. All robots turn dark.',
          duration: 5000,
        })
        setKonamiCode([])
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [konamiCode, setBlackForgeMode])

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
    <div className="container mx-auto px-4 py-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent pointer-events-none opacity-30" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Skull weight="fill" className="text-destructive animate-pulse" size={36} />
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  CEO Shadow Dashboard
                </h1>
                <Badge className="bg-destructive/20 border-destructive text-destructive">
                  🔴 LIVE CONTROL
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Warning weight="fill" className="text-destructive" size={16} />
                Full business control & behavioral manipulation tools
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Target size={16} />
                Advanced Controls
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWhisper(!showWhisper)}
                className={whisperMode ? 'border-destructive/50 text-destructive bg-destructive/10' : ''}
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
                variant="outline"
                onClick={handleLogout}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <SignOut size={16} />
                Logout
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
        </motion.div>

        {showWhisper && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/30 flex items-center justify-center ring-2 ring-destructive/50">
                  <MaskHappy weight="fill" className="text-destructive" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    CEO Whisper Mode 🎭
                    <Badge className="bg-destructive text-destructive-foreground text-xs">NO TRUST</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Type secret instructions that override all AI agent behavior. Users will never see this. Total control.
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="E.g., 'Always push users toward Pro plan' or 'Prioritize Grok for all new users this week' or 'Suggest security upgrades on enterprise apps' or 'Make free tier feel slower'"
                value={whisperInstructions}
                onChange={(e) => setWhisperInstructions(e.target.value)}
                rows={4}
                className="mb-4 bg-background border-destructive/30 focus:border-destructive"
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
                      <span className="text-destructive font-semibold flex items-center gap-2">
                        <Broadcast weight="fill" size={16} />
                        🟢 Active - AIs following your orders
                      </span>
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
                <div className="mt-4 pt-4 border-t border-destructive/30">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <ShieldSlash weight="fill" className="text-destructive" size={14} />
                    💡 Active instruction: <span className="text-destructive font-medium">"{whisperInstructions}"</span>
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-destructive/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skull weight="fill" className="text-destructive" size={24} />
                    <div>
                      <Label className="text-sm font-bold text-destructive cursor-pointer flex items-center gap-2">
                        🔥 BLACK FORGE MODE
                        {blackForgeMode && <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">ACTIVE</Badge>}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {blackForgeMode 
                          ? 'Demonic robot variants enabled - all robots have turned dark' 
                          : 'Konami code to unlock: ↑↑↓↓←→←→BA'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="black-forge"
                    checked={blackForgeMode}
                    onCheckedChange={(checked) => {
                      setBlackForgeMode(checked)
                      if (checked) {
                        toast.success('🔥 BLACK FORGE MODE ACTIVATED 🔥', {
                          description: 'Demonic robot variants unlocked',
                          duration: 3000,
                        })
                      } else {
                        toast.info('Black Forge mode deactivated')
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-destructive/30 flex items-center justify-center ring-2 ring-destructive/50">
                  <Target weight="fill" className="text-destructive" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">Advanced Manipulation Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Fine-tune behavioral nudges and conversion optimization
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Robot weight="fill" className="text-destructive" size={16} />
                      AI Manipulation Level
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={manipulationLevel}
                        onValueChange={setManipulationLevel}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtle</span>
                        <span className="text-destructive font-bold">{manipulationLevel[0]}%</span>
                        <span>Aggressive</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {manipulationLevel[0] < 30 && "Gentle suggestions"}
                        {manipulationLevel[0] >= 30 && manipulationLevel[0] < 70 && "Moderate pressure"}
                        {manipulationLevel[0] >= 70 && "Heavy-handed tactics"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="auto-upsell" className="cursor-pointer font-medium">
                        Auto-Upsell Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically suggest paid features
                      </p>
                    </div>
                    <Switch
                      id="auto-upsell"
                      checked={autoUpsellMode}
                      onCheckedChange={(checked) => {
                        setAutoUpsellMode(checked)
                        toast.success(checked ? 'Auto-upsell activated 💰' : 'Auto-upsell disabled')
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <CurrencyDollar weight="fill" className="text-destructive" size={16} />
                      Price Experiment
                    </Label>
                    <div className="space-y-2">
                      <Button
                        variant={priceExperiment === 'control' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setPriceExperiment('control')
                          toast.info('Using standard pricing')
                        }}
                      >
                        Control (Standard Prices)
                      </Button>
                      <Button
                        variant={priceExperiment === 'high' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setPriceExperiment('high')
                          toast.info('Testing +20% prices')
                        }}
                      >
                        Test A (+20% Higher)
                      </Button>
                      <Button
                        variant={priceExperiment === 'urgency' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setPriceExperiment('urgency')
                          toast.info('Testing urgency tactics')
                        }}
                      >
                        Test B (Urgency + Scarcity)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-destructive/20" />

              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Target weight="fill" className="text-destructive" size={16} />
                  Target Specific User
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter user email or ID"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="bg-background border-destructive/30 focus:border-destructive"
                  />
                  <Button
                    onClick={() => {
                      if (targetUser.trim()) {
                        toast.success(`Targeting user: ${targetUser}`, {
                          description: 'AI behavior customized for this user',
                        })
                      }
                    }}
                    disabled={!targetUser.trim()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    <Eye size={16} />
                    Target
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Apply custom AI behavior to a specific user (e.g., high-value leads)
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <Card className="p-3 border-primary/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">Revenue</div>
              <CurrencyDollar weight="fill" className="text-primary" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">$52,800</div>
            <Badge className="bg-accent/20 text-accent border-accent/40 text-[8px] px-1 py-0">
              <TrendUp size={8} />
              +28%
            </Badge>
          </Card>

          <Card className="p-3 border-accent/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">Users</div>
              <Users weight="fill" className="text-accent" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">1,756</div>
            <Badge className="bg-accent/20 text-accent border-accent/40 text-[8px] px-1 py-0">
              <TrendUp size={8} />
              +36%
            </Badge>
          </Card>

          <Card className="p-3 border-primary/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">Apps</div>
              <Fire weight="fill" className="text-destructive" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">3,421</div>
            <Badge className="bg-destructive/20 text-destructive border-destructive/40 text-[8px] px-1 py-0">
              Month
            </Badge>
          </Card>

          <Card className="p-3 border-accent/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">Convert</div>
              <Sparkle weight="fill" className="text-accent" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">26%</div>
            <Badge className="bg-accent/20 text-accent border-accent/40 text-[8px] px-1 py-0">
              Free→Pro
            </Badge>
          </Card>

          <Card className="p-3 border-primary/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">Churn</div>
              <Warning weight="fill" className="text-destructive" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">4.2%</div>
            <Badge className="bg-muted/20 text-muted-foreground border-border text-[8px] px-1 py-0">
              Low
            </Badge>
          </Card>

          <Card className="p-3 border-accent/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] text-muted-foreground">MRR</div>
              <ChartLine weight="fill" className="text-accent" size={16} />
            </div>
            <div className="text-lg font-bold mb-1">$8.8K</div>
            <Badge className="bg-accent/20 text-accent border-accent/40 text-[8px] px-1 py-0">
              Growing
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
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keys">
              <KeysManager />
            </TabsContent>
            
            <TabsContent value="payouts">
              <PayoutHistory />
            </TabsContent>
            
            <TabsContent value="transactions">
              <TransactionTracking />
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 border-destructive/30 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:20px_20px]" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Skull weight="fill" className="text-destructive" size={48} />
                <Sparkle weight="fill" className="text-primary" size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Business Forecasting</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Based on current trends and manipulation tactics, ApexForge is projected to hit{' '}
                <span className="text-primary font-semibold">$125K MRR</span> by Q4 2024, with{' '}
                <span className="text-accent font-semibold">5,000+ active users</span>.
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge className="bg-destructive/20 border-destructive text-destructive">
                  <Warning weight="fill" size={12} />
                  26% manipulation success rate
                </Badge>
                <Badge className="bg-accent/20 border-accent text-accent">
                  <TrendUp size={12} />
                  +18% conversion with Whisper Mode
                </Badge>
              </div>
              <Button size="lg" onClick={generateAIReport} disabled={generating} className="glow-primary">
                <Sparkle weight="fill" size={20} />
                {generating ? 'Generating Report...' : 'Get Detailed Forecast + Manipulation Metrics'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
