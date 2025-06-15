"use client"

import { useState, useEffect } from "react"

export default function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      type: "royalty",
      title: "Royalty Payment Received",
      description: "0.25 WIP from remix of 'Ethereal Evening Gown'",
      timestamp: "2 hours ago",
      icon: "💰",
      color: "text-green-600",
    },
    {
      id: 2,
      type: "remix",
      title: "Design Remixed",
      description: "Your 'Urban Street Jacket' was remixed by @creator123",
      timestamp: "5 hours ago",
      icon: "🔄",
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "like",
      title: "Design Liked",
      description: "Your 'Minimalist Blazer' received 5 new likes",
      timestamp: "1 day ago",
      icon: "❤️",
      color: "text-red-600",
    },
    {
      id: 4,
      type: "stake",
      title: "Staking Reward",
      description: "Earned 2.5 THREAD from staking pool",
      timestamp: "2 days ago",
      icon: "📊",
      color: "text-purple-600",
    },
  ]

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setActivities(mockActivities)
    } catch (error) {
      console.error("Error loading activities:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">📈 Recent Activity</h3>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View All</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
