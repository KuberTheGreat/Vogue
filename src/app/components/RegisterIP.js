'use client';

import { useEffect, useState } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import { toHex, custom } from 'viem';
import axios from 'axios';
import { PINATA_JWT } from '@/contract_data/constants.js';
import { parseEther, zeroAddress } from 'viem';

export default function RegisterIP({ tokenId, nftContract }) {
  const { address } = useAccount();
  const { data: wallet } = useWalletClient();

  const [form, setForm] = useState({
    nftContract: nftContract || '',
    tokenId: tokenId || '',
    name: '',
    description: '',
    creator: '',
    licenseTags: '',
    nftMetadataURI: '',
  });

  const [status, setStatus] = useState('');
  const [ipList, setIpList] = useState([]);
  const [selectedIp, setSelectedIp] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [royaltyHistory, setRoyaltyHistory] = useState([]);

  const setupStoryClient = async () => {
    if (!wallet) return null;
    return StoryClient.newClient({
      wallet,
      transport: custom(wallet.transport),
      chainId: 'aeneid',
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        licenseTags: form.licenseTags.split(',').map((tag) => tag.trim()),
        version: '1.0',
      };

      const metadataBlob = new Blob([JSON.stringify(ipMetadataJSON)], {
        type: 'application/json',
      });

      const formData = new FormData();
      formData.append('file', metadataBlob);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          'Content-Type': 'multipart/form-data',
        },
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
        },
      });

      setStatus(`✅ IP Registered! Tx: ${response.txHash}, ID: ${response.ipId}`);
      await loadMyIps(); // refresh IP list
    } catch (err) {
      console.error(err);
      setStatus('❌ Error registering IP');
    }
  };

  const handleTip = async () => {
    if (!selectedIp || !tipAmount || isNaN(Number(tipAmount))) {
      alert('Select IP and valid tip amount');
      return;
    }

    setStatus('💸 Sending royalty tip...');
    try {
      const client = await setupStoryClient();
      const response = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: selectedIp,
        payerIpId: zeroAddress,
        token: '0x0000000000000000000000000000000000000000', // WIP Token (native)
        amount: parseEther(tipAmount),
      });

      setStatus(`✅ Royalty sent! Tx: ${response.txHash}`);
      await loadRoyaltyHistory(); // Refresh royalty history
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to send royalty');
    }
  };

  const loadMyIps = async () => {
    try {
      const client = await setupStoryClient();
      const res = await client.ipAsset.getIpAssetsByOwner({ owner: address });
      setIpList(res.items.map((ip) => ({ id: ip.id, name: ip.ipName || ip.id })));
    } catch (err) {
      console.error('Error loading IPs:', err);
    }
  };

  const loadRoyaltyHistory = async () => {
    try {
      const client = await setupStoryClient();
      const history = await client.royalty.getRoyaltyHistory({ walletAddress: address });
      setRoyaltyHistory(history.items);
    } catch (err) {
      console.error('Error loading royalty history:', err);
    }
  };

  useEffect(() => {
    if (address && wallet) {
      loadMyIps();
      loadRoyaltyHistory();
    }
  }, [address, wallet]);

  return (
    <div className="p-4 max-w-xl mx-auto bg-black text-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Register Design as IP</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="nftContract" onChange={handleChange} value={form.nftContract} placeholder="NFT Contract Address" className="w-full p-2 border rounded text-black" required />
        <input type="text" name="tokenId" onChange={handleChange} value={form.tokenId} placeholder="Token ID" className="w-full p-2 border rounded text-black" required />
        <input type="text" name="nftMetadataURI" onChange={handleChange} placeholder="NFT Metadata URI" className="w-full p-2 border rounded text-black" required />
        <input type="text" name="name" onChange={handleChange} placeholder="IP Name" className="w-full p-2 border rounded text-black" required />
        <textarea name="description" onChange={handleChange} placeholder="IP Description" className="w-full p-2 border rounded text-black" required />
        <input type="text" name="creator" onChange={handleChange} placeholder="Creator Name" className="w-full p-2 border rounded text-black" required />
        <input type="text" name="licenseTags" onChange={handleChange} placeholder="License Tags (comma-separated)" className="w-full p-2 border rounded text-black" required />

        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Register IP
        </button>
      </form>

      {/* Tipping section */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">💸 Tip Your Registered IPs</h3>

        <select
          value={selectedIp}
          onChange={(e) => setSelectedIp(e.target.value)}
          className="w-full p-2 text-black rounded mb-2"
        >
          <option value="">Select IP to tip</option>
          {ipList.map((ip) => (
            <option key={ip.id} value={ip.id}>
              {ip.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Amount in WIP"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />
        <button onClick={handleTip} className="w-full p-2 bg-green-600 rounded hover:bg-green-700">
          Send Royalty
        </button>
      </div>

      {/* Royalty History */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">📜 Royalty History</h3>
        {royaltyHistory.length === 0 ? (
          <p className="text-gray-400">No royalty records found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {royaltyHistory.map((r, i) => (
              <li key={i} className="border-b py-1">
                <strong>Tx:</strong> {r.transactionHash.slice(0, 10)}...
                <br />
                <strong>Amount:</strong> {Number(r.amount) / 1e18} WIP
                <br />
                <strong>From:</strong> {r.payerIpId || '—'} <br />
                <strong>To:</strong> {r.receiverIpId}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 text-sm text-yellow-400">{status}</div>
    </div>
  );
}
