"use client"

import { useState, useEffect } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { createStoryClientWithWallet } from "../../utils/storyClient"
import { formatEther } from "viem"

export default function RoyaltyManager() {
  const { address } = useAccount()
  const { data: wallet } = useWalletClient()
  const [royaltyData, setRoyaltyData] = useState({
    earned: "0",
    paid: "0",
    pending: "0",
  })
  const [ipAssets, setIpAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const [claimingRoyalties, setClaimingRoyalties] = useState({})

  const loadRoyaltyData = async () => {
    if (!address || !wallet) return

    setLoading(true)
    try {
      const client = createStoryClientWithWallet(wallet)

      // Get user's IP assets
      const ipResponse = await client.ipAsset.getIpAssetsByOwner({
        owner: address,
      })

      console.log("IP Assets:", ipResponse)
      setIpAssets(ipResponse.items || [])

      // Get royalty earnings for each IP
      let totalEarned = 0n
      let totalPending = 0n

      for (const ip of ipResponse.items || []) {
        try {
          // Try to get royalty info for each IP
          const royaltyInfo = await client.royalty.getRoyaltyInfo({
            ipId: ip.id,
          })

          console.log(`Royalty info for ${ip.id}:`, royaltyInfo)

          if (royaltyInfo) {
            totalEarned += BigInt(royaltyInfo.totalEarned || 0)
            totalPending += BigInt(royaltyInfo.pendingAmount || 0)
          }
        } catch (err) {
          console.log(`No royalty info for IP ${ip.id}:`, err.message)
        }
      }

      setRoyaltyData({
        earned: formatEther(totalEarned),
        paid: "0", // This would need to be tracked separately
        pending: formatEther(totalPending),
      })
    } catch (error) {
      console.error("Error loading royalty data:", error)
    } finally {
      setLoading(false)
    }
  }

  const claimRoyalties = async (ipId) => {
    if (!wallet) return

    setClaimingRoyalties({ ...claimingRoyalties, [ipId]: true })

    try {
      const client = createStoryClientWithWallet(wallet)
      const response = await client.royalty.claimRoyalty({
        ipId: ipId,
        claimer: address,
      })

      console.log("Royalty claim response:", response)
      alert(`✅ Royalties claimed! Transaction: ${response.txHash}`)

      // Refresh data
      await loadRoyaltyData()
    } catch (error) {
      console.error("Error claiming royalties:", error)
      alert("❌ Failed to claim royalties: " + error.message)
    } finally {
      setClaimingRoyalties({ ...claimingRoyalties, [ipId]: false })
    }
  }

  const claimAllRoyalties = async () => {
    const claimableIPs = ipAssets.filter((ip) => {
      // TODO: Add logic to check if IP has claimable royalties
      return true
    })

    for (const ip of claimableIPs) {
      await claimRoyalties(ip.id)
    }
  }

  useEffect(() => {
    if (address && wallet) {
      loadRoyaltyData()
    }
  }, [address, wallet])

  if (!address) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-center">Connect your wallet to view royalty information</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">💰 Royalty Dashboard</h2>
        <button
          onClick={claimAllRoyalties}
          disabled={loading || ipAssets.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          Claim All Royalties
        </button>
      </div>

      {/* Royalty Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800">Total Earned</h3>
          <p className="text-2xl font-bold text-green-600">
            {loading ? "..." : `${Number.parseFloat(royaltyData.earned).toFixed(4)} WIP`}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800">Pending Claims</h3>
          <p className="text-2xl font-bold text-blue-600">
            {loading ? "..." : `${Number.parseFloat(royaltyData.pending).toFixed(4)} WIP`}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-800">Total IP Assets</h3>
          <p className="text-2xl font-bold text-purple-600">{loading ? "..." : ipAssets.length}</p>
        </div>
      </div>

      {/* IP Assets with Royalty Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your IP Assets</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : ipAssets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-gray-500 mb-4">No IP assets found. Create and register some designs first!</p>
            <button onClick={() => (window.location.href = "/create")} className="btn-primary">
              Create Your First Design
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {ipAssets.map((ip) => (
              <div key={ip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{ip.ipName || `IP Asset ${ip.id.slice(0, 10)}...`}</p>
                    <p className="text-sm text-gray-600">ID: {ip.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(ip.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => claimRoyalties(ip.id)}
                    disabled={claimingRoyalties[ip.id]}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {claimingRoyalties[ip.id] ? "Claiming..." : "💰 Claim Royalties"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={loadRoyaltyData}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "🔄 Refresh Data"}
      </button>
    </div>
  )
}
