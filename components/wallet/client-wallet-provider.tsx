"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// 动态导入WalletProvider组件，禁用SSR
const DynamicWalletProvider = dynamic(
  () => import('./wallet-provider').then(mod => ({ default: mod.WalletProvider })),
  { ssr: false }
);

interface ClientWalletProviderProps {
  children: ReactNode;
}

// 客户端专用的钱包提供者组件
const ClientWalletProvider = ({ children }: ClientWalletProviderProps) => {
  return <DynamicWalletProvider>{children}</DynamicWalletProvider>;
};

export default ClientWalletProvider; 