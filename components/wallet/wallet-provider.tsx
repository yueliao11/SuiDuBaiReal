"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { WalletProvider as DappKitWalletProvider } from '@mysten/dapp-kit';

// 使用testnet网络
const NETWORK = 'testnet';
const suiClient = new SuiClient({ url: getFullnodeUrl(NETWORK) });

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  balances: {
    sui?: string;
  };
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  isConnected: false,
  balances: {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState<{
    sui?: string;
  }>({});
  
  // 使用isClient标志避免服务器端渲染
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 只在客户端渲染DappKitWalletProvider
  if (!isClient) {
    return (
      <WalletContext.Provider
        value={{
          walletAddress,
          isConnected,
          balances,
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }

  return (
    <DappKitWalletProvider autoConnect={false}>
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        balances,
      }}
    >
      {children}
    </WalletContext.Provider>
    </DappKitWalletProvider>
  );
};