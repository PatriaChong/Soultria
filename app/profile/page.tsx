"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SubscriptionService } from "@/lib/subscription"
import { User, Edit, Smartphone, Calendar, Zap, Crown, ChevronRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const elementDetails = {
  earth: {
    color: "#A3A3A3",
    emoji: "🌍",
    traits: ["Grounding", "Stability", "Patience", "Nurturing"],
    description:
      "You find strength in stability and connection to nature. Your grounded energy helps others feel secure.",
    practices: ["Walking meditation", "Crystal healing", "Garden rituals", "Body awareness"],
  },
  water: {
    color: "#3B82F6",
    emoji: "🌊",
    traits: ["Intuition", "Flow", "Emotion", "Healing"],
    description: "You navigate life through intuition and emotional wisdom. Your fluid nature adapts to any situation.",
    practices: ["Moon rituals", "Water ceremonies", "Emotional release", "Dream work"],
  },
  air: {
    color: "#E5E7EB",
    emoji: "💨",
    traits: ["Intellect", "Communication", "Freedom", "Innovation"],
    description: "You seek truth through knowledge and clear communication. Your mental clarity inspires others.",
    practices: ["Breathwork", "Study meditation", "Sound healing", "Philosophical inquiry"],
  },
  fire: {
    color: "#EF4444",
    emoji: "🔥",
    traits: ["Passion", "Action", "Transformation", "Leadership"],
    description: "You embody dynamic energy and transformative power. Your passion ignites positive change.",
    practices: ["Dynamic meditation", "Sun salutations", "Candle rituals", "Energy work"],
  },
}

const spiritAnimalDetails = {
  wolf: {
    emoji: "🐺",
    meaning: "Loyalty & Intuition",
    description:
      "The wolf represents deep intuition, loyalty to your pack, and the ability to navigate both the seen and unseen worlds.",
  },
  eagle: {
    emoji: "🦅",
    meaning: "Vision & Freedom",
    description:
      "The eagle soars above limitations, seeing the bigger picture with clarity and maintaining connection to higher perspectives.",
  },
  butterfly: {
    emoji: "🦋",
    meaning: "Transformation",
    description:
      "The butterfly embodies metamorphosis, showing that beautiful transformation comes through embracing change.",
  },
  owl: {
    emoji: "🦉",
    meaning: "Wisdom & Mystery",
    description:
      "The owl sees through darkness, representing deep wisdom, intuition, and comfort with life's mysteries.",
  },
  dragon: {
    emoji: "🐉",
    meaning: "Power & Magic",
    description:
      "The dragon represents primal power, magical thinking, and the ability to bridge earthly and spiritual realms.",
  },
  turtle: {
    emoji: "🐢",
    meaning: "Patience & Grounding",
    description:
      "The turtle teaches patience, steady progress, and the wisdom that comes from taking life at your own pace.",
  },
}

const auraColorDetails = {
  violet: {
    color: "#8B5CF6",
    meaning: "Spiritual Awareness",
    description: "A violet aura indicates deep spiritual connection and psychic abilities.",
  },
  indigo: {
    color: "#6366F1",
    meaning: "Intuition",
    description: "An indigo aura represents strong intuition and inner knowing.",
  },
  blue: {
    color: "#3B82F6",
    meaning: "Communication",
    description: "A blue aura shows clear communication and peaceful energy.",
  },
  green: {
    color: "#10B981",
    meaning: "Healing",
    description: "A green aura indicates natural healing abilities and heart-centered living.",
  },
  yellow: {
    color: "#F59E0B",
    meaning: "Joy",
    description: "A yellow aura radiates joy, optimism, and intellectual curiosity.",
  },
  orange: {
    color: "#F97316",
    meaning: "Creativity",
    description: "An orange aura represents creative expression and emotional vitality.",
  },
  red: {
    color: "#EF4444",
    meaning: "Passion",
    description: "A red aura shows passionate energy and strong life force.",
  },
}

export default function ProfilePage() {
  const subscriptionService = SubscriptionService.getInstance()
  const [profileData, setProfileData] = useState<any>(null)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState(subscriptionService.getCurrentPlan())
  const [usage, setUsage] = useState(subscriptionService.getUsage())
  const [remainingUsage, setRemainingUsage] = useState(subscriptionService.getRemainingUsage())

  useEffect(() => {
    const data = localStorage.getItem("soulsync-onboarding")
    if (data) {
      const parsed = JSON.parse(data)
      setOnboardingData(parsed)
      setProfileData(parsed.profile)
    }

    // Update usage data
    setUsage(subscriptionService.getUsage())
    setRemainingUsage(subscriptionService.getRemainingUsage())
  }, [])

  if (!profileData || !onboardingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-8 text-center">
            <p className="font-sf-pro">Complete your onboarding to view your profile</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const element = elementDetails[profileData.dominantElement as keyof typeof elementDetails]
  const animal = spiritAnimalDetails[profileData.spiritAnimal as keyof typeof spiritAnimalDetails]
  const aura = auraColorDetails[profileData.auraColor as keyof typeof auraColorDetails]

  // Calculate usage percentages for progress bars
  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Your Spiritual Profile</h1>
          <p className="text-white/60 font-sf-pro">Discovered through your unique journey</p>
        </div>

        {/* Membership Card */}
        <Card className="bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Crown className="w-5 h-5 text-spiritual-teal" />
              Soultria Membership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sf-pro font-bold text-xl">{currentPlan.name}</p>
                <p className="text-sm text-white/70">
                  {currentPlan.name === "Soullite"
                    ? "Free Tier"
                    : currentPlan.name === "Soulplus"
                      ? "$9.90/month"
                      : "$24.99/month"}
                </p>
              </div>
              {currentPlan.name === "Soullite" && (
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>

            {/* Usage Stats */}
            <div className="space-y-3 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meditation Sessions</span>
                  <Badge variant="outline" className="border-spiritual-teal text-spiritual-teal">
                    {currentPlan.features.meditationSessions === -1
                      ? `${usage.meditationSessions} used`
                      : `${usage.meditationSessions}/${currentPlan.features.meditationSessions}`}
                  </Badge>
                </div>
                {currentPlan.features.meditationSessions !== -1 && (
                  <Progress
                    value={getUsagePercentage(usage.meditationSessions, currentPlan.features.meditationSessions)}
                    className="h-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tarot Readings</span>
                  <Badge variant="outline" className="border-spiritual-purple text-spiritual-purple">
                    {currentPlan.features.tarotReadings === -1
                      ? `${usage.tarotReadings} used`
                      : `${usage.tarotReadings}/${currentPlan.features.tarotReadings}`}
                  </Badge>
                </div>
                {currentPlan.features.tarotReadings !== -1 && (
                  <Progress
                    value={getUsagePercentage(usage.tarotReadings, currentPlan.features.tarotReadings)}
                    className="h-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Guide Conversations (Today)</span>
                  <Badge variant="outline" className="border-spiritual-teal text-spiritual-teal">
                    {currentPlan.features.aiGuideConversations === -1
                      ? `${usage.aiGuideConversations} used`
                      : `${usage.aiGuideConversations}/${currentPlan.features.aiGuideConversations}`}
                  </Badge>
                </div>
                {currentPlan.features.aiGuideConversations !== -1 && (
                  <Progress
                    value={getUsagePercentage(usage.aiGuideConversations, currentPlan.features.aiGuideConversations)}
                    className="h-2"
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Palm Reading</span>
                <Badge
                  variant="outline"
                  className={`${currentPlan.features.palmReading ? "border-spiritual-teal text-spiritual-teal" : "border-spiritual-stress text-spiritual-stress"}`}
                >
                  {currentPlan.features.palmReading ? "Available" : "Locked"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Wisdom Library</span>
                <Badge
                  variant="outline"
                  className={`${currentPlan.features.wisdomLibrary === "full" ? "border-spiritual-teal text-spiritual-teal" : "border-spiritual-stress text-spiritual-stress"}`}
                >
                  {currentPlan.features.wisdomLibrary === "full" ? "Full Access" : "Limited"}
                </Badge>
              </div>
            </div>

            <Link href="/pricing">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mt-2">
                View Plan Details
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-spiritual-purple" />
              This Month's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/70 mb-1">Sessions Used</p>
                <p className="text-2xl font-bold text-spiritual-purple">{usage.meditationSessions}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/70 mb-1">Readings Done</p>
                <p className="text-2xl font-bold text-spiritual-teal">{usage.tarotReadings}</p>
              </div>
            </div>

            {/* Show upgrade suggestion if user is close to limits */}
            {(remainingUsage.meditation <= 1 || remainingUsage.tarot <= 1) && currentPlan.name === "Soullite" && (
              <div className="p-3 rounded-lg bg-spiritual-stress/20 border border-spiritual-stress/30">
                <p className="text-sm text-spiritual-stress font-bold mb-1">Running Low!</p>
                <p className="text-xs text-white/80 mb-2">
                  You're almost out of {remainingUsage.meditation <= 1 ? "meditation sessions" : "tarot readings"} for
                  this month.
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="bg-spiritual-purple hover:bg-spiritual-purple/80">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Account Information */}
        {onboardingData.account && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-inter flex items-center gap-2">
                <User className="w-5 h-5 text-spiritual-purple" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Name</span>
                <span className="font-sf-pro">{onboardingData.account.name}</span>
              </div>
              {onboardingData.account.email && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/70 text-sm">Email</span>
                  <span className="font-sf-pro text-sm">{onboardingData.account.email}</span>
                </div>
              )}
              {onboardingData.account.phone && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/70 text-sm">Phone</span>
                  <span className="font-sf-pro text-sm">{onboardingData.account.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bazi Details */}
        {onboardingData.baziDetails && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-inter flex items-center gap-2">
                <Calendar className="w-5 h-5 text-spiritual-teal" />
                Bazi Birth Chart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Birth Date</span>
                <span className="font-sf-pro text-sm">
                  {new Date(onboardingData.baziDetails.birthDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Birth Time</span>
                <span className="font-sf-pro text-sm">{onboardingData.baziDetails.birthTime}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Birth Place</span>
                <span className="font-sf-pro text-sm">{onboardingData.baziDetails.birthPlace}</span>
              </div>
              <div className="text-center mt-4">
                <Badge className="bg-spiritual-teal">Cosmic Blueprint Recorded</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spiritual Connection Level */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Zap className="w-5 h-5 text-spiritual-teal" />
              Spiritual Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-sf-pro">Current Level</span>
              <Badge className="bg-spiritual-purple text-lg px-3 py-1">{onboardingData.connectionLevel}/10</Badge>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-spiritual-purple to-spiritual-teal h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(onboardingData.connectionLevel / 10) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Elemental Nature */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Elemental Nature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-3">{element.emoji}</div>
              <h3 className="text-2xl font-bold" style={{ color: element.color }}>
                {profileData.dominantElement.charAt(0).toUpperCase() + profileData.dominantElement.slice(1)} Element
              </h3>
              <p className="text-sm text-white/70 mt-2">{element.description}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-sf-pro font-bold mb-2">Core Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {element.traits.map((trait) => (
                    <Badge key={trait} variant="outline" className="border-white/20 text-white/80">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-sf-pro font-bold mb-2">Recommended Practices</h4>
                <div className="space-y-2">
                  {element.practices.map((practice) => (
                    <div key={practice} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: element.color }} />
                      <span className="text-sm font-sf-pro">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spirit Animal */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Spirit Animal Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-3">{animal.emoji}</div>
              <h3 className="text-2xl font-bold text-spiritual-purple">
                {profileData.spiritAnimal.charAt(0).toUpperCase() + profileData.spiritAnimal.slice(1)}
              </h3>
              <p className="text-spiritual-teal font-sf-pro">{animal.meaning}</p>
            </div>
            <p className="text-sm text-white/80 font-sf-pro text-center">{animal.description}</p>
          </CardContent>
        </Card>

        {/* Aura Color */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Aura Energy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 aura-gradient"
                style={{ backgroundColor: aura.color }}
              />
              <h3 className="text-2xl font-bold" style={{ color: aura.color }}>
                {profileData.auraColor.charAt(0).toUpperCase() + profileData.auraColor.slice(1)} Aura
              </h3>
              <p className="text-spiritual-teal font-sf-pro">{aura.meaning}</p>
            </div>
            <p className="text-sm text-white/80 font-sf-pro text-center">{aura.description}</p>
          </CardContent>
        </Card>

        {/* Connected Devices */}
        {onboardingData.devices.length > 0 && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-inter flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-spiritual-teal" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {onboardingData.devices.map((device: string) => (
                  <div key={device} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="font-sf-pro capitalize">{device.replace("_", " ")}</span>
                    <Badge className="bg-spiritual-calm">Connected</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Completion */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Calendar className="w-5 h-5 text-spiritual-purple" />
              Journey Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="font-sf-pro">
                {new Date(onboardingData.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                <Edit className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
