"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// 动态导入WalletInteraction组件，禁用SSR
const DynamicWalletInteraction = dynamic(
  () => import('./wallet-interaction'),
  { 
    ssr: false,
    loading: () => (
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }
);

// 客户端专用的钱包交互组件
const ClientWalletInteraction = () => {
  return <DynamicWalletInteraction />;
};

export default ClientWalletInteraction; 