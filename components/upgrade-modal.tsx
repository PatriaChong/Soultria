"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  currentPlan: string
}

export function UpgradeModal({ isOpen, onClose, feature, currentPlan }: UpgradeModalProps) {
  const router = useRouter()

  const featureMessages = {
    meditation: "You've reached your meditation session limit for this month.",
    tarot: "You've reached your tarot reading limit for this month.",
    palm: "Palm reading is not available in your current plan.",
    aiGuide: "You've reached your daily AI guide conversation limit.",
    wisdom: "This content requires a premium subscription.",
    journal: "Advanced journal insights require a premium subscription.",
  }

  const handleUpgrade = () => {
    onClose()
    router.push("/pricing")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-lg border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter flex items-center gap-2">
            <Crown className="w-6 h-6 text-spiritual-teal" />
            Upgrade Required
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {featureMessages[feature as keyof typeof featureMessages] || "This feature requires an upgrade."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm text-white/80">Unlock unlimited spiritual growth with Soulplus or SoulSync</p>
          </div>

          {/* Quick Plan Comparison */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-spiritual-teal/30 bg-spiritual-teal/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-spiritual-teal" />
                  <span className="font-bold">Soulplus</span>
                </div>
                <Badge className="bg-spiritual-teal">$9.90/month</Badge>
              </div>
              <ul className="text-sm space-y-1 text-white/80">
                <li>• 30 meditation sessions/month</li>
                <li>• 20 tarot readings/month</li>
                <li>• Palm reading unlocked</li>
                <li>• 20 AI conversations/day</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-spiritual-purple/30 bg-spiritual-purple/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-spiritual-purple" />
                  <span className="font-bold">SoulSync</span>
                </div>
                <Badge className="bg-spiritual-purple">$24.99/month</Badge>
              </div>
              <ul className="text-sm space-y-1 text-white/80">
                <li>• Unlimited everything</li>
                <li>• Retreat community access</li>
                <li>• Human spiritual advisors</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={onClose}>
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
              onClick={handleUpgrade}
            >
              View Plans
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
