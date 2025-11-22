import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Sparkle, TrendUp, TrendDown, Brain, ChartLine, DownloadSimple, FileCsv, FilePdf } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts'

interface ForecastData {
  month: string
  historical: number | null
  predicted: number | null
  optimistic: number | null
  pessimistic: number | null
}

const INITIAL_DATA: ForecastData[] = [
  { month: 'Jan', historical: 12400, predicted: null, optimistic: null, pessimistic: null },
  { month: 'Feb', historical: 18900, predicted: null, optimistic: null, pessimistic: null },
  { month: 'Mar', historical: 25300, predicted: null, optimistic: null, pessimistic: null },
  { month: 'Apr', historical: 32100, predicted: null, optimistic: null, pessimistic: null },
  { month: 'May', historical: 41200, predicted: null, optimistic: null, pessimistic: null },
  { month: 'Jun', historical: 52800, predicted: null, optimistic: null, pessimistic: null },
  { month: 'Jul', historical: null, predicted: 65200, optimistic: 78500, pessimistic: 55800 },
  { month: 'Aug', historical: null, predicted: 78900, optimistic: 95200, pessimistic: 67300 },
  { month: 'Sep', historical: null, predicted: 94600, optimistic: 115800, pessimistic: 80700 },
  { month: 'Oct', historical: null, predicted: 112300, optimistic: 138400, pessimistic: 95800 },
  { month: 'Nov', historical: null, predicted: 131800, optimistic: 164500, pessimistic: 112500 },
  { month: 'Dec', historical: null, predicted: 153400, optimistic: 194300, pessimistic: 130900 },
]

