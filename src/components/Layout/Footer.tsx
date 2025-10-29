import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
              CertChain
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Secure FHE-based encrypted quota distribution on blockchain
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2024 CertChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
