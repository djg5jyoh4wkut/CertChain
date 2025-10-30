import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Shield, ExternalLink, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useHistory, formatAddress, formatTimestamp } from '@/hooks/useHistory';

const History = () => {
  const { isConnected } = useAccount();
  const { events, isLoading } = useHistory();

  const getEventIcon = (type: string) => {
    if (type === 'Claimed') {
      return <CheckCircle className="h-5 w-5 text-accent" />;
    }
    return <Shield className="h-5 w-5 text-primary" />;
  };

  const getEventDescription = (event: any) => {
    if (event.type === 'Allocation Set') {
      return (
        <>
          <p className="text-sm text-muted-foreground">
            Creator: <span className="font-mono">{formatAddress(event.creator)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Recipient: <span className="font-mono">{formatAddress(event.recipient)}</span>
          </p>
        </>
      );
    }

    if (event.type === 'Batch Allocation') {
      return (
        <>
          <p className="text-sm text-muted-foreground">
            Creator: <span className="font-mono">{formatAddress(event.creator)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Recipients: {event.count} addresses
          </p>
        </>
      );
    }

    if (event.type === 'Claimed') {
      return (
        <p className="text-sm text-muted-foreground">
          User: <span className="font-mono">{formatAddress(event.user)}</span>
        </p>
      );
    }

    return null;
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">View all on-chain operations (amounts remain encrypted)</p>
          </div>
        </div>

        {!isConnected ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to view transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transaction history is available after connecting your wallet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This history shows all operations recorded on-chain. While operations are transparent, 
                  the actual quota amounts remain encrypted and confidential through FHE technology.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Operations</CardTitle>
                <CardDescription>
                  Latest transactions on the CertChain network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Loading transaction history...</span>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Allocation and claim operations will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border/40 rounded-lg hover:shadow-card transition-shadow bg-gradient-card"
                      >
                        <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">{event.type}</p>
                            {getEventDescription(event)}
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(event.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <Badge variant="secondary" className="whitespace-nowrap">
                            {event.status}
                          </Badge>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View on Etherscan"
                          >
                            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground text-center">
                    All operations are recorded on the blockchain with encrypted amounts. 
                    Only operation types and addresses are publicly visible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
