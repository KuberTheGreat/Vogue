"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import DesignUploader from "../../components/create/DesignUploader"
import DesignMetadata from "../../components/create/DesignMetadata"
import LicenseTerms from "../../components/create/LicenseTerms"
import PreviewCard from "../../components/create/PreviewCard"

export default function CreateDesign() {
  const { isConnected } = useAccount()
  const [currentStep, setCurrentStep] = useState(1)
  const [designData, setDesignData] = useState({
    file: null,
    title: "",
    description: "",
    category: "",
    tags: [],
    royaltyPercentage: 500, // 5%
    commercialUse: true,
    derivativesAllowed: true,
    exclusivity: "non-exclusive",
    price: "",
  })

  const steps = [
    { id: 1, name: "Upload Design", icon: "📁" },
    { id: 2, name: "Add Details", icon: "📝" },
    { id: 3, name: "License Terms", icon: "📋" },
    { id: 4, name: "Preview & Mint", icon: "🚀" },
  ]

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to create designs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Create New Design 🎨</h1>
        <p className="text-gray-600 text-lg">
          Upload your fashion design and register it as an IP-NFT with customizable licensing terms
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="ml-2 mr-4">
                <div className={`text-sm font-medium ${currentStep >= step.id ? "text-purple-600" : "text-gray-400"}`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    currentStep > step.id ? "bg-purple-500" : "bg-gray-300"
                  } transition-colors duration-300`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {currentStep === 1 && (
              <DesignUploader designData={designData} setDesignData={setDesignData} onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
              <DesignMetadata
                designData={designData}
                setDesignData={setDesignData}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <LicenseTerms
                designData={designData}
                setDesignData={setDesignData}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && <PreviewCard designData={designData} onBack={() => setCurrentStep(3)} />}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Design Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Design Preview</h3>
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              {designData.file ? (
                <img
                  src={URL.createObjectURL(designData.file) || "/placeholder.svg"}
                  alt="Design preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <span className="text-4xl mb-2 block">🎨</span>
                  <p>Upload a design to see preview</p>
                </div>
              )}
            </div>
            {designData.title && (
              <div>
                <h4 className="font-bold text-gray-800">{designData.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{designData.description}</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• High-quality images get more remixes</li>
              <li>• Clear descriptions improve discoverability</li>
              <li>• Fair royalty rates encourage derivatives</li>
              <li>• Trending tags boost visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
