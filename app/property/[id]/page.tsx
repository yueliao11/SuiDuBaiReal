import PropertyDetail from '@/components/property/property-detail';
import { notFound } from 'next/navigation';

// This would ideally come from a fetcher/DB in a real app
const properties = [
  {
    id: '1',
    name: 'Palm Jumeirah Luxury Villa',
    location: 'Palm Jumeirah',
    type: 'Residential Villa',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
      'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg',
      'https://images.pexels.com/photos/5528986/pexels-photo-5528986.jpeg',
    ],
    apr: 9.8,
    status: 'active',
    tokenSymbol: 'PALM01',
    supply: '1,000,000',
    price: 1.25,
    description: 'This luxury villa located on Palm Jumeirah offers premium rental yields with consistent high occupancy rates. The property features direct beach access, private swimming pool, and panoramic sea views. The villa is fully furnished and managed by a professional property management company ensuring regular maintenance and high-quality services for tenants.',
    features: [
      '5 Bedrooms, 6 Bathrooms',
      '8,500 sq ft built-up area',
      'Private beach access',
      'Infinity swimming pool',
      'Smart home technology',
      'Premium finishes throughout',
      'Fully furnished',
      'Professional property management',
    ],
    historicalYields: [
      { year: 2020, value: 8.5 },
      { year: 2021, value: 9.2 },
      { year: 2022, value: 9.5 },
      { year: 2023, value: 9.8 },
    ],
    expectedYield: 10.2,
    location_map: {
      lat: 25.112,
      lng: 55.138,
    },
    tokenAddress: '0x42e8e6523a5fe93aade39a6ebf64fac5b1982b0248b1b3c9d18bcd42f62c25e1',
  },
  {
    id: '2',
    name: 'Downtown Dubai Apartment Complex',
    location: 'Downtown Dubai',
    type: 'Residential Apartments',
    images: [
      'https://images.pexels.com/photos/2096578/pexels-photo-2096578.jpeg',
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
    ],
    apr: 8.5,
    status: 'active',
    tokenSymbol: 'DWTN01',
    supply: '2,000,000',
    price: 1.10,
    description: 'A premium residential apartment complex in the heart of Downtown Dubai, offering spectacular views of Burj Khalifa and Dubai Fountain. The property consists of multiple high-end residential units with excellent rental demand due to its prime location. The complex includes luxury amenities like swimming pools, fitness centers, and round-the-clock security.',
    features: [
      'Multiple unit sizes (studios to 3-bedrooms)',
      'Premium location near Burj Khalifa',
      'Luxury amenities throughout',
      'High rental demand area',
      'Professional property management',
      '24/7 security and concierge services',
      'Walking distance to Dubai Mall',
      'High occupancy rates year-round',
    ],
    historicalYields: [
      { year: 2020, value: 7.8 },
      { year: 2021, value: 8.0 },
      { year: 2022, value: 8.3 },
      { year: 2023, value: 8.5 },
    ],
    expectedYield: 8.8,
    location_map: {
      lat: 25.197,
      lng: 55.274,
    },
    tokenAddress: '0x78e9abfb91ec82f6a32c0dee3aef5b57f8ab0a5ab5c63e8b9577aabd34d5cfe3',
  },
  {
    id: '3',
    name: 'Business Bay Office Tower',
    location: 'Business Bay',
    type: 'Commercial Office',
    images: [
      'https://images.pexels.com/photos/256150/pexels-photo-256150.jpeg',
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
      'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg',
      'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
    ],
    apr: 7.5,
    status: 'active',
    tokenSymbol: 'BBOT01',
    supply: '3,000,000',
    price: 0.95,
    description: 'A modern office tower in Business Bay offering Grade A commercial space with high occupancy rates. The building features state-of-the-art facilities, smart building management systems, and excellent connectivity to major business districts.',
    features: [
      '25 floors of premium office space',
      'Smart building management system',
      'High-speed elevators',
      'Central location',
      '24/7 security',
      'Ample parking space',
      'Meeting and conference facilities',
      'High-speed internet infrastructure',
    ],
    historicalYields: [
      { year: 2020, value: 6.8 },
      { year: 2021, value: 7.0 },
      { year: 2022, value: 7.2 },
      { year: 2023, value: 7.5 },
    ],
    expectedYield: 7.8,
    location_map: {
      lat: 25.185,
      lng: 55.266,
    },
    tokenAddress: '0x91f7abfb91ec82f6a32c0dee3aef5b57f8ab0a5ab5c63e8b9577aabd34d5cfe3',
  }
];

export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const property = properties.find(p => p.id === params.id);
  
  if (!property) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PropertyDetail property={property} />
    </div>
  );
}