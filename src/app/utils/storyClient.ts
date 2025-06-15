import { StoryClient, type StoryConfig } from "@story-protocol/core-sdk"
import { http } from "viem"
import { privateKeyToAccount, type Address, type Account } from "viem/accounts"

// Story Protocol Network Configurations
const STORY_NETWORKS = {
  aeneid: {
    chainId: "aeneid",
    rpcUrl: "https://testnet.storyrpc.io",
    name: "Story Aeneid Testnet",
  },
  odyssey: {
    chainId: "odyssey",
    rpcUrl: "https://odyssey.storyrpc.io",
    name: "Story Odyssey Testnet",
  },
  mainnet: {
    chainId: "story",
    rpcUrl: "https://mainnet.storyrpc.io", // When available
    name: "Story Mainnet",
  },
}

// ===== CHANGE THIS TO SWITCH NETWORKS =====
const SELECTED_NETWORK = "odyssey" // Change to "aeneid" or "mainnet"

const getStoryConfig = (): StoryConfig => {
  const networkConfig = STORY_NETWORKS[SELECTED_NETWORK]

  if (typeof window === "undefined") {
    // Server side
    const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
    const account: Account = privateKeyToAccount(privateKey)

    return {
      account: account,
      transport: http(process.env.RPC_PROVIDER_URL || networkConfig.rpcUrl),
      chainId: networkConfig.chainId,
    }
  }

  // Client side - will be configured with wallet
  return {
    transport: http(networkConfig.rpcUrl),
    chainId: networkConfig.chainId,
  }
}

export const getStoryClient = () => StoryClient.newClient(getStoryConfig())

// Export current network info for debugging
export const getCurrentNetwork = () => STORY_NETWORKS[SELECTED_NETWORK]