export function RevenueForecast() {
  const [data, setData] = useState<ForecastData[]>(INITIAL_DATA)
  const [predicting, setPredicting] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  const generateAIPrediction = async () => {
    setPredicting(true)
    toast.info('🤖 AI analyzing revenue patterns...', { duration: 2000 })

    await new Promise((resolve) => setTimeout(resolve, 2500))

    setShowPrediction(true)
    setAiInsights([
      'Strong upward trajectory detected with 28% average monthly growth',
      'Predicted to reach $153K by December with current momentum',
      'Optimistic scenario assumes 15% increase in conversion rates',
      'Key growth driver: Pro plan adoption increasing by 32%',
      'Recommendation: Focus marketing on enterprise customers in Q4',
    ])

    setPredicting(false)
    toast.success('✨ AI forecast complete!', {
      description: 'Revenue predictions generated with 89% confidence',
      duration: 4000,
    })
  }

  const lastHistorical = data.find((d) => d.historical !== null && d.predicted === null)
  const firstPrediction = data.find((d) => d.predicted !== null)
  const lastPrediction = data[data.length - 1]

  const growthRate =
    lastHistorical && firstPrediction && firstPrediction.predicted
      ? (((firstPrediction.predicted - lastHistorical.historical!) / lastHistorical.historical!) * 100).toFixed(1)
      : 0

  const exportToCSV = () => {
    const headers = ['Month', 'Historical', 'Predicted', 'Optimistic', 'Pessimistic']
    const csvData = data.map((row) => [
      row.month,
      row.historical ?? '',
      row.predicted ?? '',
      row.optimistic ?? '',
      row.pessimistic ?? '',
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
      '',
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Historical Revenue: $${data.reduce((sum, d) => sum + (d.historical || 0), 0).toLocaleString()}`,
      `Total Predicted Revenue: $${data.reduce((sum, d) => sum + (d.predicted || 0), 0).toLocaleString()}`,
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `revenue-forecast-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('CSV exported successfully!', {
      description: 'Revenue forecast data downloaded',
    })
  }

  const exportToPDF = () => {
    const pdfWindow = window.open('', '_blank')
    if (!pdfWindow) {
      toast.error('Please allow popups to download PDF')
      return
    }

    const totalHistorical = data.reduce((sum, d) => sum + (d.historical || 0), 0)
    const totalPredicted = data.reduce((sum, d) => sum + (d.predicted || 0), 0)

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Revenue Forecast Report</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      background: white;
      color: #000;
    }
    h1 {
      color: #6B46C1;
      margin-bottom: 10px;
    }
    .meta {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
    }
    .summary-card h3 {
      font-size: 12px;
      color: #666;
      margin: 0 0 8px 0;
      text-transform: uppercase;
    }
    .summary-card .value {
      font-size: 28px;
      font-weight: bold;
      color: #6B46C1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #E5E7EB;
    }
    th {
      background: #F9FAFB;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #F9FAFB;
    }
    .insights {
      background: #F3F4F6;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .insights h2 {
      margin-top: 0;
      color: #374151;
    }
    .insight-item {
      margin-bottom: 12px;
      padding-left: 20px;
      position: relative;
    }
    .insight-item:before {
      content: "●";
      position: absolute;
      left: 0;
      color: #6B46C1;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>Revenue Forecast Report</h1>
  <div class="meta">Generated on ${new Date().toLocaleString()}</div>
  
  <div class="summary">
    <div class="summary-card">
      <h3>Current MRR</h3>
      <div class="value">$${lastHistorical?.historical ? (lastHistorical.historical / 1000).toFixed(1) : 0}K</div>
    </div>
    <div class="summary-card">
      <h3>Predicted December</h3>
      <div class="value">$${lastPrediction?.predicted ? (lastPrediction.predicted / 1000).toFixed(1) : 0}K</div>
    </div>
    <div class="summary-card">
      <h3>Growth Rate</h3>
      <div class="value">+${growthRate}%</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Month</th>
        <th>Historical Revenue</th>
        <th>Predicted Revenue</th>
        <th>Optimistic Scenario</th>
        <th>Pessimistic Scenario</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row) => `
        <tr>
          <td><strong>${row.month}</strong></td>
          <td>${row.historical ? '$' + row.historical.toLocaleString() : '-'}</td>
          <td>${row.predicted ? '$' + row.predicted.toLocaleString() : '-'}</td>
          <td>${row.optimistic ? '$' + row.optimistic.toLocaleString() : '-'}</td>
          <td>${row.pessimistic ? '$' + row.pessimistic.toLocaleString() : '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  ${
    aiInsights.length > 0
      ? `
  <div class="insights">
    <h2>AI Insights & Recommendations</h2>
    ${aiInsights.map((insight) => `<div class="insight-item">${insight}</div>`).join('')}
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #D1D5DB;">
      <strong>Confidence Score:</strong> 89% based on historical data, market trends, and behavioral analysis
    </div>
  </div>
  `
      : ''
  }

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
    `

    pdfWindow.document.write(pdfContent)
    pdfWindow.document.close()
    
    toast.success('PDF export opened!', {
      description: 'Use your browser print dialog to save as PDF',
    })
  }

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Brain weight="fill" className="text-primary" size={28} />
            AI Revenue Forecasting
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            6-month predictive analysis with confidence intervals
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <DownloadSimple size={16} />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                <FileCsv size={16} className="text-accent" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="gap-2">
                <FilePdf size={16} className="text-destructive" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={generateAIPrediction} disabled={predicting} className="glow-primary">
            <Sparkle weight="fill" size={16} />
            {predicting ? 'Analyzing...' : 'Generate AI Forecast'}
          </Button>
        </div>
      </div>

      {showPrediction && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Current MRR</div>
            <div className="text-2xl font-bold text-accent">
              ${lastHistorical?.historical ? (lastHistorical.historical / 1000).toFixed(1) : 0}K
            </div>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Predicted Dec</div>
            <div className="text-2xl font-bold text-primary">
              ${lastPrediction?.predicted ? (lastPrediction.predicted / 1000).toFixed(1) : 0}K
            </div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendUp size={12} />
              Growth Rate
            </div>
            <div className="text-2xl font-bold text-foreground">+{growthRate}%</div>
          </div>
        </motion.div>
      )}

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.80 0.18 195)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.80 0.18 195)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.60 0.30 285)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="oklch(0.60 0.30 285)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Legend />
            <Area
              type="monotone"
              dataKey="historical"
              stroke="oklch(0.80 0.18 195)"
              fill="url(#historicalGradient)"
              strokeWidth={3}
              name="Historical"
            />
            {showPrediction && (
              <>
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="oklch(0.60 0.30 285)"
                  fill="url(#predictedGradient)"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="AI Predicted"
                />
                <Line
                  type="monotone"
                  dataKey="optimistic"
                  stroke="oklch(0.80 0.18 195)"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Optimistic"
                />
                <Line
                  type="monotone"
                  dataKey="pessimistic"
                  stroke="oklch(0.60 0.28 340)"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Pessimistic"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showPrediction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain weight="fill" className="text-primary" size={20} />
              <h4 className="font-semibold">AI Insights & Recommendations</h4>
            </div>
            <div className="space-y-2">
              {aiInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChartLine weight="bold" className="text-primary" size={14} />
                  </div>
                  <p className="text-sm text-foreground">{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">Confidence Score</div>
                <p className="text-xs text-muted-foreground">
                  Based on historical data, market trends, and behavioral analysis
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">89%</Badge>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}
