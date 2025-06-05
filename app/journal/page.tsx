"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SubscriptionService } from "@/lib/subscription"
import { Mic, MicOff, Sparkles, ArrowRight, Brain, Star, Crown, Lock, TrendingUp } from "lucide-react"

interface JournalEntry {
  id: number
  date: string
  content: string
  emotions: string[]
  type: "manual" | "meditation"
  meditationType?: string
  duration?: number
  rating?: number
  aiInsights?: string[]
}

export default function JournalPage() {
  const subscriptionService = SubscriptionService.getInstance()
  const [isRecording, setIsRecording] = useState(false)
  const [journalEntry, setJournalEntry] = useState("")
  const [detectedEmotions, setDetectedEmotions] = useState<string[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(subscriptionService.getCurrentPlan())

  const aiPrompt = "Your sleep suggests exhaustion - what's weighing on you?"
  const ritualSuggestion = "Try cord-cutting meditation"

  useEffect(() => {
    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem("soulsync-journal")
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recognition
      setTimeout(() => {
        setJournalEntry((prev) => prev + " I've been feeling overwhelmed lately...")
        setDetectedEmotions(["overwhelmed", "tired", "seeking clarity"])
      }, 2000)
    }
  }

  const generateAIInsights = (content: string, emotions: string[]): string[] => {
    if (!currentPlan.features.journalInsights) return []

    // Simulate AI insights based on content and emotions
    const insights = [
      "Your emotional patterns suggest a need for grounding practices",
      "Consider exploring the root cause of these overwhelming feelings",
      "Your energy seems scattered - try focusing meditation",
      "This emotional state often precedes breakthrough moments",
      "Your intuition is heightened during this emotional phase",
    ]

    // Return 2-3 relevant insights
    return insights.slice(0, Math.floor(Math.random() * 2) + 2)
  }

  const saveJournalEntry = () => {
    if (!journalEntry.trim()) return

    const aiInsights = generateAIInsights(journalEntry, detectedEmotions)

    const newEntry: JournalEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: journalEntry,
      emotions: detectedEmotions.length ? detectedEmotions : ["reflective"],
      type: "manual",
      aiInsights: aiInsights,
    }

    const updatedEntries = [newEntry, ...journalEntries]
    setJournalEntries(updatedEntries)
    localStorage.setItem("soulsync-journal", JSON.stringify(updatedEntries))

    setJournalEntry("")
    setDetectedEmotions([])
  }

  const handleInsightsAccess = () => {
    if (!currentPlan.features.journalInsights) {
      setShowUpgradeModal(true)
      return false
    }
    return true
  }

  const filteredEntries =
    activeTab === "all" ? journalEntries : journalEntries.filter((entry) => entry.type === activeTab)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  // Calculate emotional patterns for insights
  const getEmotionalPatterns = () => {
    const emotionCounts: Record<string, number> = {}
    journalEntries.forEach((entry) => {
      entry.emotions.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })
    })

    return Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Soul Journal</h1>
          <p className="text-white/60 font-sf-pro">Express your inner truth</p>
        </div>

        {/* Subscription Status */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-spiritual-teal" />
                <span className="font-sf-pro">{currentPlan.name}</span>
              </div>
              <Badge className={currentPlan.features.journalInsights ? "bg-spiritual-teal" : "bg-spiritual-stress"}>
                {currentPlan.features.journalInsights ? "AI Insights" : "Basic"}
              </Badge>
            </div>
            {!currentPlan.features.journalInsights && (
              <div className="mt-2 text-sm text-white/70">
                Upgrade to unlock AI-powered journal insights and emotional pattern analysis
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        {currentPlan.features.journalInsights && journalEntries.length > 0 && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-inter flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-spiritual-purple" />
                Emotional Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {getEmotionalPatterns().map(([emotion, count]) => (
                  <div key={emotion} className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-lg font-bold text-spiritual-teal">{count}</div>
                    <div className="text-xs text-white/70 capitalize">{emotion}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80 italic">
                "Your recent entries show a pattern of seeking clarity. This suggests you're in a phase of spiritual
                growth and self-discovery."
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Prompt */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-spiritual-teal" />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-spiritual-purple font-sf-pro italic mb-4">"{aiPrompt}"</p>
            <p className="text-sm text-white/70">
              Based on your biometric data, we sense you might benefit from deeper reflection.
            </p>
          </CardContent>
        </Card>

        {/* Journal Input */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Share what's in your heart..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
              />
              <Button
                size="icon"
                variant="ghost"
                className={`absolute bottom-2 right-2 ${isRecording ? "text-red-400 animate-pulse" : "text-white/60"}`}
                onClick={handleVoiceToggle}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>

            {/* Emotion Detection */}
            {detectedEmotions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-white/70 font-sf-pro">Detected emotions:</p>
                <div className="flex flex-wrap gap-2">
                  {detectedEmotions.map((emotion) => (
                    <Badge key={emotion} variant="outline" className="border-spiritual-teal text-spiritual-teal">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal"
              disabled={!journalEntry.trim()}
              onClick={saveJournalEntry}
            >
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {/* Ritual Suggestion */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-white/70 font-sf-pro">Suggested ritual:</p>
                <p className="font-sf-pro font-bold text-spiritual-purple">{ritualSuggestion}</p>
              </div>
              <Button size="icon" variant="ghost" className="text-spiritual-teal">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Journal Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="manual">Reflections</TabsTrigger>
                <TabsTrigger value="meditation">Meditation</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-3">
                {filteredEntries.length === 0 ? (
                  <div className="text-center p-4 text-white/60">
                    <p>No entries yet</p>
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60 font-sf-pro">{formatDate(entry.date)}</span>
                          {entry.type === "meditation" && (
                            <Badge
                              variant="outline"
                              className="text-xs border-spiritual-purple/50 text-spiritual-purple/70"
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              Meditation
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {entry.emotions.map((emotion) => (
                            <Badge
                              key={emotion}
                              variant="outline"
                              className="text-xs border-spiritual-teal/50 text-spiritual-teal/70"
                            >
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-white/80 font-sf-pro mb-2">{entry.content}</p>

                      {entry.type === "meditation" && entry.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < (entry.rating || 0) ? "text-yellow-400" : "text-white/20"}`}
                            />
                          ))}
                          <span className="text-xs text-white/60 ml-1">
                            {entry.meditationType} • {entry.duration} min
                          </span>
                        </div>
                      )}

                      {/* AI Insights */}
                      {entry.aiInsights && entry.aiInsights.length > 0 && (
                        <div className="mt-3 p-2 rounded-lg bg-spiritual-purple/20 border border-spiritual-purple/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-spiritual-purple" />
                            <span className="text-sm font-bold text-spiritual-purple">AI Insights</span>
                          </div>
                          <div className="space-y-1">
                            {entry.aiInsights.map((insight, index) => (
                              <p key={index} className="text-xs text-white/80 italic">
                                • {insight}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upgrade prompt for non-premium users */}
                      {!currentPlan.features.journalInsights && (
                        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10 relative">
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              className="bg-spiritual-purple hover:bg-spiritual-purple/80"
                              onClick={handleInsightsAccess}
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Unlock AI Insights
                            </Button>
                          </div>
                          <div className="opacity-30">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-spiritual-purple" />
                              <span className="text-sm font-bold text-spiritual-purple">AI Insights</span>
                            </div>
                            <p className="text-xs text-white/80 italic">• Your emotional patterns suggest...</p>
                            <p className="text-xs text-white/80 italic">• Consider exploring deeper...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="journal"
          currentPlan={subscriptionService.getCurrentPlanName()}
        />
      </div>
    </div>
  )
}
