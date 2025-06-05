export interface SubscriptionPlan {
  name: string
  tier: "free" | "plus" | "sync"
  features: {
    meditationSessions: number // -1 for unlimited
    tarotReadings: number // -1 for unlimited
    baziReading: "basic" | "detailed" | "advanced"
    palmReading: boolean
    faceReading: boolean // New feature
    iChingReading: boolean // New feature
    astrologyReading: boolean // New feature
    numerologyReading: boolean // New feature
    combinedReadings: boolean // New feature
    wisdomLibrary: "limited" | "full"
    aiGuideConversations: number // per day, -1 for unlimited
    journalInsights: boolean
    affirmations: boolean
    spiritualAdvisor: boolean
    retreatCommunity: boolean
  }
  price: {
    monthly: number
    annual: number
  }
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  soullite: {
    name: "Soullite",
    tier: "free",
    features: {
      meditationSessions: 3,
      tarotReadings: 1,
      baziReading: "basic",
      palmReading: true, // Temporarily unlocked for testing
      faceReading: true, // Temporarily unlocked for testing
      iChingReading: true, // Temporarily unlocked for testing
      astrologyReading: true, // Temporarily unlocked for testing
      numerologyReading: true, // Temporarily unlocked for testing
      combinedReadings: false,
      wisdomLibrary: "limited",
      aiGuideConversations: 5,
      journalInsights: false,
      affirmations: false,
      spiritualAdvisor: false,
      retreatCommunity: false,
    },
    price: {
      monthly: 0,
      annual: 0,
    },
  },
  soulplus: {
    name: "Soulplus",
    tier: "plus",
    features: {
      meditationSessions: 30,
      tarotReadings: 20,
      baziReading: "detailed",
      palmReading: true,
      faceReading: true,
      iChingReading: true,
      astrologyReading: true,
      numerologyReading: true,
      combinedReadings: true,
      wisdomLibrary: "full",
      aiGuideConversations: 20,
      journalInsights: true,
      affirmations: true,
      spiritualAdvisor: true,
      retreatCommunity: false,
    },
    price: {
      monthly: 9.9,
      annual: 8.91,
    },
  },
  soulsync: {
    name: "SoulSync",
    tier: "sync",
    features: {
      meditationSessions: -1,
      tarotReadings: -1,
      baziReading: "advanced",
      palmReading: true,
      faceReading: true,
      iChingReading: true,
      astrologyReading: true,
      numerologyReading: true,
      combinedReadings: true,
      wisdomLibrary: "full",
      aiGuideConversations: -1,
      journalInsights: true,
      affirmations: true,
      spiritualAdvisor: true,
      retreatCommunity: true,
    },
    price: {
      monthly: 24.99,
      annual: 22.49,
    },
  },
}

export interface UsageData {
  meditationSessions: number
  tarotReadings: number
  aiGuideConversations: number
  lastReset: {
    monthly: string // ISO date string
    daily: string // ISO date string
  }
}

export class SubscriptionService {
  private static instance: SubscriptionService
  private currentPlan = "soullite"
  private usage: UsageData = {
    meditationSessions: 0,
    tarotReadings: 0,
    aiGuideConversations: 0,
    lastReset: {
      monthly: new Date().toISOString(),
      daily: new Date().toISOString(),
    },
  }

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService()
    }
    return SubscriptionService.instance
  }

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const plan = localStorage.getItem("soultria-subscription-plan")
      const usage = localStorage.getItem("soultria-usage-data")

      if (plan) {
        this.currentPlan = plan
      }

      if (usage) {
        this.usage = JSON.parse(usage)
        this.resetUsageIfNeeded()
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("soultria-subscription-plan", this.currentPlan)
      localStorage.setItem("soultria-usage-data", JSON.stringify(this.usage))
    }
  }

  private resetUsageIfNeeded() {
    const now = new Date()
    const lastMonthlyReset = new Date(this.usage.lastReset.monthly)
    const lastDailyReset = new Date(this.usage.lastReset.daily)

    // Reset monthly usage if it's a new month
    if (now.getMonth() !== lastMonthlyReset.getMonth() || now.getFullYear() !== lastMonthlyReset.getFullYear()) {
      this.usage.meditationSessions = 0
      this.usage.tarotReadings = 0
      this.usage.lastReset.monthly = now.toISOString()
    }

    // Reset daily usage if it's a new day
    if (now.toDateString() !== lastDailyReset.toDateString()) {
      this.usage.aiGuideConversations = 0
      this.usage.lastReset.daily = now.toISOString()
    }

    this.saveToStorage()
  }

  getCurrentPlan(): SubscriptionPlan {
    return SUBSCRIPTION_PLANS[this.currentPlan]
  }

  getCurrentPlanName(): string {
    return this.currentPlan
  }

  getUsage(): UsageData {
    this.resetUsageIfNeeded()
    return this.usage
  }

  canUseMeditation(): boolean {
    const plan = this.getCurrentPlan()
    if (plan.features.meditationSessions === -1) return true
    return this.usage.meditationSessions < plan.features.meditationSessions
  }

  canUseTarot(): boolean {
    const plan = this.getCurrentPlan()
    if (plan.features.tarotReadings === -1) return true
    return this.usage.tarotReadings < plan.features.tarotReadings
  }

  canUsePalmReading(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.palmReading
  }

  canUseFaceReading(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.faceReading
  }

  canUseIChingReading(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.iChingReading
  }

  canUseAstrologyReading(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.astrologyReading
  }

  canUseNumerologyReading(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.numerologyReading
  }

  canUseCombinedReadings(): boolean {
    const plan = this.getCurrentPlan()
    return plan.features.combinedReadings
  }

  canUseAIGuide(): boolean {
    const plan = this.getCurrentPlan()
    if (plan.features.aiGuideConversations === -1) return true
    return this.usage.aiGuideConversations < plan.features.aiGuideConversations
  }

  canAccessWisdomLibrary(contentType: "basic" | "premium" = "basic"): boolean {
    const plan = this.getCurrentPlan()
    if (plan.features.wisdomLibrary === "full") return true
    return contentType === "basic"
  }

  useMeditation(): boolean {
    if (!this.canUseMeditation()) return false
    this.usage.meditationSessions++
    this.saveToStorage()
    return true
  }

  useTarot(): boolean {
    if (!this.canUseTarot()) return false
    this.usage.tarotReadings++
    this.saveToStorage()
    return true
  }

  useAIGuide(): boolean {
    if (!this.canUseAIGuide()) return false
    this.usage.aiGuideConversations++
    this.saveToStorage()
    return true
  }

  upgradePlan(planName: string): boolean {
    if (SUBSCRIPTION_PLANS[planName]) {
      this.currentPlan = planName
      this.saveToStorage()
      return true
    }
    return false
  }

  getRemainingUsage() {
    const plan = this.getCurrentPlan()
    const usage = this.getUsage()

    return {
      meditation:
        plan.features.meditationSessions === -1 ? -1 : plan.features.meditationSessions - usage.meditationSessions,
      tarot: plan.features.tarotReadings === -1 ? -1 : plan.features.tarotReadings - usage.tarotReadings,
      aiGuide:
        plan.features.aiGuideConversations === -1
          ? -1
          : plan.features.aiGuideConversations - usage.aiGuideConversations,
    }
  }
}
