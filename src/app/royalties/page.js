"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import RoyaltyOverview from "../../components/royalties/RoyaltyOverview"
import RoyaltyHistory from "../../components/royalties/RoyaltyHistory"
import RoyaltyAnalytics from "../../components/royalties/RoyaltyAnalytics"
import ClaimableRoyalties from "../../components/royalties/ClaimableRoyalties"

export default function RoyaltiesDashboard() {
  const { address, isConnected } = useAccount()
  const [royaltyData, setRoyaltyData] = useState({
    totalEarned: "0",
    pendingClaims: "0",
    thisMonth: "0",
    totalDesigns: 0,
  })
  const [royaltyHistory, setRoyaltyHistory] = useState([])
  const [claimableRoyalties, setClaimableRoyalties] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockRoyaltyHistory = [
    {
      id: 1,
      type: "remix",
      designTitle: "Ethereal Evening Gown",
      amount: "0.25",
      currency: "WIP",
      from: "0x5678...9012",
      timestamp: "2024-01-15T10:30:00Z",
      txHash: "0xabc123...",
    },
    {
      id: 2,
      type: "license",
      designTitle: "Urban Street Jacket",
      amount: "1.50",
      currency: "WIP",
      from: "Fashion Brand Co.",
      timestamp: "2024-01-14T15:45:00Z",
      txHash: "0xdef456...",
    },
    {
      id: 3,
      type: "remix",
      designTitle: "Minimalist Blazer",
      amount: "0.15",
      currency: "WIP",
      from: "0x9012...3456",
      timestamp: "2024-01-13T09:20:00Z",
      txHash: "0xghi789...",
    },
  ]

  const mockClaimableRoyalties = [
    {
      id: 1,
      designTitle: "Ethereal Evening Gown",
      designImage: "/placeholder.svg?height=100&width=100",
      amount: "0.75",
      currency: "WIP",
      sources: 3,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      designTitle: "Urban Street Jacket",
      designImage: "/placeholder.svg?height=100&width=100",
      amount: "0.45",
      currency: "WIP",
      sources: 2,
      lastUpdated: "2024-01-14",
    },
  ]

  useEffect(() => {
    if (isConnected) {
      loadRoyaltyData()
    }
  }, [isConnected])

  const loadRoyaltyData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRoyaltyData({
        totalEarned: "15.75",
        pendingClaims: "1.20",
        thisMonth: "3.45",
        totalDesigns: 8,
      })
      setRoyaltyHistory(mockRoyaltyHistory)
      setClaimableRoyalties(mockClaimableRoyalties)
    } catch (error) {
      console.error("Error loading royalty data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view royalty information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Royalty Dashboard 💎</h1>
          <p className="text-gray-600 mt-2">Track your earnings from design licensing and remixes</p>
        </div>
        <button className="btn-primary">Claim All Royalties</button>
      </div>

      {/* Overview */}
      <RoyaltyOverview royaltyData={royaltyData} />

      {/* Analytics */}
      <RoyaltyAnalytics />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claimable Royalties */}
        <div className="lg:col-span-1">
          <ClaimableRoyalties royalties={claimableRoyalties} loading={loading} />
        </div>

        {/* Royalty History */}
        <div className="lg:col-span-2">
          <RoyaltyHistory history={royaltyHistory} loading={loading} />
        </div>
      </div>
    </div>
  )
}
