"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const featuredProperties = [
  {
    id: '1',
    name: 'Palm Jumeirah Luxury Villa',
    location: 'Palm Jumeirah',
    type: 'Residential Villa',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    apr: 9.8,
    status: 'active',
    tokenSymbol: 'PALM01',
    supply: '1,000,000'
  },
  {
    id: '2',
    name: 'Downtown Dubai Apartment Complex',
    location: 'Downtown Dubai',
    type: 'Residential Apartments',
    image: 'https://images.pexels.com/photos/2096578/pexels-photo-2096578.jpeg',
    apr: 8.5,
    status: 'active',
    tokenSymbol: 'DWTN01',
    supply: '2,000,000'
  },
  {
    id: '3',
    name: 'Dubai Marina Office Tower',
    location: 'Dubai Marina',
    type: 'Commercial',
    image: 'https://images.pexels.com/photos/10871168/pexels-photo-10871168.jpeg',
    apr: 10.2,
    status: 'active',
    tokenSymbol: 'MARN01',
    supply: '5,000,000'
  },
  {
    id: '4',
    name: 'Business Bay Hotel',
    location: 'Business Bay',
    type: 'Hospitality',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    apr: 11.5,
    status: 'upcoming',
    tokenSymbol: 'BYBH01',
    supply: '3,000,000'
  }
];

const FeaturedProperties = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-background/90 to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore our curated selection of premium Dubai properties with proven yield performance.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/marketplace" className="flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Link 
              key={property.id} 
              href={`/property/${property.id}`}
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="no-underline"
            >
              <Card 
                className={`overflow-hidden transition-all duration-300 h-full ${
                  hoveredId === property.id ? 'border-primary shadow-lg' : ''
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredId === property.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={property.status === 'active' ? 'default' : 'outline'}
                      className={property.status === 'active' 
                        ? 'bg-green-500/90 hover:bg-green-500/80'
                        : 'border-amber-500 text-amber-500'
                      }
                    >
                      {property.status === 'active' ? 'Active' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{property.name}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.type}</span>
                  </div>
                  
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">{property.apr}% APY (Last Year)</span>
                  </div>
                  
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Token Symbol:</span>
                      <span className="font-medium">{property.tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Token Supply:</span>
                      <span className="font-medium">{property.supply}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;