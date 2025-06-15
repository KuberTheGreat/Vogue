"use client"

import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Create New Design",
      description: "Upload and mint your fashion design",
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
      action: () => router.push("/create"),
    },
    {
      title: "Browse Marketplace",
      description: "Discover designs to license or remix",
      icon: "🏪",
      color: "from-blue-500 to-cyan-500",
      action: () => router.push("/marketplace"),
    },
    {
      title: "Open Remix Studio",
      description: "Create derivative works",
      icon: "🔄",
      color: "from-green-500 to-emerald-500",
      action: () => router.push("/remix"),
    },
    {
      title: "Stake on Designs",
      description: "Earn rewards from promising designs",
      icon: "💰",
      color: "from-orange-500 to-red-500",
      action: () => router.push("/staking"),
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full p-4 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <div className="text-gray-400 group-hover:text-purple-600 transition-colors">→</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
