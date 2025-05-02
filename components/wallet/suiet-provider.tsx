"use client";

import { ReactNode, useEffect } from 'react';
import { WalletProvider, AllDefaultWallets, defineStashedWallet, useWallet } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

// 配置Slush钱包
const slushWalletConfig = defineStashedWallet({
  appName: 'RWAS Dubai',
});

interface SuietProviderProps {
  children: ReactNode;
}

// 包装WalletProvider，添加连接状态变化事件监听
const WalletStatusMonitor = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  
  useEffect(() => {
    // 当钱包连接状态变化时，派发自定义事件
    const event = new CustomEvent('wallet-connected', {
      detail: { connected: wallet.connected, address: wallet.account?.address }
    });
    window.dispatchEvent(event);
    
    console.log('Wallet connection changed:', wallet.connected);
  }, [wallet.connected, wallet.account?.address]);
  
  return <>{children}</>;
};

export function SuietProvider({ children }: SuietProviderProps) {
  return (
    <WalletProvider 
      defaultWallets={[...AllDefaultWallets, slushWalletConfig]}
      autoConnect={true}
    >
      <WalletStatusMonitor>
        {children}
      </WalletStatusMonitor>
    </WalletProvider>
  );
} 