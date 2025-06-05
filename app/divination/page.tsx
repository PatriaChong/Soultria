"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SubscriptionService } from "@/lib/subscription"
import { iChingHexagrams, zodiacSigns } from "@/lib/divination-data"
import {
  generateTarotReading,
  generateIChingReading,
  generateBaziReading,
  generateAstrologyReading,
  generateNumerologyReading,
  generatePalmReading,
  generateFaceReading,
  generateCombinedReading,
} from "../actions/divination-actions"
import {
  Sparkles,
  Star,
  XIcon as Yin,
  Hand,
  User,
  Calculator,
  Globe,
  Camera,
  ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  RotateCcw,
  Combine,
  Crown,
  ChevronRight,
  Eye,
} from "lucide-react"

const divinationSystems = [
  {
    id: "tarot",
    name: "Tarot Reading",
    origin: "European",
    icon: Star,
    description: "Ancient wisdom for decision guidance",
    color: "text-spiritual-purple",
    purpose: "Decision guidance, spiritual insight",
    premium: false,
  },
  {
    id: "iching",
    name: "I Ching (易经)",
    origin: "Chinese",
    icon: Yin,
    description: "Book of Changes for life guidance",
    color: "text-spiritual-teal",
    purpose: "Decision guidance, timing, natural flow",
    premium: false,
  },
  {
    id: "bazi",
    name: "Bazi (八字)",
    origin: "Chinese",
    icon: Calendar,
    description: "Four Pillars of Destiny",
    color: "text-yellow-400",
    purpose: "Life trends, personality, 10-year cycles",
    premium: false, // Unlocked for testing
  },
  {
    id: "astrology",
    name: "Western Astrology",
    origin: "Western",
    icon: Globe,
    description: "Soul blueprint and psychological map",
    color: "text-blue-400",
    purpose: "Soul blueprint, psychological patterns",
    premium: false, // Unlocked for testing
  },
  {
    id: "numerology",
    name: "Numerology",
    origin: "Universal",
    icon: Calculator,
    description: "Sacred numbers and life cycles",
    color: "text-green-400",
    purpose: "Personality, yearly cycles, life path",
    premium: false, // Unlocked for testing
  },
  {
    id: "palm",
    name: "Palm Reading",
    origin: "Universal",
    icon: Hand,
    description: "Life insights through palm lines",
    color: "text-orange-400",
    purpose: "Life path, personality, timing",
    premium: false, // Unlocked for testing
  },
  {
    id: "face",
    name: "Face Reading",
    origin: "Chinese",
    icon: Eye,
    description: "Mian Xiang physiognomy analysis",
    color: "text-pink-400",
    purpose: "Personality, life phases, fortune",
    premium: false, // Unlocked for testing
  },
]

const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity", element: "Air" },
  { name: "The Magician", meaning: "Manifestation, power, skill", element: "Air" },
  { name: "The High Priestess", meaning: "Intuition, unconscious, divine feminine", element: "Water" },
  { name: "The Empress", meaning: "Fertility, nurturing, abundance", element: "Earth" },
  { name: "The Emperor", meaning: "Authority, structure, control", element: "Fire" },
  { name: "The Hierophant", meaning: "Tradition, conformity, morality", element: "Earth" },
  { name: "The Lovers", meaning: "Love, harmony, relationships", element: "Air" },
  { name: "The Chariot", meaning: "Control, willpower, success", element: "Water" },
  { name: "Strength", meaning: "Strength, courage, patience", element: "Fire" },
  { name: "The Hermit", meaning: "Soul searching, seeking truth", element: "Earth" },
  { name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles", element: "Fire" },
  { name: "Justice", meaning: "Justice, fairness, truth", element: "Air" },
  { name: "The Hanged Man", meaning: "Suspension, restriction, letting go", element: "Water" },
  { name: "Death", meaning: "Endings, beginnings, change", element: "Water" },
  { name: "Temperance", meaning: "Balance, moderation, patience", element: "Fire" },
  { name: "The Devil", meaning: "Bondage, addiction, sexuality", element: "Earth" },
  { name: "The Tower", meaning: "Sudden change, upheaval, chaos", element: "Fire" },
  { name: "The Star", meaning: "Hope, spirituality, renewal", element: "Air" },
  { name: "The Moon", meaning: "Illusion, fear, anxiety", element: "Water" },
  { name: "The Sun", meaning: "Joy, success, celebration", element: "Fire" },
  { name: "Judgement", meaning: "Judgement, rebirth, inner calling", element: "Fire" },
  { name: "The World", meaning: "Completion, accomplishment, travel", element: "Earth" },
]

