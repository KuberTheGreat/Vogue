"use client"

import { useState } from "react"
import { useAccount, useWalletClient, useWaitForTransactionReceipt } from "wagmi"
import { createStoryClientWithWallet } from "../../../utils/storyClient"
import { NFT_CONTRACT, ROYALTY_POLICY_LAP } from "../../../contract_data/constants"

export default function PreviewCard({ designData, onBack }) {
  const { address } = useAccount()
  const { data: wallet } = useWalletClient()
  const [minting, setMinting] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [ipId, setIpId] = useState(null)
  const [step, setStep] = useState(1) // 1: Mint NFT, 2: Register IP, 3: Set License

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const mintAndRegisterIP = async () => {
    if (!wallet || !designData.metadataUrl) {
      alert("Please upload your design to IPFS first!")
      return
    }

    setMinting(true)
    setStep(1)

    try {
      const client = createStoryClientWithWallet(wallet)

      // Step 1: Mint NFT and Register as IP
      setStep(1)
      console.log("🎨 Minting NFT and registering as IP...")

      const ipResponse = await client.ipAsset.register({
        nftContract: NFT_CONTRACT,
        tokenId: Date.now().toString(), // Use timestamp as tokenId for demo
        ipMetadata: {
          ipMetadataURI: designData.metadataUrl,
          ipMetadataHash: "0x" + "0".repeat(64), // Placeholder hash
          nftMetadataURI: designData.metadataUrl,
          nftMetadataHash: "0x" + "0".repeat(64), // Placeholder hash
        },
      })

      console.log("✅ IP registered:", ipResponse)
      setIpId(ipResponse.ipId)
      setTxHash(ipResponse.txHash)

      // Step 2: Register License Terms
      setStep(2)
      console.log("📋 Registering license terms...")

      const licenseResponse = await client.license.registerPILTerms({
        transferable: true,
        royaltyPolicy: ROYALTY_POLICY_LAP,
        mintingFee: 0,
        commercialUse: designData.commercialUse,
        commercialAttribution: true,
        commercializerChecker: "0x0000000000000000000000000000000000000000",
        commercializerCheckerData: "0x",
        commercialRevShare: designData.royaltyPercentage, // Already in basis points
        derivativesAllowed: designData.derivativesAllowed,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        currency: "0x0000000000000000000000000000000000000000", // Native token
        uri: "",
      })

      console.log("✅ License terms registered:", licenseResponse)

      // Step 3: Attach License Terms to IP
      setStep(3)
      console.log("🔗 Attaching license terms to IP...")

      const attachResponse = await client.license.attachLicenseTerms({
        ipId: ipResponse.ipId,
        licenseTermsId: licenseResponse.licenseTermsId,
      })

      console.log("✅ License terms attached:", attachResponse)

      // Success!
      alert(`🎉 Success! Your design has been minted and registered as IP!\n\nIP ID: ${ipResponse.ipId}`)
    } catch (error) {
      console.error("❌ Minting failed:", error)
      alert("❌ Minting failed: " + error.message)
    } finally {
      setMinting(false)
    }
  }

  const getStepStatus = (stepNumber) => {
    if (step > stepNumber) return "completed"
    if (step === stepNumber) return "active"
    return "pending"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Preview & Mint 🚀</h2>
        <p className="text-gray-600">Review your design details and mint as an IP-NFT on Story Protocol</p>
      </div>

      {/* Design Preview */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
            {designData.file ? (
              <img
                src={URL.createObjectURL(designData.file) || "/placeholder.svg"}
                alt="Design preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">🎨</span>
              </div>
            )}
          </div>

          {/* Design Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{designData.title || "Untitled Design"}</h3>
              <p className="text-gray-600 mt-2">{designData.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-600 capitalize">{designData.category || "Fashion"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Royalty Rate:</span>
                <p className="text-gray-600">{(designData.royaltyPercentage / 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Commercial Use:</span>
                <p className="text-gray-600">{designData.commercialUse ? "✅ Allowed" : "❌ Not Allowed"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Derivatives:</span>
                <p className="text-gray-600">{designData.derivativesAllowed ? "✅ Allowed" : "❌ Not Allowed"}</p>
              </div>
            </div>

            {designData.tags && designData.tags.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {designData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minting Progress */}
      {minting && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium text-blue-800 mb-4">🔄 Minting Progress</h4>
          <div className="space-y-3">
            {[
              { step: 1, title: "Mint NFT & Register IP", desc: "Creating your IP-NFT on Story Protocol" },
              { step: 2, title: "Register License Terms", desc: "Setting up licensing and royalty terms" },
              { step: 3, title: "Attach License to IP", desc: "Connecting license terms to your IP" },
            ].map((item) => (
              <div key={item.step} className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    getStepStatus(item.step) === "completed"
                      ? "bg-green-500 text-white"
                      : getStepStatus(item.step) === "active"
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {getStepStatus(item.step) === "completed" ? "✓" : item.step}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {ipId && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-medium text-green-800 mb-2">🎉 Success!</h4>
          <p className="text-green-700 mb-4">Your design has been successfully minted and registered as IP!</p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">IP ID:</span> {ipId}
            </p>
            {txHash && (
              <p>
                <span className="font-medium">Transaction:</span>{" "}
                <a
                  href={`https://testnet.storyscan.xyz/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Explorer
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary" disabled={minting}>
          ← Back to License Terms
        </button>
        <button
          onClick={mintAndRegisterIP}
          disabled={minting || !designData.metadataUrl}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {minting ? "Minting..." : "🚀 Mint as IP-NFT"}
        </button>
      </div>

      {/* Requirements Check */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-medium text-yellow-800 mb-2">📋 Pre-Mint Checklist</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li className={designData.file ? "text-green-700" : ""}>
            {designData.file ? "✅" : "❌"} Design file uploaded
          </li>
          <li className={designData.metadataUrl ? "text-green-700" : ""}>
            {designData.metadataUrl ? "✅" : "❌"} Metadata uploaded to IPFS
          </li>
          <li className={designData.title ? "text-green-700" : ""}>{designData.title ? "✅" : "❌"} Title provided</li>
          <li className={wallet ? "text-green-700" : ""}>{wallet ? "✅" : "❌"} Wallet connected</li>
        </ul>
      </div>
    </div>
  )
}
