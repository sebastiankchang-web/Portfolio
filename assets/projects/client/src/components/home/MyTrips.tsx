import { useQuery } from "@tanstack/react-query";
import { Trip } from "@shared/schema";
import { format } from "date-fns";
import { AlertCircle, Calendar, MoreHorizontal, Plane, Train } from "lucide-react";

export function MyTrips() {
  const { data: upcomingTrips, isLoading: upcomingLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips/upcoming"],
  });

  const { data: pastTrips, isLoading: pastLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips/past"],
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-lg">Upcoming Trips</h3>
          <button className="text-primary-DEFAULT font-medium text-sm hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="bg-white border border-neutral-light rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-40 bg-neutral-light"></div>
                <div className="p-4">
                  <div className="h-6 bg-neutral-light w-3/4 mb-3"></div>
                  <div className="h-4 bg-neutral-light w-1/2 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-neutral-light w-1/3"></div>
                    <div className="h-6 bg-neutral-light w-8 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : !upcomingTrips || upcomingTrips.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-white border border-neutral-light rounded-lg">
              <AlertCircle className="h-8 w-8 text-neutral-medium mb-2" />
              <p className="text-neutral-medium text-lg">No upcoming trips. Plan your next adventure!</p>
            </div>
          ) : (
            upcomingTrips.map((trip) => (
              <div key={trip.id} className="bg-white border border-neutral-light rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 relative">
                  <img 
                    src={trip.imageUrl || "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"} 
                    className="w-full h-full object-cover" 
                    alt={trip.title} 
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full py-1 px-3 text-xs font-medium text-primary-DEFAULT">
                    {trip.startDate && (
                      <>
                        <Plane className="inline-block mr-1 h-3 w-3" /> 
                        In {Math.ceil((new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-semibold text-lg mb-1">{trip.title}</h4>
                  <div className="flex items-center text-neutral-medium text-sm mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {trip.startDate && trip.endDate 
                        ? `${format(new Date(trip.startDate), 'MMM d')} - ${format(new Date(trip.endDate), 'MMM d, yyyy')}`
                        : 'Dates not set'
                      }
                    </span>
                    {trip.startDate && trip.endDate && (
                      <>
                        <span className="mx-2">•</span>
                        <span>
                          {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="bg-primary-light/20 text-primary-DEFAULT text-xs rounded-full px-2 py-1">Eco-Resort</span>
                      <span className="bg-secondary-light/20 text-secondary-DEFAULT text-xs rounded-full px-2 py-1">
                        {trip.id % 2 === 0 ? 'Boat Tour' : 'Train Travel'}
                      </span>
                    </div>
                    <button className="text-primary-DEFAULT">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-lg">Past Trips</h3>
          <button className="text-primary-DEFAULT font-medium text-sm hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pastLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-neutral-light rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-32 bg-neutral-light"></div>
                <div className="p-3">
                  <div className="h-5 bg-neutral-light w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-light w-1/2 mb-2"></div>
                  <div className="h-4 bg-neutral-light w-1/3"></div>
                </div>
              </div>
            ))
          ) : !pastTrips || pastTrips.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-white border border-neutral-light rounded-lg">
              <AlertCircle className="h-8 w-8 text-neutral-medium mb-2" />
              <p className="text-neutral-medium text-lg">No past trips. Start your eco-travel journey!</p>
            </div>
          ) : (
            pastTrips.map((trip) => (
              <div key={trip.id} className="bg-white border border-neutral-light rounded-lg overflow-hidden shadow-sm">
                <div className="h-32 relative">
                  <img 
                    src={trip.imageUrl || "https://images.unsplash.com/photo-1609102026400-3c0ca378e4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"} 
                    className="w-full h-full object-cover" 
                    alt={trip.title} 
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-heading font-semibold mb-1">{trip.title}</h4>
                  <div className="flex items-center text-neutral-medium text-xs mb-2">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>
                      {trip.startDate && trip.endDate 
                        ? `${format(new Date(trip.startDate), 'MMM d')} - ${format(new Date(trip.endDate), 'MMM d, yyyy')}`
                        : 'Dates not set'
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <i className="fas fa-leaf text-success mr-1"></i>
                    <span className="font-medium text-success">{trip.carbonSaved || 0}kg CO₂ saved</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
