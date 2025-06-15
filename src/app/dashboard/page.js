"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import DashboardStats from "../../components/dashboard/DashboardStats"
import RecentActivity from "../../components/dashboard/RecentActivity"
import QuickActions from "../../components/dashboard/QuickActions"
import TrendingDesigns from "../../components/dashboard/TrendingDesigns"

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [userStats, setUserStats] = useState({
    totalDesigns: 0,
    totalRoyalties: "0.00",
    activeStakes: 0,
    reputationScore: 0,
  })

  useEffect(() => {
    if (isConnected && address) {
      // Load user stats
      loadUserStats()
    }
  }, [isConnected, address])

  const loadUserStats = async () => {
    // TODO: Implement actual data loading
    setUserStats({
      totalDesigns: 12,
      totalRoyalties: "2.45",
      activeStakes: 8,
      reputationScore: 850,
    })
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Creator! 🎨</h1>
        <p className="text-purple-100">Ready to create, remix, and earn from your fashion designs?</p>
        <div className="mt-4 text-sm text-purple-200">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={userStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <RecentActivity />
          <TrendingDesigns />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
