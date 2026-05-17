import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPinIcon, TicketIcon, MusicIcon, ArrowRightIcon } from "lucide-react";
import { format } from "date-fns";

interface MusicEvent {
  id: number;
  name: string;
  description: string;
  location: string;
  venue: string;
  date: string;
  eventGenres: string[];
  imageUrl?: string;
  ticketUrl?: string;
  latitude?: number;
  longitude?: number;
}

export default function Events() {
  const { user, isLoading: isUserLoading } = useAuth();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState("");
  
  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
  
  // Sample event data for demonstration
  const sampleEvents: MusicEvent[] = [
    {
      id: 1,
      name: "World Music Festival",
      description: "A celebration of diverse musical traditions from around the globe featuring artists from Africa, Asia, Latin America, and more.",
      location: "New York, NY",
      venue: "Central Park",
      date: "2025-07-15",
      eventGenres: ["World", "Folk", "Fusion"],
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1074",
      ticketUrl: "https://example.com/tickets/world-music",
      latitude: 40.7831,
      longitude: -73.9712
    },
    {
      id: 2,
      name: "African Rhythms Showcase",
      description: "Experience the authentic sounds of West Africa with traditional djembe drummers and modern Afrobeat artists.",
      location: "Atlanta, GA",
      venue: "Piedmont Park",
      date: "2025-06-22",
      eventGenres: ["African", "Percussion", "Afrobeat"],
      imageUrl: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?auto=format&fit=crop&q=80&w=1376",
      ticketUrl: "https://example.com/tickets/african-rhythms",
      latitude: 33.7863,
      longitude: -84.3742
    },
    {
      id: 3,
      name: "Latin Jazz Night",
      description: "An evening of vibrant Latin jazz featuring top musicians from Cuba, Brazil, and Puerto Rico.",
      location: "Miami, FL",
      venue: "Bayfront Park Amphitheater",
      date: "2025-08-05",
      eventGenres: ["Latin", "Jazz", "Salsa"],
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1470",
      ticketUrl: "https://example.com/tickets/latin-jazz",
      latitude: 25.7742,
      longitude: -80.1866
    },
    {
      id: 4,
      name: "Asian Fusion Showcase",
      description: "A unique blend of traditional and contemporary Asian music featuring artists from Japan, India, and Korea.",
      location: "San Francisco, CA",
      venue: "Golden Gate Park",
      date: "2025-09-12",
      eventGenres: ["Asian", "Fusion", "Traditional"],
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1470",
      ticketUrl: "https://example.com/tickets/asian-fusion",
      latitude: 37.7694,
      longitude: -122.4862
    },
    {
      id: 5,
      name: "Indigenous Voices Festival",
      description: "Celebrating the musical heritage of indigenous peoples from North America, Australia, and beyond.",
      location: "Seattle, WA",
      venue: "Discovery Park",
      date: "2025-07-28",
      eventGenres: ["Indigenous", "Folk", "Traditional"],
      imageUrl: "https://images.unsplash.com/photo-1621478374422-39104c547be5?auto=format&fit=crop&q=80&w=1470",
      ticketUrl: "https://example.com/tickets/indigenous-voices",
      latitude: 47.6616,
      longitude: -122.4058
    },
    {
      id: 6,
      name: "Celtic Music Gathering",
      description: "Traditional music and dance from Ireland, Scotland, and Wales featuring fiddles, bagpipes, and more.",
      location: "Boston, MA",
      venue: "Boston Common",
      date: "2025-08-18",
      eventGenres: ["Celtic", "Folk", "Traditional"],
      imageUrl: "https://images.unsplash.com/photo-1603417406253-4c65c06974c5?auto=format&fit=crop&q=80&w=1376",
      ticketUrl: "https://example.com/tickets/celtic-gathering",
      latitude: 42.3551,
      longitude: -71.0657
    }
  ];
  
  // Nearby events (first 3 from sample data for demo)
  const nearbyEventSample = sampleEvents.slice(0, 3);
  
  // Get all events - using sample data for demonstration
  const { data: allEvents = sampleEvents, isLoading: isAllEventsLoading } = useQuery({
    queryKey: ["/api/events"],
    enabled: false, // Disabled since we're using sample data
  });
  
  // Get nearby events if we have location - using sample data for demonstration
  const { data: nearbyEvents = nearbyEventSample, isLoading: isNearbyEventsLoading } = useQuery({
    queryKey: ["/api/events/nearby", location?.lat, location?.lng],
    queryFn: async () => {
      if (!location) return [];
      return apiRequest(`/api/events/nearby?latitude=${location.lat}&longitude=${location.lng}&radius=50`);
    },
    enabled: false, // Disabled since we're using sample data
  });
  
  // Check if the user has a stored location preference
  useEffect(() => {
    if (user?.location) {
      setUserLocation(user.location);
    }
  }, [user]);
  
  // Loading state
  const isLoading = isUserLoading || isAllEventsLoading || isNearbyEventsLoading;
  
  // If we're still loading data, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">Loading events...</div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Global Music Events</h1>
        
        <Tabs defaultValue="nearby" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="nearby">Nearby Events</TabsTrigger>
            <TabsTrigger value="all">All Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nearby" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-medium mb-2">
                <MapPinIcon className="inline mr-2 h-5 w-5" />
                Events Near You
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover global music events happening near your location.
                These events are a great way to experience different cultures through music.
              </p>
            </div>
            
            {nearbyEvents && nearbyEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyEvents.map((event: MusicEvent) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <MusicIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No nearby events found</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  We couldn't find any global music events near your current location.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-medium mb-2">
                <MusicIcon className="inline mr-2 h-5 w-5" />
                Global Music Calendar
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse upcoming music events from around the world. Discover new cultural 
                experiences through live music performances.
              </p>
            </div>
            
            {allEvents && allEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allEvents.map((event: MusicEvent) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events available</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  There are currently no music events listed. Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <MobileNav />
    </div>
  );
}

function EventCard({ event }: { event: MusicEvent }) {
  const formattedDate = event.date 
    ? format(new Date(event.date), "PPP") 
    : "Date TBA";
  
  return (
    <Card className="overflow-hidden">
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1" /> 
          {event.venue}, {event.location}
        </CardDescription>
        <CardDescription className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" /> 
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{event.description}</p>
        {event.eventGenres && event.eventGenres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.eventGenres.map((genre) => (
              <span key={genre} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {genre}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Live cultural experience
        </div>
        {event.ticketUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
              <TicketIcon className="h-4 w-4 mr-1" /> Tickets
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}