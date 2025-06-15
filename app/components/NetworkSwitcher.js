"use client"

import { useState } from "react"
import { getCurrentNetwork } from "../../utils/storyClient"

export default function NetworkSwitcher() {
  const [currentNetwork] = useState(getCurrentNetwork())

  const networks = {
    aeneid: {
      name: "Story Aeneid Testnet",
      chainId: 1513,
      status: "Active",
      color: "bg-green-100 text-green-800",
    },
    odyssey: {
      name: "Story Odyssey Testnet",
      chainId: 1516,
      status: "Active",
      color: "bg-blue-100 text-blue-800",
    },
    mainnet: {
      name: "Story Mainnet",
      chainId: "TBD",
      status: "Coming Soon",
      color: "bg-gray-100 text-gray-800",
    },
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">🌐 Network Status</h3>

      <div className="space-y-2">
        {Object.entries(networks).map(([key, network]) => (
          <div
            key={key}
            className={`p-3 rounded-lg border-2 ${
              key === Object.keys(networks).find((k) => networks[k].name === currentNetwork.name)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{network.name}</p>
                <p className="text-sm text-gray-600">Chain ID: {network.chainId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${network.color}`}>{network.status}</span>
                {key === Object.keys(networks).find((k) => networks[k].name === currentNetwork.name) && (
                  <span className="text-blue-600 font-medium">✓ Current</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> To switch networks, update the configuration in layout.js and storyClient.ts, then
          restart your development server.
        </p>
      </div>
    </div>
  )
}
