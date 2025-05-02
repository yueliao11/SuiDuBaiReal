"use client";

import { useState } from 'react';
import { useSuiWallet } from '@/hooks/use-suiet-wallet';
import { Vote, Info, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ClientSuietConnect from '@/components/wallet/client-suiet-connect';

// Mock governance data - in a real app this would come from the blockchain
const governanceData = {
  votingPower: 15000,
  activeProposals: 2,
  totalProposals: 12,
  quorumPercentage: 50,
  proposals: [
    {
      id: '1',
      title: 'Increase Staking Rewards APR',
      description: 'Proposal to increase the staking rewards APR from 12.5% to 15% to incentivize more token holders to participate in platform governance.',
      status: 'active',
      proposer: '0x123...abc',
      startTime: '2024-03-01T00:00:00Z',
      endTime: '2024-03-15T00:00:00Z',
      votesFor: 2500000,
      votesAgainst: 500000,
      votesAbstain: 100000,
      totalVotes: 3100000,
      quorum: 5000000,
      executed: false,
      myVote: null,
    },
    {
      id: '2',
      title: 'Add New Property Type',
      description: 'Proposal to add hotel properties as a new supported property type for tokenization on the platform.',
      status: 'active',
      proposer: '0x456...def',
      startTime: '2024-03-05T00:00:00Z',
      endTime: '2024-03-20T00:00:00Z',
      votesFor: 1800000,
      votesAgainst: 200000,
      votesAbstain: 50000,
      totalVotes: 2050000,
      quorum: 5000000,
      executed: false,
      myVote: 'for',
    },
    {
      id: '3',
      title: 'Reduce Platform Fees',
      description: 'Proposal to reduce platform fees from 2% to 1.5% to attract more investors.',
      status: 'passed',
      proposer: '0x789...ghi',
      startTime: '2024-02-01T00:00:00Z',
      endTime: '2024-02-15T00:00:00Z',
      votesFor: 4000000,
      votesAgainst: 1000000,
      votesAbstain: 200000,
      totalVotes: 5200000,
      quorum: 5000000,
      executed: true,
      myVote: 'for',
    },
  ],
};

export default function Governance() {
  const wallet = useSuiWallet();
  const isConnected = wallet.connected;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const handleVote = (proposalId: string) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to vote on proposals",
      });
      return;
    }

    if (!selectedVote) {
      toast({
        variant: "destructive",
        title: "No option selected",
        description: "Please select a voting option",
      });
      return;
    }

    // Mock successful vote
    toast({
      title: "Vote submitted",
      description: `Successfully voted ${selectedVote} on proposal ${proposalId}`,
    });
    setSelectedVote(null);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Connect Wallet to Participate</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view and vote on governance proposals.
          </p>
          <ClientSuietConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Governance</h1>
        <p className="text-muted-foreground max-w-3xl">
          Participate in platform governance by voting on proposals with your staked RWAS tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Voting Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {governanceData.votingPower.toLocaleString()} RWAS
            </div>
            <p className="text-muted-foreground text-sm">Based on your staked tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{governanceData.activeProposals}</div>
            <p className="text-muted-foreground text-sm">Out of {governanceData.totalProposals} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quorum Requirement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{governanceData.quorumPercentage}%</div>
            <p className="text-muted-foreground text-sm">Of total staked tokens</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Proposals</TabsTrigger>
          <TabsTrigger value="passed">Passed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {governanceData.proposals
            .filter(proposal => proposal.status === 'active')
            .map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                selectedVote={selectedVote}
                setSelectedVote={setSelectedVote}
                onVote={handleVote}
              />
            ))}
        </TabsContent>

        <TabsContent value="passed" className="space-y-6">
          {governanceData.proposals
            .filter(proposal => proposal.status === 'passed')
            .map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                selectedVote={selectedVote}
                setSelectedVote={setSelectedVote}
                onVote={handleVote}
              />
            ))}
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Failed Proposals</h3>
            <p className="text-muted-foreground">
              There are currently no failed governance proposals.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Alert className="mt-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Governance Information</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Your voting power is determined by your staked RWAS tokens</li>
            <li>Proposals require {governanceData.quorumPercentage}% quorum to pass</li>
            <li>Votes cannot be changed once submitted</li>
            <li>Passed proposals are executed automatically after the voting period</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface ProposalCardProps {
  proposal: any;
  selectedVote: string | null;
  setSelectedVote: (vote: string | null) => void;
  onVote: (proposalId: string) => void;
}

function ProposalCard({ proposal, selectedVote, setSelectedVote, onVote }: ProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercentage = (proposal.votesFor / totalVotes) * 100;
  const againstPercentage = (proposal.votesAgainst / totalVotes) * 100;
  const abstainPercentage = (proposal.votesAbstain / totalVotes) * 100;
  const quorumPercentage = (totalVotes / proposal.quorum) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{proposal.title}</CardTitle>
            <CardDescription className="mt-2">
              Proposed by {proposal.proposer}
            </CardDescription>
          </div>
          <Badge
            variant={proposal.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-muted-foreground">{proposal.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Ends {new Date(proposal.endTime).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>For ({forPercentage.toFixed(1)}%)</span>
              <span>{proposal.votesFor.toLocaleString()} RWAS</span>
            </div>
            <Progress value={forPercentage} className="bg-muted h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Against ({againstPercentage.toFixed(1)}%)</span>
              <span>{proposal.votesAgainst.toLocaleString()} RWAS</span>
            </div>
            <Progress value={againstPercentage} className="bg-muted h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Abstain ({abstainPercentage.toFixed(1)}%)</span>
              <span>{proposal.votesAbstain.toLocaleString()} RWAS</span>
            </div>
            <Progress value={abstainPercentage} className="bg-muted h-2" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Quorum Progress</span>
            <span>{quorumPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={quorumPercentage} className="bg-muted h-2" />
        </div>

        {proposal.status === 'active' && !proposal.myVote && (
          <div className="space-y-4">
            <RadioGroup value={selectedVote || ''} onValueChange={setSelectedVote}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="for" id={`for-${proposal.id}`} />
                <Label htmlFor={`for-${proposal.id}`}>Vote For</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="against" id={`against-${proposal.id}`} />
                <Label htmlFor={`against-${proposal.id}`}>Vote Against</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="abstain" id={`abstain-${proposal.id}`} />
                <Label htmlFor={`abstain-${proposal.id}`}>Abstain</Label>
              </div>
            </RadioGroup>

            <Button 
              className="w-full"
              onClick={() => onVote(proposal.id)}
              disabled={!selectedVote}
            >
              Submit Vote
            </Button>
          </div>
        )}

        {proposal.myVote && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>You've Voted</AlertTitle>
            <AlertDescription>
              You voted "{proposal.myVote}" on this proposal
            </AlertDescription>
          </Alert>
        )}

        {proposal.executed && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Proposal Executed</AlertTitle>
            <AlertDescription>
              This proposal has been executed on the blockchain
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}