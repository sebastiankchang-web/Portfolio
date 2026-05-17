import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGenres } from "@/hooks/useSpotify";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlaying } from "@/components/layout/now-playing";
import { DailyChallenge } from "@/components/music/daily-challenge";
import { SimpleGenreGrid } from "@/components/music/simple-genre-card";
import { SimpleWorldMap } from "@/components/music/simple-world-map";
import { Badges } from "@/components/user/badges";
import { Leaderboard } from "@/components/user/leaderboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Play } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  // Using local static data to ensure genre display works properly
  const [genres] = useState([
    {
      id: 1,
      name: "Afrobeat",
      description: "A combination of West African musical styles with American funk and jazz influences.",
      color: "#FF9500",
      imageUrl: "https://cdn.pixabay.com/photo/2016/11/19/13/57/drummer-1839418_1280.jpg"
    },
    {
      id: 2,
      name: "K-Pop",
      description: "Korean popular music characterized by a wide variety of audiovisual elements.",
      color: "#FF2D55",
      imageUrl: "https://cdn.pixabay.com/photo/2019/08/09/21/20/korea-4395457_1280.jpg"
    },
    {
      id: 3,
      name: "Flamenco",
      description: "A form of Spanish folk music that originated in Andalusia in the south of Spain.",
      color: "#FF3B30",
      imageUrl: "https://cdn.pixabay.com/photo/2019/02/04/19/25/flamenco-3975024_1280.jpg"
    }
  ]);
  const isLoadingGenres = false;
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
      albumArt: genre.imageUrl || "https://placehold.co/400",
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <DailyChallenge />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Explore Music Genres</h2>
            {isLoadingGenres ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-card h-48 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {genres.map((genre) => (
                  <div 
                    key={genre.id}
                    className={`relative rounded-lg overflow-hidden h-48 cursor-pointer shadow-lg hover:shadow-xl transition-all`}
                    onClick={() => handlePlayGenre(genre.id)}
                  >
                    {/* Background image */}
                    <img 
                      src={genre.imageUrl} 
                      alt={genre.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        // If image fails to load, show a fallback color
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.classList.add('bg-orange-500');
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    
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
            )}
            
            {/* Show login button if not authenticated */}
            {!isAuthenticated && genres?.length === 0 && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Sign in to explore music</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to discover music from around the world
                </p>
                <Button 
                  onClick={() => {
                    window.location.href = "/api/login";
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign In
                </Button>
              </div>
            )}
          </section>
          
          <SimpleWorldMap />
          
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
