import Link from 'next/link';
import { Building2, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">RWAS Dubai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tokenizing Dubai real estate annual profits on Sui blockchain, enabling global compliant investors to participate in premium property returns.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Portfolio
                </Link>
              </li>
              <li>
                <Link href="/staking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Staking
                </Link>
              </li>
              <li>
                <Link href="/governance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Governance
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@rwasdubai.com" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 border-t pt-8">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} RWAS Dubai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;