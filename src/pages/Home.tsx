import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'FHE Encryption',
      description: 'Fully Homomorphic Encryption ensures complete privacy of quota amounts',
    },
    {
      icon: Lock,
      title: 'Secure Distribution',
      description: 'Admins can set encrypted quotas without revealing actual amounts',
    },
    {
      icon: Clock,
      title: 'On-Demand Claims',
      description: 'Users claim their encrypted quotas when needed, maintaining privacy',
    },
    {
      icon: CheckCircle,
      title: 'Transparent Records',
      description: 'All operations are recorded on-chain while keeping amounts confidential',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              CertChain
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              FHE-Based Encrypted Quota Distribution System
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              A revolutionary blockchain solution that enables secure quota distribution using Fully Homomorphic Encryption. 
              Admins set encrypted quotas, users claim them privately, and all operations are transparently recorded on-chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/claim">Start Claiming</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/admin">Admin Panel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge encryption technology to ensure privacy and security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-border/40 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in bg-gradient-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-8">
              <Card className="border-l-4 border-l-primary shadow-card">
                <CardHeader>
                  <CardTitle>1. Admin Sets Quotas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Administrators can set encrypted quotas for specific addresses. The actual amounts remain 
                    encrypted and private, visible only to authorized parties.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent shadow-card">
                <CardHeader>
                  <CardTitle>2. Users Claim Quotas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Users can claim their allocated encrypted quotas on-demand. The claim process is recorded 
                    on-chain while maintaining the confidentiality of amounts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-card">
                <CardHeader>
                  <CardTitle>3. Transparent History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All operations are recorded on the blockchain, providing full transparency of actions 
                    while keeping the specific quota amounts confidential through FHE.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Connect your wallet and start using CertChain's secure encrypted quota system today
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/claim">Connect Wallet</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
