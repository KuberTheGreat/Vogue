"use client"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit"

import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"

// Story Protocol Aeneid testnet configuration
const aeneidChain = {
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


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const config = getDefaultConfig({
  appName: "Vogue Story Protocol",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [aeneidChain],
  ssr: true,
  transports: {
    [aeneidChain.id]: http("https://testnet.storyrpc.io"),
  },
})

const queryClient = new QueryClient()

export default function AppLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div style={{ padding: "1rem" }}>
                <ConnectButton />
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
