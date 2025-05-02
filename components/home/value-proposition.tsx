"use client";

import { 
  BadgeDollarSign, 
  Lock, 
  TrendingUp, 
  Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: <BadgeDollarSign className="h-8 w-8" />,
    title: 'Low Entry Barrier',
    description: 'Start investing in premium Dubai real estate with as little as $100. Fractional ownership made possible through tokenization.'
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Annual Yields',
    description: 'Receive verified real estate yields paid in USDC stablecoin directly to your wallet. Typically 8-12% APY.'
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: 'Trustless & Transparent',
    description: 'All property data, revenue distributions, and ownership records are immutably stored on the Sui blockchain.'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global Compliance',
    description: 'Our platform ensures compliance with regulatory requirements through integrated KYC verification.'
  }
];

const ValueProposition = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Invest With Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our blockchain-based platform brings premium Dubai real estate profits to global investors through innovative tokenization.
          </p>
        </div>
        
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;