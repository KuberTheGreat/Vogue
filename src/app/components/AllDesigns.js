'use client';

import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { useAccount, useChainId } from 'wagmi';
import { NFT_CONTRACT } from '@/contract_data/constants';
import { abi as FASHION_ABI } from '@/contract_data/CreatorReputationABI';

export default function AllDesigns() {
  const { address } = useAccount();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const chainId = useChainId()

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const total = await readContract({
        address: NFT_CONTRACT,
        abi: FASHION_ABI,
        functionName: 'getTotalDesigns',
        chainId: 'aeneid'
      });

      const designPromises = [];
      for (let i = 1; i <= Number(total); i++) {
        designPromises.push(fetchSingleDesign(i));
      }

      const allDesigns = await Promise.all(designPromises);
      setDesigns(allDesigns.filter(Boolean));
    } catch (err) {
      console.error('❌ Error loading designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleDesign = async (tokenId) => {
    try {
      const [design, uri] = await Promise.all([
        readContract({
          address: NFT_CONTRACT,
          abi: FASHION_ABI,
          functionName: 'getDesign',
          args: [tokenId],
          chainId: 'aeneid'
        }),
        readContract({
          address: NFT_CONTRACT,
          abi: FASHION_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
          chainId: 'aeneid'
        }),
      ]);

      const res = await fetch(uri);
      const metadata = await res.json();

      return {
        tokenId,
        metadata,
        creator: design[1],
        isOriginal: design[3],
      };
    } catch (err) {
      console.warn(`⚠️ Failed to fetch design ${tokenId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [chainId]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {loading && <p className="text-center col-span-full">Loading designs... 🧵</p>}

      {!loading && designs.length === 0 && (
        <p className="text-center col-span-full">No designs found yet 😢</p>
      )}

      {designs.map((design) => (
        <div key={design.tokenId} className="border rounded shadow p-4 bg-white">
          <img src={design.metadata.image} alt={design.metadata.name} className="w-full h-48 object-cover rounded" />
          <h3 className="mt-2 font-semibold">{design.metadata.name}</h3>
          <p className="text-sm text-gray-600">{design.metadata.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            #{design.tokenId} · {design.isOriginal ? 'Original' : 'Remix'}
          </p>
          <p className="text-xs mt-1">👤 {design.creator.slice(0, 6)}...{design.creator.slice(-4)}</p>
        </div>
      ))}
    </div>
  );
}
