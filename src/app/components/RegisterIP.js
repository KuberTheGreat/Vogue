
// 'use client';

// import { useState } from 'react';
// import { useAccount, useWalletClient } from 'wagmi';
// import { StoryClient } from '@story-protocol/core-sdk';
// import { NFT_CONTRACT } from '@/contract_data/constants';
// import { custom, toHex } from "viem";


// export default function RegisterIP({ tokenId }) {
//   const { address, isConnected } = useAccount();
//   const { data: wallet } = useWalletClient();
//   const [status, setStatus] = useState('');
//   const [ipId, setIpId] = useState(null);

//   const [form, setForm] = useState({
//     nftContract: NFT_CONTRACT || '',
//     tokenId: tokenId || '',
//     name: '',
//     description: '',
//     creator: '',
//     licenseTags: '',
//     nftMetadataURI: '',
//   });

//   const handleRegister = async () => {
//     if (!isConnected || !wallet) {
//       setStatus('🔌 Please connect your wallet');
//       return;
//     }

//     setStatus('🚀 Registering on Story Protocol...');

//     try {
//       const client = await StoryClient.newClient({
//         wallet: wallet,
//         transport: custom(wallet.transport),
//         chainId: 'aeneid', // you can also use chain ID 252 directly if needed
//       });

//       const result = await client.ipAsset.register({
//         nftContract: NFT_CONTRACT,
//         tokenId: BigInt(tokenId),
//         ipMetadata: {
//             ipMetadataURI: 'test-metadata-uri',
//             ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
//             nftMetadataURI: 'test-nft-metadata-uri',
//             nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
//         }
//       });

//       setIpId(result.ipId);
//       setStatus(`✅ Registered with IP ID: ${result.ipId}`);
//       console.log('✨ Story Protocol Registration:', result);
//     } catch (err) {
//       console.error('🔥 Registration failed:', err);
//       setStatus(`❌ Error: ${err.message || 'Unknown error'}`);
//     }
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
  
//   return (
//     <div className="flex flex-col gap-2 p-4 border rounded-lg shadow">
//       <p className="font-semibold">Token #{tokenId}</p>

//         <div className='bg-gray-400 p-5 rounded'>
//             <input type="text" name="nftMetadataURI" onChange={handleChange} placeholder="NFT Metadata URI" className="w-full p-2 border rounded text-black" required />
//             <input type="text" name="name" onChange={handleChange} placeholder="IP Name" className="w-full p-2 border rounded text-black" required />
//             <textarea name="description" onChange={handleChange} placeholder="IP Description" className="w-full p-2 border rounded text-black" required />
//             <input type="text" name="creator" onChange={handleChange} placeholder="Creator Name" className="w-full p-2 border rounded text-black" required />
//             <input type="text" name="licenseTags" onChange={handleChange} placeholder="License Tags (comma-separated)" className="w-full p-2 border rounded text-black" required />
//         </div>

//       <button
//         onClick={handleRegister}
//         className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
//         disabled={!!ipId}
//       >
//         {ipId ? 'Registered ✅' : 'Register IP'}
//       </button>

//       <div className="text-sm text-gray-700">{status}</div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { StoryClient } from '@story-protocol/core-sdk';
import { NFT_CONTRACT } from '@/contract_data/constants';
import { custom, toHex } from 'viem';
import AttachLicenseTerms from './AttachLicenseTerms';
import LicenseManager from './MintLicenseTokens';

export default function RegisterIP({ tokenId }) {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();
  const [status, setStatus] = useState('');
  const [ipId, setIpId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [form, setForm] = useState({
    nftContract: NFT_CONTRACT || '',
    tokenId: tokenId || '',
    name: '',
    description: '',
    creator: '',
    licenseTags: '',
    nftMetadataURI: '',
  });

  // 🔍 Check if the token is already registered as an IP
  useEffect(() => {
    const checkIfRegistered = async () => {
        if (!wallet || !isConnected || !tokenId) return;

        try {
        const client = await StoryClient.newClient({
            wallet,
            transport: custom(wallet.transport),
            chainId: 'aeneid',
        });

        const result = await client.ipAsset.getIpAssetByNft({
            nftContract: NFT_CONTRACT,
            tokenId: BigInt(tokenId),
        });

        if (result?.ipId) {
            setAlreadyRegistered(true);
            setIpId(result.ipId);
            setStatus(`🔒 Already registered with IP ID: ${result.ipId}`);
        } else {
            setAlreadyRegistered(false);
        }
        } catch (err) {
        // Likely means it's not registered
        console.log('📭 Not registered yet.');
        setAlreadyRegistered(false);
        } finally {
        setLoading(false);
        }
    };

    checkIfRegistered();
    }, [wallet, isConnected, tokenId]);

  const handleRegister = async () => {
    if (!isConnected || !wallet) {
      setStatus('🔌 Please connect your wallet');
      return;
    }

    setStatus('🚀 Registering on Story Protocol...');

    try {
      const client = await StoryClient.newClient({
        wallet,
        transport: custom(wallet.transport),
        chainId: 'aeneid',
      });

      const result = await client.ipAsset.register({
        nftContract: NFT_CONTRACT,
        tokenId: BigInt(tokenId),
        ipMetadata: {
          ipMetadataURI: form.nftMetadataURI,
          ipMetadataHash: toHex('ip-metadata-hash', { size: 32 }),
          nftMetadataURI: form.nftMetadataURI,
          nftMetadataHash: toHex('nft-metadata-hash', { size: 32 }),
        },
      });

      setIpId(result.ipId);
      setAlreadyRegistered(true);
      setStatus(`✅ Registered with IP ID: ${result.ipId}`);
      console.log('✨ Story Protocol Registration:', result);
    } catch (err) {
      console.error('🔥 Registration failed:', err);
      setStatus(`❌ Error: ${err.message || 'Unknown error'}`);
      console.error('🔥 Registration failed:', err);
      setStatus(`❌ Error: ${err.message || 'Unknown error'}`);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow bg-gray-400">
      <p className="font-semibold text-black">Token #{tokenId}</p>

      {loading ? (
        <p className="text-gray-600">🔍 Checking registration status...</p>
      ) : alreadyRegistered ? (
        <div>
            <div className="text-green-700 font-medium p-2 border border-green-500 rounded bg-green-100">
            ✅ This design is already registered with IP ID: <span className="font-mono">{ipId}</span>
            </div>
            <LicenseManager ipId={ipId}/>
        </div>
      ) : (
        <>
          <div className="bg-gray-200 p-5 rounded">
            <input type="text" name="nftMetadataURI" onChange={handleChange} placeholder="NFT Metadata URI" className="w-full p-2 border rounded text-black mb-2" required />
            <input type="text" name="name" onChange={handleChange} placeholder="IP Name" className="w-full p-2 border rounded text-black mb-2" required />
            <textarea name="description" onChange={handleChange} placeholder="IP Description" className="w-full p-2 border rounded text-black mb-2" required />
            <input type="text" name="creator" onChange={handleChange} placeholder="Creator Name" className="w-full p-2 border rounded text-black mb-2" required />
            <input type="text" name="licenseTags" onChange={handleChange} placeholder="License Tags (comma-separated)" className="w-full p-2 border rounded text-black" required />
          </div>

          <button
            onClick={handleRegister}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            disabled={!!ipId}
          >
            Register IP
          </button>
        </>
      )}
    </div>
  );
}
