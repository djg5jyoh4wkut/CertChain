import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Shield } from 'lucide-react';
import { useAccount } from 'wagmi';

const History = () => {
  const { isConnected } = useAccount();

  const mockHistory = [
    {
      id: 1,
      type: 'Quota Set',
      address: '0x742d...89AB',
      timestamp: '2024-01-15 14:32:10',
      status: 'Confirmed',
    },
    {
      id: 2,
      type: 'Quota Claimed',
      address: '0x123a...45CD',
      timestamp: '2024-01-15 13:15:42',
      status: 'Confirmed',
    },
    {
      id: 3,
      type: 'Quota Set',
      address: '0x9876...54EF',
      timestamp: '2024-01-15 12:08:21',
      status: 'Confirmed',
    },
    {
      id: 4,
      type: 'Quota Claimed',
      address: '0x456b...12GH',
      timestamp: '2024-01-15 11:45:33',
      status: 'Confirmed',
    },
    {
      id: 5,
      type: 'Quota Set',
      address: '0xdef1...78IJ',
      timestamp: '2024-01-15 10:22:15',
      status: 'Confirmed',
    },
  ];

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
                <div className="space-y-4">
                  {mockHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border/40 rounded-lg hover:shadow-card transition-shadow bg-gradient-card"
                    >
                      <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {item.type === 'Quota Set' ? (
                            <Shield className="h-5 w-5 text-primary" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{item.type}</p>
                          <p className="text-sm text-muted-foreground">
                            Address: <span className="font-mono">{item.address}</span>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {item.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="self-start sm:self-center">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>

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
