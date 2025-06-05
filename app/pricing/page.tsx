"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Sparkles, Star, Zap, Brain, BookOpen, MessageCircle, Hand, Calendar, Users } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const handleUpgrade = (tier: string) => {
    // In a real app, this would navigate to a checkout page or show a payment modal
    console.log(`Upgrading to ${tier}`)
    // For demo purposes, we'll just show an alert
    alert(`Thank you for choosing ${tier}! This would navigate to a payment page in the full app.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-inter font-bold text-white mb-2">Soultria Membership</h1>
          <p className="text-white/60 font-sf-pro">Choose the perfect plan for your spiritual journey</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingCycle === "monthly" ? "text-white" : "text-white/60"}`}>Monthly</span>
          <div className="flex items-center space-x-2">
            <Switch
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
            />
            <Label className="text-sm">
              Annual <Badge className="ml-1 bg-spiritual-purple">Save 10%</Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier - Soullite */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-white/10 transform rotate-45 translate-x-8 -translate-y-8 rounded-full"></div>
            <CardHeader>
              <CardTitle className="text-xl font-inter flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                  <Sparkles className="w-4 h-4 text-white/80" />
                </div>
                Soullite
              </CardTitle>
              <CardDescription className="text-white/60">Free Tier</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-white/60 ml-1">forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/80">Begin your spiritual journey with essential features</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>3</strong> meditation sessions per month
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>1</strong> tarot card reading per month
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Basic Bazi reading</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Limited wisdom library access</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>5</strong> AI guide conversations per day
                  </span>
                </li>
                <li className="flex items-start opacity-50">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Palm reading (not available)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/")}
              >
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Soulplus Tier */}
          <Card className="bg-gradient-to-br from-spiritual-purple/30 to-spiritual-teal/30 backdrop-blur-lg border-spiritual-purple/30 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-teal/20 transform rotate-45 translate-x-10 -translate-y-10 rounded-full"></div>
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-spiritual-teal px-3 py-1">Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-inter flex items-center">
                <div className="w-8 h-8 rounded-full bg-spiritual-purple/30 flex items-center justify-center mr-2">
                  <Star className="w-4 h-4 text-spiritual-teal" />
                </div>
                Soulplus
              </CardTitle>
              <CardDescription className="text-white/80">Enhanced Journey</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">${billingCycle === "monthly" ? "9.90" : "8.91"}</span>
                <span className="text-white/60 ml-1">
                  / {billingCycle === "monthly" ? "month" : "month (billed annually)"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/80">Deepen your practice with advanced features</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>30</strong> meditation sessions per month
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>100+</strong> meditation tracks available
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>20</strong> tarot card readings per month
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Detailed Bazi reading</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Palm reading unlocked</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Full wisdom library access</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>20</strong> AI guide conversations per day
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Advanced AI journal insights</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">Daily affirmation notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-teal" />
                  </div>
                  <span className="text-sm">
                    <strong>2</strong> free spiritual advisor sessions (10 min each)
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                onClick={() => handleUpgrade("Soulplus")}
              >
                Upgrade to Soulplus
              </Button>
            </CardFooter>
          </Card>

          {/* SoulSync Tier */}
          <Card className="bg-black/20 backdrop-blur-lg border-spiritual-purple/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-spiritual-purple/10 to-spiritual-teal/10 transform rotate-45 translate-x-10 -translate-y-10 rounded-full"></div>
            <CardHeader>
              <CardTitle className="text-xl font-inter flex items-center">
                <div className="w-8 h-8 rounded-full bg-spiritual-purple/20 flex items-center justify-center mr-2">
                  <Zap className="w-4 h-4 text-spiritual-purple" />
                </div>
                SoulSync
              </CardTitle>
              <CardDescription className="text-white/60">Ultimate Experience</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">${billingCycle === "monthly" ? "24.99" : "22.49"}</span>
                <span className="text-white/60 ml-1">
                  / {billingCycle === "monthly" ? "month" : "month (billed annually)"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/80">Unlock your full spiritual potential</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">
                    <strong>Unlimited</strong> meditation sessions
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">
                    <strong>Unlimited</strong> tarot card readings
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">
                    <strong>Unlimited</strong> Bazi and palm readings
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">
                    <strong>Unlimited</strong> AI guide conversations
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">AI matching to human spiritual guides</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">Access to retreat community</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">
                    <Check className="h-4 w-4 text-spiritual-purple" />
                  </div>
                  <span className="text-sm">Human spiritual advisor sessions ($40 each or $400 for 11)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-spiritual-purple hover:bg-spiritual-purple/80"
                onClick={() => handleUpgrade("SoulSync")}
              >
                Upgrade to SoulSync
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-inter">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Soullite</th>
                    <th className="text-center py-3 px-4">Soulplus</th>
                    <th className="text-center py-3 px-4">SoulSync</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Meditation Sessions</span>
                    </td>
                    <td className="text-center py-3 px-4">3/month</td>
                    <td className="text-center py-3 px-4">30/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Tarot Readings</span>
                    </td>
                    <td className="text-center py-3 px-4">1/month</td>
                    <td className="text-center py-3 px-4">20/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Bazi Reading</span>
                    </td>
                    <td className="text-center py-3 px-4">Basic</td>
                    <td className="text-center py-3 px-4">Detailed</td>
                    <td className="text-center py-3 px-4">Advanced</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <Hand className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Palm Reading</span>
                    </td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Wisdom Library</span>
                    </td>
                    <td className="text-center py-3 px-4">Limited</td>
                    <td className="text-center py-3 px-4">Full Access</td>
                    <td className="text-center py-3 px-4">Full Access</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>AI Guide Conversations</span>
                    </td>
                    <td className="text-center py-3 px-4">5/day</td>
                    <td className="text-center py-3 px-4">20/day</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-spiritual-teal" />
                      <span>Human Spiritual Advisor</span>
                    </td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">2 free sessions</td>
                    <td className="text-center py-3 px-4">Pay per session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-inter">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-spiritual-teal">Can I change my plan later?</h3>
              <p className="text-sm text-white/80">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your
                next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-spiritual-teal">How do I cancel my subscription?</h3>
              <p className="text-sm text-white/80">
                You can cancel your subscription from your account settings. You'll continue to have access to your
                current plan until the end of your billing period.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-spiritual-teal">How do spiritual advisor sessions work?</h3>
              <p className="text-sm text-white/80">
                With Soulplus, you get 2 free 10-minute sessions. With SoulSync, you can book sessions at $40 each or
                purchase a package of 11 sessions for $400. Sessions are conducted via video call with our certified
                spiritual advisors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
