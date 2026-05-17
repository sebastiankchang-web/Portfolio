import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PremiumFeature } from "@/components/home/PremiumFeature";
import { Button } from "@/components/ui/button";

export default function Connect() {
  const mockNearbyTravelers = [
    {
      id: 1,
      name: "Alex Morgan",
      location: "Seattle, WA",
      interests: ["Hiking", "Photography", "Sustainable Living"],
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 2,
      name: "Sarah Chen",
      location: "Portland, OR",
      interests: ["Eco Tourism", "Vegan Food", "Wildlife Conservation"],
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      location: "Vancouver, BC",
      interests: ["Clean Energy", "Cycling", "Minimalism"],
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  const mockEvents = [
    {
      id: 1,
      title: "Beach Cleanup & Picnic",
      date: "June 15, 2023",
      location: "Golden Gardens, Seattle",
      attendees: 24,
      imageUrl: "https://images.unsplash.com/photo-1618277561934-ac59f3a5f17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
    },
    {
      id: 2,
      title: "Sustainable Urban Gardening Workshop",
      date: "June 22, 2023",
      location: "Community Center, Downtown",
      attendees: 18,
      imageUrl: "https://images.unsplash.com/photo-1623226395172-61d8e9040a39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Connect with Eco-Travelers</h1>
            <p className="text-neutral-medium">Find like-minded sustainable travelers, join eco-friendly events, and build your green travel network.</p>
          </div>
          
          <PremiumFeature />
          
          {/* Preview of Connect Features */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">Premium Connect Features Preview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-heading text-xl font-semibold mb-4">Nearby Eco-Travelers</h3>
                <div className="space-y-4">
                  {mockNearbyTravelers.map(traveler => (
                    <div key={traveler.id} className="flex items-center p-3 border border-neutral-light rounded-lg">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img src={traveler.imageUrl} alt={traveler.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-neutral-dark">{traveler.name}</h4>
                        <p className="text-xs text-neutral-medium">{traveler.location}</p>
                        <div className="flex flex-wrap mt-1">
                          {traveler.interests.map((interest, i) => (
                            <span key={i} className="text-xs bg-primary-light/10 text-primary-DEFAULT rounded-full px-2 py-0.5 mr-1 mb-1">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="text-primary-DEFAULT border-primary-DEFAULT text-xs" disabled>
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Button variant="outline" className="text-primary-DEFAULT border-primary-DEFAULT" disabled>
                    View More
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading text-xl font-semibold mb-4">Upcoming Eco-Events</h3>
                <div className="space-y-4">
                  {mockEvents.map(event => (
                    <div key={event.id} className="border border-neutral-light rounded-lg overflow-hidden">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover opacity-60" />
                      <div className="p-4">
                        <h4 className="font-medium text-neutral-dark mb-1">{event.title}</h4>
                        <div className="flex justify-between text-sm text-neutral-medium mb-2">
                          <span>{event.date}</span>
                          <span>{event.attendees} attendees</span>
                        </div>
                        <p className="text-xs text-neutral-medium mb-3">{event.location}</p>
                        <Button className="w-full bg-neutral-light text-neutral-dark" disabled>
                          Join Event (Premium)
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-heading text-xl font-semibold mb-3">Unlock All Connect Features</h3>
              <p className="text-neutral-medium mb-4 max-w-2xl mx-auto">Join our premium tier to connect with sustainable travelers, attend exclusive eco-events, and find travel companions who share your values.</p>
              <Button className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-8 py-2 rounded-full">
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
