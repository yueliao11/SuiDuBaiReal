"use client";

import dynamic from 'next/dynamic';

// 动态导入SuietWalletConnect组件，禁用SSR
const DynamicSuietConnect = dynamic(
  () => import('./suiet-wallet-connect'),
  { 
    ssr: false,
    loading: () => (
      <button className="wkit-button-loading">
        Connect Wallet
      </button>
    )
  }
);

// 客户端专用的钱包连接组件
const ClientSuietConnect = () => {
  return <DynamicSuietConnect />;
};

export default ClientSuietConnect; 