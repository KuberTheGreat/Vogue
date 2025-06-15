// 'use client';

// import { useEffect, useState } from 'react';
// import { useAccount, useWalletClient, useWriteContract } from 'wagmi';
// // import { writeContract } from '@wagmi/core';
// import { NFT_CONTRACT } from '@/contract_data/constants';
// import {abi as FASHION_ABI} from '@/contract_data/CreatorReputationABI'


// export default function RegisterIP({ tokenId }) {
//   const { address, isConnected } = useAccount();
//   const { data: walletClient } = useWalletClient();
//   const [status, setStatus] = useState('');
//   const {data: hash, writeContract} = useWriteContract();

//   const handleRegister = async () => {
//     useEffect(() => {
//         if (!isConnected || !walletClient) {
//         setStatus('🔌 Connect your wallet first');
//         return;
//         }

//         try {
//         setStatus('📝 Sending transaction...');
//             writeContract({
//             address: NFT_CONTRACT,
//             abi: FASHION_ABI,
//             functionName: 'registerIPFromFrontend',
//             args: [tokenId],
//             account: address, // <-- This is needed for walletClient to sign
//             chainId: walletClient.chain.id,
//         });
//         console.log(hash);
//         setStatus(`✅ Tx sent: ${hash}`);
//         } catch (err) {
//         console.error('🔥 Registration error:', err);
//         setStatus(`❌ Error: ${err.message}`);
//         }
//     }, [status])
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <button
//         onClick={handleRegister}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Register IP
//       </button>
//       <div className="text-sm text-gray-700">{status}</div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import { NFT_CONTRACT } from '@/contract_data/constants';
import { custom, toHex } from "viem";


export default function RegisterIP({ tokenId }) {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();
  const [status, setStatus] = useState('');
  const [ipId, setIpId] = useState(null);

  const handleRegister = async () => {
    if (!isConnected || !wallet) {
      setStatus('🔌 Please connect your wallet');
      return;
    }

    setStatus('🚀 Registering on Story Protocol...');

    try {
      const client = await StoryClient.newClient({
        wallet: wallet,
        transport: custom(wallet.transport),
        chainId: 'aeneid', // you can also use chain ID 252 directly if needed
      });

      const result = await client.ipAsset.register({
        nftContract: NFT_CONTRACT,
        tokenId: BigInt(tokenId),
        ipMetadata: {
            ipMetadataURI: 'test-metadata-uri',
            ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-metadata-uri',
            nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
        }
      });

      setIpId(result.ipId);
      setStatus(`✅ Registered with IP ID: ${result.ipId}`);
      console.log('✨ Story Protocol Registration:', result);
    } catch (err) {
      console.error('🔥 Registration failed:', err);
      setStatus(`❌ Error: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow">
      <p className="font-semibold">Token #{tokenId}</p>

      <button
        onClick={handleRegister}
        className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        disabled={!!ipId}
      >
        {ipId ? 'Registered ✅' : 'Register IP'}
      </button>

      <div className="text-sm text-gray-700">{status}</div>
    </div>
  );
}
