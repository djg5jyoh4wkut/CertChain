import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Wallet } from 'lucide-react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useAirdrop } from '@/hooks/useAirdrop';
import { parseUnits } from 'viem';

const Claim = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [submittedAmount, setSubmittedAmount] = useState('');
  const { myAllocation, myRemaining, claim, refetchAllocation, refetchClaimed, refetchRemaining } = useAirdrop();

  const hasAllocation = myAllocation && myAllocation !== '0x0000000000000000000000000000000000000000000000000000000000000000';

  // Monitor transaction confirmation
  const { isLoading: isPending, isSuccess: isConfirmed, isError: isFailed, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Show transaction submitted notification
  useEffect(() => {
    if (txHash && !isPending && !isConfirmed && !isFailed) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
      toast({
        title: '📤 Transaction Submitted',
        description: (
          <div className="space-y-2">
            <p>Your claim transaction has been submitted to the network.</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
            >
              View on Etherscan →
            </a>
          </div>
        ),
        duration: 5000,
      });
    }
  }, [txHash, isPending, isConfirmed, isFailed, toast]);

  // Show pending notification
  useEffect(() => {
    if (txHash && isPending) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
      toast({
        title: '⏳ Transaction pending...',
        description: (
          <div className="space-y-2">
            <p>Your claim transaction is being confirmed.</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
            >
              View on Etherscan →
            </a>
          </div>
        ),
        duration: 5000,
      });
    }
  }, [txHash, isPending, toast]);

  // Show confirmation notification
  useEffect(() => {
    if (isConfirmed && txHash && submittedAmount) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

      toast({
        title: '✅ Claim successful!',
        description: (
          <div className="space-y-2">
            <p>You claimed {submittedAmount} tokens successfully.</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
            >
              View on Etherscan →
            </a>
          </div>
        ),
        duration: 10000,
      });

      // Refetch data after claim
      setTimeout(() => {
        refetchAllocation();
        refetchClaimed();
        refetchRemaining();
      }, 2000);

      // Reset form
      setClaimAmount('');
      setSubmittedAmount('');
      setTxHash(undefined);
      setIsLoading(false);
    }
  }, [isConfirmed, txHash, submittedAmount, toast, refetchAllocation, refetchClaimed, refetchRemaining]);

  // Show failure notification
  useEffect(() => {
    if (isFailed && txHash) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

      toast({
        title: '❌ Transaction Failed',
        description: (
          <div className="space-y-2">
            <p>{txError?.message || 'Your claim transaction failed on-chain.'}</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
            >
              View on Etherscan →
            </a>
          </div>
        ),
        variant: 'destructive',
        duration: 10000,
      });

      // Reset state
      setClaimAmount('');
      setSubmittedAmount('');
      setTxHash(undefined);
      setIsLoading(false);
    }
  }, [isFailed, txHash, txError, toast]);

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
      console.log('[Claim] Starting claim...');
      console.log('[Claim] Amount:', claimAmount);

      // Convert amount to bigint with 6 decimals (to fit in uint64)
      const amount = parseUnits(claimAmount, 6);
      console.log('[Claim] Amount (6 decimals):', amount.toString());

      // Call the claim function with FHE encryption
      console.log('[Claim] Encrypting and submitting...');
      const hash = await claim(amount);

      console.log('[Claim] Transaction hash:', hash);

      // Save transaction hash and amount for confirmation notification
      setTxHash(hash);
      setSubmittedAmount(claimAmount);

      // Note: Don't reset isLoading here - it will be reset after confirmation
    } catch (error) {
      console.error('[Claim] ❌ Claim error:', error);

      // Show error notification for pre-submission errors (FHE encryption, wallet rejection, etc.)
      toast({
        title: '❌ Transaction Error',
        description: (
          <div className="space-y-2">
            <p>{error instanceof Error ? error.message : 'Failed to submit transaction'}</p>
          </div>
        ),
        variant: 'destructive',
        duration: 8000,
      });

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
                      step="0.000001"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the amount you want to claim. The amount will be encrypted using FHE (6 decimal precision).
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
