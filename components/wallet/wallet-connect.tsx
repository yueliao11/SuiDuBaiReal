"use client";

import { ConnectButton } from '@mysten/dapp-kit';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const WalletConnect = () => {
  // 使用isClient标志避免服务器端渲染
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 在服务器端渲染时，返回Connect Wallet按钮的UI外壳
  if (!isClient) {
    return (
      <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500">
            <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
          </Button>
    );
  }

  return (
    <ConnectButton
      connectText={
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500">
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      }
    />
  );
};

export default WalletConnect;