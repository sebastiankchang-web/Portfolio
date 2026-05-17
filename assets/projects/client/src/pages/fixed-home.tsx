import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlaying } from "@/components/layout/now-playing";
import { DailyChallenge } from "@/components/music/daily-challenge";
import { Badges } from "@/components/user/badges";
import { Leaderboard } from "@/components/user/leaderboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Play, ChevronRight } from "lucide-react";

export default function FixedHome() {
  const { isAuthenticated } = useAuth();
  // Fixed genres with reliable public domain images
  const [genres] = useState([
    {
      id: 1,
      name: "Afrobeat",
      description: "West African musical styles with American funk and jazz",
      color: "bg-orange-500",
      imageUrl: "https://images.pexels.com/photos/2046220/pexels-photo-2046220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      name: "K-Pop",
      description: "Korean popular music with audiovisual elements",
      color: "bg-pink-600",
      imageUrl: "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      name: "Flamenco",
      description: "Spanish folk music from Andalusia",
      color: "bg-red-500",
      imageUrl: "https://images.pexels.com/photos/4691576/pexels-photo-4691576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  
  const handlePlayGenre = (genreId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to play music",
        variant: "destructive",
      });
      // Redirect to login
      window.location.href = "/api/login";
      return;
    }
    
    const genre = genres.find(g => g.id === genreId);
    if (!genre) return;
    
    // Set a placeholder track since we're not actually playing music
    setCurrentTrack({
      id: `track-${genreId}`,
      name: `${genre.name} Exploration`,
      artist: "Various Artists",
      genre: genre.name,
      albumArt: genre.imageUrl,
      duration: 180000, // 3 minutes
      uri: `spotify:playlist:${genreId}`,
    });
    
    setIsPlaying(true);
    
    toast({
      title: "Playing music",
      description: `Exploring ${genre.name} music...`,
    });
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    toast({
      title: "Next track",
      description: "Playing next track...",
    });
  };
  
  const handlePrevious = () => {
    toast({
      title: "Previous track",
      description: "Playing previous track...",
    });
  };

  // Fixed world map with predefined explored regions
  const regions = [
    {
      id: "south-america",
      name: "South America",
      description: "Vibrant rhythms of samba and bossa nova",
      position: { top: "60%", left: "30%" },
      color: "bg-orange-500", 
      explored: true
    },
    {
      id: "africa",
      name: "Africa",
      description: "Rich polyrhythms and unique instruments",
      position: { top: "50%", left: "50%" },
      color: "bg-red-500",
      explored: true
    },
    {
      id: "asia",
      name: "East Asia",
      description: "K-Pop and traditional music",
      position: { top: "40%", left: "70%" },
      color: "bg-pink-600",
      explored: false
    },
    {
      id: "europe",
      name: "Europe",
      description: "Classical masterpieces and folk traditions",
      position: { top: "30%", left: "45%" },
      color: "bg-blue-400",
      explored: false
    },
    {
      id: "oceania",
      name: "Oceania",
      description: "Indigenous traditions and modern influences",
      position: { top: "70%", left: "80%" },
      color: "bg-green-500",
      explored: false
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <DailyChallenge />
          
          {/* GENRE CARDS SECTION */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Explore Music Genres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((genre) => (
                <div 
                  key={genre.id}
                  className={`relative rounded-lg overflow-hidden h-48 cursor-pointer shadow-lg hover:shadow-xl transition-all ${genre.color}`}
                  onClick={() => handlePlayGenre(genre.id)}
                >
                  {/* Solid color background with decorative music icon */}
                  <div className="absolute right-4 top-4 text-white/40 text-4xl">
                    🎵
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{genre.name}</h3>
                        <p className="text-sm text-white text-opacity-80">{genre.description}</p>
                      </div>
                      <div className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* WORLD MAP SECTION */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">World Music Exploration</h2>
              <Button 
                variant="link" 
                className="text-primary flex items-center"
                onClick={() => window.location.href = "/world-map"}
              >
                View Full Map <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-card rounded-xl p-6 relative">
              <div className="relative w-full h-60 md:h-80">
                {/* World Map Background - simple vector SVG for reliability */}
                <div className="w-full h-full rounded-lg overflow-hidden bg-blue-900/10">
                  <svg className="w-full h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* North America */}
                    <path d="M150,120 Q200,100 250,120 T300,150 T250,200 T150,170 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* South America */}
                    <path d="M250,250 Q280,230 310,250 T330,320 T290,370 T240,330 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* Europe */}
                    <path d="M450,130 Q480,110 520,130 T550,170 T520,210 T460,180 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* Africa */}
                    <path d="M480,220 Q510,200 550,220 T580,300 T530,340 T470,310 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* Asia */}
                    <path d="M600,130 Q650,100 720,130 T780,200 T720,270 T630,230 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* Oceania */}
                    <path d="M750,300 Q780,280 820,300 T840,350 T800,380 T760,350 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                    
                    {/* Simple grid lines */}
                    <path d="M100,150 L900,150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M100,250 L900,250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M100,350 L900,350" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    
                    <path d="M200,50 L200,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M400,50 L400,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M600,50 L600,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <path d="M800,50 L800,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                  </svg>
                </div>
                
                {/* Map Region Markers */}
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute map-marker cursor-pointer"
                    style={{ top: region.position.top, left: region.position.left }}
                    onClick={() => {
                      toast({
                        title: region.name,
                        description: region.explored ? 
                          `You've explored ${region.name} music!` : 
                          `Discover music from ${region.name}`,
                      });
                    }}
                  >
                    <div 
                      className={`${region.color} h-8 w-8 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg transform 
                        ${!region.explored && "animate-pulse"}`}
                    >
                      {region.explored ? (
                        <span className="text-white font-bold text-sm">✓</span>
                      ) : (
                        <span className="text-white text-sm font-bold">?</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Global Exploration</p>
                  <p className="text-sm text-primary font-medium">
                    {Math.round((regions.filter(r => r.explored).length / regions.length) * 100)}% Complete
                  </p>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((regions.filter(r => r.explored).length / regions.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
          
          <Badges />
          
          <Leaderboard />
        </main>
        
        {currentTrack && (
          <NowPlaying 
            track={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
}