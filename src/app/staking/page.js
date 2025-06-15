"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import StakingOverview from "../../components/staking/StakingOverview"
import ActivePools from "../../components/staking/ActivePools"
import MyStakes from "../../components/staking/MyStakes"
import StakingStats from "../../components/staking/StakingStats"

export default function StakingPools() {
  const { address, isConnected } = useAccount()
  const [stakingData, setStakingData] = useState({
    totalStaked: "0",
    totalRewards: "0",
    activeStakes: 0,
    threadBalance: "0",
  })
  const [pools, setPools] = useState([])
  const [myStakes, setMyStakes] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockPools = [
    {
      id: 1,
      designTitle: "Ethereal Evening Gown",
      designImage: "/placeholder.svg?height=300&width=300",
      creator: "0x1234...5678",
      totalStaked: "1250.5",
      apy: "45.2",
      timeLeft: "6 days",
      participants: 89,
      riskLevel: "medium",
      category: "evening-wear",
    },
    {
      id: 2,
      designTitle: "Urban Street Collection",
      designImage: "/placeholder.svg?height=300&width=300",
      creator: "0x5678...9012",
      totalStaked: "890.3",
      apy: "62.8",
      timeLeft: "12 days",
      participants: 156,
      riskLevel: "high",
      category: "streetwear",
    },
    {
      id: 3,
      designTitle: "Minimalist Workspace",
      designImage: "/placeholder.svg?height=300&width=300",
      creator: "0x9012...3456",
      totalStaked: "2100.8",
      apy: "28.5",
      timeLeft: "3 days",
      participants: 234,
      riskLevel: "low",
      category: "formal",
    },
  ]

  const mockMyStakes = [
    {
      id: 1,
      poolId: 1,
      designTitle: "Ethereal Evening Gown",
      amountStaked: "100.0",
      currentValue: "112.5",
      rewards: "12.5",
      apy: "45.2",
      stakedAt: "2024-01-10",
    },
    {
      id: 2,
      poolId: 3,
      designTitle: "Minimalist Workspace",
      amountStaked: "250.0",
      currentValue: "267.8",
      rewards: "17.8",
      apy: "28.5",
      stakedAt: "2024-01-08",
    },
  ]

  useEffect(() => {
    if (isConnected) {
      loadStakingData()
    }
  }, [isConnected])

  const loadStakingData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPools(mockPools)
      setMyStakes(mockMyStakes)
      setStakingData({
        totalStaked: "350.0",
        totalRewards: "30.3",
        activeStakes: 2,
        threadBalance: "1250.75",
      })
    } catch (error) {
      console.error("Error loading staking data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access staking pools</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Staking Pools 💰</h1>
        <p className="text-gray-600 text-lg">
          Stake $THREAD tokens on promising designs and earn rewards based on their success
        </p>
      </div>

      {/* Staking Overview */}
      <StakingOverview stakingData={stakingData} />

      {/* Stats */}
      <StakingStats />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Pools */}
        <div className="lg:col-span-2">
          <ActivePools pools={pools} loading={loading} />
        </div>

        {/* My Stakes */}
        <div>
          <MyStakes stakes={myStakes} loading={loading} />
        </div>
      </div>
    </div>
  )
}
