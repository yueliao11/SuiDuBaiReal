"use client";

import { useState, useEffect } from 'react';
import { useSuiWallet } from '@/hooks/use-suiet-wallet';
import { TrendingUp, BadgeDollarSign, Info, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import ClientSuietConnect from '@/components/wallet/client-suiet-connect';
import { suiClient } from "@/config";
import { queryBalance, stake } from '@/contracts';

// Mock staking data - in a real app this would come from the blockchain
const stakingData = {
  apr: 12.5,
  totalStaked: 5000000,
  myStake: 10000,
  availableBalance: 5000,
  claimableRewards: 250,
  stakingHistory: [
    {
      type: 'Stake',
      amount: 5000,
      timestamp: '2024-03-01T10:00:00Z',
      txHash: '0x123...abc',
    },
    {
      type: 'Claim Rewards',
      amount: 100,
      timestamp: '2024-02-15T14:30:00Z',
      txHash: '0x456...def',
    },
    {
      type: 'Unstake',
      amount: 2000,
      timestamp: '2024-02-01T09:15:00Z',
      txHash: '0x789...ghi',
    },
  ],
};

export default function Staking() {
  const wallet = useSuiWallet();
  const isConnected = wallet.connected;
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('stake');
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && wallet.address) {
        try {
          const result = await queryBalance(wallet.address);
          setAvailableBalance(Number(result.totalBalance) / 1e9);
        } catch (error) {
          console.error('Error fetching balance:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch balance",
          });
        }
      }
    };

    fetchBalance();
  }, [isConnected, wallet.address, toast]);

  const handleStake = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to stake RWAS tokens",
      });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to stake",
      });
      return;
    }

    if (amount > availableBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "You don't have enough RWAS tokens to stake this amount",
      });
      return;
    }

    try {
      const tx = await stake(wallet.address!, amount * 1e9); // Convert to base units
      // Here you would typically sign and execute the transaction
      if (!wallet.signAndExecuteTransaction) {
        throw new Error("Wallet does not support signing transactions.");
      }

      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      // Wait for transaction confirmation (optional but recommended for UI feedback)
      await suiClient.waitForTransaction({ 
        digest: result.digest,
        options: { showEffects: true }
      });

      // Check transaction status (example)
      const txDetails = await suiClient.getTransactionBlock({
        digest: result.digest,
        options: { showEffects: true }
      });

      if (txDetails.effects?.status.status === 'success') {
        toast({
          title: "Staking successful",
          description: `Successfully staked ${amount} RWAS tokens`,
        });
      } else {
        throw new Error(`Staking transaction failed with status: ${txDetails.effects?.status.status}`);
      }

      setStakeAmount('');
      
      // Refresh balance after staking
      const balanceResult = await queryBalance(wallet.address!);
      setAvailableBalance(Number(balanceResult.totalBalance) / 1e9);
    } catch (error) {
      console.error('Error staking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to stake tokens",
      });
    }
  };

  const handleUnstake = () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to unstake RWAS tokens",
      });
      return;
    }

    const amount = parseFloat(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to unstake",
      });
      return;
    }

    if (amount > stakingData.myStake) {
      toast({
        variant: "destructive",
        title: "Insufficient staked amount",
        description: "You don't have enough staked RWAS tokens to unstake this amount",
      });
      return;
    }

    // Mock successful unstake
    toast({
      title: "Unstaking successful",
      description: `Successfully unstaked ${amount} RWAS tokens`,
    });
    setUnstakeAmount('');
  };

  const handleClaimRewards = () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to claim rewards",
      });
      return;
    }

    if (stakingData.claimableRewards <= 0) {
      toast({
        variant: "destructive",
        title: "No rewards available",
        description: "You don't have any rewards to claim",
      });
      return;
    }

    // Mock successful claim
    toast({
      title: "Rewards claimed",
      description: `Successfully claimed ${stakingData.claimableRewards} RWAS tokens`,
    });
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <BadgeDollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Connect Wallet to Stake RWAS</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to stake RWAS tokens and earn rewards.
          </p>
          <ClientSuietConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">RWAS Staking</h1>
        <p className="text-muted-foreground max-w-3xl">
          Stake your RWAS tokens to earn rewards and participate in platform governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">APR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stakingData.apr}%</div>
            <p className="text-muted-foreground text-sm">Current staking reward rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Staked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stakingData.totalStaked.toLocaleString()} RWAS
            </div>
            <p className="text-muted-foreground text-sm">By all stakers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Stake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stakingData.myStake.toLocaleString()} RWAS
            </div>
            <p className="text-muted-foreground text-sm">Your staked amount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Staking Actions</CardTitle>
              <CardDescription>Stake or unstake your RWAS tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake">Unstake</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stake" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available Balance</span>
                      <span>{availableBalance.toLocaleString()} RWAS</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setStakeAmount(stakingData.availableBalance.toString())}
                      >
                        Max
                      </Button>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleStake}
                      disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                    >
                      Stake RWAS
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="unstake" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Staked Amount</span>
                      <span>{stakingData.myStake.toLocaleString()} RWAS</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Amount to unstake"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setUnstakeAmount(stakingData.myStake.toString())}
                      >
                        Max
                      </Button>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleUnstake}
                      disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                    >
                      Unstake RWAS
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Staking History</CardTitle>
              <CardDescription>Your recent staking activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakingData.stakingHistory.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>{history.type}</TableCell>
                      <TableCell>{history.amount.toLocaleString()} RWAS</TableCell>
                      <TableCell>
                        {new Date(history.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://suiscan.xyz/mainnet/tx/${history.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          {history.txHash.slice(0, 6)}...{history.txHash.slice(-4)}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
              <CardDescription>Your staking rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {stakingData.claimableRewards.toLocaleString()} RWAS
                </div>
                <p className="text-sm text-muted-foreground">Available to claim</p>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleClaimRewards}
                disabled={stakingData.claimableRewards <= 0}
              >
                Claim Rewards
              </Button>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Staking Information</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Rewards are distributed continuously</li>
                <li>No minimum staking period</li>
                <li>Unstaking is subject to a 24-hour cooldown</li>
                <li>Staked RWAS tokens grant governance voting rights</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}