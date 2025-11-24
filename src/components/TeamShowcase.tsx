import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Brain, ShieldCheck, Lightning, Palette, Rocket, Code } from '@phosphor-icons/react'
import { useScreenSize } from '../hooks/use-mobile'

const aiTeam = [
  {
    name: 'GPT-4o',
    role: 'Lead Architect',
    icon: Brain,
    color: 'from-primary to-accent',
    description: 'Designs scalable architecture and makes strategic technical decisions',
    specialty: 'System Design'
  },
  {
    name: 'Claude',
    role: 'Security Expert',
    icon: ShieldCheck,
    color: 'from-primary to-accent',
    description: 'Ensures code security, reviews vulnerabilities, implements best practices',
    specialty: 'Security'
  },
  {
    name: 'Grok',
    role: 'Speed Optimizer',
    icon: Lightning,
    color: 'from-accent to-primary',
    description: 'Optimizes performance, reduces bundle size, enhances speed',
    specialty: 'Performance'
  },
  {
    name: 'Gemini',
    role: 'UI/UX Designer',
    icon: Palette,
    color: 'from-primary to-accent',
    description: 'Creates beautiful interfaces, perfect spacing, delightful interactions',
    specialty: 'Design'
  },
  {
    name: 'Llama',
    role: 'Backend Engineer',
    icon: Code,
    color: 'from-accent to-primary',
    description: 'Builds robust APIs, database schemas, server infrastructure',
    specialty: 'Backend'
  },
  {
    name: 'Mistral',
    role: 'DevOps Lead',
    icon: Rocket,
    color: 'from-primary to-accent',
    description: 'Handles deployment, CI/CD pipelines, cloud infrastructure',
    specialty: 'DevOps'
  }
]

export function TeamShowcase() {
  const { isMobile } = useScreenSize()

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 max-w-[1400px]">
      <div className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300">
            Meet Your AI Team
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              6 AI Experts
            </span>
            <br />
            Working Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each AI agent brings unique expertise, debating and collaborating in real-time to build your perfect application
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTeam.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/50 to-card hover:border-primary/50 transition-all group h-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <member.icon size={isMobile ? 24 : 28} weight="fill" className="text-white" />
                  </div>
                  <Badge variant="outline" className="border-border/50 text-xs">
                    {member.specialty}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                        className={`h-full bg-gradient-to-r ${member.color}`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">85%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <Card className="inline-block border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 p-6">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">All 6 AI agents debate in real-time</span>
            <br />
            You vote on their proposals • Winners auto-apply • Your app ships faster
          </p>
        </Card>
      </motion.div>
    </section>
  )
}
