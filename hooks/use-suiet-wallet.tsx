"use client";

import { useWallet as useSuietWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';

export function useSuiWallet() {
  const wallet = useSuietWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 确保钱包状态初始化并在所有页面之间共享
  useEffect(() => {
    if (wallet) {
      setIsInitialized(true);
    }
  }, [wallet]);

  // 为了调试
  useEffect(() => {
    if (isInitialized && wallet) {
      console.log("Wallet status:", { 
        connected: wallet.connected, 
        address: wallet.account?.address,
        name: wallet.name
      });
    }
  }, [isInitialized, wallet.connected, wallet.account?.address]);

  return {
    ...wallet,
    isInitialized
  };
} 