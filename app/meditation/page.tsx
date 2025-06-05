"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SubscriptionService } from "@/lib/subscription"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Clock,
  Bell,
  Settings,
  Star,
  ChevronRight,
  BarChart,
  Square,
  VolumeX,
  Crown,
  Lock,
} from "lucide-react"

const chakras = [
  { name: "Crown", color: "#9400D3", position: "top-4" },
  { name: "Third Eye", color: "#4B0082", position: "top-12" },
  { name: "Throat", color: "#00BFFF", position: "top-20" },
  { name: "Heart", color: "#00FF00", position: "top-28" },
  { name: "Solar Plexus", color: "#FFD700", position: "top-36" },
  { name: "Sacral", color: "#FF8C00", position: "top-44" },
  { name: "Root", color: "#FF0000", position: "top-52" },
]

const meditationTypes = [
  {
    id: "third-eye-calm",
    name: "Third Eye Calm",
    description: "Activate your intuition and inner vision",
    duration: [7, 20, 30],
    waves: "Delta",
    benefits: ["Intuition", "Clarity", "Inner peace"],
    recommended: true,
    premium: false,
  },
  {
    id: "heart-center",
    name: "Heart Center Healing",
    description: "Open your heart to compassion and love",
    duration: [7, 20, 30],
    waves: "Alpha",
    benefits: ["Emotional healing", "Compassion", "Self-love"],
    recommended: false,
    premium: false,
  },
  {
    id: "root-grounding",
    name: "Root Grounding",
    description: "Connect to earth energy and feel secure",
    duration: [7, 20, 30],
    waves: "Theta",
    benefits: ["Stability", "Security", "Presence"],
    recommended: true,
    premium: false,
  },
  {
    id: "full-chakra-balance",
    name: "Full Chakra Balance",
    description: "Harmonize all energy centers",
    duration: [20, 30, 45],
    waves: "Mixed",
    benefits: ["Energy balance", "Alignment", "Wholeness"],
    recommended: false,
    premium: true,
  },
  {
    id: "astral-projection",
    name: "Astral Projection Journey",
    description: "Explore beyond physical boundaries",
    duration: [30, 45, 60],
    waves: "Theta",
    benefits: ["Spiritual travel", "Consciousness expansion", "Higher awareness"],
    recommended: false,
    premium: true,
  },
]

// Demo voice guidance based on tone
const voiceGuidance = {
  calm: [
    "Breathe deeply and let your body relax...",
    "Feel the gentle waves of peace washing over you...",
    "Allow your mind to settle like still water...",
    "Rest in this moment of perfect tranquility...",
  ],
  balanced: [
    "Focus on your breath as it flows naturally...",
    "Notice the balance between effort and ease...",
    "Find your center and maintain steady awareness...",
    "Embrace both strength and softness within...",
  ],
  motivational: [
    "You have the power to transform your energy!",
    "Feel your inner strength growing with each breath!",
    "You are capable of incredible spiritual growth!",
    "Channel this energy into positive change!",
  ],
}

