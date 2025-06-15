"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import VogueLogo from "../ui/VogueLogo"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected } = useAccount()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠", active: pathname === "/dashboard" },
    { name: "Create Design", href: "/create", icon: "🎨", active: pathname === "/create" },
    { name: "My Designs", href: "/designs", icon: "🖼️", active: pathname === "/designs" },
    { name: "Remix Studio", href: "/remix", icon: "🔄", active: pathname === "/remix" },
    { name: "Marketplace", href: "/marketplace", icon: "🏪", active: pathname === "/marketplace" },
    { name: "Staking Pools", href: "/staking", icon: "💰", active: pathname === "/staking" },
    { name: "Royalties", href: "/royalties", icon: "💎", active: pathname === "/royalties" },
    { name: "Profile", href: "/profile", icon: "👤", active: pathname === "/profile" },
  ]

  const handleNavigation = (href) => {
    if (!isConnected && href !== "/") {
      // Redirect to landing page if not connected
      router.push("/")
      return
    }
    router.push(href)
  }

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <VogueLogo size="medium" className="cursor-pointer" onClick={() => handleNavigation("/")} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href)}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
              item.active
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
            }`}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            {item.active && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Powered by Story Protocol</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
