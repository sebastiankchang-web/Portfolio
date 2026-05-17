import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDailyChallenge, useRecordListening } from "@/hooks/useSpotify";
import { Clock, Share2, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameOverlay } from "@/components/game/game-overlay";
import { toast } from "@/hooks/use-toast";

export function EnhancedDailyChallenge() {
  const [showGame, setShowGame] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { data: challenge, isLoading } = useDailyChallenge();
  const recordListening = useRecordListening();

  // Background images for each genre
  const genreBackgrounds: Record<string, string> = {
    "Afrobeat": "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "K-Pop": "https://images.unsplash.com/photo-1567095388693-a1a5694a8243?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Flamenco": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "World": "https://images.unsplash.com/photo-1454908027598-28c44b1716c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Classical": "https://images.unsplash.com/photo-1553452118-621e1f860f43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    "Jazz": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Electronic": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "Folk": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  };

  // Default background if genre not found
  const defaultBackground = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

  const handlePlay = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to play the daily challenge",
        variant: "destructive",
      });
      // Redirect to login
      window.location.href = "/api/login";
      return;
    }
    
    setShowGame(true);
    
    // Record that user started listening
    if (user && challenge?.genre?.id) {
      recordListening.mutate({
        userId: user.id,
        genreId: challenge.genre.id,
        trackUri: challenge.playlistUri || "",
        durationMs: 0, // Will be updated when they finish
      });
    }
  };

  const getBackgroundImage = (genreName?: string) => {
    if (!genreName) return defaultBackground;
    return genreBackgrounds[genreName] || defaultBackground;
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Today's Challenge</h2>
          <div className="bg-black bg-opacity-30 rounded-full px-3 py-1">
            <Clock className="inline-block mr-1 text-primary h-4 w-4" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-6 md:p-8 animate-pulse h-56"></div>
      </section>
    );
  }

  if (!challenge) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Today's Challenge</h2>
        </div>
        
        <div className="bg-card rounded-xl p-6 md:p-8 text-center">
          <p>No challenge available today. Check back tomorrow!</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Today's Challenge</h2>
          <div className="flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1">
            <Clock className="mr-1 text-primary h-4 w-4" />
            <span className="text-sm">10:00 min</span>
          </div>
        </div>
        
        <div 
          className="rounded-xl p-6 md:p-8 relative overflow-hidden h-64"
          style={{
            backgroundImage: `url(${getBackgroundImage(challenge.genre?.name)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <span className="bg-white text-primary font-bold text-xs px-2 py-1 rounded-full">
                DAILY CHALLENGE
              </span>
              <div className="ml-auto flex">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="bg-white/20 rounded-full h-8 w-8 mr-2 hover:bg-white/30"
                  onClick={() => {
                    toast({
                      title: "Share",
                      description: "Sharing functionality coming soon!",
                    });
                  }}
                >
                  <Share2 className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="bg-white/20 rounded-full h-8 w-8 hover:bg-white/30"
                  onClick={() => {
                    toast({
                      title: "About this challenge",
                      description: challenge.description,
                    });
                  }}
                >
                  <Info className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">{challenge.title}</h3>
            <p className="text-white text-opacity-90 mb-6 max-w-lg">{challenge.description}</p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                className="bg-white hover:bg-white/90 text-primary font-semibold px-6 py-3 rounded-full"
                onClick={handlePlay}
              >
                <Play className="mr-2 h-4 w-4" /> Play Now
              </Button>
              
              {/* We've removed the profile pics and counter completely as requested */}
            </div>
          </div>
        </div>
      </section>
      
      {showGame && (
        <GameOverlay 
          challenge={challenge} 
          onClose={() => setShowGame(false)} 
        />
      )}
    </>
  );
}