export default function DivinationPage() {
  const subscriptionService = SubscriptionService.getInstance()
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("select")
  const [question, setQuestion] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [readings, setReadings] = useState<any>({})
  const [combinedReading, setCombinedReading] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(subscriptionService.getCurrentPlan())

  // Form states for different systems
  const [tarotCard, setTarotCard] = useState<any>(null)
  const [iChingHexagram, setIChingHexagram] = useState<any>(null)
  const [birthData, setBirthData] = useState({
    date: "",
    time: "",
    place: "",
    name: "",
  })
  const [numerologyData, setNumerologyData] = useState({
    birthDate: "",
    fullName: "",
  })
  const [palmImage, setPalmImage] = useState<string | null>(null)
  const [faceImage, setFaceImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const faceInputRef = useRef<HTMLInputElement>(null)

  // Load user profile for enhanced readings
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("soulsync-onboarding")
    if (data) {
      setUserProfile(JSON.parse(data))
    }
  }, [])

  const handleSystemToggle = (systemId: string) => {
    setSelectedSystems((prev) => (prev.includes(systemId) ? prev.filter((id) => id !== systemId) : [...prev, systemId]))
  }

  const drawTarotCard = () => {
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)]
    setTarotCard(randomCard)
  }

  const castIChingHexagram = () => {
    const randomHexagram = iChingHexagrams[Math.floor(Math.random() * iChingHexagrams.length)]
    setIChingHexagram(randomHexagram)
  }

  const calculateNumerology = (birthDate: string, fullName: string) => {
    // Simple numerology calculations
    const lifePath = birthDate
      .replace(/\D/g, "")
      .split("")
      .reduce((sum, digit) => sum + Number.parseInt(digit), 0)
    const finalLifePath = lifePath > 9 ? Math.floor(lifePath / 10) + (lifePath % 10) : lifePath

    const expression = fullName
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("")
      .reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0)
    const finalExpression = expression > 9 ? Math.floor(expression / 10) + (expression % 10) : expression

    return {
      lifePath: finalLifePath > 9 ? Math.floor(finalLifePath / 10) + (finalLifePath % 10) : finalLifePath,
      expression: finalExpression > 9 ? Math.floor(finalExpression / 10) + (finalExpression % 10) : finalExpression,
      personalYear: new Date().getFullYear() % 9 || 9,
    }
  }

  const generateAllReadings = async () => {
    if (!question.trim()) {
      alert("Please enter a question for your reading")
      return
    }

    setIsGenerating(true)
    const newReadings: any = {}

    try {
      // Generate readings for each selected system
      for (const systemId of selectedSystems) {
        switch (systemId) {
          case "tarot":
            if (tarotCard) {
              const result = await generateTarotReading(tarotCard.name, question, userProfile)
              newReadings.tarot = { ...result, card: tarotCard }
            }
            break

          case "iching":
            if (iChingHexagram) {
              const result = await generateIChingReading(iChingHexagram, question, userProfile)
              newReadings.iching = { ...result, hexagram: iChingHexagram }
            }
            break

          case "bazi":
            if (birthData.date && birthData.time && birthData.place) {
              const result = await generateBaziReading(birthData, userProfile)
              newReadings.bazi = { ...result, birthData }
            }
            break

          case "astrology":
            if (birthData.date && birthData.time && birthData.place) {
              // Create birth chart data
              const birthChart = {
                ...birthData,
                sunSign: zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)],
                moonSign: zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)],
                risingSign: zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)],
              }
              const result = await generateAstrologyReading(birthChart, userProfile)
              newReadings.astrology = { ...result, birthChart }
            }
            break

          case "numerology":
            if (numerologyData.birthDate && numerologyData.fullName) {
              const numbers = calculateNumerology(numerologyData.birthDate, numerologyData.fullName)
              const result = await generateNumerologyReading(numbers, userProfile)
              newReadings.numerology = { ...result, numbers }
            }
            break

          case "palm":
            if (palmImage) {
              // Simulate palm analysis
              const palmData = {
                lifeLine: "Strong and clear",
                heartLine: "Deep with gentle curves",
                headLine: "Well-defined",
                fateLine: "Present with branches",
                handShape: "Earth hand",
              }
              const result = await generatePalmReading(palmData, userProfile)
              newReadings.palm = { ...result, palmData }
            }
            break

          case "face":
            if (faceImage) {
              // Simulate face analysis
              const faceData = {
                faceShape: "Oval",
                forehead: "Broad and clear",
                eyes: "Bright and focused",
                nose: "Well-proportioned",
                mouth: "Balanced",
                chin: "Strong",
              }
              const result = await generateFaceReading(faceData, userProfile)
              newReadings.face = { ...result, faceData }
            }
            break
        }
      }

      setReadings(newReadings)

      // Generate combined reading if multiple systems used
      if (selectedSystems.length > 1) {
        const combinedResult = await generateCombinedReading(selectedSystems, newReadings, question, userProfile)
        setCombinedReading(combinedResult.reading)
      }

      setActiveTab("results")
    } catch (error) {
      console.error("Error generating readings:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "palm" | "face") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "palm") {
          setPalmImage(result)
        } else {
          setFaceImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resetAll = () => {
    setSelectedSystems([])
    setActiveTab("select")
    setQuestion("")
    setReadings({})
    setCombinedReading(null)
    setTarotCard(null)
    setIChingHexagram(null)
    setBirthData({ date: "", time: "", place: "", name: "" })
    setNumerologyData({ birthDate: "", fullName: "" })
    setPalmImage(null)
    setFaceImage(null)
  }

  const canProceedToInput = selectedSystems.length > 0
  const canGenerateReading = () => {
    if (!question.trim()) return false

    return selectedSystems.every((systemId) => {
      switch (systemId) {
        case "tarot":
          return tarotCard !== null
        case "iching":
          return iChingHexagram !== null
        case "bazi":
        case "astrology":
          return birthData.date && birthData.time && birthData.place
        case "numerology":
          return numerologyData.birthDate && numerologyData.fullName
        case "palm":
          return palmImage !== null
        case "face":
          return faceImage !== null
        default:
          return true
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Universal Divination</h1>
          <p className="text-white/60 font-sf-pro">Eastern & Western wisdom combined</p>
        </div>

        {/* Subscription Status */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-spiritual-teal" />
                <span className="font-sf-pro">{currentPlan.name}</span>
              </div>
              <Badge className="bg-spiritual-teal">All Systems Unlocked</Badge>
            </div>
            <div className="mt-2 text-sm text-white/70">
              All divination systems are temporarily unlocked for testing and exploration
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="select">Select</TabsTrigger>
            <TabsTrigger value="input" disabled={!canProceedToInput}>
              Input
            </TabsTrigger>
            <TabsTrigger value="results" disabled={Object.keys(readings).length === 0}>
              Results
            </TabsTrigger>
          </TabsList>

          {/* System Selection */}
          <TabsContent value="select" className="space-y-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-inter flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-spiritual-teal" />
                  Choose Divination Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/80 font-sf-pro mb-4">
                  Select one or more systems for a comprehensive reading. Combining Eastern and Western approaches
                  provides deeper insights.
                </p>

                <div className="space-y-3">
                  {divinationSystems.map((system) => (
                    <div
                      key={system.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedSystems.includes(system.id)
                          ? "border-spiritual-purple bg-spiritual-purple/20"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => handleSystemToggle(system.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedSystems.includes(system.id)} readOnly />
                        <system.icon className={`w-6 h-6 ${system.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-sf-pro font-bold">{system.name}</h3>
                            <Badge variant="outline" className="text-xs border-white/30 text-white/70">
                              {system.origin}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 mb-1">{system.description}</p>
                          <p className="text-xs text-white/60">{system.purpose}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSystems.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-spiritual-teal/20 border border-spiritual-teal/30">
                    <p className="text-sm text-spiritual-teal font-bold">
                      {selectedSystems.length} system{selectedSystems.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      {selectedSystems.length > 1
                        ? "Multiple systems will provide cross-referenced insights for maximum accuracy"
                        : "Single system reading will provide focused guidance"}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-spiritual-purple hover:bg-spiritual-purple/80"
                  onClick={() => setActiveTab("input")}
                  disabled={!canProceedToInput}
                >
                  Continue to Input
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Input Phase */}
          <TabsContent value="input" className="space-y-4">
            {/* Question Input */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-inter">Your Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">What guidance do you seek?</Label>
                  <Textarea
                    id="question"
                    placeholder="e.g., What path should I take for my career growth? How can I improve my relationships?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  />
                </div>
                <p className="text-xs text-white/60">
                  Be specific and open-hearted. The more sincere your question, the more accurate the guidance.
                </p>
              </CardContent>
            </Card>

            {/* System-specific inputs */}
            {selectedSystems.includes("tarot") && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Star className="w-5 h-5 text-spiritual-purple" />
                    Tarot Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!tarotCard ? (
                    <div className="text-center space-y-4">
                      <div className="text-4xl">🔮</div>
                      <p className="text-white/80 font-sf-pro">Focus on your question and draw a card</p>
                      <Button onClick={drawTarotCard} className="bg-spiritual-purple hover:bg-spiritual-purple/80">
                        Draw Card
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-4xl">✨</div>
                      <h3 className="font-bold text-spiritual-purple text-lg">{tarotCard.name}</h3>
                      <p className="text-sm text-white/70">{tarotCard.meaning}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={drawTarotCard}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Draw Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedSystems.includes("iching") && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Yin className="w-5 h-5 text-spiritual-teal" />I Ching Hexagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!iChingHexagram ? (
                    <div className="text-center space-y-4">
                      <div className="text-4xl">☯️</div>
                      <p className="text-white/80 font-sf-pro">Cast the coins and receive your hexagram</p>
                      <Button onClick={castIChingHexagram} className="bg-spiritual-teal hover:bg-spiritual-teal/80">
                        Cast Hexagram
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{iChingHexagram.chinese}</div>
                      <h3 className="font-bold text-spiritual-teal text-lg">
                        {iChingHexagram.number}. {iChingHexagram.name}
                      </h3>
                      <p className="text-sm text-white/70">{iChingHexagram.meaning}</p>
                      <div className="flex justify-center gap-2">
                        {iChingHexagram.keywords.map((keyword: string) => (
                          <Badge key={keyword} variant="outline" className="text-xs border-spiritual-teal/50">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={castIChingHexagram}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Cast Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(selectedSystems.includes("bazi") || selectedSystems.includes("astrology")) && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    Birth Information
                    <div className="flex gap-1 ml-auto">
                      {selectedSystems.includes("bazi") && (
                        <Badge className="bg-yellow-400 text-black text-xs">Bazi</Badge>
                      )}
                      {selectedSystems.includes("astrology") && (
                        <Badge className="bg-blue-400 text-black text-xs">Astrology</Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birth-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input
                          id="birth-name"
                          placeholder="Your birth name"
                          value={birthData.name}
                          onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth-date">Birth Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input
                          id="birth-date"
                          type="date"
                          value={birthData.date}
                          onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                          className="pl-10 bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth-time">Birth Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input
                          id="birth-time"
                          type="time"
                          value={birthData.time}
                          onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                          className="pl-10 bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth-place">Birth Place</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input
                          id="birth-place"
                          placeholder="City, Country"
                          value={birthData.place}
                          onChange={(e) => setBirthData({ ...birthData, place: e.target.value })}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSystems.includes("numerology") && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-green-400" />
                    Numerology Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="num-name">Full Name (as on birth certificate)</Label>
                      <Input
                        id="num-name"
                        placeholder="Your complete birth name"
                        value={numerologyData.fullName}
                        onChange={(e) => setNumerologyData({ ...numerologyData, fullName: e.target.value })}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="num-date">Birth Date</Label>
                      <Input
                        id="num-date"
                        type="date"
                        value={numerologyData.birthDate}
                        onChange={(e) => setNumerologyData({ ...numerologyData, birthDate: e.target.value })}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  {numerologyData.birthDate && numerologyData.fullName && (
                    <div className="p-3 rounded-lg bg-green-400/20 border border-green-400/30">
                      <p className="text-sm text-green-400 font-bold mb-2">Quick Preview:</p>
                      {(() => {
                        const numbers = calculateNumerology(numerologyData.birthDate, numerologyData.fullName)
                        return (
                          <div className="text-xs space-y-1">
                            <p>Life Path: {numbers.lifePath}</p>
                            <p>Expression: {numbers.expression}</p>
                            <p>Personal Year: {numbers.personalYear}</p>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedSystems.includes("palm") && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Hand className="w-5 h-5 text-orange-400" />
                    Palm Reading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!palmImage ? (
                    <div className="text-center space-y-4">
                      <div className="text-4xl">🤚</div>
                      <p className="text-white/80 font-sf-pro">Upload a clear photo of your dominant hand</p>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-6">
                        <ImageIcon className="w-8 h-8 mx-auto text-white/40 mb-2" />
                        <p className="text-sm text-white/60 mb-3">Tap to select photo</p>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-orange-400 hover:bg-orange-500 text-black"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Palm Photo
                        </Button>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e, "palm")}
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-white/20">
                        <img src={palmImage || "/placeholder.svg"} alt="Palm" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-orange-400 font-bold">Palm photo uploaded</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPalmImage(null)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Change Photo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedSystems.includes("face") && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Eye className="w-5 h-5 text-pink-400" />
                    Face Reading (面相)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!faceImage ? (
                    <div className="text-center space-y-4">
                      <div className="text-4xl">👤</div>
                      <p className="text-white/80 font-sf-pro">Upload a clear front-facing photo</p>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-6">
                        <ImageIcon className="w-8 h-8 mx-auto text-white/40 mb-2" />
                        <p className="text-sm text-white/60 mb-3">Good lighting, neutral expression</p>
                        <Button
                          onClick={() => faceInputRef.current?.click()}
                          className="bg-pink-400 hover:bg-pink-500 text-black"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Face Photo
                        </Button>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={faceInputRef}
                        onChange={(e) => handleImageUpload(e, "face")}
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-white/20">
                        <img src={faceImage || "/placeholder.svg"} alt="Face" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-pink-400 font-bold">Face photo uploaded</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFaceImage(null)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Change Photo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Generate Reading Button */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-4">
                <Button
                  className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                  onClick={generateAllReadings}
                  disabled={!canGenerateReading() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Channeling Wisdom...
                    </>
                  ) : (
                    <>
                      <Combine className="w-4 h-4 mr-2" />
                      Generate Reading
                    </>
                  )}
                </Button>
                {!canGenerateReading() && !isGenerating && (
                  <p className="text-xs text-white/60 text-center mt-2">
                    Complete all required inputs to generate your reading
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results */}
          <TabsContent value="results" className="space-y-4">
            {combinedReading && selectedSystems.length > 1 && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter flex items-center gap-2">
                    <Combine className="w-5 h-5 text-spiritual-teal" />
                    Unified Reading
                    <Badge className="bg-spiritual-purple">{selectedSystems.length} Systems Combined</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-spiritual-purple/20 to-spiritual-teal/20 border border-spiritual-purple/30">
                    <h4 className="font-sf-pro font-bold text-spiritual-purple mb-2">Your Question:</h4>
                    <p className="text-sm italic">"{question}"</p>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {combinedReading.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-sm font-sf-pro mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Individual System Readings */}
            {Object.entries(readings).map(([systemId, reading]: [string, any]) => {
              const system = divinationSystems.find((s) => s.id === systemId)
              if (!system) return null

              return (
                <Card key={systemId} className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-inter flex items-center gap-2">
                      <system.icon className={`w-5 h-5 ${system.color}`} />
                      {system.name}
                      <Badge variant="outline" className="ml-auto border-white/30 text-white/70">
                        {system.origin}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* System-specific display data */}
                    {systemId === "tarot" && reading.card && (
                      <div className="p-3 rounded-lg bg-spiritual-purple/20 border border-spiritual-purple/30">
                        <h4 className="font-sf-pro font-bold text-spiritual-purple mb-1">{reading.card.name}</h4>
                        <p className="text-xs text-white/80">{reading.card.meaning}</p>
                      </div>
                    )}

                    {systemId === "iching" && reading.hexagram && (
                      <div className="p-3 rounded-lg bg-spiritual-teal/20 border border-spiritual-teal/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{reading.hexagram.chinese}</div>
                          <div>
                            <h4 className="font-sf-pro font-bold text-spiritual-teal">
                              {reading.hexagram.number}. {reading.hexagram.name}
                            </h4>
                            <p className="text-xs text-white/80">{reading.hexagram.meaning}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      {reading.reading.split("\n\n").map((paragraph: string, index: number) => (
                        <p key={index} className="text-sm font-sf-pro mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => setActiveTab("input")}
              >
                Modify Reading
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={resetAll}>
                New Reading
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="divination"
          currentPlan={subscriptionService.getCurrentPlanName()}
        />
      </div>
    </div>
  )
}
