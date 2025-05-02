"use client";

import dynamic from 'next/dynamic';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 动态导入WalletConnect组件，禁用SSR
const DynamicWalletConnect = dynamic(
  () => import('./wallet-connect'),
  { ssr: false }
);

// 客户端专用的钱包连接组件
const ClientWalletConnect = () => {
  return <DynamicWalletConnect />;
};

export default ClientWalletConnect; 