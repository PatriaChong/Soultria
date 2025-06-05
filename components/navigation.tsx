"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Brain, BookOpen, Sparkles, MessageCircle, User, Library, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/meditation", icon: Brain, label: "Meditate" },
  { href: "/journal", icon: BookOpen, label: "Journal" },
  { href: "/divination", icon: Sparkles, label: "Divine" },
  { href: "/wisdom", icon: Library, label: "Wisdom" },
  { href: "/companion", icon: MessageCircle, label: "Guide" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/pricing", icon: Crown, label: "Plans" },
]

export function Navigation() {
  const pathname = usePathname()

  if (pathname === "/onboarding") return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive ? "text-spiritual-purple spiritual-glow" : "text-white/60 hover:text-white/80",
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-sf-pro">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
