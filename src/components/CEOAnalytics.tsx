import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  ChartLine, 
  TrendUp, 
  Users, 
  ChatCircleDots, 
  Robot, 
  Calendar,
  Download,
  Sparkle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface AnalyticsReport {
  id: string
  generatedAt: number
  period: string
  metrics: {
    totalUsers: number
    activeUsers: number
    newSignups: number
    churnRate: number
    revenue: number
    complaints: number
    satisfaction: number
  }
  insights: string[]
  recommendations: string[]
}

interface UserComplaint {
  id: string
  userId: string
  message: string
  timestamp: number
  status: 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
}

export function CEOAnalytics() {
  const [reports, setReports] = useKV<AnalyticsReport[]>('ceo-analytics-reports', [])
  const [complaints, setComplaints] = useKV<UserComplaint[]>('user-complaints', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [nextReportTime, setNextReportTime] = useKV<number>('next-report-time', 0)

  useEffect(() => {
    const checkAndGenerateReport = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()
      
      if (currentHour === 12 && currentMinutes === 0 && Date.now() > (nextReportTime || 0)) {
        generateDailyReport()
      }
    }

    const interval = setInterval(checkAndGenerateReport, 60000)
    return () => clearInterval(interval)
  }, [nextReportTime])

  const generateDailyReport = async () => {
    setIsGenerating(true)
    try {
      const mockMetrics = {
        totalUsers: Math.floor(Math.random() * 10000) + 5000,
        activeUsers: Math.floor(Math.random() * 5000) + 2000,
        newSignups: Math.floor(Math.random() * 500) + 100,
        churnRate: parseFloat((Math.random() * 5).toFixed(2)),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        complaints: complaints?.filter(c => c.status === 'pending').length || 0,
        satisfaction: parseFloat((Math.random() * 2 + 8).toFixed(1)),
      }

      const complaintSummary = complaints?.slice(0, 5).map(c => 
        `- ${c.priority.toUpperCase()}: ${c.message.substring(0, 50)}...`
      ).join('\n') || 'No recent complaints'

      const promptText = `Generate a concise CEO analytics report with insights and recommendations based on these metrics:
      - Total Users: ${mockMetrics.totalUsers}
      - Active Users: ${mockMetrics.activeUsers}
      - New Signups: ${mockMetrics.newSignups}
      - Churn Rate: ${mockMetrics.churnRate}%
      - Revenue: $${mockMetrics.revenue}
      - Pending Complaints: ${mockMetrics.complaints}
      - Satisfaction Score: ${mockMetrics.satisfaction}/10
      
      Recent Complaints:
      ${complaintSummary}
      
      Provide 3 key insights and 3 actionable recommendations. Format as JSON with properties: insights (array of strings), recommendations (array of strings).`

      const prompt = window.spark.llmPrompt([promptText] as any)
      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const aiData = JSON.parse(response)

      const newReport: AnalyticsReport = {
        id: Date.now().toString(),
        generatedAt: Date.now(),
        period: '24 Hours',
        metrics: mockMetrics,
        insights: aiData.insights || [
          'User engagement is trending upward',
          'Revenue growth is stable',
          'Customer satisfaction remains high',
        ],
        recommendations: aiData.recommendations || [
          'Address pending complaints within 24 hours',
          'Focus on user retention programs',
          'Optimize onboarding for new signups',
        ],
      }

      setReports((current) => [newReport, ...(current || [])].slice(0, 30))
      setNextReportTime(Date.now() + 24 * 60 * 60 * 1000)

      toast.success('📊 Daily Report Generated', {
        description: 'AI analysis complete - check insights below',
      })
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const latestReport = reports?.[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI-Powered Analytics</h2>
          <p className="text-muted-foreground">
            Automated 24-hour reporting • Next report at 12:00 PM daily
          </p>
        </div>
        <Button
          onClick={generateDailyReport}
          disabled={isGenerating}
          className="glow-primary"
        >
          <Robot weight="fill" size={20} />
          {isGenerating ? 'Generating...' : 'Generate Report Now'}
        </Button>
      </div>

      {latestReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
                  <ChartLine weight="fill" className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Latest Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated {new Date(latestReport.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30">
                <Calendar weight="fill" size={14} />
                {latestReport.period}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <Users weight="fill" className="text-primary" size={20} />
                  <TrendUp className="text-accent" size={16} />
                </div>
                <p className="text-2xl font-bold">{latestReport.metrics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </Card>

              <Card className="p-4 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <Users weight="fill" className="text-accent" size={20} />
                  <TrendUp className="text-accent" size={16} />
                </div>
                <p className="text-2xl font-bold">{latestReport.metrics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </Card>

              <Card className="p-4 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <Sparkle weight="fill" className="text-accent" size={20} />
                  <TrendUp className="text-accent" size={16} />
                </div>
                <p className="text-2xl font-bold">${latestReport.metrics.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Revenue (24h)</p>
              </Card>

              <Card className="p-4 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <ChatCircleDots weight="fill" className="text-destructive" size={20} />
                </div>
                <p className="text-2xl font-bold">{latestReport.metrics.complaints}</p>
                <p className="text-xs text-muted-foreground">Pending Complaints</p>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Robot weight="fill" className="text-primary" size={18} />
                  AI Insights
                </h4>
                <div className="space-y-2">
                  {latestReport.insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkle weight="fill" className="text-accent" size={18} />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {latestReport.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                      <p className="text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {complaints && complaints.length > 0 && (
        <Card className="p-6 border-destructive/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
              <ChatCircleDots weight="fill" className="text-destructive" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">User Complaints</h3>
              <p className="text-sm text-muted-foreground">
                {complaints.filter(c => c.status === 'pending').length} pending
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {complaints.slice(0, 10).map((complaint) => (
              <div
                key={complaint.id}
                className="p-3 bg-muted/30 rounded-lg flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        complaint.priority === 'high'
                          ? 'destructive'
                          : complaint.priority === 'medium'
                          ? 'default'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {complaint.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(complaint.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{complaint.message}</p>
                </div>
                <Badge
                  variant={complaint.status === 'resolved' ? 'default' : 'outline'}
                  className="ml-2"
                >
                  {complaint.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {reports && reports.length > 1 && (
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Report History</h3>
            <Button size="sm" variant="outline">
              <Download size={16} />
              Export All
            </Button>
          </div>
          <div className="space-y-2">
            {reports.slice(1, 10).map((report) => (
              <div
                key={report.id}
                className="p-3 bg-muted/20 rounded-lg flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold">
                    Report - {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {report.metrics.totalUsers.toLocaleString()} users • 
                    ${report.metrics.revenue.toLocaleString()} revenue
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {report.period}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!latestReport && (
        <Card className="p-12 text-center border-dashed">
          <Robot weight="fill" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-bold mb-2">No Reports Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate your first AI-powered analytics report to get started
          </p>
          <Button onClick={generateDailyReport} disabled={isGenerating}>
            <Sparkle weight="fill" size={20} />
            Generate First Report
          </Button>
        </Card>
      )}
    </div>
  )
}
