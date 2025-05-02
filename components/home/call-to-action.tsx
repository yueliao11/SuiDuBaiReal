import Link from 'next/link';
import { BadgeDollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 py-16 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-xl mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Earning Real Estate Yields?
              </h2>
              <p className="text-gray-300 md:text-lg mb-6">
                Join thousands of global investors already earning passive income from premium Dubai properties. 
                Start with as little as $100.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-1">
                  <BadgeDollarSign className="text-green-400 h-5 w-5" />
                  <span className="text-green-400 font-medium">8-12% Annual Yields</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Building2 className="text-blue-400 h-5 w-5" />
                  <span className="text-blue-400 font-medium">Premium Properties</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-white/10 w-full md:w-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Get Started Now</h3>
              
              <div className="flex flex-col space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500"
                  size="lg"
                  asChild
                >
                  <Link href="/marketplace">
                    <Building2 className="mr-2 h-5 w-5" />
                    Browse Properties
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  size="lg"
                  asChild
                >
                  <Link href="/compliance">
                    Complete Verification
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                KYC verification required for investment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;