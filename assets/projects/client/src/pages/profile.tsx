import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, MapPin, Calendar, Edit, Settings, LogOut } from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("trips");

  const { data: userTrips } = useQuery({
    queryKey: ["/api/user/trips"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-neutral-light h-32 w-32 mb-4"></div>
            <div className="h-8 bg-neutral-light w-48 mb-2 rounded"></div>
            <div className="h-4 bg-neutral-light w-64 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden -mt-16 mb-4 md:mb-0 bg-white">
                  <img 
                    src={user.profileImageUrl || "https://via.placeholder.com/150"} 
                    alt={`${user.firstName || 'User'}'s profile`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="md:ml-6 text-center md:text-left flex-grow">
                  <h1 className="font-heading text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-neutral-medium">{user.email}</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-error border-error hover:bg-error hover:text-white"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
              
              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                  <span className="block text-neutral-medium text-sm">Total Trips</span>
                  <span className="font-heading text-xl font-bold">{userStats?.totalTrips || 0}</span>
                </div>
                <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                  <span className="block text-neutral-medium text-sm">Carbon Saved</span>
                  <span className="font-heading text-xl font-bold">{userStats?.carbonSaved || 0}kg</span>
                </div>
                <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                  <span className="block text-neutral-medium text-sm">Achievements</span>
                  <span className="font-heading text-xl font-bold">{userStats?.achievementsCompleted || 0}</span>
                </div>
                <div className="bg-neutral-lightest rounded-lg p-3 text-center">
                  <span className="block text-neutral-medium text-sm">Friends</span>
                  <span className="font-heading text-xl font-bold">{userStats?.friendsCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <Tabs defaultValue="trips" className="mb-8">
            <TabsList className="bg-white rounded-lg shadow-sm mb-6">
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="vouchers">Rewards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trips" className="mt-0">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl font-bold">My Travel History</h2>
                  <Button className="bg-primary-DEFAULT text-white">
                    Plan New Trip
                  </Button>
                </div>
                
                {!userTrips || userTrips.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-neutral-light mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">No trips yet</h3>
                    <p className="text-neutral-medium mb-4">Start your sustainable travel journey by planning your first eco-friendly trip!</p>
                    <Button className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-6">
                      Create First Trip
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTrips.map((trip: any) => (
                      <div key={trip.id} className="border border-neutral-light rounded-lg overflow-hidden">
                        <div className="h-40 relative">
                          <img 
                            src={trip.imageUrl || "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"} 
                            alt={trip.title} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-4 text-white">
                              <h3 className="font-heading font-semibold text-lg">{trip.title}</h3>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          {trip.carbonSaved > 0 && (
                            <div className="absolute top-2 right-2 bg-success/90 text-white text-xs rounded-full py-1 px-3 flex items-center">
                              <Leaf className="h-3 w-3 mr-1" />
                              {trip.carbonSaved}kg CO₂ saved
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activities">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-heading text-xl font-bold mb-6">Recent Activities</h2>
                {/* Activities content would go here */}
                <div className="text-center py-12 text-neutral-medium">
                  <p>Your activity feed will appear here.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-heading text-xl font-bold mb-6">Your Achievements</h2>
                {/* Achievements content would go here */}
                <div className="text-center py-12 text-neutral-medium">
                  <p>Your achievements will appear here.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vouchers">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-heading text-xl font-bold mb-6">Your Reward Vouchers</h2>
                {/* Vouchers content would go here */}
                <div className="text-center py-12 text-neutral-medium">
                  <p>Your reward vouchers will appear here.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
