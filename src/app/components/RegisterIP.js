'use client';

import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import { toHex, custom } from 'viem';
import axios from 'axios';
import { PINATA_JWT } from '@/contract_data/constants.js';

export default function RegisterIP() {
  const { data: wallet } = useWalletClient();

  const [form, setForm] = useState({
    nftContract: '',
    tokenId: '',
    name: '',
    description: '',
    creator: '',
    licenseTags: '',
    nftMetadataURI: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setupStoryClient = async () => {
    if (!wallet) return null;
    return StoryClient.newClient({
      wallet,
      transport: custom(wallet.transport),
      chainId: 'aeneid',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Uploading IP Metadata...');

    try {
      const ipMetadataJSON = {
        name: form.name,
        description: form.description,
        creator: form.creator,
        creationDate: new Date().toISOString(),
        licenseTags: form.licenseTags.split(',').map(tag => tag.trim()),
        version: "1.0"
      };

      const metadataBlob = new Blob([JSON.stringify(ipMetadataJSON)], {
        type: 'application/json'
      });

      const formData = new FormData();
      formData.append('file', metadataBlob);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const ipMetadataURI = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

      setStatus('📡 Registering with Story Protocol...');

      const client = await setupStoryClient();
      const response = await client.ipAsset.register({
        nftContract: form.nftContract,
        tokenId: form.tokenId,
        ipMetadata: {
          ipMetadataURI,
          ipMetadataHash: toHex('ip-metadata-hash', { size: 32 }),
          nftMetadataURI: form.nftMetadataURI,
          nftMetadataHash: toHex('nft-metadata-hash', { size: 32 }),
        }
      });

      setStatus(`✅ IP Registered! Tx: ${response.txHash}, ID: ${response.ipId}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error registering IP');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-black rounded shadow">
      <h2 className="text-lg font-bold mb-4">Register Design as IP</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="nftContract" onChange={handleChange} placeholder="NFT Contract Address" className="w-full p-2 border rounded" required />
        <input type="text" name="tokenId" onChange={handleChange} placeholder="Token ID" className="w-full p-2 border rounded" required />
        <input type="text" name="nftMetadataURI" onChange={handleChange} placeholder="NFT Metadata URI" className="w-full p-2 border rounded" required />
        <input type="text" name="name" onChange={handleChange} placeholder="IP Name" className="w-full p-2 border rounded" required />
        <textarea name="description" onChange={handleChange} placeholder="IP Description" className="w-full p-2 border rounded" required />
        <input type="text" name="creator" onChange={handleChange} placeholder="Creator Name" className="w-full p-2 border rounded" required />
        <input type="text" name="licenseTags" onChange={handleChange} placeholder="License Tags (comma-separated)" className="w-full p-2 border rounded" required />

        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Register IP
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-700">{status}</div>
    </div>
  );
}
