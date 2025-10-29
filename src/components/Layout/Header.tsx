import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CertChain
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/admin"
            className={`transition-colors hover:text-primary ${
              isActive('/admin') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            Admin
          </Link>
          <Link
            to="/claim"
            className={`transition-colors hover:text-primary ${
              isActive('/claim') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            Claim
          </Link>
          <Link
            to="/history"
            className={`transition-colors hover:text-primary ${
              isActive('/history') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            History
          </Link>
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
