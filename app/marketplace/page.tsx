import PropertyFilters from '@/components/marketplace/property-filters';
import PropertyGrid from '@/components/marketplace/property-grid';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ClientWalletInteraction from '@/components/wallet/client-wallet-interaction';

export default function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Property Marketplace</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse our selection of premium Dubai properties with tokenized annual profits. 
          Filter by location, property type, or expected yield to find your ideal investment.
        </p>
      </div>
      
      <ClientWalletInteraction />
      
      <PropertyFilters />
      
      <Suspense fallback={<PropertyGridSkeleton />}>
        <PropertyGrid />
      </Suspense>
    </div>
  );
}

const PropertyGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {Array(8).fill(0).map((_: number, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};