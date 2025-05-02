"use client";

import { ConnectButton } from '@suiet/wallet-kit';

const SuietWalletConnect = () => {
  // 直接使用原生ConnectButton组件，样式通过全局CSS覆盖
  return (
    <ConnectButton>Connect Wallet</ConnectButton>
  );
};

export default SuietWalletConnect; 