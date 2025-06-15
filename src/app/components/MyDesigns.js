'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { NFT_CONTRACT } from '@/contract_data/constants.js';
import { abi } from '@/contract_data/CreatorReputationABI.js';
import RegisterIP from './RegisterIP.js';
import { createPublicClient, http } from 'viem'
import { storyAeneid } from 'wagmi/chains'


export default function MyDesigns() {
  const { address, isConnected } = useAccount();
  const publicClient = createPublicClient({
    chain: storyAeneid,
    transport: http(),
    })
  const [designs, setDesigns] = useState([]);
  const MAX_TOKEN_ID = 10; // adjust if you expect more
  useEffect(() => {
    async function fetchOwnedDesigns() {
      if (!isConnected || !address) return;

      console.log('💜 Connected:', address);

      const found = [];

      for (let tokenId = 1; tokenId <= MAX_TOKEN_ID; tokenId++) {
        try {
            let uri = await publicClient.readContract({
              address: NFT_CONTRACT,
              abi: abi,
              functionName: 'tokenURI',
              args: [BigInt(tokenId)],
              publicClient,
            });

            // If your uri uses placeholders, uncomment below:
            // if (uri.includes('{id}')) {
            //   uri = uri.replace('{id}', tokenId.toString(16).padStart(64, '0'));
            // }

            const metaRes = await fetch(uri);
            const meta = await metaRes.json();

            found.push({
              tokenId,
              uri,
              meta,
            });
        } catch (e) {
          console.error(`Error tokenId=${tokenId}:`, e.message);
        }
      }

      console.log('➡️ Found designs:', found);
      setDesigns(found);
    }

    fetchOwnedDesigns();
  }, [isConnected, address]);

  if (!isConnected) {
    return <p className="p-4 text-center">🔌 Connect your wallet to see your designs.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎨 Your Minted Designs</h2>

      {designs.length === 0 ? (
        <p>No designs found yet — mint some originals or remixes!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(({ tokenId, uri, meta }) => (
            <div key={tokenId} className="border rounded-lg shadow-lg p-4">
              {meta.image && (
                <img src={meta.image} alt={meta.name} className="w-full h-48 object-cover rounded" />
              )}
              <div className="mt-2">
                <p><strong>ID:</strong> {tokenId}</p>
                <p><strong>Name:</strong> {meta.name || '—'}</p>
                <p className="truncate"><strong>URI:</strong> {uri}</p>
              </div>

              <div className="mt-4">
                <RegisterIP tokenId={tokenId.toString()}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
