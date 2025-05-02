"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const locations = [
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'Jumeirah Beach Residence',
  'Dubai Hills Estate',
  'Bluewaters Island',
];

const propertyTypes = [
  'Residential Villa',
  'Residential Apartment',
  'Commercial Office',
  'Retail',
  'Hospitality',
  'Mixed Use',
];

const PropertyFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [yieldRange, setYieldRange] = useState([6, 12]);
  const [sortOption, setSortOption] = useState('newest');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Initialize filters from URL on component mount
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const locations = searchParams.get('locations')?.split(',') || [];
    const types = searchParams.get('types')?.split(',') || [];
    const minYield = Number(searchParams.get('minYield')) || 6;
    const maxYield = Number(searchParams.get('maxYield')) || 12;
    const sort = searchParams.get('sort') || 'newest';
    
    setSearchQuery(query);
    setSelectedLocations(locations.filter(Boolean));
    setSelectedTypes(types.filter(Boolean));
    setYieldRange([minYield, maxYield]);
    setSortOption(sort);
    
    // Count active filters
    let count = 0;
    if (query) count++;
    count += locations.filter(Boolean).length;
    count += types.filter(Boolean).length;
    if (minYield !== 6 || maxYield !== 12) count++;
    setActiveFiltersCount(count);
  }, [searchParams]);
  
  const applyFilters = () => {
    // Create URLSearchParams object
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    
    if (selectedLocations.length > 0) {
      params.set('locations', selectedLocations.join(','));
    }
    
    if (selectedTypes.length > 0) {
      params.set('types', selectedTypes.join(','));
    }
    
    if (yieldRange[0] !== 6 || yieldRange[1] !== 12) {
      params.set('minYield', yieldRange[0].toString());
      params.set('maxYield', yieldRange[1].toString());
    }
    
    params.set('sort', sortOption);
    
    // Update URL with search params
    router.push(`/marketplace?${params.toString()}`);
    
    // Close mobile filters if open
    setIsFilterOpen(false);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocations([]);
    setSelectedTypes([]);
    setYieldRange([6, 12]);
    setSortOption('newest');
    
    // Clear URL params
    router.push('/marketplace');
  };
  
  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property name or location"
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
        
        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
          {/* Mobile Filters Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4 overflow-y-auto">
                <MobileFilters
                  selectedLocations={selectedLocations}
                  selectedTypes={selectedTypes}
                  yieldRange={yieldRange}
                  handleLocationToggle={handleLocationToggle}
                  handleTypeToggle={handleTypeToggle}
                  setYieldRange={setYieldRange}
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="yield_high">Highest Yield</SelectItem>
                <SelectItem value="yield_low">Lowest Yield</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            
            <DesktopFilters
              selectedLocations={selectedLocations}
              selectedTypes={selectedTypes}
              yieldRange={yieldRange}
              handleLocationToggle={handleLocationToggle}
              handleTypeToggle={handleTypeToggle}
              setYieldRange={setYieldRange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          </div>
          
          <Button onClick={applyFilters} className="w-full lg:w-auto">
            Search
          </Button>
        </div>
      </div>
      
      {/* Active Filters Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  applyFilters();
                }}
              />
            </Badge>
          )}
          
          {selectedLocations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  handleLocationToggle(location);
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          
          {selectedTypes.map(type => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  handleTypeToggle(type);
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          
          {(yieldRange[0] !== 6 || yieldRange[1] !== 12) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Yield: {yieldRange[0]}%-{yieldRange[1]}%
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setYieldRange([6, 12]);
                  applyFilters();
                }}
              />
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

const MobileFilters = ({
  selectedLocations,
  selectedTypes,
  yieldRange,
  handleLocationToggle,
  handleTypeToggle,
  setYieldRange,
}: {
  selectedLocations: string[];
  selectedTypes: string[];
  yieldRange: number[];
  handleLocationToggle: (location: string) => void;
  handleTypeToggle: (type: string) => void;
  setYieldRange: (range: number[]) => void;
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="location">
        <AccordionTrigger>Locations</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {locations.map(location => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <label
                  htmlFor={`location-${location}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="property-type">
        <AccordionTrigger>Property Type</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {propertyTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="yield-range">
        <AccordionTrigger>Yield Range</AccordionTrigger>
        <AccordionContent>
          <div className="px-2 pt-4 pb-2">
            <Slider
              value={yieldRange}
              min={4}
              max={16}
              step={0.5}
              onValueChange={setYieldRange}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm">{yieldRange[0]}%</span>
              <span className="text-sm">{yieldRange[1]}%</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const DesktopFilters = ({
  selectedLocations,
  selectedTypes,
  yieldRange,
  handleLocationToggle,
  handleTypeToggle,
  setYieldRange,
  applyFilters,
  resetFilters,
}: {
  selectedLocations: string[];
  selectedTypes: string[];
  yieldRange: number[];
  handleLocationToggle: (location: string) => void;
  handleTypeToggle: (type: string) => void;
  setYieldRange: (range: number[]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {(selectedLocations.length > 0 || selectedTypes.length > 0 || yieldRange[0] !== 6 || yieldRange[1] !== 12) && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {selectedLocations.length + selectedTypes.length + (yieldRange[0] !== 6 || yieldRange[1] !== 12 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 py-6 overflow-y-auto">
          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <div className="grid grid-cols-2 gap-2">
              {locations.map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-location-${location}`}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                  />
                  <label
                    htmlFor={`desktop-location-${location}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Property Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label
                    htmlFor={`desktop-type-${type}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Yield Range (%)</h3>
            <div className="px-2 pt-6 pb-2">
              <Slider
                value={yieldRange}
                min={4}
                max={16}
                step={0.5}
                onValueChange={setYieldRange}
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm">{yieldRange[0]}%</span>
                <span className="text-sm">{yieldRange[1]}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PropertyFilters;