import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAirdrop } from '@/hooks/useAirdrop';
import { parseUnits, isAddress } from 'viem';

const Admin = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [quota, setQuota] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAllocation } = useAirdrop();

  const handleSetQuota = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create allocations',
        variant: 'destructive',
      });
      return;
    }

    if (!isAddress(recipientAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address',
        variant: 'destructive',
      });
      return;
    }

    if (!quota || parseFloat(quota) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid quota amount',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert quota to bigint (assuming 18 decimals)
      const amount = parseUnits(quota, 18);

      // Call setAllocation with FHE encryption
      await setAllocation(recipientAddress, amount);

      setRecipientAddress('');
      setQuota('');
    } catch (error) {
      console.error('Error setting quota:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Create Allocation</h1>
            <p className="text-muted-foreground">Anyone can create encrypted quotas for any address</p>
          </div>
        </div>

        {!isConnected ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Please connect your wallet to create allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to create encrypted quota allocations for any address.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Encrypted Allocation
              </CardTitle>
              <CardDescription>
                Create an encrypted quota allocation for any address. The amount will be encrypted using FHE and only visible to the recipient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetQuota} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Recipient Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    required
                    className="font-mono"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    The wallet address that will receive the encrypted quota
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quota">Quota Amount</Label>
                  <Input
                    id="quota"
                    type="number"
                    placeholder="1000"
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    required
                    min="0"
                    step="0.000000000000000001"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    This amount will be encrypted using FHE before being recorded on-chain
                  </p>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg border border-border/40">
                  <h4 className="font-semibold mb-2 text-sm">Privacy Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    The quota amount will be encrypted using Fully Homomorphic Encryption (FHE). 
                    Only the operation will be visible on-chain, not the actual amount.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Allocation...' : 'Create Encrypted Allocation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 shadow-card">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Public Allocation Creation:</strong> Any user can create encrypted quota allocations for any address. This is a fully decentralized DApp.
            </p>
            <p>
              <strong className="text-foreground">FHE Encryption:</strong> The quota amount is encrypted using Fully Homomorphic Encryption before being stored on-chain, ensuring complete privacy.
            </p>
            <p>
              <strong className="text-foreground">Privacy Preserved:</strong> Only the recipient can view and claim their allocation amount. Even the creator and blockchain observers cannot see the actual amount.
            </p>
            <p>
              <strong className="text-foreground">Use Cases:</strong> Gift quotas, rewards, airdrops, subsidies, or any scenario requiring private amount distribution.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
