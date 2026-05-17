import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDailyChallenge, useRecordListening } from "@/hooks/useSpotify";
import { Clock, Share2, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameOverlay } from "@/components/game/game-overlay";
import { toast } from "@/hooks/use-toast";

export function DailyChallenge() {
  const [showGame, setShowGame] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { data: challenge, isLoading } = useDailyChallenge();
  const recordListening = useRecordListening();

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

  const getGenreColor = (genreName?: string) => {
    if (!genreName) return "from-chart-1 to-chart-1/60";
    
    const genreMap: Record<string, string> = {
      "World": "from-chart-1 to-chart-1/60",
      "Classical": "from-chart-2 to-chart-2/60",
      "Jazz": "from-chart-3 to-chart-3/60",
      "Electronic": "from-chart-4 to-chart-4/60",
      "Folk": "from-chart-5 to-chart-5/60",
    };
    
    return genreMap[genreName] || "from-chart-1 to-chart-1/60";
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
        
        <div className="bg-gradient-to-r from-chart-1/30 to-chart-1/10 rounded-xl p-6 md:p-8 animate-pulse">
          <div className="h-48"></div>
        </div>
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
        
        <div className={`bg-gradient-to-r ${getGenreColor(challenge.genre?.name)} rounded-xl p-6 md:p-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <div className="absolute top-0 right-0 w-full h-full bg-white rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <span className="bg-white text-primary font-bold text-xs px-2 py-1 rounded-full">
                DAILY CHALLENGE
              </span>
              <div className="ml-auto flex">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="bg-white/20 rounded-full h-8 w-8 mr-2"
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
                  className="bg-white/20 rounded-full h-8 w-8"
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
            
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{challenge.title}</h3>
            <p className="text-white text-opacity-90 mb-4 max-w-lg">{challenge.description}</p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                className="bg-white hover:bg-white/90 text-primary font-semibold px-6 py-3 rounded-full"
                onClick={handlePlay}
              >
                <Play className="mr-2 h-4 w-4" /> Play Now
              </Button>
              
              {/* Profile pictures and played counter removed */}
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
