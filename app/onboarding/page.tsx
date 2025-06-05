"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Smartphone, Watch, Activity, ChevronRight, User, Mail, Phone, SkipBackIcon as Skip } from "lucide-react"

// Spiritual assessment questions with elemental points
const spiritualQuestions = [
  {
    id: "meditation_experience",
    question: "How would you describe your meditation experience?",
    options: [
      { value: "beginner", label: "Complete beginner", points: { earth: 2, water: 1 } },
      { value: "occasional", label: "I've tried it a few times", points: { air: 1, water: 2 } },
      { value: "regular", label: "I meditate regularly", points: { air: 2, fire: 1 } },
      { value: "advanced", label: "Advanced practitioner", points: { fire: 2, air: 1 } },
    ],
  },
  {
    id: "stress_response",
    question: "When faced with stress, you typically:",
    options: [
      { value: "withdraw", label: "Withdraw and reflect internally", points: { water: 2, earth: 1 } },
      { value: "analyze", label: "Analyze and plan solutions", points: { air: 2, earth: 1 } },
      { value: "take_action", label: "Take immediate action", points: { fire: 2, air: 1 } },
      { value: "seek_support", label: "Seek support from others", points: { water: 1, earth: 2 } },
    ],
  },
  {
    id: "spiritual_practices",
    question: "Which spiritual practices resonate most with you?",
    options: [
      { value: "nature", label: "Nature connection & grounding", points: { earth: 3 } },
      { value: "energy", label: "Energy work & chakra healing", points: { fire: 2, air: 1 } },
      { value: "intuition", label: "Intuitive practices & divination", points: { water: 3 } },
      { value: "study", label: "Study of spiritual texts & philosophy", points: { air: 3 } },
    ],
  },
  {
    id: "life_goals",
    question: "Your primary spiritual goal is:",
    options: [
      { value: "peace", label: "Finding inner peace and calm", points: { water: 2, earth: 1 } },
      { value: "purpose", label: "Discovering life purpose", points: { fire: 2, air: 1 } },
      { value: "wisdom", label: "Gaining spiritual wisdom", points: { air: 2, water: 1 } },
      { value: "healing", label: "Healing and transformation", points: { earth: 2, water: 1 } },
    ],
  },
  {
    id: "energy_preference",
    question: "You feel most energized when:",
    options: [
      { value: "alone", label: "Spending time alone in nature", points: { earth: 2, water: 1 } },
      { value: "learning", label: "Learning something new", points: { air: 2, fire: 1 } },
      { value: "creating", label: "Creating or expressing yourself", points: { fire: 2, air: 1 } },
      { value: "connecting", label: "Connecting deeply with others", points: { water: 2, earth: 1 } },
    ],
  },
]

