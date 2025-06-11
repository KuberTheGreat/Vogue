'use client';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';

import { WagmiProvider, http } from 'wagmi';
import { aeneid } from '@story-protocol/core-sdk';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Load fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Configure RainbowKit + Wagmi
const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [aeneid],
  ssr: true,
  transports: {

  },
});

// Initialize Query Client
const queryClient = new QueryClient();

// Root layout or App component
export default function AppLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div style={{ padding: '1rem' }}>
                <ConnectButton />
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
