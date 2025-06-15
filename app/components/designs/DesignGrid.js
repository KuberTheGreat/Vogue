"use client"

import { useState, useEffect } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { createStoryClientWithWallet } from "../../../utils/storyClient"

export default function DesignGrid({ designs, loading }) {
  const { address } = useAccount()
  const { data: wallet } = useWalletClient()
  const [ipAssets, setIpAssets] = useState([])
  const [loadingIPs, setLoadingIPs] = useState(false)

  useEffect(() => {
    if (wallet && address) {
      loadUserIPs()
    }
  }, [wallet, address])

  const loadUserIPs = async () => {
    setLoadingIPs(true)
    try {
      const client = createStoryClientWithWallet(wallet)

      // Get user's IP assets
      const ipResponse = await client.ipAsset.getIpAssetsByOwner({
        owner: address,
      })

      console.log("User IP Assets:", ipResponse)
      setIpAssets(ipResponse.items || [])
    } catch (error) {
      console.error("Error loading IP assets:", error)
    } finally {
      setLoadingIPs(false)
    }
  }

  const claimRoyalties = async (ipId) => {
    if (!wallet) return

    try {
      const client = createStoryClientWithWallet(wallet)
      const response = await client.royalty.claimRoyalty({
        ipId: ipId,
        claimer: address,
      })

      alert(`✅ Royalties claimed! Transaction: ${response.txHash}`)
      await loadUserIPs() // Refresh data
    } catch (error) {
      console.error("Error claiming royalties:", error)
      alert("❌ Failed to claim royalties: " + error.message)
    }
  }

  const getDerivatives = async (ipId) => {
    try {
      const client = createStoryClientWithWallet(wallet)
      // TODO: Implement get derivatives function when available in SDK
      console.log("Getting derivatives for IP:", ipId)
    } catch (error) {
      console.error("Error getting derivatives:", error)
    }
  }

  if (loading || loadingIPs) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Combine mock designs with real IP assets
  const allDesigns = [
    ...designs,
    ...ipAssets.map((ip) => ({
      id: ip.id,
      title: ip.ipName || `IP Asset ${ip.id.slice(0, 8)}...`,
      description: "Registered IP Asset on Story Protocol",
      image: "/placeholder.svg?height=400&width=400",
      category: "ip-asset",
      status: "active",
      royaltiesEarned: "0.00", // TODO: Get actual royalty data
      totalRemixes: 0, // TODO: Get actual remix count
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      tags: ["story-protocol", "ip"],
      ipId: ip.id,
      isRealIP: true,
    })),
  ]

  if (allDesigns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No designs yet</h3>
        <p className="text-gray-600 mb-6">Create your first fashion design to get started!</p>
        <button onClick={() => (window.location.href = "/create")} className="btn-primary">
          Create Your First Design
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allDesigns.map((design) => (
        <div
          key={design.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={design.image || "/placeholder.svg?height=400&width=400"}
              alt={design.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  design.status === "active"
                    ? "bg-green-100 text-green-800"
                    : design.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {design.isRealIP ? "IP Asset" : design.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{design.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{design.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Royalties:</span>
                <p className="font-medium text-green-600">{design.royaltiesEarned} WIP</p>
              </div>
              <div>
                <span className="text-gray-500">Remixes:</span>
                <p className="font-medium text-blue-600">{design.totalRemixes}</p>
              </div>
            </div>

            {/* Tags */}
            {design.tags && design.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {design.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {design.isRealIP ? (
                <>
                  <button
                    onClick={() => claimRoyalties(design.ipId)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                  >
                    💰 Claim Royalties
                  </button>
                  <button
                    onClick={() => getDerivatives(design.ipId)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    🔄 View Remixes
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors">
                    📊 Analytics
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors">
                    ⚙️ Settings
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
