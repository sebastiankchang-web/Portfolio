import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Trip } from "@shared/schema";
import { Leaf, Calendar, MapPin, Users } from "lucide-react";

export default function Explore() {
  const { isAuthenticated } = useAuth();
  
  const { data: popularTrips, isLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips/popular"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Explore Sustainable Travel</h1>
            <p className="text-neutral-medium">Discover eco-friendly destinations, routes, and experiences shared by our community.</p>
          </div>
          
          {/* Search & Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="Search destinations, activities, or travelers..." 
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light">
                  <option value="">All Categories</option>
                  <option value="hiking">Hiking Trails</option>
                  <option value="city">City Tours</option>
                  <option value="beach">Beach Getaways</option>
                  <option value="mountain">Mountain Retreats</option>
                </select>
                <button className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-6 py-2 rounded-lg">
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {/* Popular Routes */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold mb-4">Popular Eco-Friendly Routes</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                    <div className="h-48 bg-neutral-light"></div>
                    <div className="p-4">
                      <div className="h-6 bg-neutral-light w-3/4 mb-2"></div>
                      <div className="h-4 bg-neutral-light w-1/2 mb-4"></div>
                      <div className="flex justify-between mb-2">
                        <div className="h-4 bg-neutral-light w-1/4"></div>
                        <div className="h-4 bg-neutral-light w-1/4"></div>
                      </div>
                      <div className="h-4 bg-neutral-light w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularTrips?.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg overflow-hidden shadow group">
                    <div className="relative h-48">
                      <img 
                        src={trip.imageUrl || "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"} 
                        alt={trip.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full py-1 px-3 text-xs font-medium text-primary-DEFAULT">
                        {trip.carbonSaved}kg CO₂ saved
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg mb-1">{trip.title}</h3>
                      <p className="text-neutral-medium text-sm mb-3 line-clamp-2">{trip.description}</p>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-primary-DEFAULT mr-1" />
                          <span className="text-xs">{trip.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-primary-DEFAULT mr-1" />
                          <span className="text-xs">{trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Flexible'}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-neutral-medium">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Shared by {trip.userId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sustainable Travel Tips */}
          <div className="bg-primary-light/10 rounded-lg p-6 mb-8">
            <h2 className="font-heading text-2xl font-bold mb-4 text-primary-DEFAULT">Sustainable Travel Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary-DEFAULT/20 flex items-center justify-center mr-3">
                    <Leaf className="h-5 w-5 text-primary-DEFAULT" />
                  </div>
                  <h3 className="font-heading font-semibold">Choose Eco-Friendly Transport</h3>
                </div>
                <p className="text-sm text-neutral-medium">Opt for trains, buses, or shared rides instead of flights when possible. If you need to fly, book direct flights to reduce carbon emissions.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary-DEFAULT/20 flex items-center justify-center mr-3">
                    <i className="fas fa-water text-primary-DEFAULT"></i>
                  </div>
                  <h3 className="font-heading font-semibold">Reduce Plastic Waste</h3>
                </div>
                <p className="text-sm text-neutral-medium">Pack a reusable water bottle, shopping bag, and toiletry containers. Avoid single-use plastics and disposable items during your travels.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary-DEFAULT/20 flex items-center justify-center mr-3">
                    <i className="fas fa-hands-helping text-primary-DEFAULT"></i>
                  </div>
                  <h3 className="font-heading font-semibold">Support Local Communities</h3>
                </div>
                <p className="text-sm text-neutral-medium">Stay at locally-owned accommodations, eat at local restaurants, and buy souvenirs from local artisans to support the destination's economy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
