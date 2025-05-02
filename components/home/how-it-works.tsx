"use client";

import { useRef, useEffect } from 'react';
import { 
  Building, 
  BadgeDollarSign, 
  PiggyBank, 
  ArrowRight,
  BarChart4
} from 'lucide-react';

const HowItWorks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawConnectingLines(ctx);
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Initial setup
    canvas.width = canvas.parentElement?.clientWidth || 0;
    canvas.height = canvas.parentElement?.clientHeight || 0;
    drawConnectingLines(ctx);
    
    return () => {
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, []);
  
  const drawConnectingLines = (ctx: CanvasRenderingContext2D) => {
    const steps = document.querySelectorAll('.step-item');
    if (steps.length < 2) return;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Get theme colors
    const isDarkMode = document.documentElement.classList.contains('dark');
    const lineColor = isDarkMode ? 'rgba(64, 64, 64, 0.6)' : 'rgba(229, 229, 229, 0.8)';
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw lines connecting the steps
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i] as HTMLElement;
      const nextStep = steps[i + 1] as HTMLElement;
      
      const currentRect = currentStep.getBoundingClientRect();
      const nextRect = nextStep.getBoundingClientRect();
      
      const canvasRect = ctx.canvas.getBoundingClientRect();
      
      // Calculate positions relative to canvas
      const startX = currentRect.left + currentRect.width / 2 - canvasRect.left;
      const startY = currentRect.top + currentRect.height / 2 - canvasRect.top;
      const endX = nextRect.left + nextRect.width / 2 - canvasRect.left;
      const endY = nextRect.top + nextRect.height / 2 - canvasRect.top;
      
      // Draw the connecting line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // For horizontal layout
      if (window.innerWidth >= 768) {
        ctx.lineTo(endX, endY);
      } else {
        // For vertical layout, add a curve
        const midY = (startY + endY) / 2;
        ctx.bezierCurveTo(startX, midY, endX, midY, endX, endY);
      }
      
      ctx.stroke();
    }
  };

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform simplifies the process of investing in Dubai real estate profit tokens
          </p>
        </div>
        
        <div className="relative">
          <canvas ref={canvasRef} className="absolute inset-0 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="step-item flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Property Selection</h3>
              <p className="text-muted-foreground">
                Premium Dubai properties are carefully vetted and tokenized on the Sui blockchain.
              </p>
            </div>
            
            <div className="step-item flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BadgeDollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Token Purchase</h3>
              <p className="text-muted-foreground">
                Buy property profit tokens with USDC after completing KYC verification.
              </p>
            </div>
            
            <div className="step-item flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart4 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Real World Profits</h3>
              <p className="text-muted-foreground">
                Properties generate real-world rental income, managed by our professional teams.
              </p>
            </div>
            
            <div className="step-item flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PiggyBank className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Yield Distribution</h3>
              <p className="text-muted-foreground">
                Receive annual profit distributions in USDC stablecoin directly to your wallet.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <BadgeDollarSign className="mr-2 h-6 w-6 text-primary" />
              Annual Yield Process
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center">
                <div className="bg-muted p-4 rounded-lg mb-2">
                  <p className="font-medium">Property Generates Revenue</p>
                </div>
                <p className="text-sm text-muted-foreground">Rental Income</p>
              </div>
              
              <ArrowRight className="rotate-90 md:rotate-0 h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="bg-muted p-4 rounded-lg mb-2">
                  <p className="font-medium">Verified On-Chain</p>
                </div>
                <p className="text-sm text-muted-foreground">Transparent Process</p>
              </div>
              
              <ArrowRight className="rotate-90 md:rotate-0 h-6 w-6 text-muted-foreground" />
              
              <div className="text-center">
                <div className="bg-muted p-4 rounded-lg mb-2">
                  <p className="font-medium">USDC Distribution</p>
                </div>
                <p className="text-sm text-muted-foreground">To Token Holders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;