"use client"

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Total Designs",
      value: stats.totalDesigns,
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
      change: "+2 this week",
    },
    {
      title: "Royalties Earned",
      value: `${stats.totalRoyalties} WIP`,
      icon: "💰",
      color: "from-green-500 to-emerald-500",
      change: "+0.15 WIP today",
    },
    {
      title: "Active Stakes",
      value: stats.activeStakes,
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
      change: "2 new positions",
    },
    {
      title: "Reputation Score",
      value: stats.reputationScore,
      icon: "⭐",
      color: "from-orange-500 to-red-500",
      change: "+50 this month",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}
            >
              {stat.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">{stat.change}</div>
        </div>
      ))}
    </div>
  )
}