export default function MeditationPage() {
  const router = useRouter()
  const subscriptionService = SubscriptionService.getInstance()
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [activeTab, setActiveTab] = useState("meditate")
  const [selectedMeditation, setSelectedMeditation] = useState(meditationTypes[0])
  const [selectedDuration, setSelectedDuration] = useState(7)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [heartRate, setHeartRate] = useState(72)
  const [voiceTone, setVoiceTone] = useState([5])
  const [volume, setVolume] = useState([70])
  const [soundscapeVolume, setSoundscapeVolume] = useState([50])
  const [notificationSchedule, setNotificationSchedule] = useState("daily")
  const [notificationTime, setNotificationTime] = useState("08:00")
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    lastSession: null,
  })
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    mood: "",
    experience: "",
    notes: "",
  })
  const [currentVoiceGuidance, setCurrentVoiceGuidance] = useState("")
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(subscriptionService.getCurrentPlanName())
  const [remainingUsage, setRemainingUsage] = useState(subscriptionService.getRemainingUsage())

  useEffect(() => {
    // Load session stats from localStorage
    const savedStats = localStorage.getItem("soulsync-meditation-stats")
    if (savedStats) {
      setSessionStats(JSON.parse(savedStats))
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("soulsync-meditation-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setVoiceTone([settings.voiceTone])
      setVolume([settings.volume])
      setSoundscapeVolume([settings.soundscapeVolume || 50])
      setNotificationSchedule(settings.notificationSchedule)
      setNotificationTime(settings.notificationTime)
      setReminderEnabled(settings.reminderEnabled)
    }

    // Update usage stats
    setRemainingUsage(subscriptionService.getRemainingUsage())

    return () => {
      stopAudio()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= selectedDuration * 60) {
            endSession()
            return selectedDuration * 60
          }
          return prev + 1
        })
        // Simulate heart rate variation
        setHeartRate((prev) => prev + (Math.random() - 0.5) * 4)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedDuration])

  // Audio functions
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  const startAudio = () => {
    if (!isAudioEnabled) return

    initAudio()
    const audioContext = audioContextRef.current!

    // Create oscillator for ambient sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set frequency based on meditation type
    const frequencies = {
      "third-eye-calm": 110, // Deep theta waves
      "heart-center": 136.1, // Heart chakra frequency
      "root-grounding": 194.18, // Root chakra frequency
      "full-chakra-balance": 256, // Balanced frequency
      "astral-projection": 90, // Deep theta for astral work
    }

    oscillator.frequency.setValueAtTime(
      frequencies[selectedMeditation.id as keyof typeof frequencies] || 110,
      audioContext.currentTime,
    )
    oscillator.type = "sine"

    // Set volume based on soundscape slider
    gainNode.gain.setValueAtTime((soundscapeVolume[0] / 100) * 0.1, audioContext.currentTime)

    oscillator.start()

    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode

    // Start voice guidance
    startVoiceGuidance()
  }

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
    }
    if (gainNodeRef.current) {
      gainNodeRef.current = null
    }
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current)
      voiceTimerRef.current = null
    }
    setCurrentVoiceGuidance("")
  }

  const updateAudioVolume = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime((soundscapeVolume[0] / 100) * 0.1, audioContextRef.current.currentTime)
    }
  }

  const startVoiceGuidance = () => {
    const getVoiceType = () => {
      if (voiceTone[0] <= 3) return "calm"
      if (voiceTone[0] >= 7) return "motivational"
      return "balanced"
    }

    const showGuidance = () => {
      const voiceType = getVoiceType()
      const guidance = voiceGuidance[voiceType]
      const randomGuidance = guidance[Math.floor(Math.random() * guidance.length)]
      setCurrentVoiceGuidance(randomGuidance)

      setTimeout(() => {
        setCurrentVoiceGuidance("")
      }, 4000)
    }

    // Show initial guidance
    setTimeout(showGuidance, 2000)

    // Set interval for periodic guidance
    voiceTimerRef.current = setInterval(showGuidance, 30000) // Every 30 seconds
  }

  useEffect(() => {
    updateAudioVolume()
  }, [soundscapeVolume])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const saveSettings = () => {
    const settings = {
      voiceTone: voiceTone[0],
      volume: volume[0],
      soundscapeVolume: soundscapeVolume[0],
      notificationSchedule,
      notificationTime,
      reminderEnabled,
    }
    localStorage.setItem("soulsync-meditation-settings", JSON.stringify(settings))
  }

  const startSession = () => {
    // Check if user can start a meditation session
    if (!subscriptionService.canUseMeditation()) {
      setShowUpgradeModal(true)
      return
    }

    setIsPlaying(true)
    setIsAudioEnabled(true)
    startAudio()
    setRemainingUsage(subscriptionService.getRemainingUsage())
  }

  const pauseSession = () => {
    setIsPlaying(false)
    stopAudio()
  }

  const resumeSession = () => {
    setIsPlaying(true)
    startAudio()
  }

  const endSession = () => {
    setIsPlaying(false)
    stopAudio()
    setShowFeedback(true)
  }

  const completeSession = () => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    // Update stats
    const actualDuration = Math.floor(progress / 60)
    const newStats = {
      totalSessions: sessionStats.totalSessions + 1,
      totalMinutes: sessionStats.totalMinutes + actualDuration,
      currentStreak: sessionStats.lastSession === today ? sessionStats.currentStreak : sessionStats.currentStreak + 1,
      lastSession: today,
    }

    setSessionStats(newStats)
    localStorage.setItem("soulsync-meditation-stats", JSON.stringify(newStats))

    // Save feedback to journal
    if (feedbackData.rating > 0) {
      const journalEntries = JSON.parse(localStorage.getItem("soulsync-journal") || "[]")
      const newEntry = {
        id: Date.now(),
        date: now.toISOString(),
        content:
          feedbackData.notes ||
          `Completed a ${actualDuration}-minute ${selectedMeditation.name} meditation. Feeling ${feedbackData.mood}.`,
        emotions: [feedbackData.mood || "peaceful", "centered"],
        rating: feedbackData.rating,
        type: "meditation",
        meditationType: selectedMeditation.name,
        duration: actualDuration,
        experience: feedbackData.experience,
        voiceTone: voiceTone[0],
      }

      journalEntries.unshift(newEntry)
      localStorage.setItem("soulsync-journal", JSON.stringify(journalEntries))
    }

    // Reset state
    setShowFeedback(false)
    setProgress(0)
    setFeedbackData({ rating: 0, mood: "", experience: "", notes: "" })
    setCurrentVoiceGuidance("")
  }

  const handleMeditationSelect = (meditation: (typeof meditationTypes)[0]) => {
    if (meditation.premium && !subscriptionService.canUseMeditation()) {
      setShowUpgradeModal(true)
      return
    }
    setSelectedMeditation(meditation)
  }

  const currentPlanData = subscriptionService.getCurrentPlan()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Meditation</h1>
          <p className="text-white/60 font-sf-pro">Calm your mind, elevate your spirit</p>
        </div>

        {/* Usage Stats */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-spiritual-teal" />
                <span className="font-sf-pro">{currentPlanData.name}</span>
              </div>
              <Badge className="bg-spiritual-purple">
                {remainingUsage.meditation === -1 ? "Unlimited" : `${remainingUsage.meditation} left`}
              </Badge>
            </div>
            {remainingUsage.meditation !== -1 && remainingUsage.meditation <= 1 && (
              <div className="mt-2 text-sm text-spiritual-stress">
                Running low on sessions! Consider upgrading for unlimited access.
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="meditate" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="meditate">Meditate</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Meditation Tab */}
          <TabsContent value="meditate" className="space-y-4">
            {!isPlaying && !showFeedback && (
              <>
                {/* Meditation Selection */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-inter">Choose Your Practice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {meditationTypes.map((meditation) => (
                      <div
                        key={meditation.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                          selectedMeditation.id === meditation.id
                            ? "border-spiritual-purple bg-spiritual-purple/20"
                            : "border-white/20 hover:border-white/40"
                        } ${meditation.premium && currentPlanData.tier === "free" ? "opacity-60" : ""}`}
                        onClick={() => handleMeditationSelect(meditation)}
                      >
                        {meditation.premium && currentPlanData.tier === "free" && (
                          <div className="absolute top-2 right-2">
                            <Lock className="w-4 h-4 text-spiritual-stress" />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-sf-pro font-bold">{meditation.name}</h3>
                          <div className="flex gap-2">
                            {meditation.recommended && <Badge className="bg-spiritual-teal">Recommended</Badge>}
                            {meditation.premium && <Badge className="bg-spiritual-purple">Premium</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{meditation.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {meditation.benefits.map((benefit) => (
                            <Badge key={benefit} variant="outline" className="text-xs border-white/20 text-white/60">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Duration Selection */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-inter">Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedDuration.toString()}
                      onValueChange={(value) => setSelectedDuration(Number.parseInt(value))}
                      className="flex gap-3"
                    >
                      {selectedMeditation.duration.map((mins) => (
                        <div key={mins} className="flex-1">
                          <RadioGroupItem value={mins.toString()} id={`duration-${mins}`} className="peer sr-only" />
                          <Label
                            htmlFor={`duration-${mins}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-white/20 bg-white/5 p-4 hover:bg-white/10 hover:border-white/30 peer-data-[state=checked]:border-spiritual-purple peer-data-[state=checked]:bg-spiritual-purple/20 cursor-pointer"
                          >
                            <Clock className="mb-2 h-6 w-6" />
                            <span className="font-bold">{mins} min</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                      onClick={startSession}
                      disabled={remainingUsage.meditation === 0}
                    >
                      {remainingUsage.meditation === 0 ? "No Sessions Left" : "Begin Session"}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}

            {isPlaying && (
              <>
                {/* Session Header */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-4 text-center">
                    <h2 className="text-xl font-inter font-bold text-white mb-1">{selectedMeditation.name}</h2>
                    <p className="text-white/60 font-sf-pro">
                      {selectedMeditation.waves} waves • {selectedDuration} minutes
                    </p>
                  </CardContent>
                </Card>

                {/* Voice Guidance Display */}
                {currentVoiceGuidance && (
                  <Card className="bg-spiritual-purple/20 backdrop-blur-lg border-spiritual-purple/30 text-white">
                    <CardContent className="p-4 text-center">
                      <p className="text-spiritual-purple font-sf-pro italic">"{currentVoiceGuidance}"</p>
                    </CardContent>
                  </Card>
                )}

                {/* Chakra Visualization */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-8">
                    <div className="relative h-64 flex justify-center">
                      <div className="relative">
                        {chakras.map((chakra, index) => (
                          <div
                            key={chakra.name}
                            className={`absolute left-1/2 transform -translate-x-1/2 ${chakra.position}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full chakra-glow animate-chakra-pulse`}
                              style={{
                                backgroundColor: chakra.color,
                                animationDelay: `${index * 0.2}s`,
                              }}
                            />
                          </div>
                        ))}
                        {/* Central figure outline */}
                        <div className="w-16 h-60 border-2 border-white/20 rounded-full relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-white/20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Biometric Overlay */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="font-sf-pro">Heart Rate</span>
                      </div>
                      <Badge variant="outline" className="border-red-400 text-red-400">
                        {Math.round(heartRate)} BPM
                      </Badge>
                    </div>
                    <div className="mt-2 h-8 bg-black/20 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-pink-400 animate-pulse"
                        style={{ width: "60%" }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between text-sm font-sf-pro">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(selectedDuration * 60)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-spiritual-purple to-spiritual-teal h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(progress / (selectedDuration * 60)) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-4 space-y-6">
                    <div className="flex items-center justify-center gap-6">
                      <Button variant="ghost" size="icon" className="text-white/60">
                        <SkipBack className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal"
                        onClick={isPlaying ? pauseSession : resumeSession}
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white/60">
                        <SkipForward className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Stop Session Button */}
                    <Button
                      variant="outline"
                      className="w-full border-red-400 text-red-400 hover:bg-red-400/10"
                      onClick={endSession}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Session
                    </Button>

                    {/* Voice Tone Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-sf-pro">Voice Tone</span>
                        <span className="text-xs text-white/60">
                          {voiceTone[0] <= 3 ? "🧘 Calm" : voiceTone[0] >= 7 ? "💪 Motivational" : "⚖️ Balanced"}
                        </span>
                      </div>
                      <Slider
                        value={voiceTone}
                        onValueChange={setVoiceTone}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Soundscape Volume */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {soundscapeVolume[0] === 0 ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                          <span className="text-sm font-sf-pro">Soundscape</span>
                        </div>
                        <span className="text-xs text-white/60">{soundscapeVolume[0]}%</span>
                      </div>
                      <Slider
                        value={soundscapeVolume}
                        onValueChange={setSoundscapeVolume}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Enhanced Feedback Form */}
            {showFeedback && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter">Session Complete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <h3 className="text-xl font-inter font-bold text-spiritual-purple mb-1">
                      {Math.floor(progress / 60)} Minute Session Complete
                    </h3>
                    <p className="text-white/70 font-sf-pro">How was your meditation experience?</p>
                  </div>

                  {/* Overall Rating */}
                  <div className="space-y-2">
                    <Label className="text-sm font-sf-pro">Overall Experience</Label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFeedbackData({ ...feedbackData, rating })}
                          className={`p-2 rounded-full transition-all ${
                            feedbackData.rating >= rating ? "text-yellow-400" : "text-white/30"
                          }`}
                        >
                          <Star className="w-8 h-8" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-sf-pro">How do you feel now?</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["peaceful", "energized", "centered", "relaxed", "focused", "grateful"].map((mood) => (
                        <Button
                          key={mood}
                          variant={feedbackData.mood === mood ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFeedbackData({ ...feedbackData, mood })}
                          className={
                            feedbackData.mood === mood
                              ? "bg-spiritual-purple hover:bg-spiritual-purple/80"
                              : "border-white/20 text-white hover:bg-white/10"
                          }
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Experience Quality */}
                  <div className="space-y-2">
                    <Label className="text-sm font-sf-pro">Session Quality</Label>
                    <RadioGroup
                      value={feedbackData.experience}
                      onValueChange={(value) => setFeedbackData({ ...feedbackData, experience: value })}
                    >
                      {[
                        { value: "deep", label: "Deep and immersive" },
                        { value: "good", label: "Good focus" },
                        { value: "distracted", label: "Somewhat distracted" },
                        { value: "difficult", label: "Difficult to focus" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="text-sm font-sf-pro">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-sf-pro">Additional Notes (Optional)</Label>
                    <Textarea
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
                      rows={3}
                      placeholder="Share any insights, feelings, or experiences..."
                      value={feedbackData.notes}
                      onChange={(e) => setFeedbackData({ ...feedbackData, notes: e.target.value })}
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                    onClick={completeSession}
                    disabled={feedbackData.rating === 0}
                  >
                    Save Feedback & Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-inter flex items-center gap-2">
                  <Bell className="w-5 h-5 text-spiritual-teal" />
                  Meditation Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminder-toggle" className="font-sf-pro">
                    Enable Reminders
                  </Label>
                  <Switch id="reminder-toggle" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule" className="font-sf-pro">
                    Reminder Schedule
                  </Label>
                  <Select
                    value={notificationSchedule}
                    onValueChange={setNotificationSchedule}
                    disabled={!reminderEnabled}
                  >
                    <SelectTrigger id="schedule" className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      <SelectItem value="weekends">Weekends Only</SelectItem>
                      <SelectItem value="random">Random (2-3 times/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="font-sf-pro">
                    Preferred Time
                  </Label>
                  <input
                    id="time"
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="w-full p-2 rounded-md bg-white/5 border border-white/20 text-white"
                    disabled={!reminderEnabled || notificationSchedule === "random"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-inter flex items-center gap-2">
                  <Settings className="w-5 h-5 text-spiritual-purple" />
                  Default Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-sf-pro">Default Voice Tone</Label>
                    <span className="text-xs text-white/60">
                      {voiceTone[0] <= 3 ? "🧘 Calm" : voiceTone[0] >= 7 ? "💪 Motivational" : "⚖️ Balanced"}
                    </span>
                  </div>
                  <Slider value={voiceTone} onValueChange={setVoiceTone} max={10} min={1} step={1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-sf-pro">Default Soundscape Volume</Label>
                    <span className="text-xs text-white/60">{soundscapeVolume[0]}%</span>
                  </div>
                  <Slider
                    value={soundscapeVolume}
                    onValueChange={setSoundscapeVolume}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-spiritual-purple hover:bg-spiritual-purple/80" onClick={saveSettings}>
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-inter flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-spiritual-teal" />
                  Meditation Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-white/70 mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-spiritual-purple">{sessionStats.totalSessions}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-white/70 mb-1">Total Minutes</p>
                    <p className="text-2xl font-bold text-spiritual-teal">{sessionStats.totalMinutes}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-sf-pro">Current Streak</p>
                    <Badge className="bg-spiritual-purple">{sessionStats.currentStreak} days</Badge>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          i < sessionStats.currentStreak ? "bg-spiritual-purple" : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70 mb-1">Last Session</p>
                  <p className="font-sf-pro">
                    {sessionStats.lastSession
                      ? new Date(sessionStats.lastSession).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })
                      : "No sessions yet"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push("/journal")}
                >
                  View Meditation Journal Entries
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="meditation"
          currentPlan={currentPlan}
        />
      </div>
    </div>
  )
}
