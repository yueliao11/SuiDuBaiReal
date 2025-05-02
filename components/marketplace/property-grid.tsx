"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, MapPin, TrendingUp, GripHorizontal, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';

// Mock data - in a real application, this would come from a Sui blockchain query
const properties = [
  {
    id: '1',
    name: 'Palm Jumeirah Luxury Villa',
    location: 'Palm Jumeirah',
    type: 'Residential Villa',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    apr: 9.8,
    status: 'active',
    tokenSymbol: 'PALM01',
    supply: '1,000,000',
    price: 1.25,
    description: 'Beachfront luxury villa with private pool and stunning sea views.',
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
    supply: '2,000,000',
    price: 1.10,
    description: 'Premium apartment complex near Burj Khalifa with high rental demand.',
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
    supply: '5,000,000',
    price: 1.45,
    description: 'Grade A office tower with blue-chip tenants and long-term leases.',
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
    supply: '3,000,000',
    price: 0.95,
    description: 'Five-star hotel with consistent occupancy rates above industry average.',
  },
  {
    id: '5',
    name: 'Jumeirah Beach Residence Retail',
    location: 'Jumeirah Beach Residence',
    type: 'Retail',
    image: 'https://images.pexels.com/photos/5570224/pexels-photo-5570224.jpeg',
    apr: 8.9,
    status: 'active',
    tokenSymbol: 'JBRR01',
    supply: '1,500,000',
    price: 1.15,
    description: 'Prime retail spaces in popular beachfront destination with high foot traffic.',
  },
  {
    id: '6',
    name: 'Dubai Hills Estate Villas',
    location: 'Dubai Hills Estate',
    type: 'Residential Villa',
    image: 'https://images.pexels.com/photos/5997967/pexels-photo-5997967.jpeg',
    apr: 7.8,
    status: 'active',
    tokenSymbol: 'DHEV01',
    supply: '2,500,000',
    price: 1.05,
    description: 'Luxury villas in prestigious gated community with golf course views.',
  },
  {
    id: '7',
    name: 'Bluewaters Island Mixed Use',
    location: 'Bluewaters Island',
    type: 'Mixed Use',
    image: 'https://images.pexels.com/photos/12203460/pexels-photo-12203460.jpeg',
    apr: 9.5,
    status: 'upcoming',
    tokenSymbol: 'BWIM01',
    supply: '4,000,000',
    price: 1.30,
    description: 'Integrated residential, retail and hospitality development on iconic island.',
  },
  {
    id: '8',
    name: 'Palm Jumeirah Hotel & Residences',
    location: 'Palm Jumeirah',
    type: 'Hospitality',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    apr: 10.8,
    status: 'active',
    tokenSymbol: 'PJHR01',
    supply: '6,000,000',
    price: 1.50,
    description: 'Luxury beachfront hotel with branded residences generating premium returns.',
  },
];

const PropertyGrid = () => {
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  useEffect(() => {
    // Apply filters based on URL search params
    let result = [...properties];
    
    const query = searchParams.get('q')?.toLowerCase();
    const locations = searchParams.get('locations')?.split(',').filter(Boolean) || [];
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const minYield = Number(searchParams.get('minYield')) || 4;
    const maxYield = Number(searchParams.get('maxYield')) || 16;
    const sortBy = searchParams.get('sort') || 'newest';
    
    // Filter by search query
    if (query) {
      result = result.filter(property => 
        property.name.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by locations
    if (locations.length > 0) {
      result = result.filter(property => locations.includes(property.location));
    }
    
    // Filter by property types
    if (types.length > 0) {
      result = result.filter(property => types.includes(property.type));
    }
    
    // Filter by yield range
    result = result.filter(property => property.apr >= minYield && property.apr <= maxYield);
    
    // Sort results
    switch (sortBy) {
      case 'yield_high':
        result.sort((a, b) => b.apr - a.apr);
        break;
      case 'yield_low':
        result.sort((a, b) => a.apr - b.apr);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // Assume the array is already sorted by newest
        break;
    }
    
    setFilteredProperties(result);
  }, [searchParams]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {filteredProperties.length} properties found
        </p>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
          if (value) setViewMode(value as 'grid' | 'list');
        }}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <GripHorizontal className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>APY</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="font-medium">{property.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell className="text-green-500 font-medium">
                    {property.apr}%
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={property.status === 'active' ? 'default' : 'outline'}
                      className={property.status === 'active' 
                        ? 'bg-green-500/90 hover:bg-green-500/80'
                        : 'border-amber-500 text-amber-500'
                      }
                    >
                      {property.status === 'active' ? 'Active' : 'Upcoming'}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.tokenSymbol}</TableCell>
                  <TableCell>${property.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" asChild>
                      <Link href={`/property/${property.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No properties found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({ 
  property, 
  hoveredId, 
  setHoveredId 
}: { 
  property: any, 
  hoveredId: string | null, 
  setHoveredId: (id: string | null) => void 
}) => {
  return (
    <Link 
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
              <span className="text-muted-foreground">Token Price:</span>
              <span className="font-medium">${property.price.toFixed(2)}</span>
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
  );
};

export default PropertyGrid;