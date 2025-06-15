"use client"

import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"
import { usePathname } from "next/navigation"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"

// Story Protocol Aeneid testnet configuration
const aeneidTestnet = {
  id: 1513,
  name: "Story Aeneid Testnet",
  network: "aeneid",
  nativeCurrency: {
    decimals: 18,
    name: "WIP",
    symbol: "WIP",
  },
  rpcUrls: {
    public: { http: ["https://testnet.storyrpc.io"] },
    default: { http: ["https://testnet.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Story Explorer", url: "https://testnet.storyscan.xyz" },
  },
  testnet: true,
}

const config = getDefaultConfig({
  appName: "Vogue - Fashion IP Platform",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [aeneidTestnet],
  ssr: true,
  transports: {
    [aeneidTestnet.id]: http("https://testnet.storyrpc.io"),
  },
})

const queryClient = new QueryClient()

function AppContent({ children }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return children
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

export default function ClientLayout({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent>{children}</AppContent>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
