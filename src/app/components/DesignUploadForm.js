

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useWriteContract, useAccount } from 'wagmi';
import { PINATA_API_KEY, PINATA_API_SECRET, NFT_CONTRACT } from '@/contract_data/constants.js';
import {abi} from "@/contract_data/CreatorReputationABI.js"

const _PINATA_API_KEY = PINATA_API_KEY;
const _PINATA_SECRET = PINATA_API_SECRET;

export default function DesignMintForm() {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    if (!file || !name) return alert('Please provide name and image');

    try {
      setLoading(true);

      // Step 1: Upload image to IPFS via Pinata
      const imgData = new FormData();
      imgData.append('file', file);

      const imgRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imgData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: _PINATA_API_KEY,
          pinata_secret_api_key: _PINATA_SECRET,
        },
      });

      const imageHash = imgRes.data.IpfsHash;
      const imageUrl = `https://crimson-immediate-cricket-188.mypinata.cloud/ipfs/${imageHash}`;

      // Step 2: Upload metadata
      const metadata = {
        name,
        description: `Design by ${address}`,
        image: imageUrl,
      };

      const metaRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            pinata_api_key: _PINATA_API_KEY,
            pinata_secret_api_key: _PINATA_SECRET,
          },
        }
      );
      const metadataURI = `https://crimson-immediate-cricket-188.mypinata.cloud/ipfs/${metaRes.data.IpfsHash}`;

      // Step 3: Mint NFT
      await writeContractAsync({
        address: NFT_CONTRACT,
        abi: abi,
        functionName: 'mintOriginal',
        args: [metadataURI, 1], // tokenId, amount, URI (depends on your contract)
      });

      alert('✅ NFT minted successfully!');
    } catch (err) {
      console.error('❌ Error uploading or minting:', err);
      alert('Something went wrong. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="p-4 space-y-4 max-w-md mx-auto bg-black rounded shadow">
      <h2 className="text-xl font-semibold">Upload & Mint Design NFT</h2>

      <input
        type="text"
        placeholder="Design Name"
        className="w-full px-4 py-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={handleFileChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Uploading...' : 'Mint Design NFT'}
      </button>
    </form>
  );
}
