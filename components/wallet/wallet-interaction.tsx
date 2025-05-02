"use client";

import { useSuiWallet } from '@/hooks/use-suiet-wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function WalletInteraction() {
  const wallet = useSuiWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 示例：发送一个简单的交易
  const handleTestTransaction = async () => {
    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // 创建交易块
      const tx = new TransactionBlock();
      
      // 这是一个示例交易，只是在链上记录一条消息
      tx.moveCall({
        target: '0x2::display::new_with_fields',
        arguments: [
          tx.pure.address(wallet.account?.address || ''),
          tx.pure.string('RWAS Dubai Test Transaction'),
          tx.pure([])
        ],
      });

      // 签名并执行交易
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log('Transaction result:', result);
      setSuccess(true);
    } catch (error) {
      console.error('Transaction failed:', error);
      setError(typeof error === 'string' ? error : 'Transaction failed, check console for details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Wallet Connection Status</CardTitle>
        <CardDescription>
          {wallet.connected 
            ? `Connected: ${wallet.account?.address?.slice(0, 10)}...${wallet.account?.address?.slice(-8)}`
            : 'Wallet not connected'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            Network: {wallet.chain?.name || 'Unknown'}
          </p>
          <p className="text-sm">
            Wallet: {wallet.name || 'Unknown'}
          </p>
          {error && (
            <div className="bg-destructive/20 text-destructive text-sm p-3 rounded-md mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 text-green-600 text-sm p-3 rounded-md mt-2 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Transaction successful!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestTransaction} 
          disabled={!wallet.connected || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : "Test Transaction"}
        </Button>
      </CardFooter>
    </Card>
  );
} 