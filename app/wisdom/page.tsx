"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SubscriptionService } from "@/lib/subscription"
import { Play, BookOpen, Clock, Star, Search, Bookmark, BookMarked, Heart, Crown, Lock } from "lucide-react"

const wisdomContent = [
  {
    id: "aura-cleansing",
    title: "3-min Aura Cleansing",
    type: "Meditation",
    duration: "3 min",
    match: 87,
    progress: 0,
    description: "Clear negative energy and restore your natural radiance",
    tags: ["Energy", "Cleansing", "Quick"],
    featured: true,
    premium: false,
  },
  {
    id: "chakra-alignment",
    title: "Understanding Chakra Alignment",
    type: "Learning",
    duration: "8 min",
    match: 92,
    progress: 45,
    description: "Deep dive into balancing your energy centers",
    tags: ["Chakras", "Balance", "Foundation"],
    featured: false,
    premium: false,
  },
  {
    id: "moon-rituals",
    title: "Moon Cycle Rituals",
    type: "Practice",
    duration: "12 min",
    match: 78,
    progress: 100,
    description: "Harness lunar energy for manifestation and release",
    tags: ["Moon", "Rituals", "Cycles"],
    featured: false,
    premium: true,
  },
  {
    id: "sacred-geometry",
    title: "Sacred Geometry Meditation",
    type: "Meditation",
    duration: "15 min",
    match: 83,
    progress: 20,
    description: "Connect with universal patterns and divine order",
    tags: ["Geometry", "Patterns", "Advanced"],
    featured: false,
    premium: true,
  },
  {
    id: "crystal-healing",
    title: "Crystal Healing Basics",
    type: "Learning",
    duration: "10 min",
    match: 76,
    progress: 0,
    description: "Learn how to use crystals for energy healing",
    tags: ["Crystals", "Healing", "Beginner"],
    featured: true,
    premium: false,
  },
  {
    id: "mindfulness-101",
    title: "Mindfulness 101",
    type: "Practice",
    duration: "5 min",
    match: 95,
    progress: 60,
    description: "Simple techniques for present moment awareness",
    tags: ["Mindfulness", "Beginner", "Daily"],
    featured: true,
    premium: false,
  },
  {
    id: "astral-projection",
    title: "Astral Projection Guide",
    type: "Learning",
    duration: "20 min",
    match: 68,
    progress: 0,
    description: "Techniques for out-of-body experiences",
    tags: ["Astral", "Advanced", "Exploration"],
    featured: false,
    premium: true,
  },
  {
    id: "sound-healing",
    title: "Sound Bath Experience",
    type: "Meditation",
    duration: "25 min",
    match: 89,
    progress: 0,
    description: "Immersive sound healing for deep relaxation",
    tags: ["Sound", "Healing", "Immersive"],
    featured: true,
    premium: true,
  },
  {
    id: "advanced-breathwork",
    title: "Advanced Breathwork Techniques",
    type: "Practice",
    duration: "18 min",
    match: 91,
    progress: 0,
    description: "Master advanced breathing patterns for transformation",
    tags: ["Breathwork", "Advanced", "Transformation"],
    featured: false,
    premium: true,
  },
  {
    id: "energy-protection",
    title: "Psychic Protection Methods",
    type: "Learning",
    duration: "12 min",
    match: 85,
    progress: 0,
    description: "Shield yourself from negative energies",
    tags: ["Protection", "Energy", "Defense"],
    featured: false,
    premium: true,
  },
]

const wisdomCollections = [
  {
    id: "beginner-journey",
    title: "Beginner's Spiritual Journey",
    description: "Essential practices for those starting their spiritual path",
    items: 5,
    image: "🌱",
    premium: false,
  },
  {
    id: "energy-healing",
    title: "Energy Healing Techniques",
    description: "Methods to balance and restore your energy field",
    items: 7,
    image: "✨",
    premium: true,
  },
  {
    id: "meditation-mastery",
    title: "Meditation Mastery",
    description: "Advanced practices for experienced meditators",
    items: 9,
    image: "🧘‍♀️",
    premium: true,
  },
  {
    id: "intuition-development",
    title: "Intuition Development",
    description: "Strengthen your connection to inner wisdom",
    items: 6,
    image: "🔮",
    premium: false,
  },
]

interface WisdomItem {
  id: string
  title: string
  type: string
  duration: string
  match: number
  progress: number
  description: string
  tags: string[]
  featured: boolean
  premium: boolean
  saved?: boolean
}

