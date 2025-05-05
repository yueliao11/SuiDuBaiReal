"use client";

import { SuiClientProvider as DappKitSuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { ReactNode, useState, useEffect } from 'react';

const NETWORK = 'testnet'; // 'mainnet' 或 'testnet' 或 'devnet'

// 定义网络配置
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') },
};

export const SuiClientProvider = ({ children }: { children: ReactNode }) => {
  // 使用isClient标志避免服务器端渲染
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 在服务器端渲染时，仅返回子组件
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <DappKitSuiClientProvider networks={networks} defaultNetwork={NETWORK}>
      {children}
    </DappKitSuiClientProvider>
  );
};