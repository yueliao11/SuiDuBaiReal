"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  BarChart3, 
  Vote, 
  FileCheck 
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ModeToggle } from '@/components/theme/mode-toggle';
import ClientSuietConnect from '@/components/wallet/client-suiet-connect';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isMounted) return null;

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden md:inline-block">RWAS Dubai</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>
          
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <ClientSuietConnect />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <MobileNavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLinks = () => {
  return (
    <>
      <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
        Marketplace
      </Link>
      <Link href="/portfolio" className="text-sm font-medium transition-colors hover:text-primary">
        My Portfolio
      </Link>
      <Link href="/staking" className="text-sm font-medium transition-colors hover:text-primary">
        Staking
      </Link>
      <Link href="/governance" className="text-sm font-medium transition-colors hover:text-primary">
        Governance
      </Link>
    </>
  );
};

const MobileNavLinks = () => {
  return (
    <>
      <Link href="/marketplace" className="flex items-center space-x-2 text-sm font-medium">
        <Building2 className="h-5 w-5" />
        <span>Marketplace</span>
      </Link>
      <Link href="/portfolio" className="flex items-center space-x-2 text-sm font-medium">
        <BarChart3 className="h-5 w-5" />
        <span>My Portfolio</span>
      </Link>
      <Link href="/staking" className="flex items-center space-x-2 text-sm font-medium">
        <FileCheck className="h-5 w-5" />
        <span>Staking</span>
      </Link>
      <Link href="/governance" className="flex items-center space-x-2 text-sm font-medium">
        <Vote className="h-5 w-5" />
        <span>Governance</span>
      </Link>
    </>
  );
};

export default Header;