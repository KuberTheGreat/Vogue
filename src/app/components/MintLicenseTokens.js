'use client';

import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import {custom} from 'viem'
import { erc20Abi } from 'viem'; // OpenZeppelin ERC20 ABI
import { writeContract } from '@wagmi/core';

export default function LicenseManager({ ipId}) {
  const { data: wallet } = useWalletClient();
  const [licenseAttached, setLicenseAttached] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [mintSuccess, setMintSuccess] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
    const [confirmed, setConfirmed] = useState(false);

  const handleAttachTerms = async () => {
    try {
      if (!wallet || !ipId || !selectedLicenseId) {
        setStatus('❌ Missing input');
        return;
        }

      const client = await StoryClient.newClient({
            wallet,
            transport: custom(wallet.transport),
            chainId: 'aeneid',
        });

      setMintStatus('📎 Attaching license terms...');
      await client.license.attachLicenseTerms({
        ipId,
        licenseTermsId: selectedLicenseId,
        wallet: wallet,
      });

      setMintStatus('✅ License terms attached');
      setLicenseAttached(true);
    } catch (error) {
      console.error('🔥 Attach failed:', error);
      setMintStatus(`❌ Attach failed: ${error.message}`);
    }
  };

  const handleMintLicense = async () => {
    try {
      if (!wallet) throw new Error('Wallet not connected');

      const client = await StoryClient.newClient({
            wallet,
            transport: custom(wallet.transport),
            chainId: 'aeneid',
        });
        
      setMintStatus('🪙 Minting license token...');
      const  licenseTokenId  = await client.license.mintLicenseTokens({
        licenseTermsId: selectedLicenseId,
        licensorIpId: ipId,
        maxMintingFee: BigInt(0),
        maxRevenueShare: 0,
        // receiver: wallet.account.address,
      });

      setMintStatus(`✅ License Token Minted! Token ID: ${licenseTokenId}`);
      setMintSuccess(true);
    } catch (error) {
      console.error('🔥 Mint failed:', error);
      setMintStatus(`❌ Mint failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {!licenseAttached ? (
        <div className="flex flex-col gap-3 mt-4">
            <label className="text-sm font-medium text-gray-700">Select License Terms:</label>
            <select
                value={selectedLicenseId || ''}
                onChange={(e) => setSelectedLicenseId(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
            >
                <option value="" disabled>Select license...</option>
                <option value="1" >Non-Commercial Social Remixing</option>
                <option value="2" >Commercial Use</option>
                <option value="3" >Commercial Remix</option>
                <option value="4" >Creative Commons Attribution</option>

            </select>

            <label className="flex items-center gap-2 text-sm">
                <input
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
                />
                I agree to the selected license terms
            </label>

            <button
                onClick={handleAttachTerms}
                disabled={!confirmed || !selectedLicenseId}
                className={`px-4 py-2 rounded text-white ${
                confirmed && selectedLicenseId
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                Attach License Terms
            </button>

            {<p className="text-sm text-gray-600">{mintStatus}</p>}
            </div>                                                         
      ) : (
        <button
          onClick={handleMintLicense}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Mint License Token
        </button>
      )}
      <div className="text-sm text-gray-700">{mintStatus}</div>
    </div>
  );
}