export default function WisdomPage() {
  const subscriptionService = SubscriptionService.getInstance()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("explore")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [wisdomItems, setWisdomItems] = useState<WisdomItem[]>(wisdomContent)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(subscriptionService.getCurrentPlan())

  const categories = ["All", "Meditation", "Learning", "Practice"]

  useEffect(() => {
    // Load saved items from localStorage
    const saved = localStorage.getItem("soulsync-saved-wisdom")
    if (saved) {
      setSavedItems(JSON.parse(saved))
    }
  }, [])

  const toggleSaveItem = (itemId: string) => {
    const updatedSavedItems = savedItems.includes(itemId)
      ? savedItems.filter((id) => id !== itemId)
      : [...savedItems, itemId]

    setSavedItems(updatedSavedItems)
    localStorage.setItem("soulsync-saved-wisdom", JSON.stringify(updatedSavedItems))
  }

  const handleContentAccess = (item: WisdomItem) => {
    if (item.premium && !subscriptionService.canAccessWisdomLibrary("premium")) {
      setShowUpgradeModal(true)
      return false
    }
    return true
  }

  const handleCollectionAccess = (collection: any) => {
    if (collection.premium && !subscriptionService.canAccessWisdomLibrary("premium")) {
      setShowUpgradeModal(true)
      return false
    }
    return true
  }

  const filteredContent = wisdomItems
    .filter((item) => {
      // Filter by category
      if (selectedCategory !== "All" && item.type !== selectedCategory) {
        return false
      }

      // Filter by search query
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Filter by saved status if on saved tab
      if (activeTab === "saved" && !savedItems.includes(item.id)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by featured status first, then by match percentage
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.match - a.match
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-inter font-bold text-white mb-2">Wisdom Library</h1>
          <p className="text-white/60 font-sf-pro">Personalized spiritual learning</p>
        </div>

        {/* Subscription Status */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-spiritual-teal" />
                <span className="font-sf-pro">{currentPlan.name}</span>
              </div>
              <Badge
                className={currentPlan.features.wisdomLibrary === "full" ? "bg-spiritual-teal" : "bg-spiritual-stress"}
              >
                {currentPlan.features.wisdomLibrary === "full" ? "Full Access" : "Limited Access"}
              </Badge>
            </div>
            {currentPlan.features.wisdomLibrary === "limited" && (
              <div className="mt-2 text-sm text-white/70">
                Upgrade to unlock premium content and advanced spiritual practices
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-4">
            {/* Search and Filter */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                  <Input
                    placeholder="Search wisdom content..."
                    className="pl-10 bg-white/5 border-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-spiritual-purple hover:bg-spiritual-purple/80"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Content */}
            {searchQuery === "" && selectedCategory === "All" && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-inter">Featured For You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {wisdomItems
                    .filter((item) => item.featured && (!item.premium || currentPlan.features.wisdomLibrary === "full"))
                    .slice(0, 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg border border-spiritual-purple/30 bg-spiritual-purple/10 relative"
                      >
                        {item.premium && currentPlan.features.wisdomLibrary === "limited" && (
                          <div className="absolute top-2 right-2">
                            <Lock className="w-4 h-4 text-spiritual-stress" />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-sf-pro font-bold">{item.title}</h3>
                          <div className="flex gap-2">
                            <Badge className="bg-spiritual-teal">{item.match}% match</Badge>
                            {item.premium && <Badge className="bg-spiritual-purple">Premium</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{item.duration}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-spiritual-purple hover:bg-spiritual-purple/80"
                            onClick={() => handleContentAccess(item)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Content List */}
            <div className="space-y-4">
              {filteredContent.length === 0 ? (
                <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-white/60">No content matches your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredContent.map((item) => (
                  <Card
                    key={item.id}
                    className={`bg-black/20 backdrop-blur-lg border-white/10 text-white relative ${
                      item.premium && currentPlan.features.wisdomLibrary === "limited" ? "opacity-70" : ""
                    }`}
                  >
                    <CardContent className="p-4 space-y-4">
                      {item.premium && currentPlan.features.wisdomLibrary === "limited" && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-4 h-4 text-spiritual-stress" />
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-sf-pro font-bold">{item.title}</h3>
                            <Badge variant="outline" className="text-xs border-spiritual-teal text-spiritual-teal">
                              {item.match}% match
                            </Badge>
                            {item.premium && <Badge className="bg-spiritual-purple text-xs">Premium</Badge>}
                          </div>
                          <p className="text-sm text-white/70 mb-3">{item.description}</p>

                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{item.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {item.type === "Meditation" && <Play className="w-4 h-4" />}
                              {item.type === "Learning" && <BookOpen className="w-4 h-4" />}
                              {item.type === "Practice" && <Star className="w-4 h-4" />}
                              <span>{item.type}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white/60 hover:text-spiritual-purple"
                          onClick={() => toggleSaveItem(item.id)}
                        >
                          {savedItems.includes(item.id) ? (
                            <BookMarked className="w-5 h-5 text-spiritual-purple" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      {item.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Progress</span>
                            <span className="text-spiritual-teal">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-white/20 text-white/60">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                        onClick={() => handleContentAccess(item)}
                        disabled={item.premium && currentPlan.features.wisdomLibrary === "limited"}
                      >
                        {item.premium && currentPlan.features.wisdomLibrary === "limited"
                          ? "Upgrade Required"
                          : item.progress === 0
                            ? "Start"
                            : item.progress === 100
                              ? "Review"
                              : "Continue"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-4">
            {wisdomCollections.map((collection) => (
              <Card
                key={collection.id}
                className={`bg-black/20 backdrop-blur-lg border-white/10 text-white relative ${
                  collection.premium && currentPlan.features.wisdomLibrary === "limited" ? "opacity-70" : ""
                }`}
              >
                <CardContent className="p-4">
                  {collection.premium && currentPlan.features.wisdomLibrary === "limited" && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-spiritual-stress" />
                    </div>
                  )}
                  <div className="flex gap-4 items-center">
                    <div className="text-4xl">{collection.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-sf-pro font-bold">{collection.title}</h3>
                        {collection.premium && <Badge className="bg-spiritual-purple text-xs">Premium</Badge>}
                      </div>
                      <p className="text-sm text-white/70">{collection.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                        <BookOpen className="w-3 h-3" />
                        <span>{collection.items} items</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleCollectionAccess(collection)}
                      disabled={collection.premium && currentPlan.features.wisdomLibrary === "limited"}
                    >
                      {collection.premium && currentPlan.features.wisdomLibrary === "limited" ? "Locked" : "View"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="space-y-4">
            {savedItems.length === 0 ? (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                <CardContent className="p-8 text-center space-y-4">
                  <BookMarked className="w-12 h-12 text-white/40 mx-auto" />
                  <div>
                    <p className="text-white/60">No saved content yet</p>
                    <p className="text-sm text-white/40 mt-1">Bookmark wisdom content to access it quickly later</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setActiveTab("explore")}
                  >
                    Explore Content
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredContent.map((item) => (
                <Card key={item.id} className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-sf-pro font-bold">{item.title}</h3>
                          {item.premium && <Badge className="bg-spiritual-purple text-xs">Premium</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="w-4 h-4" />
                          <span>{item.duration}</span>
                          <span>•</span>
                          <span>{item.type}</span>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-spiritual-purple"
                        onClick={() => toggleSaveItem(item.id)}
                      >
                        <BookMarked className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-spiritual-purple to-spiritual-teal hover:opacity-90"
                      onClick={() => handleContentAccess(item)}
                      disabled={item.premium && currentPlan.features.wisdomLibrary === "limited"}
                    >
                      {item.premium && currentPlan.features.wisdomLibrary === "limited"
                        ? "Upgrade Required"
                        : item.progress === 0
                          ? "Start"
                          : item.progress === 100
                            ? "Review"
                            : "Continue"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Daily Wisdom Card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-inter flex items-center gap-2">
              <Star className="w-5 h-5 text-spiritual-teal" />
              Daily Wisdom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-3xl">🌟</div>
              <blockquote className="text-spiritual-purple italic font-sf-pro">
                "The cave you fear to enter holds the treasure you seek."
              </blockquote>
              <p className="text-sm text-white/70">- Joseph Campbell</p>
              <p className="text-xs text-white/60 mt-3">
                Today's energy calls for courage. What have you been avoiding that might lead to growth?
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button size="sm" variant="ghost" className="text-white/60">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white/60">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="wisdom"
          currentPlan={subscriptionService.getCurrentPlanName()}
        />
      </div>
    </div>
  )
}
