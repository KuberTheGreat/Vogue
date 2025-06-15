"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import ProfileHeader from "../../components/profile/ProfileHeader"
import ProfileStats from "../../components/profile/ProfileStats"
import ProfileSettings from "../../components/profile/ProfileSettings"
import ReputationScore from "../../components/profile/ReputationScore"
import Achievements from "../../components/profile/Achievements"
import DesignPortfolio from "../../components/profile/DesignPortfolio"

export default function Profile() {
  const { address, isConnected } = useAccount()
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    avatar: "",
    website: "",
    twitter: "",
    instagram: "",
    location: "",
  })
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalRoyalties: "0",
    followers: 0,
    following: 0,
    reputationScore: 0,
    level: 1,
  })
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockProfileData = {
    username: "FashionCreator",
    bio: "Passionate fashion designer creating the future of wearable art. Specializing in sustainable and innovative designs.",
    avatar: "/placeholder.svg?height=200&width=200",
    website: "https://fashioncreator.com",
    twitter: "@fashioncreator",
    instagram: "@fashion_creator",
    location: "New York, NY",
  }

  const mockStats = {
    totalDesigns: 24,
    totalRoyalties: "45.75",
    followers: 1250,
    following: 340,
    reputationScore: 850,
    level: 5,
  }

  useEffect(() => {
    if (isConnected) {
      loadProfileData()
    }
  }, [isConnected])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfileData(mockProfileData)
      setStats(mockStats)
    } catch (error) {
      console.error("Error loading profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <ProfileHeader profileData={profileData} setProfileData={setProfileData} address={address} loading={loading} />

      {/* Stats Overview */}
      <ProfileStats stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <ReputationScore score={stats.reputationScore} level={stats.level} />
          <Achievements />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-2 space-y-8">
          <DesignPortfolio />
          <ProfileSettings profileData={profileData} setProfileData={setProfileData} />
        </div>
      </div>
    </div>
  )
}
