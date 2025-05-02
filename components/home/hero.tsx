"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/wallet/wallet-provider';
import { Button } from '@/components/ui/button';
import { Building2, BadgeDollarSign } from 'lucide-react';

const Hero = () => {
  const { isConnected } = useWallet();
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const targetText = 'Dubai Real Estate Profits';
  
  useEffect(() => {
    if (isTyping && typedText !== targetText) {
      const timeout = setTimeout(() => {
        setTypedText(targetText.slice(0, typedText.length + 1));
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping, targetText]);

  return (
    <div className="relative min-h-[90vh] w-full flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
            <span className="text-sm font-medium text-primary">Powered by Sui Blockchain</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Tokenized <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">{typedText}</span>
            <span className={`inline-block w-0.5 h-8 md:h-12 ml-1 bg-blue-400 ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Invest in premium Dubai real estate annual profits with low entry barriers. 
            Receive stable returns in USDC, backed by verified property performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!isConnected ? (
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500">
                Connect Wallet
              </Button>
            ) : (
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500" asChild>
                <Link href="/marketplace">
                  <Building2 className="mr-2 h-5 w-5" />
                  Explore Properties
                </Link>
              </Button>
            )}
            
            <Button variant="outline" className="text-lg border-gray-400 text-white hover:bg-white/10 px-8 py-6" asChild>
              <Link href="/#how-it-works">
                <BadgeDollarSign className="mr-2 h-5 w-5" />
                How It Works
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center gap-4 text-gray-300">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="font-bold text-white">S</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                <span className="font-bold text-white">U</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="font-bold text-white">I</span>
              </div>
            </div>
            <span className="text-sm">Trusted by 3,500+ global investors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;