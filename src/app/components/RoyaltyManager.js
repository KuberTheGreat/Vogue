"use client"

import { useState, useEffect } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { StoryClient } from "@story-protocol/core-sdk"
import { custom, formatEther } from "viem"

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

  const setupStoryClient = async () => {
    if (!wallet) return null
    return StoryClient.newClient({
      wallet,
      transport: custom(wallet.transport),
      chainId: "aeneid",
    })
  }

  const loadRoyaltyData = async () => {
    if (!address || !wallet) return

    setLoading(true)
    try {
      const client = await setupStoryClient()

      // Get user's IP assets
      const ipResponse = await client.ipAsset.getIpAssetsByOwner({
        owner: address,
      })
      setIpAssets(ipResponse.items || [])

      // Get royalty earnings for each IP
      let totalEarned = 0n
      let totalPending = 0n

      for (const ip of ipResponse.items || []) {
        try {
          const royaltyInfo = await client.royalty.getRoyaltyInfo({
            ipId: ip.id,
          })

          if (royaltyInfo) {
            totalEarned += BigInt(royaltyInfo.totalEarned || 0)
            totalPending += BigInt(royaltyInfo.pendingAmount || 0)
          }
        } catch (err) {
          console.log(`No royalty info for IP ${ip.id}`)
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

    try {
      const client = await setupStoryClient()
      const response = await client.royalty.claimRoyalty({
        ipId: ipId,
        claimer: address,
      })

      alert(`Royalties claimed! Tx: ${response.txHash}`)
      await loadRoyaltyData() // Refresh data
    } catch (error) {
      console.error("Error claiming royalties:", error)
      alert("Failed to claim royalties")
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
      <h2 className="text-2xl font-bold mb-6">💰 Royalty Dashboard</h2>

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
          <h3 className="font-semibold text-purple-800">Total Paid Out</h3>
          <p className="text-2xl font-bold text-purple-600">
            {loading ? "..." : `${Number.parseFloat(royaltyData.paid).toFixed(4)} WIP`}
          </p>
        </div>
      </div>

      {/* IP Assets with Royalty Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your IP Assets</h3>
        {loading ? (
          <p>Loading IP assets...</p>
        ) : ipAssets.length === 0 ? (
          <p className="text-gray-500">No IP assets found. Register some NFTs as IP first!</p>
        ) : (
          <div className="space-y-3">
            {ipAssets.map((ip) => (
              <div key={ip.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">IP ID: {ip.id.slice(0, 10)}...</p>
                  <p className="text-sm text-gray-600">Name: {ip.ipName || "Unnamed IP"}</p>
                </div>
                <button
                  onClick={() => claimRoyalties(ip.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Claim Royalties
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={loadRoyaltyData}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Data"}
      </button>
    </div>
  )
}
