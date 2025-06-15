"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useSearchParams } from "next/navigation"
import RemixCanvas from "../../components/remix/RemixCanvas"
import RemixToolbar from "../../components/remix/RemixToolbar"
import RemixLibrary from "../../components/remix/RemixLibrary"
import RemixPreview from "../../components/remix/RemixPreview"

export default function RemixStudio() {
  const { isConnected } = useAccount()
  const searchParams = useSearchParams()
  const parentDesignId = searchParams.get("parent")

  const [selectedDesign, setSelectedDesign] = useState(null)
  const [canvasElements, setCanvasElements] = useState([])
  const [selectedTool, setSelectedTool] = useState("select")
  const [remixData, setRemixData] = useState({
    title: "",
    description: "",
    royaltyPayment: "0.01",
    attribution: true,
  })

  useEffect(() => {
    if (parentDesignId) {
      loadParentDesign(parentDesignId)
    }
  }, [parentDesignId])

  const loadParentDesign = async (designId) => {
    // TODO: Load actual design data
    const mockDesign = {
      id: designId,
      title: "Original Evening Gown",
      creator: "0x1234...5678",
      image: "/placeholder.svg?height=600&width=600",
      royaltyRate: 5,
    }
    setSelectedDesign(mockDesign)
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access Remix Studio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Remix Studio 🔄</h1>
            <p className="text-gray-600">Create derivative works with automatic royalty attribution</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">Save Draft</button>
            <button className="btn-primary">Publish Remix</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <RemixToolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
          <RemixLibrary onElementSelect={(element) => setCanvasElements([...canvasElements, element])} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 relative">
          <RemixCanvas
            selectedDesign={selectedDesign}
            elements={canvasElements}
            setElements={setCanvasElements}
            selectedTool={selectedTool}
          />
        </div>

        {/* Right Sidebar - Preview & Settings */}
        <div className="w-80 bg-white border-l border-gray-200">
          <RemixPreview
            selectedDesign={selectedDesign}
            elements={canvasElements}
            remixData={remixData}
            setRemixData={setRemixData}
          />
        </div>
      </div>
    </div>
  )
}
