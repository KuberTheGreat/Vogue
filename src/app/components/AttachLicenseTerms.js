'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import { custom } from 'viem';

export default function AttachLicenseTerms({ ipId }) {
  const { address } = useAccount();
  const { data: wallet } = useWalletClient();

  const [status, setStatus] = useState('');
  const [licenseTermsList, setLicenseTermsList] = useState([]);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetchLicenseTerms = async () => {
      if (!wallet || !address) return;

      const storyClient = StoryClient.newClient({
            wallet,
            transport: custom(wallet.transport),
            chainId: 'aeneid',
        });

      try {
        const terms = await storyClient.license.getLicenseTerms(selectedLicenseId);
        setLicenseTermsList(terms);
        console.log(terms)
      } catch (err) {
        console.error('❌ Failed to fetch license terms:', err);
        setStatus('❌ Could not fetch license terms');
      }
    };

    fetchLicenseTerms();
  }, [wallet, address]);

  const handleAttach = async () => {
    if (!wallet || !address || !ipId || !selectedLicenseId) {
      setStatus('❌ Missing input');
      return;
    }

    try {
      setStatus('🔗 Attaching license terms...');
      const storyClient = await StoryClient.newClient({
            wallet,
            transport: custom(wallet.transport),
            chainId: 'aeneid',
        });

      await storyClient.license.attachLicenseTerms({
        ipId,
        licenseTermsId: selectedLicenseId,
      });

      setStatus('✅ License terms attached!');
      const terms = await storyClient.license.getLicenseTerms(selectedLicenseId);
        setLicenseTermsList(terms);
        console.log(terms)
    } catch (err) {
      console.error('🔥 Attach failed:', err);
      setStatus("❌ Couldn't Attach License Terms")
    }
  };

  return (
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
        onClick={handleAttach}
        disabled={!confirmed || !selectedLicenseId}
        className={`px-4 py-2 rounded text-white ${
          confirmed && selectedLicenseId
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Attach License Terms
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
