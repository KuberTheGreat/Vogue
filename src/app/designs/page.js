"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import DesignGrid from "../../components/designs/DesignGrid"
import DesignFilters from "../../components/designs/DesignFilters"
import DesignStats from "../../components/designs/DesignStats"

export default function MyDesigns() {
  const { address, isConnected } = useAccount()
  const [designs, setDesigns] = useState([])
  const [filteredDesigns, setFilteredDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    sortBy: "newest",
  })

  // Mock data - replace with actual API calls
  const mockDesigns = [
    {
      id: 1,
      title: "Ethereal Evening Gown",
      description: "Flowing silk gown with celestial embroidery",
      image: "/placeholder.svg?height=400&width=400",
      category: "evening-wear",
      status: "active",
      royaltiesEarned: "2.45",
      totalRemixes: 8,
      views: 1250,
      likes: 89,
      createdAt: "2024-01-15",
      tags: ["elegant", "silk", "embroidery"],
    },
    {
      id: 2,
      title: "Urban Street Jacket",
      description: "Edgy leather jacket with geometric patterns",
      image: "/placeholder.svg?height=400&width=400",
      category: "streetwear",
      status: "active",
      royaltiesEarned: "1.23",
      totalRemixes: 12,
      views: 890,
      likes: 67,
      createdAt: "2024-01-10",
      tags: ["urban", "leather", "geometric"],
    },
    {
      id: 3,
      title: "Minimalist Blazer",
      description: "Clean lines and premium wool construction",
      image: "/placeholder.svg?height=400&width=400",
      category: "formal",
      status: "pending",
      royaltiesEarned: "0.00",
      totalRemixes: 0,
      views: 234,
      likes: 23,
      createdAt: "2024-01-12",
      tags: ["minimalist", "wool", "professional"],
    },
  ]

  useEffect(() => {
    if (isConnected) {
      loadDesigns()
    }
  }, [isConnected])

  useEffect(() => {
    applyFilters()
  }, [designs, filters])

  const loadDesigns = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDesigns(mockDesigns)
    } catch (error) {
      console.error("Error loading designs:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...designs]

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((design) => design.category === filters.category)
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((design) => design.status === filters.status)
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "most-remixed":
        filtered.sort((a, b) => b.totalRemixes - a.totalRemixes)
        break
      case "highest-earning":
        filtered.sort((a, b) => Number.parseFloat(b.royaltiesEarned) - Number.parseFloat(a.royaltiesEarned))
        break
    }

    setFilteredDesigns(filtered)
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your designs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Designs 🖼️</h1>
          <p className="text-gray-600 mt-2">Manage your fashion IP portfolio and track performance</p>
        </div>
        <button onClick={() => (window.location.href = "/create")} className="btn-primary">
          + Create New Design
        </button>
      </div>

      {/* Stats Overview */}
      <DesignStats designs={designs} />

      {/* Filters */}
      <DesignFilters filters={filters} setFilters={setFilters} />

      {/* Designs Grid */}
      <DesignGrid designs={filteredDesigns} loading={loading} />
    </div>
  )
}