// Personality assessment questions with spirit animal and aura color mappings
const personalityQuestions = [
  {
    id: "decision_making",
    question: "When making important decisions, you rely on:",
    options: [
      { value: "intuition", label: "Gut feeling and intuition", animal: "wolf", aura: "indigo" },
      { value: "analysis", label: "Careful analysis and research", animal: "owl", aura: "violet" },
      { value: "heart", label: "What feels right in your heart", animal: "butterfly", aura: "green" },
      { value: "experience", label: "Past experience and wisdom", animal: "turtle", aura: "blue" },
    ],
  },
  {
    id: "challenges",
    question: "When facing challenges, you:",
    options: [
      { value: "persist", label: "Keep pushing through with determination", animal: "dragon", aura: "red" },
      { value: "adapt", label: "Adapt and find creative solutions", animal: "butterfly", aura: "orange" },
      { value: "seek_perspective", label: "Step back for broader perspective", animal: "eagle", aura: "yellow" },
      { value: "trust_process", label: "Trust the process and flow", animal: "turtle", aura: "blue" },
    ],
  },
  {
    id: "communication",
    question: "Your communication style is:",
    options: [
      { value: "direct", label: "Direct and straightforward", animal: "eagle", aura: "red" },
      { value: "thoughtful", label: "Thoughtful and measured", animal: "owl", aura: "violet" },
      { value: "empathetic", label: "Empathetic and understanding", animal: "wolf", aura: "green" },
      { value: "inspiring", label: "Inspiring and uplifting", animal: "dragon", aura: "yellow" },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [connectionLevel, setConnectionLevel] = useState([5])
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [spiritualAnswers, setSpiritualAnswers] = useState<Record<string, string>>({})
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, string>>({})

  const handleAccountDataChange = (field: string, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeviceToggle = (device: string) => {
    setSelectedDevices((prev) => (prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]))
  }

  const handleSpiritualAnswer = (questionId: string, value: string) => {
    setSpiritualAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handlePersonalityAnswer = (questionId: string, value: string) => {
    setPersonalityAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  // AI-driven profile calculation based on assessment responses
  const calculateProfile = () => {
    // Calculate elemental nature based on spiritual questions
    const elementScores = { earth: 0, water: 0, air: 0, fire: 0 }

    // Process each spiritual question's answer
    spiritualQuestions.forEach((question) => {
      const answer = spiritualAnswers[question.id]
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option?.points) {
          Object.entries(option.points).forEach(([element, points]) => {
            elementScores[element as keyof typeof elementScores] += points
          })
        }
      }
    })

    // Find the dominant element (highest score)
    const dominantElement = Object.entries(elementScores).reduce((a, b) =>
      elementScores[a[0] as keyof typeof elementScores] > elementScores[b[0] as keyof typeof elementScores] ? a : b,
    )[0]

    // Calculate spirit animal and aura color based on personality answers
    const animalCounts: Record<string, number> = {}
    const auraCounts: Record<string, number> = {}

    // Process each personality question's answer
    personalityQuestions.forEach((question) => {
      const answer = personalityAnswers[question.id]
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option) {
          animalCounts[option.animal] = (animalCounts[option.animal] || 0) + 1
          auraCounts[option.aura] = (auraCounts[option.aura] || 0) + 1
        }
      }
    })

    // Find the most frequent spirit animal and aura color
    const spiritAnimal = Object.entries(animalCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ["wolf", 0])[0]
    const auraColor = Object.entries(auraCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ["indigo", 0])[0]

    // Store the detailed calculation for transparency
    const profileCalculation = {
      elementScores,
      animalCounts,
      auraCounts,
    }

    return { dominantElement, spiritAnimal, auraColor, profileCalculation }
  }

  const handleComplete = () => {
    const profile = calculateProfile()

    // Extract first name from full name
    const firstName = accountData.name.split(" ")[0]

    const onboardingData = {
      account: accountData,
      name: accountData.name,
      firstName: firstName,
      connectionLevel: connectionLevel[0],
      devices: selectedDevices,
      spiritualAnswers,
      personalityAnswers,
      profile,
      completed: true,
      completedAt: new Date().toISOString(),
      isFirstLogin: true, // Mark as first login
    }

    localStorage.setItem("soulsync-onboarding", JSON.stringify(onboardingData))
    router.push("/")
  }

  const skipDeviceConnection = () => {
    setStep(step + 1)
  }

  const currentSpiritualQuestion = step >= 4 && step <= 8 ? spiritualQuestions[step - 4] : null
  const currentPersonalityQuestion = step >= 9 && step <= 11 ? personalityQuestions[step - 9] : null

  const canProceed = () => {
    switch (step) {
      case 1:
        return accountData.name.trim() !== ""
      case 2:
        return true // Connection level always has a value
      case 3:
        return true // Device connection is optional
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return currentSpiritualQuestion ? !!spiritualAnswers[currentSpiritualQuestion.id] : false
      case 9:
      case 10:
      case 11:
        return currentPersonalityQuestion ? !!personalityAnswers[currentPersonalityQuestion.id] : false
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-white/10 text-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <CardTitle className="text-2xl font-inter font-bold">
            {step === 1 && "Create Your Account"}
            {step === 2 && "Spiritual Connection"}
            {step === 3 && "Connect Your Devices"}
            {step >= 4 && step <= 8 && "Spiritual Assessment"}
            {step >= 9 && step <= 11 && "Personality Insights"}
            {step === 12 && "Your Spiritual Profile"}
          </CardTitle>
          <div className="flex justify-center mt-2">
            <Badge variant="outline" className="border-spiritual-teal text-spiritual-teal">
              Step {step} of 12
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Account Creation */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-center text-white/80 font-sf-pro mb-6">Let's create your spiritual journey profile</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-sf-pro">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={accountData.name}
                      onChange={(e) => handleAccountDataChange("name", e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-sf-pro">
                    Email (Optional)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={accountData.email}
                      onChange={(e) => handleAccountDataChange("email", e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-sf-pro">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={accountData.phone}
                      onChange={(e) => handleAccountDataChange("phone", e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs text-white/60 text-center">Your information is kept private and secure</div>
            </div>
          )}

          {/* Spiritual Connection Level */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-center text-white/80 font-sf-pro">How connected do you feel to your spiritual self?</p>
              <div className="space-y-4">
                <Slider
                  value={connectionLevel}
                  onValueChange={setConnectionLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60">
                  <span>Disconnected</span>
                  <span className="text-spiritual-teal font-bold">{connectionLevel[0]}/10</span>
                  <span>Deeply Connected</span>
                </div>
              </div>
            </div>
          )}

          {/* Device Connection */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-center text-white/80 font-sf-pro mb-6">
                Connect your wearables for personalized insights
              </p>
              <div className="grid gap-3">
                {[
                  { id: "apple", name: "Apple Watch", icon: Watch, status: "Not Connected" },
                  { id: "fitbit", name: "Fitbit", icon: Activity, status: "Not Connected" },
                  { id: "oura", name: "Oura Ring", icon: Smartphone, status: "Not Connected" },
                ].map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleDeviceToggle(device.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      selectedDevices.includes(device.id)
                        ? "border-spiritual-purple bg-spiritual-purple/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <device.icon className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-sf-pro">{device.name}</div>
                        <div className="text-xs text-white/60">
                          {selectedDevices.includes(device.id) ? "Connected" : device.status}
                        </div>
                      </div>
                    </div>
                    {selectedDevices.includes(device.id) && <Badge className="bg-spiritual-teal">Connected</Badge>}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Button variant="ghost" onClick={skipDeviceConnection} className="text-white/60 hover:text-white/80">
                  <Skip className="w-4 h-4 mr-2" />
                  Skip for now
                </Button>
              </div>
            </div>
          )}

          {/* Spiritual Questions */}
          {step >= 4 && step <= 8 && (
            <div className="space-y-4">
              {currentSpiritualQuestion ? (
                <>
                  <p className="text-center text-white/80 font-sf-pro mb-6">{currentSpiritualQuestion.question}</p>
                  <RadioGroup
                    value={spiritualAnswers[currentSpiritualQuestion.id] || ""}
                    onValueChange={(value) => handleSpiritualAnswer(currentSpiritualQuestion.id, value)}
                  >
                    {currentSpiritualQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:border-white/40 transition-all"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 font-sf-pro cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </>
              ) : (
                <div className="text-center text-white/80 font-sf-pro">
                  <p>Question not available. Please try again.</p>
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="mt-4 border-white/20 text-white hover:bg-white/10"
                  >
                    Restart Assessment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Personality Questions */}
          {step >= 9 && step <= 11 && (
            <div className="space-y-4">
              {currentPersonalityQuestion ? (
                <>
                  <p className="text-center text-white/80 font-sf-pro mb-6">{currentPersonalityQuestion.question}</p>
                  <RadioGroup
                    value={personalityAnswers[currentPersonalityQuestion.id] || ""}
                    onValueChange={(value) => handlePersonalityAnswer(currentPersonalityQuestion.id, value)}
                  >
                    {currentPersonalityQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:border-white/40 transition-all"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 font-sf-pro cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </>
              ) : (
                <div className="text-center text-white/80 font-sf-pro">
                  <p>Question not available. Please try again.</p>
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="mt-4 border-white/20 text-white hover:bg-white/10"
                  >
                    Restart Assessment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Profile Summary */}
          {step === 12 && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="text-4xl">🌟</div>
                <h3 className="text-xl font-inter font-bold text-spiritual-purple">
                  Welcome, {accountData.name.split(" ")[0]}!
                </h3>
                <p className="text-white/80 font-sf-pro">Your personalized spiritual journey is ready to begin.</p>
              </div>

              <div className="grid gap-3 text-left">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-white/70">Dominant Element</div>
                  <div className="font-sf-pro font-bold text-spiritual-teal">
                    {calculateProfile().dominantElement.charAt(0).toUpperCase() +
                      calculateProfile().dominantElement.slice(1)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-white/70">Spirit Animal</div>
                  <div className="font-sf-pro font-bold text-spiritual-purple">
                    {calculateProfile().spiritAnimal.charAt(0).toUpperCase() + calculateProfile().spiritAnimal.slice(1)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-white/70">Aura Color</div>
                  <div className="font-sf-pro font-bold text-spiritual-teal">
                    {calculateProfile().auraColor.charAt(0).toUpperCase() + calculateProfile().auraColor.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}
            <Button
              onClick={step === 12 ? handleComplete : () => setStep(step + 1)}
              className="flex-1 bg-spiritual-purple hover:bg-spiritual-purple/80"
              disabled={!canProceed()}
            >
              {step === 12 ? "Begin Journey" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
