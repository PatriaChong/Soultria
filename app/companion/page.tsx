"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SubscriptionService } from "@/lib/subscription"
import { Send, Moon, Bell, Crown, User } from "lucide-react"

const chatMessages = [
  {
    type: "companion",
    message:
      "Good evening, beautiful soul. I sense you're seeking clarity tonight. The full moon's energy is perfect for releasing what no longer serves you.",
    timestamp: "8:30 PM",
  },
  {
    type: "user",
    message: "How can I practice non-attachment?",
    timestamp: "8:32 PM",
  },
  {
    type: "companion",
    message:
      "Non-attachment is like being the sky - clouds pass through, but the sky remains unchanged. Start by observing your thoughts without judgment. When you feel attached to an outcome, breathe and remind yourself: 'I am not my thoughts, I am the awareness behind them.'",
    timestamp: "8:33 PM",
  },
]

export default function CompanionPage() {
  const subscriptionService = SubscriptionService.getInstance()
  const [messages, setMessages] = useState(chatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [remainingUsage, setRemainingUsage] = useState(subscriptionService.getRemainingUsage())
  const [canUseAIGuide, setCanUseAIGuide] = useState(true)

  const sendMessage = () => {
    if (!newMessage.trim()) return

    if (!canUseAIGuide) {
      setShowUpgradeModal(true)
      return
    }

    const userMessage = {
      type: "user" as const,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate companion response
    setTimeout(() => {
      const responses = [
        "Your question touches the depths of spiritual wisdom. Remember, every challenge is an opportunity for growth.",
        "I feel your energy shifting. Trust in your inner knowing - it will guide you to the answers you seek.",
        "The universe is conspiring to help you. Sometimes the path forward requires letting go of what we think we need.",
      ]

      const companionMessage = {
        type: "companion" as const,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, companionMessage])
    }, 1500)
  }

  useEffect(() => {
    setRemainingUsage(subscriptionService.getRemainingUsage())
    setCanUseAIGuide(subscriptionService.canUseAIGuide())
  }, [])

  const currentPlan = subscriptionService.getCurrentPlan()

  // Use the conversation and update remaining usage
  const useAIGuide = () => {
    subscriptionService.useAIGuide()
    setCanUseAIGuide(subscriptionService.canUseAIGuide())
    setRemainingUsage(subscriptionService.getRemainingUsage())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal flex items-center justify-center">
            <span className="text-2xl">🧘‍♀️</span>
          </div>
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Higher-Self Companion</h1>
          <div className="flex items-center justify-center gap-2">
            <Moon className="w-4 h-4 text-spiritual-teal" />
            <span className="text-white/60 font-sf-pro">Full Moon Energy</span>
          </div>
        </div>

        {/* Usage Stats */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-spiritual-teal" />
                <span className="font-sf-pro">{currentPlan.name}</span>
              </div>
              <Badge className="bg-spiritual-purple">
                {remainingUsage.aiGuide === -1 ? "Unlimited" : `${remainingUsage.aiGuide} left today`}
              </Badge>
            </div>
            {remainingUsage.aiGuide !== -1 && remainingUsage.aiGuide <= 1 && (
              <div className="mt-2 text-sm text-spiritual-stress">
                Running low on conversations! Consider upgrading for more daily chats.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proactive Notification */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-spiritual-teal mt-1" />
              <div className="flex-1">
                <p className="font-sf-pro font-bold text-spiritual-purple mb-1">Spiritual Insight</p>
                <p className="text-sm text-white/80">
                  Full moon tonight - perfect for release ritual. Your recent journal entries suggest you're ready to
                  let go of old patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Spiritual Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-spiritual-purple text-white"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <p className="text-sm font-sf-pro">{msg.message}</p>
                  <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder={remainingUsage.aiGuide === 0 ? "Daily limit reached" : "Ask your higher self..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                disabled={remainingUsage.aiGuide === 0}
              />
              <Button
                size="icon"
                onClick={() => {
                  sendMessage()
                  useAIGuide()
                }}
                className="bg-spiritual-purple hover:bg-spiritual-purple/80"
                disabled={remainingUsage.aiGuide === 0}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Quick Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "How do I find inner peace?",
              "What is my life purpose?",
              "How can I release fear?",
              "Guide me through forgiveness",
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 text-sm"
                onClick={() => {
                  setNewMessage(question)
                  useAIGuide()
                }}
                disabled={remainingUsage.aiGuide === 0}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Human Spiritual Advisor */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Connect with a Human Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-sf-pro font-bold">Human Spiritual Advisor</h3>
                <p className="text-sm text-white/70">
                  Get personalized guidance from certified spiritual practitioners
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">10-minute session</span>
                <Badge variant="outline" className="border-spiritual-purple text-spiritual-purple">
                  $20 value
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-spiritual-purple/20 border border-spiritual-purple/30">
                <p className="text-sm text-white/80">
                  <span className="font-bold text-spiritual-teal">Soulplus members get 2 free sessions!</span> Upgrade
                  now to connect with a real spiritual advisor for personalized guidance.
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                onClick={() => {
                  if (currentPlan.tier === "free") {
                    setShowUpgradeModal(true)
                  } else {
                    // For demo purposes, just show an alert
                    alert("This would open the spiritual advisor booking interface")
                  }
                }}
              >
                {currentPlan.tier === "free" ? "Upgrade to Connect" : "Book a Session"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="aiGuide"
          currentPlan={subscriptionService.getCurrentPlanName()}
        />
      </div>
    </div>
  )
}
