export const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT || "0x1234567890123456789012345678901234567890"

// Story Protocol permanent contract address
export const ROYALTY_POLICY_LAP =
  process.env.NEXT_PUBLIC_ROYALTY_POLICY_LAP || "0x28b4F70ffE5ba7A26aEF979226f77Eb57fb9Fdb6"

// IPFS Configuration
export const PINATA_API_KEY = process.env.PINATA_API_KEY
export const PINATA_API_SECRET = process.env.PINATA_API_SECRET
export const PINATA_JWT = process.env.PINATA_JWT

// Network Configuration
export const STORY_NETWORK = {
  chainId: 1513,
  name: "Story Aeneid Testnet",
  rpcUrl: "https://testnet.storyrpc.io",
  explorerUrl: "https://testnet.storyscan.xyz",
}
