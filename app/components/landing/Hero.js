"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import VogueLogo from "../ui/VogueLogo"

export default function Hero() {
  const { isConnected } = useAccount()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <VogueLogo size="large" />
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          Fashion
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> IP </span>
          Revolution
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Create, protect, and monetize your fashion designs with blockchain-powered IP rights. Build on others' work
          while ensuring fair royalty distribution through Story Protocol.
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400">Designs Protected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">$2M+</div>
            <div className="text-gray-400">Royalties Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-gray-400">Active Creators</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted
              const connected = ready && account && chain

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                        >
                          🚀 Connect Wallet & Start Creating
                        </button>
                      )
                    }

                    return (
                      <div className="flex gap-4">
                        <button
                          onClick={handleGetStarted}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                        >
                          🎨 Enter Dashboard
                        </button>
                        <button
                          onClick={openAccountModal}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white/20 transition-all duration-300"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
