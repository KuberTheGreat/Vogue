import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http } from "viem";
import { privateKeyToAccount, Address, Account } from "viem/accounts";

// const privateKey = `0x${process.env.WALLET_PRIVATE_KEY}`;
// const config = { account, transport: http(process.env.RPC_PROVIDER_URL), chainId: "aeneid" };

// Read the private key and RPC URL from .env
const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
export const account: Account = privateKeyToAccount(privateKey);

const config: StoryConfig = {
  account: account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);
