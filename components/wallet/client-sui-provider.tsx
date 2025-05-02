"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// 动态导入SuiClientProvider组件，禁用SSR
const DynamicSuiClientProvider = dynamic(
  () => import('./sui-client-provider').then(mod => ({ default: mod.SuiClientProvider })),
  { ssr: false }
);

interface ClientSuiProviderProps {
  children: ReactNode;
}

// 客户端专用的Sui客户端提供者组件
const ClientSuiProvider = ({ children }: ClientSuiProviderProps) => {
  return <DynamicSuiClientProvider>{children}</DynamicSuiClientProvider>;
};

export default ClientSuiProvider; 