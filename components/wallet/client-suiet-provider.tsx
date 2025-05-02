"use client";

import dynamic from 'next/dynamic';
import { ReactNode, useEffect } from 'react';

// 使用localStorage存储钱包连接状态
const storeWalletConnectionState = (connected: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('walletConnected', connected ? 'true' : 'false');
  }
};

// 检查钱包是否已连接
const getWalletConnectionState = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('walletConnected') === 'true';
  }
  return false;
};

// 动态导入SuietProvider组件，禁用SSR
const DynamicSuietProvider = dynamic(
  () => import('./suiet-provider').then(mod => {
    const WrappedProvider = ({ children }: { children: ReactNode }) => {
      // 在客户端监听钱包连接状态变化
      useEffect(() => {
        const handleWalletConnection = (event: Event) => {
          if ((event as CustomEvent).detail?.connected !== undefined) {
            storeWalletConnectionState((event as CustomEvent).detail.connected);
          }
        };
        
        window.addEventListener('wallet-connected', handleWalletConnection);
        return () => {
          window.removeEventListener('wallet-connected', handleWalletConnection);
        };
      }, []);
      
      return <mod.SuietProvider>{children}</mod.SuietProvider>;
    };
    return { default: WrappedProvider };
  }),
  { ssr: false }
);

interface ClientSuietProviderProps {
  children: ReactNode;
}

// 客户端专用的Suiet钱包提供者组件
const ClientSuietProvider = ({ children }: ClientSuietProviderProps) => {
  // 在客户端检查钱包连接状态
  useEffect(() => {
    // 在组件挂载时添加调试日志
    console.log('Wallet connection state:', getWalletConnectionState());
  }, []);
  
  return <DynamicSuietProvider>{children}</DynamicSuietProvider>;
};

export default ClientSuietProvider; 