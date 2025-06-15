"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import Architecture from "../components/landing/Architecture"
import Footer from "../components/landing/Footer"

export default function LandingPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to dashboard if already connected
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Hero />
      <Features />
      <Architecture />
      <Footer />
    </div>
  )
}
