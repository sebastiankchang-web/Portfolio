import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import { Leaf } from "lucide-react";

export function DestinationRecommendations() {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  return (
    <div className="mb-8">
      <h2 className="font-heading font-bold text-xl mb-6">Trending Sustainable Destinations</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm relative group animate-pulse">
              <div className="w-full h-56 bg-neutral-light"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/70 to-transparent flex items-end">
                <div className="p-4">
                  <div className="h-6 w-24 bg-white mb-2"></div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-white mr-2 rounded-full"></div>
                    <div className="h-4 w-32 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !destinations || destinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-neutral-light">
          <p className="text-neutral-medium text-lg">No destinations available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg overflow-hidden shadow-sm relative group">
              <img 
                src={destination.imageUrl || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"} 
                alt={destination.name} 
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/70 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-heading font-semibold text-lg">{destination.name}</h3>
                  <div className="flex items-center text-sm">
                    <Leaf className="text-success mr-2 h-4 w-4" />
                    <span>{destination.description}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
