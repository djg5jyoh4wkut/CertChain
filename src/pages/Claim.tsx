import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAirdrop } from '@/hooks/useAirdrop';
import { parseUnits } from 'viem';

const Claim = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const { myAllocation, myRemaining, claim } = useAirdrop();

  const hasAllocation = myAllocation && myAllocation !== '0x0000000000000000000000000000000000000000000000000000000000000000';

  const handleClaim = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to claim your quota',
        variant: 'destructive',
      });
      return;
    }

    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to claim',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert amount to bigint (assuming 18 decimals like most tokens)
      const amount = parseUnits(claimAmount, 18);

      // Call the claim function with FHE encryption
      await claim(amount);

      setClaimAmount('');
    } catch (error) {
      console.error('Claim error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Download className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Claim Quota</h1>
            <p className="text-muted-foreground">Claim your allocated encrypted quota</p>
          </div>
        </div>

        {!isConnected ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Please connect your wallet to check and claim your quota
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Connect your wallet using the button in the header to view your available quotas
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="shadow-card bg-gradient-card mb-6">
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>Connected wallet information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Wallet Address</span>
                  <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Available Quota</CardTitle>
                <CardDescription>
                  Your encrypted quota allocation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Encrypted Quota Status</p>
                  <p className="text-3xl font-bold text-primary">
                    {hasAllocation ? 'Allocated' : 'No Allocation'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {hasAllocation
                      ? 'You have an encrypted quota allocated. Enter amount to claim.'
                      : 'No quota has been allocated to your address yet'
                    }
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Quota Type</span>
                    <span className="font-semibold">Encrypted (FHE)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Allocation Status</span>
                    <span className="font-semibold">{hasAllocation ? 'Allocated' : 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Amount Visibility</span>
                    <span className="font-semibold">Private (FHE)</span>
                  </div>
                </div>

                {hasAllocation && (
                  <div className="space-y-3">
                    <label htmlFor="claimAmount" className="text-sm font-medium">
                      Claim Amount
                    </label>
                    <Input
                      id="claimAmount"
                      type="number"
                      placeholder="Enter amount to claim"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      disabled={isLoading}
                      min="0"
                      step="0.000000000000000001"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the amount you want to claim. The amount will be encrypted using FHE.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleClaim}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading || !hasAllocation || !claimAmount}
                >
                  {isLoading ? 'Claiming...' : 'Claim Encrypted Quota'}
                </Button>

                <div className="bg-secondary/50 p-4 rounded-lg border border-border/40">
                  <h4 className="font-semibold mb-2 text-sm">Important Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>The quota amount is encrypted using FHE technology</li>
                    <li>Only authorized parties can view the actual amount</li>
                    <li>The claim operation is recorded on-chain transparently</li>
                    <li>You can claim your quota at any time before expiration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Claim;
