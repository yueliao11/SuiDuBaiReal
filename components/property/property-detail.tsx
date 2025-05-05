"use client";

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  AlertTriangle,
  BadgeCheck,
  BadgeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useSuiWallet } from '@/hooks/use-suiet-wallet';
import { useToast } from '@/hooks/use-toast';
import ClientSuietConnect from '@/components/wallet/client-suiet-connect';
import { purchaseYieldToken } from '@/contracts';
import { suiClient } from '@/config';

interface PropertyDetailProps {
  property: any;
}

const PropertyDetail = ({ property }: PropertyDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [tokensToReceive, setTokensToReceive] = useState(80);
  const wallet = useSuiWallet();
  const isConnected = wallet.connected;
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<'verified' | 'unverified' | 'pending'>('unverified');
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };
  
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setInvestmentAmount(0);
      setTokensToReceive(0);
    } else {
      setInvestmentAmount(value);
      setTokensToReceive(Math.floor(value / property.price));
    }
  };
  
  const handleTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setTokensToReceive(0);
      setInvestmentAmount(0);
    } else {
      setTokensToReceive(value);
      setInvestmentAmount(parseFloat((value * property.price).toFixed(2)));
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The token address has been copied to your clipboard",
    });
  };
  
  const handleInvest = () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to invest",
      });
      return;
    }
    
    if (kycStatus !== 'verified') {
      toast({
        variant: "destructive",
        title: "KYC verification required",
        description: "Please complete KYC verification before investing",
      });
      return;
    }
    
    if (investmentAmount < 100) {
      toast({
        variant: "destructive",
        title: "Minimum investment required",
        description: "Minimum investment amount is $100",
      });
      return;
    }
    
    // Mock successful transaction
    toast({
      title: "Investment successful",
      description: `You have successfully invested $${investmentAmount} in ${property.tokenSymbol} tokens`,
    });
  };

  const handleBuy = async () => {
    if (!isConnected || !wallet.address) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to buy tokens",
      });
      return;
    }

    if (investmentAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to purchase",
      });
      return;
    }

    console.log(`Attempting to purchase with ${investmentAmount} USDC for ${wallet.address}`);

    try {
      const tx = await purchaseYieldToken(investmentAmount * 1e9, wallet.address);

      if (!wallet.signAndExecuteTransaction) {
        throw new Error("Wallet does not support signing transactions.");
      }

      const result = await wallet.signAndExecuteTransaction({ transaction: tx });

      await suiClient.waitForTransaction({ 
        digest: result.digest,
        options: { showEffects: true }
      });

      const txDetails = await suiClient.getTransactionBlock({
        digest: result.digest,
        options: { showEffects: true }
      });

      if (txDetails.effects?.status.status === 'success') {
        toast({
          title: "Purchase successful",
          description: `Successfully purchased ${tokensToReceive} ${property.tokenSymbol} tokens for $${investmentAmount.toFixed(2)} USDC`,
        });
      } else {
        throw new Error(`Purchase transaction failed with status: ${txDetails.effects?.status.status}`);
      }

    } catch (error) {
      console.error("Error purchasing tokens:", error);
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Image Gallery */}
        <div className="relative rounded-xl overflow-hidden bg-card border h-[400px]">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.name} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={prevImage}
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={nextImage}
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
            {property.images.map((_: string, index: number) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Property Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={property.status === 'active' ? 'default' : 'outline'}
              className={property.status === 'active' 
                ? 'bg-green-500/90 hover:bg-green-500/80'
                : 'border-amber-500 text-amber-500'
              }
            >
              {property.status === 'active' ? 'Active' : 'Upcoming'}
            </Badge>
            <span className="text-muted-foreground">Token Symbol: {property.tokenSymbol}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.name}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.type}</span>
            </div>
            
            <div className="flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">{property.apr}% APY (Last Year)</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{property.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financials" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Historical Yields</h3>
                <div className="h-[300px] bg-card p-4 rounded-lg border">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={property.historicalYields}>
                      <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="year" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 'dataMax + 2']}
                      />
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false} 
                        stroke="hsl(var(--border))" 
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Annual Yield']}
                        labelFormatter={(label) => `Year ${label}`}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Expected Yield (This Year)</CardTitle>
                    <CardDescription>Based on property manager's forecast</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      {property.expectedYield}%
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Token Information</CardTitle>
                    <CardDescription>On Sui blockchain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Symbol:</span>
                      <span className="font-medium">{property.tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Supply:</span>
                      <span className="font-medium">{property.supply}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Price:</span>
                      <span className="font-medium">${property.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <div>Token Address:</div>
                      <div className="flex items-center">
                        <span className="font-mono truncate max-w-[100px]">
                          {property.tokenAddress.slice(0, 8)}...{property.tokenAddress.slice(-6)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => copyToClipboard(property.tokenAddress)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          asChild
                        >
                          <a 
                            href={`https://suiscan.xyz/mainnet/object/${property.tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Location</h3>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?q=${property.location_map.lat},${property.location_map.lng}&key=AIzaSyCLZQWXUU_X9f5Eytp8EAQi9vJfVj_7tPU`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Investment Card */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Invest in {property.tokenSymbol}</CardTitle>
            <CardDescription>
              Purchase tokens representing fractional ownership and earn yield.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Token Price</span>
              <span className="font-semibold">${property.price.toFixed(2)} / token</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your Wallet</span>
              {isConnected ? (
                <span className="font-mono text-sm truncate max-w-[150px]" title={wallet.address}>
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Not Connected</span>
              )}
            </div>
            
            {/* Conditional rendering for property ID '1' */} 
            {property.id === '1' ? (
              // --- Buy Logic for Property 1 (KYC assumed passed) ---
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="tokensToReceive">Tokens to Receive</Label>
                  <Input 
                    id="tokensToReceive"
                    type="number"
                    placeholder="Enter number of tokens"
                    value={tokensToReceive}
                    onChange={handleTokensChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Estimated Cost (USD)</Label>
                  <Input 
                    id="investmentAmount"
                    type="number" 
                    placeholder="Amount in USD" 
                    value={investmentAmount}
                    readOnly // Make this read-only as it depends on tokens
                    className="bg-muted/50"
                  />
                </div>
              </div>
            ) : (
              // --- Existing Investment Logic for other properties ---
              <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Amount to Invest (USD)</Label>
                  <Input 
                    id="investmentAmount"
                    type="number" 
                    placeholder="Min $100" 
                    value={investmentAmount}
                    onChange={handleInvestmentChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokensToReceive">Estimated Tokens</Label>
                  <Input 
                    id="tokensToReceive"
                    type="number"
                    placeholder="Tokens you receive"
                    value={tokensToReceive}
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
                 {isConnected && <KycStatusAlert status={kycStatus} />}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isConnected ? (
              property.id === '1' ? (
                // --- Buy Button for Property 1 ---
                <Button 
                  className="w-full" 
                  onClick={handleBuy} 
                  disabled={tokensToReceive <= 0} // Basic validation
                >
                  Buy {property.tokenSymbol} Tokens
                </Button>
              ) : (
                // --- Existing Invest/KYC Button Logic ---
                kycStatus === 'verified' ? (
                  <Button 
                    className="w-full" 
                    onClick={handleInvest} 
                    disabled={investmentAmount < 100} // Example validation
                  >
                    Invest Now
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    // onClick={handleStartKyc} // Assuming a KYC function exists
                    variant={kycStatus === 'pending' ? 'outline' : 'default'}
                    disabled={kycStatus === 'pending'}
                  >
                    {kycStatus === 'pending' ? 'KYC Pending Review' : 'Complete KYC Verification'}
                  </Button>
                )
              )
            ) : (
              <ClientSuietConnect />
            )}
          </CardFooter>
        </Card>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How it works</AlertTitle>
          <AlertDescription>
            When you invest, you receive {property.tokenSymbol} tokens representing your share of this property's annual profits.
            Each January, you'll receive USDC dividends proportional to your token holdings directly to your wallet.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Legal & Risk Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Investment involves risk. Past performance is not indicative of future results.
            </p>
            <p>
              This token represents right to annual property profits only, not ownership of the underlying real estate.
            </p>
            <div className="pt-2">
              <Button variant="link" className="p-0 h-auto text-sm" asChild>
                <a href="/legal" target="_blank">View Complete Legal Documentation</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// KYC Status Alert Component
const KycStatusAlert = ({ status }: { status: 'verified' | 'unverified' | 'pending' }) => {
  if (status === 'verified') {
    return (
      <Alert className="bg-green-500/10 border-green-500/50">
        <BadgeCheck className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">KYC Verified</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Your account is verified and you can invest in this property.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'pending') {
    return (
      <Alert className="bg-amber-500/10 border-amber-500/50">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-500">KYC Pending</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Your KYC verification is in progress. This usually takes 24-48 hours.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-destructive/10 border-destructive/50">
      <BadgeX className="h-4 w-4 text-destructive" />
      <AlertTitle className="text-destructive">KYC Required</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Complete KYC verification to invest in this property. This is required for regulatory compliance.
      </AlertDescription>
    </Alert>
  );
};

export default PropertyDetail;