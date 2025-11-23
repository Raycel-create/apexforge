import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { X, PaperPlaneRight, ChatCircleDots, Robot } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: number
}

export function LiveChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useKV<Message[]>('chatbot-messages', [])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!messages || messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "👋 Hi! I'm your 24/7 AI assistant. How can I help you today?",
        sender: 'agent',
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our pricing is flexible! We offer a free tier with 5 generations, and our paid plans start at $29/month for unlimited generations. Would you like to see the full pricing details?"
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
      return "ApexForge lets you build apps with 5 AI agents arguing in real-time! Features include: Live AI debates, Fusion Mode, instant deployment, FREE Idea Incubator, and more. What specific feature interests you?"
    }
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('start'))) {
      return "It's super simple! 1) Describe your app idea, 2) Watch 5 AI agents build it live, 3) Your app is instantly deployed with a domain. Takes less than 10 seconds! Want to try our FREE Idea Incubator?"
    }
    
    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('problem')) {
      return "I'm here to help 24/7! For complex issues, I can connect you with our technical team. What specific problem are you experiencing?"
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('model')) {
      return "We support multiple AI providers including OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini), Meta (Llama), Mistral, Cohere, xAI (Grok), and Hugging Face. You can use your own API keys or our credits!"
    }
    
    if (lowerMessage.includes('deploy') || lowerMessage.includes('domain') || lowerMessage.includes('hosting')) {
      return "Every app gets instant HTTPS deployment with a custom domain! No manual setup needed. Your app goes live in seconds with automatic SSL and global CDN."
    }
    
    if (lowerMessage.includes('free') || lowerMessage.includes('trial')) {
      return "Yes! Start with 5 FREE generations - no credit card required. Plus, our FREE Idea Incubator gives you 5 validated app ideas in 30 seconds. Ready to get started?"
    }

    try {
      const promptText = `You are a helpful 24/7 AI customer service agent for ApexForge, an AI app builder platform. The user said: "${userMessage}". Provide a helpful, friendly, and concise response (2-3 sentences max). Focus on being supportive and directing them to relevant features or support.`
      const prompt = window.spark.llmPrompt([promptText] as any)
      const response = await window.spark.llm(prompt, 'gpt-4o-mini')
      return response
    } catch (error) {
      return "I'm here to help! Could you tell me more about what you're looking for? I can assist with pricing, features, technical support, or getting started with ApexForge."
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    }

    setMessages((current) => [...(current || []), userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const response = await generateResponse(inputText)
      
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'agent',
          timestamp: Date.now(),
        }
        setMessages((current) => [...(current || []), agentMessage])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      setIsTyping(false)
      toast.error('Failed to get response. Please try again.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl glow-primary bg-primary hover:bg-primary/90 relative group"
            >
              <ChatCircleDots weight="fill" size={32} className="text-primary-foreground" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px]"
          >
            <Card className="border-primary/30 shadow-2xl overflow-hidden bg-card/95 backdrop-blur-xl">
              <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Robot weight="fill" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-foreground">24/7 AI Support</h3>
                    <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Online now
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-background/50">
                {(messages || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-background"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    size="icon"
                    className="glow-primary"
                  >
                    <PaperPlaneRight weight="fill" size={20} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by AI • Instant responses 24/7
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
