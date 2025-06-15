"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import MarketplaceGrid from "../../components/marketplace/MarketplaceGrid"
import MarketplaceFilters from "../../components/marketplace/MarketplaceFilters"
import FeaturedDesigns from "../../components/marketplace/FeaturedDesigns"
import TrendingCreators from "../../components/marketplace/TrendingCreators"

export default function Marketplace() {
  const { isConnected } = useAccount()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    license: "all",
    sortBy: "trending",
    search: "",
  })

  // Mock marketplace data
  const mockDesigns = [
    {
      id: 1,
      title: "Cosmic Dress Collection",
      creator: "0x1234...5678",
      creatorName: "Luna Designer",
      image: "/placeholder.svg?height=400&width=400",
      category: "evening-wear",
      price: "0.5",
      currency: "WIP",
      royaltyRate: 5,
      totalRemixes: 23,
      likes: 156,
      isExclusive: false,
      tags: ["cosmic", "elegant", "party"],
    },
    {
      id: 2,
      title: "Street Art Hoodie",
      creator: "0x5678...9012",
      creatorName: "Urban Creator",
      image: "/placeholder.svg?height=400&width=400",
      category: "streetwear",
      price: "0.2",
      currency: "WIP",
      royaltyRate: 3,
      totalRemixes: 45,
      likes: 289,
      isExclusive: false,
      tags: ["street", "urban", "art"],
    },
    {
      id: 3,
      title: "Executive Suit Design",
      creator: "0x9012...3456",
      creatorName: "Formal Fashion",
      image: "/placeholder.svg?height=400&width=400",
      category: "formal",
      price: "1.0",
      currency: "WIP",
      royaltyRate: 7,
      totalRemixes: 12,
      likes: 78,
      isExclusive: true,
      tags: ["formal", "business", "luxury"],
    },
  ]

  useEffect(() => {
    loadMarketplaceData()
  }, [])

  const loadMarketplaceData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDesigns(mockDesigns)
    } catch (error) {
      console.error("Error loading marketplace data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Fashion Marketplace 🏪</h1>
        <p className="text-gray-600 text-lg">Discover, license, and remix fashion designs from creators worldwide</p>
      </div>

      {/* Featured Designs */}
      <FeaturedDesigns />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <MarketplaceFilters filters={filters} setFilters={setFilters} />
            <TrendingCreators />
          </div>
        </div>

        {/* Main Content - Designs Grid */}
        <div className="lg:col-span-3">
          <MarketplaceGrid designs={designs} loading={loading} filters={filters} />
        </div>
      </div>
    </div>
  )
}
