"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Flame, Award, Target } from "lucide-react"

export default function ProgressPage() {
  const weeklyStats = {
    meditation: { sessions: 5, minutes: 87, goal: 7 },
    journaling: { entries: 3, streak: 12, stressReduction: 22 },
    divination: { readings: 2, insights: 8 },
    overall: { energyIncrease: 15, sleepImprovement: 18 },
  }

  const milestones = [
    { name: "Crown Chakra Awakened", day: 7, completed: true, icon: "👑" },
    { name: "Third Eye Opening", day: 14, completed: true, icon: "👁️" },
    { name: "Heart Center Activation", day: 21, completed: false, icon: "💚" },
    { name: "Soul Integration", day: 30, completed: false, icon: "✨" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Soul Progress</h1>
          <p className="text-white/60 font-sf-pro">Track your spiritual journey</p>
        </div>

        {/* Weekly Soul Report */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-spiritual-teal" />
              Weekly Soul Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meditation Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-sf-pro">Meditation Practice</span>
                <Badge className="bg-spiritual-purple">
                  {weeklyStats.meditation.sessions}/{weeklyStats.meditation.goal} sessions
                </Badge>
              </div>
              <Progress value={(weeklyStats.meditation.sessions / weeklyStats.meditation.goal) * 100} className="h-2" />
              <p className="text-sm text-white/70">{weeklyStats.meditation.minutes} minutes this week</p>
            </div>

            {/* Journaling Impact */}
            <div className="p-4 rounded-lg bg-spiritual-teal/20 border border-spiritual-teal/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-spiritual-teal" />
                <span className="font-sf-pro font-bold">Journaling Impact</span>
              </div>
              <p className="text-sm font-sf-pro">
                Journaling 3x/week → <span className="text-spiritual-calm font-bold">22% stress reduction</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 animate-flame-grow" />
                <span className="text-sm">{weeklyStats.journaling.streak} day streak</span>
              </div>
            </div>

            {/* Overall Wellness */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold text-spiritual-calm">+{weeklyStats.overall.energyIncrease}%</div>
                <div className="text-xs text-white/70">Energy Level</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold text-spiritual-teal">+{weeklyStats.overall.sleepImprovement}%</div>
                <div className="text-xs text-white/70">Sleep Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Milestone Map */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Award className="w-5 h-5 text-spiritual-purple" />
              Spiritual Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.name}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  milestone.completed
                    ? "border-spiritual-purple bg-spiritual-purple/20 spiritual-glow"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <div className="text-2xl">{milestone.icon}</div>
                <div className="flex-1">
                  <div className="font-sf-pro font-bold">{milestone.name}</div>
                  <div className="text-sm text-white/70">Day {milestone.day}</div>
                </div>
                {milestone.completed && <Badge className="bg-spiritual-teal">Achieved</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Streak Visualization */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Practice Streaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-sf-pro">Daily Meditation</span>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 animate-flame-grow" />
                  <span className="font-bold">5 days</span>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${i < 5 ? "bg-orange-400" : "bg-white/20"}`} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-sf-pro">Soul Journaling</span>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-spiritual-teal animate-flame-grow" />
                  <span className="font-bold">12 days</span>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${i < 3 ? "bg-spiritual-teal" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Target className="w-5 h-5 text-spiritual-purple" />
              This Week's Intentions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { goal: "Complete 7 meditation sessions", progress: 71, completed: false },
              { goal: "Journal 4 times", progress: 75, completed: false },
              { goal: "Practice gratitude daily", progress: 100, completed: true },
              { goal: "Try new divination method", progress: 50, completed: false },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-sf-pro">{item.goal}</span>
                  {item.completed && <Badge className="bg-spiritual-calm text-xs">Complete</Badge>}
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
