import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import { Car, Train, Plane, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchParams, TransportParams } from "@/lib/types";

export function Bookings() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '1 adult'
  });

  const [transportParams, setTransportParams] = useState<TransportParams>({
    pickupLocation: '',
    pickupDate: '',
    returnDate: '',
    transportType: 'car'
  });

  const { data: ecoHotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels/eco'],
  });

  const handleAccommodationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransportParams(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportTypeChange = (type: 'car' | 'train' | 'flight') => {
    setTransportParams(prev => ({ ...prev, transportType: type }));
  };

  const searchAccommodations = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
    console.log('Searching accommodations with:', searchParams);
  };

  const searchTransport = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
    console.log('Searching transport with:', transportParams);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="bg-primary-light/10 rounded-lg p-4 flex-1">
          <h3 className="font-heading font-semibold mb-3 flex items-center">
            <i className="fas fa-search text-primary-DEFAULT mr-2"></i>
            Find Sustainable Accommodations
          </h3>
          <form onSubmit={searchAccommodations} className="space-y-3">
            <div>
              <Label className="block text-sm font-medium mb-1">Destination</Label>
              <Input 
                type="text" 
                name="destination"
                value={searchParams.destination}
                onChange={handleAccommodationChange}
                placeholder="City, region or property" 
                className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label className="block text-sm font-medium mb-1">Check-in</Label>
                <Input 
                  type="date" 
                  name="checkIn"
                  value={searchParams.checkIn}
                  onChange={handleAccommodationChange}
                  className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium mb-1">Check-out</Label>
                <Input 
                  type="date" 
                  name="checkOut"
                  value={searchParams.checkOut}
                  onChange={handleAccommodationChange}
                  className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Guests</Label>
              <select 
                name="guests"
                value={searchParams.guests}
                onChange={handleAccommodationChange}
                className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-light"
              >
                <option>1 adult</option>
                <option>2 adults</option>
                <option>2 adults, 1 child</option>
                <option>2 adults, 2 children</option>
              </select>
            </div>
            <Button 
              type="submit"
              className="w-full bg-primary-DEFAULT hover:bg-primary-dark text-white font-medium py-2 rounded transition"
            >
              Search
            </Button>
          </form>
        </div>
        
        <div className="bg-secondary-light/10 rounded-lg p-4 flex-1">
          <h3 className="font-heading font-semibold mb-3 flex items-center">
            <Car className="text-secondary-DEFAULT mr-2 h-5 w-5" />
            Eco-Friendly Transportation
          </h3>
          <form onSubmit={searchTransport} className="space-y-3">
            <div className="flex space-x-3 mb-3">
              <Button
                type="button"
                onClick={() => handleTransportTypeChange('car')}
                className={`flex-1 py-2 text-center rounded-full 
                  ${transportParams.transportType === 'car' 
                    ? 'bg-secondary-DEFAULT text-white font-medium' 
                    : 'bg-white text-neutral-dark font-medium border border-neutral-light'}`}
              >
                <Car className="inline-block mr-1 h-4 w-4" /> Car
              </Button>
              <Button
                type="button"
                onClick={() => handleTransportTypeChange('train')}
                className={`flex-1 py-2 text-center rounded-full 
                  ${transportParams.transportType === 'train' 
                    ? 'bg-secondary-DEFAULT text-white font-medium' 
                    : 'bg-white text-neutral-dark font-medium border border-neutral-light'}`}
              >
                <Train className="inline-block mr-1 h-4 w-4" /> Train
              </Button>
              <Button
                type="button"
                onClick={() => handleTransportTypeChange('flight')}
                className={`flex-1 py-2 text-center rounded-full 
                  ${transportParams.transportType === 'flight' 
                    ? 'bg-secondary-DEFAULT text-white font-medium' 
                    : 'bg-white text-neutral-dark font-medium border border-neutral-light'}`}
              >
                <Plane className="inline-block mr-1 h-4 w-4" /> Flights
              </Button>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Pick-up location</Label>
              <Input 
                type="text" 
                name="pickupLocation"
                value={transportParams.pickupLocation}
                onChange={handleTransportChange}
                placeholder="City or airport" 
                className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-secondary-light"
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label className="block text-sm font-medium mb-1">Pick-up date</Label>
                <Input 
                  type="date" 
                  name="pickupDate"
                  value={transportParams.pickupDate}
                  onChange={handleTransportChange}
                  className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-secondary-light"
                />
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium mb-1">Return date</Label>
                <Input 
                  type="date" 
                  name="returnDate"
                  value={transportParams.returnDate}
                  onChange={handleTransportChange}
                  className="w-full p-2 rounded border border-neutral-light focus:outline-none focus:ring-2 focus:ring-secondary-light"
                />
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full bg-secondary-DEFAULT hover:bg-secondary-dark text-white font-medium py-2 rounded transition"
            >
              Find Options
            </Button>
          </form>
        </div>
      </div>
      
      <h3 className="font-heading font-semibold text-lg mb-4">Eco-Friendly Recommendations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-neutral-light shadow-sm animate-pulse">
              <div className="h-40 bg-neutral-light"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-neutral-light w-2/3"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 rounded-full bg-neutral-light"></div>
                    ))}
                  </div>
                </div>
                <div className="h-4 bg-neutral-light w-1/3 mb-2"></div>
                <div className="flex space-x-2 mb-2">
                  <div className="h-6 bg-neutral-light w-1/4 rounded-full"></div>
                  <div className="h-6 bg-neutral-light w-1/4 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-neutral-light w-1/4"></div>
                  <div className="h-8 bg-neutral-light w-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))
        ) : !ecoHotels || ecoHotels.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-white border border-neutral-light rounded-lg">
            <p className="text-neutral-medium text-lg">No eco-friendly hotels found for your search criteria.</p>
          </div>
        ) : (
          ecoHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg overflow-hidden border border-neutral-light shadow-sm">
              <img 
                src={hotel.imageUrl || "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"} 
                className="w-full h-40 object-cover" 
                alt={hotel.name} 
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading font-semibold">{hotel.name}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Leaf 
                        key={i} 
                        className={`h-4 w-4 ${i < hotel.sustainabilityRating ? 'text-success' : 'text-neutral-light'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-medium mb-2">{hotel.location}</p>
                <div className="flex flex-wrap items-center space-x-2 mb-2">
                  {hotel.features && hotel.features.map((feature, i) => (
                    <span key={i} className="bg-primary-light/20 text-primary-DEFAULT text-xs rounded-full px-2 py-1 mb-1">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg">${hotel.price}</span>
                    <span className="text-sm text-neutral-medium">/ night</span>
                  </div>
                  <Button className="bg-primary-DEFAULT hover:bg-primary-dark text-white font-medium py-1 px-3 rounded-lg text-sm transition">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
