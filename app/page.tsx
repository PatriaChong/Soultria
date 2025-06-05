"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Sparkles, Library, Heart, Moon, Zap } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [energyLevel, setEnergyLevel] = useState(72)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [isFirstLogin, setIsFirstLogin] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem("soulsync-onboarding")
    if (!data) {
      router.push("/onboarding")
      return
    }

    const parsedData = JSON.parse(data)
    setOnboardingData(parsedData)

    // Check if this is first login
    const firstLogin = parsedData.isFirstLogin || false
    setIsFirstLogin(firstLogin)

    // If it's first login, mark it as no longer first login for future visits
    if (firstLogin) {
      const updatedData = { ...parsedData, isFirstLogin: false }
      localStorage.setItem("soulsync-onboarding", JSON.stringify(updatedData))
    }
  }, [router])

  if (!onboardingData) return null

  const quickActions = [
    { icon: Brain, label: "Meditate", href: "/meditation", color: "text-spiritual-purple" },
    { icon: BookOpen, label: "Journal", href: "/journal", color: "text-spiritual-teal" },
    { icon: Sparkles, label: "Divine", href: "/divination", color: "text-yellow-400" },
    { icon: Library, label: "Wisdom", href: "/wisdom", color: "text-green-400" },
  ]

  // Get the user's first name
  const firstName = onboardingData.firstName || onboardingData.name?.split(" ")[0] || "Seeker"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="mb-4">
            <h1 className="text-4xl font-inter font-bold text-white mb-2">Soultria</h1>
            <p className="text-spiritual-teal font-sf-pro text-sm">
              A Place for SOUL — Where Technology Nurtures Mind, Body & Spirit
            </p>
          </div>
          <h2 className="text-2xl font-inter font-semibold text-white mb-2">
            {isFirstLogin ? `Welcome, ${firstName}` : `Welcome back, ${firstName}`}
          </h2>
          <p className="text-white/60 font-sf-pro">
            {isFirstLogin ? "Your spiritual journey begins" : "Your spiritual journey continues"}
          </p>
        </div>

        {/* Energy Balance Meter */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-inter">Energy Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#energyGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${energyLevel * 3.14} 314`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5E35B1" />
                    <stop offset="100%" stopColor="#4DB6AC" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-spiritual-teal">{energyLevel}%</div>
                  <div className="text-xs text-white/60">Balanced</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <Heart className="w-5 h-5 mx-auto text-spiritual-stress" />
                <div className="text-sm font-sf-pro">Stress</div>
                <Badge variant="outline" className="text-xs border-spiritual-stress text-spiritual-stress">
                  Low
                </Badge>
              </div>
              <div className="space-y-1">
                <Moon className="w-5 h-5 mx-auto text-spiritual-calm" />
                <div className="text-sm font-sf-pro">Sleep</div>
                <Badge variant="outline" className="text-xs border-spiritual-calm text-spiritual-calm">
                  Good
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Prescription */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Zap className="w-5 h-5 text-spiritual-teal" />
              Today's Prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-sf-pro font-bold text-spiritual-purple">7-min Third Eye Calm (Delta waves)</h3>
              <p className="text-sm text-white/70">
                Your biometrics suggest mental fatigue. This meditation will help restore clarity and inner peace.
              </p>
            </div>
            <Link href="/meditation">
              <Button className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90">
                Start Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex flex-col items-center p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all hover:bg-white/5">
                    <action.icon className={`w-8 h-8 mb-2 ${action.color}`} />
                    <span className="text-sm font-sf-pro">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
