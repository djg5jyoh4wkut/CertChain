import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Users,
  ArrowRight,
  Shield,
  Cpu,
  CheckCircle2,
  PlayCircle,
  Gift,
  Award,
  DollarSign,
  Heart
} from 'lucide-react';

const HowItWorks = () => {
  const mechanismSteps = [
    {
      icon: Users,
      title: 'Anyone Can Create',
      description: 'Any user can create encrypted quota allocations for any Ethereum address. No special permissions required.',
    },
    {
      icon: Lock,
      title: 'FHE Encryption',
      description: 'The quota amount is encrypted using Fully Homomorphic Encryption before being sent to the blockchain.',
    },
    {
      icon: Shield,
      title: 'On-Chain Storage',
      description: 'Encrypted quotas are stored on-chain. Only the recipient can decrypt and claim their allocation.',
    },
    {
      icon: CheckCircle2,
      title: 'Private Claiming',
      description: 'Recipients can claim their encrypted quotas without revealing the amount to anyone, including the creator.',
    },
  ];

  const useCases = [
    {
      icon: Gift,
      title: 'Private Gifts',
      description: 'Send encrypted token gifts without revealing the amount',
      color: 'text-pink-500',
    },
    {
      icon: Award,
      title: 'Rewards & Bonuses',
      description: 'Distribute rewards while keeping individual amounts confidential',
      color: 'text-amber-500',
    },
    {
      icon: DollarSign,
      title: 'Airdrops',
      description: 'Privacy-preserving token distribution for community members',
      color: 'text-green-500',
    },
    {
      icon: Heart,
      title: 'Donations & Subsidies',
      description: 'Confidential financial assistance while maintaining dignity',
      color: 'text-red-500',
    },
  ];

  const technicalDetails = [
    {
      title: 'Zama fhEVM',
      description: 'Built on Zama\'s Fully Homomorphic Encryption Virtual Machine (fhEVM) v0.8.0',
    },
    {
      title: 'euint64 Encryption',
      description: 'Quota amounts are encrypted as 64-bit unsigned integers using FHE',
    },
    {
      title: 'Permission System',
      description: 'Smart access control allows only authorized parties to decrypt values',
    },
    {
      title: 'Fail-Closed Design',
      description: 'Claims automatically fail if amount exceeds allocation, preventing over-claiming',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-primary/5">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How CertChain Works
            </h1>
            <p className="text-xl text-muted-foreground">
              Understanding the mechanism behind privacy-preserving quota distribution
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video Section - Moved to Top */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Demo Video
              </h2>
              <p className="text-lg text-muted-foreground">
                Watch how to create and claim encrypted quota allocations
              </p>
            </div>

            <Card className="border-border/40 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <PlayCircle className="h-20 w-20 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Demo video coming soon</p>
                    <p className="text-sm text-muted-foreground/70">
                      In the meantime, try the live demo by connecting your wallet
                    </p>
                  </div>
                  {/* Placeholder for video */}
                  {/*
                  <iframe
                    className="w-full h-full"
                    src="YOUR_VIDEO_URL"
                    title="CertChain Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  */}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>For Creators</CardTitle>
                  <CardDescription>How to create encrypted allocations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Connect your wallet to the platform</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Navigate to "Create Allocation" page</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Enter recipient address and quota amount</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">4</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confirm transaction - amount will be encrypted automatically</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>For Recipients</CardTitle>
                  <CardDescription>How to claim your encrypted quota</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Connect your wallet to the platform</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Navigate to "Claim Quota" page</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Check your allocation status</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">4</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Enter amount to claim and confirm transaction</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Mechanism Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Operating Mechanism
              </h2>
              <p className="text-lg text-muted-foreground">
                CertChain uses Fully Homomorphic Encryption to enable private quota distribution
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {mechanismSteps.map((step, index) => (
                <Card key={index} className="border-border/40 shadow-card">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">Step {index + 1}</div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
              <div className="flex items-start gap-4">
                <Cpu className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fully Homomorphic Encryption (FHE)</h3>
                  <p className="text-muted-foreground mb-4">
                    FHE allows computations to be performed on encrypted data without decrypting it first.
                    In CertChain, quota amounts remain encrypted throughout their entire lifecycle - during
                    creation, storage, and even during claim validation. Only authorized parties with proper
                    permissions can decrypt and view the actual amounts.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {technicalDetails.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{detail.title}</div>
                          <div className="text-xs text-muted-foreground">{detail.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Use Cases Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Use Cases
              </h2>
              <p className="text-lg text-muted-foreground">
                Real-world applications of encrypted quota distribution
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-border/40 shadow-card hover:shadow-card-hover transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <useCase.icon className={`h-8 w-8 ${useCase.color}`} />
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Experience privacy-preserving quota distribution powered by Fully Homomorphic Encryption
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/admin" className="inline-flex items-center gap-2">
                  Create Allocation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/claim">
                  Claim Quota
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
