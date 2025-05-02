"use client";

import { useState } from 'react';
import { useSuiWallet } from '@/hooks/use-suiet-wallet';
import { Building2, TrendingUp, BadgeDollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import ClientSuietConnect from '@/components/wallet/client-suiet-connect';

// Mock portfolio data - in a real app this would come from the blockchain
const portfolioData = [
  {
    id: '1',
    name: 'Palm Jumeirah Luxury Villa',
    tokenSymbol: 'PALM01',
    tokensOwned: 1000,
    tokenPrice: 1.25,
    apr: 9.8,
    lastDistribution: '2024-01-15',
    nextDistribution: '2025-01-15',
    historicalYields: [
      { month: 'Jan 23', value: 9.2 },
      { month: 'Apr 23', value: 9.4 },
      { month: 'Jul 23', value: 9.6 },
      { month: 'Oct 23', value: 9.8 },
      { month: 'Jan 24', value: 10.0 },
    ],
  },
  {
    id: '2',
    name: 'Downtown Dubai Apartment Complex',
    tokenSymbol: 'DWTN01',
    tokensOwned: 800,
    tokenPrice: 1.10,
    apr: 8.5,
    lastDistribution: '2024-01-15',
    nextDistribution: '2025-01-15',
    historicalYields: [
      { month: 'Jan 23', value: 8.0 },
      { month: 'Apr 23', value: 8.2 },
      { month: 'Jul 23', value: 8.4 },
      { month: 'Oct 23', value: 8.5 },
      { month: 'Jan 24', value: 8.7 },
    ],
  },
];

export default function Portfolio() {
  const wallet = useSuiWallet();
  const isConnected = wallet.connected;
  const [activeTab, setActiveTab] = useState('overview');

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Connect Wallet to View Portfolio</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your property investments and track your yields.
          </p>
          <ClientSuietConnect />
        </div>
      </div>
    );
  }

  const totalValue = portfolioData.reduce((acc, property) => {
    return acc + (property.tokensOwned * property.tokenPrice);
  }, 0);

  const averageYield = portfolioData.reduce((acc, property) => {
    return acc + property.apr;
  }, 0) / portfolioData.length;

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">My Portfolio</h1>
        <p className="text-muted-foreground max-w-3xl">
          Track your property investments and monitor your annual yields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-muted-foreground text-sm">Across {portfolioData.length} properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{averageYield.toFixed(1)}%</div>
            <p className="text-muted-foreground text-sm">Annual percentage yield</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Jan 2025</div>
            <p className="text-muted-foreground text-sm">Estimated date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yield Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData[0].historicalYields}>
                      <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false} 
                        stroke="hsl(var(--border))" 
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Yield']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.375rem',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-1))" 
                        fillOpacity={1}
                        fill="url(#yieldGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Portfolio Performance</AlertTitle>
              <AlertDescription>
                Your portfolio is performing well with an average yield of {averageYield.toFixed(1)}% APY.
                The next distribution is scheduled for January 2025.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Token Symbol</span>
                    <span className="font-medium">{property.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tokens Owned</span>
                    <span className="font-medium">{property.tokensOwned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Token Price</span>
                    <span className="font-medium">${property.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-medium">
                      ${(property.tokensOwned * property.tokenPrice).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-green-500">
                    <span>Current APY</span>
                    <span className="font-medium">{property.apr}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distributions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.map((property) => (
                    <div key={property.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium mb-2">{property.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Last Distribution</p>
                          <p className="font-medium">{property.lastDistribution}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium text-green-500">
                            ${((property.tokensOwned * property.tokenPrice * property.apr) / 100).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Distribution</p>
                          <p className="font-medium">{property.nextDistribution}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expected Amount</p>
                          <p className="font-medium">
                            ${((property.tokensOwned * property.tokenPrice * property.apr) / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <BadgeDollarSign className="h-4 w-4" />
              <AlertTitle>Distribution Schedule</AlertTitle>
              <AlertDescription>
                Property yields are distributed annually in January. The next distribution is scheduled for January 2025.
                Yields are paid in USDC stablecoin directly to your connected wallet.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}