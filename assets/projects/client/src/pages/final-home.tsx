import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlaying } from "@/components/layout/now-playing";
import { Badges } from "@/components/user/badges";
import { Leaderboard } from "@/components/user/leaderboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  Music, 
  Clock, 
  Share2, 
  Info, 
  Globe, 
  Sparkles as SparklesIcon, 
  Volume2
} from "lucide-react";

export default function FinalHome() {
  const { isAuthenticated } = useAuth();
  
  // DAILY CHALLENGE DATA
  const challenge = {
    id: 1,
    title: "Afrobeat Challenge",
    description: "Explore the rhythmic world of Afrobeat and discover how West African musical traditions blend with jazz and funk elements.",
    genreId: 1,
    genreName: "Afrobeat",
    playlistUri: "spotify:playlist:example",
    imageUrl: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  };
  
  // GENRE DATA
  const genres = [
    {
      id: 1,
      name: "Afrobeat",
      description: "West African musical styles with American funk and jazz",
      image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      name: "K-Pop",
      description: "Korean popular music with audiovisual elements",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      name: "Flamenco",
      description: "Spanish folk music from Andalusia",
      image: "https://images.pexels.com/photos/2381462/pexels-photo-2381462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // WORLD MAP DATA
  const regions = [
    {
      id: "south-america",
      name: "South America",
      description: "Vibrant rhythms of samba and bossa nova",
      position: { top: "65%", left: "30%" },
      explored: false
    },
    {
      id: "africa",
      name: "Africa",
      description: "Rich polyrhythms and unique instruments",
      position: { top: "50%", left: "52%" },
      explored: false
    },
    {
      id: "east-asia",
      name: "East Asia",
      description: "K-Pop and traditional music",
      position: { top: "40%", left: "85%" },
      explored: false
    },
    {
      id: "middle-east",
      name: "Middle East",
      description: "Ancient traditions and modal scales",
      position: { top: "45%", left: "62%" },
      explored: false
    },
    {
      id: "south-asia",
      name: "South Asia",
      description: "Rich classical traditions and Bollywood",
      position: { top: "48%", left: "72%" },
      explored: false
    },
    {
      id: "europe",
      name: "Europe",
      description: "Classical masterpieces and folk traditions",
      position: { top: "35%", left: "48%" },
      explored: true
    },
    {
      id: "north-america",
      name: "North America",
      description: "The birthplace of jazz, blues, and rock",
      position: { top: "35%", left: "20%" },
      explored: true
    },
    {
      id: "oceania",
      name: "Oceania",
      description: "Indigenous traditions and modern influences",
      position: { top: "65%", left: "92%" },
      explored: false
    }
  ];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(180); // 3 minutes in seconds
  
  // Simulate track progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentTrack) {
      progressInterval = setInterval(() => {
        setTrackProgress(prev => {
          // If we've reached the end, loop back to start
          if (prev >= trackDuration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000); // Update every second
    }
    
    // Clean up interval when component unmounts or play state changes
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, currentTrack, trackDuration]);
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
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
      albumArt: genre.image,
      duration: 180000, // 3 minutes
      uri: `spotify:playlist:${genreId}`,
    });
    
    setIsPlaying(true);
    
    toast({
      title: "Playing music",
      description: `Exploring ${genre.name} music...`,
    });
  };
  
  const handlePlayChallenge = () => {
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
    
    setCurrentTrack({
      id: `challenge-${challenge.id}`,
      name: challenge.title,
      artist: "Daily Challenge",
      genre: challenge.genreName,
      albumArt: challenge.imageUrl,
      duration: 180000, // 3 minutes
      uri: challenge.playlistUri,
    });
    
    setIsPlaying(true);
    
    toast({
      title: "Daily Challenge",
      description: "Exploring today's musical challenge!",
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
          {/* NOW PLAYING OVERLAY - Shows when a track is playing */}
          {isPlaying && currentTrack && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/10 p-3 md:p-4">
              <div className="container mx-auto flex items-center gap-4">
                <div className="h-14 w-14 bg-primary/20 rounded-md overflow-hidden">
                  {currentTrack.albumArt ? (
                    <img 
                      src={currentTrack.albumArt} 
                      alt={currentTrack.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Music className="h-6 w-6 text-primary/60" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <h4 className="font-medium text-white truncate">{currentTrack.name}</h4>
                      <p className="text-xs text-white/70 truncate">{currentTrack.artist}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-white">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white/80 hover:text-white"
                        onClick={handlePrevious}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white/80 hover:text-white"
                        onClick={handleNext}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-w-full">
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all" 
                        style={{ width: `${(trackProgress / trackDuration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>{formatTime(trackProgress)}</span>
                      <span>{formatTime(trackDuration)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="sm:hidden flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 text-white/70 hover:text-white"
                  onClick={() => setIsPlaying(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              </div>
            </div>
          )}
        
          {/* PROFILE SHORTCUT WITH STREAK INFO */}
          <div className="flex justify-end mb-6">
            <Button 
              variant="ghost" 
              className="p-0 h-auto hover:bg-transparent"
              onClick={() => window.location.href = "/settings"}
            >
              <div className="flex items-center bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">12-Day Streak</span>
                    <span className="text-xs text-muted-foreground">Level 3 Explorer</span>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                    <span className="text-sm font-bold text-primary">🔥 12</span>
                  </div>
                  <div className="relative group">
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary">
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60" 
                        alt="User profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border border-white hidden md:block"></div>
                  </div>
                </div>
              </div>
            </Button>
          </div>
          
          {/* DAILY CHALLENGE SECTION */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Today's Challenge</h2>
              <div className="flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1">
                <Clock className="mr-1 text-primary h-4 w-4" />
                <span className="text-sm">10:00 min</span>
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6 md:p-8 relative overflow-hidden h-64 border border-white/10"
              style={{
                backgroundImage: `url(${challenge.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: '1px solid black'
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
                <p className="text-white text-opacity-90 mb-4 max-w-lg">{challenge.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <Button 
                    className="bg-white hover:bg-white/90 text-primary font-semibold px-3 sm:px-6 py-1.5 h-9 rounded-full text-sm sm:text-base inline-flex items-center justify-center"
                    onClick={handlePlayChallenge}
                  >
                    <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                    <span>Play Now</span>
                  </Button>
                  
                  {/* Profile pictures and "played today" section removed */}
                </div>
              </div>
            </div>
          </section>
          
          {/* DJ MOOD SELECTOR SECTION */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">How do you feel today?</h2>
              <Button 
                variant="link" 
                className="text-primary flex items-center"
                onClick={() => window.location.href = "/dj"}
              >
                Open DJ <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-white/10">
              <p className="text-sm text-muted-foreground mb-4">Select a mood to find music that matches your emotional state:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { mood: "Happy", icon: "😊", color: "bg-yellow-500/20 hover:bg-yellow-500/30" },
                  { mood: "Relaxed", icon: "😌", color: "bg-blue-500/20 hover:bg-blue-500/30" },
                  { mood: "Energetic", icon: "⚡", color: "bg-purple-500/20 hover:bg-purple-500/30" },
                  { mood: "Nostalgic", icon: "🕰️", color: "bg-amber-500/20 hover:bg-amber-500/30" },
                  { mood: "Focused", icon: "🧠", color: "bg-green-500/20 hover:bg-green-500/30" },
                  { mood: "Melancholic", icon: "🌧️", color: "bg-indigo-500/20 hover:bg-indigo-500/30" }
                ].map((item, i) => (
                  <Button
                    key={i}
                    className={`flex flex-col items-center justify-center h-24 ${item.color} border border-white/5 rounded-xl transition-colors`}
                    variant="ghost"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast({
                          title: "Sign in required",
                          description: "Please sign in to use the DJ feature",
                          variant: "destructive", 
                        });
                        window.location.href = "/api/login";
                        return;
                      }
                      window.location.href = `/dj?mood=${item.mood.toLowerCase()}`;
                    }}
                  >
                    <span className="text-2xl mb-2">{item.icon}</span>
                    <span className="font-medium text-sm">{item.mood}</span>
                  </Button>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-primary/10 hover:bg-primary/20" 
                variant="ghost"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to use the DJ feature",
                      variant: "destructive",
                    });
                    window.location.href = "/api/login";
                    return;
                  }
                  window.location.href = "/dj?random=true";
                }}
              >
                <SparklesIcon className="mr-2 h-4 w-4" />
                Surprise Me with Random Music
              </Button>
            </div>
          </section>
          
          {/* GENRE CARDS SECTION */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Explore Music Genres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((genre) => (
                <div 
                  key={genre.id}
                  className="relative rounded-xl overflow-hidden h-48 cursor-pointer shadow-lg hover:shadow-xl transition-all border border-white/10"
                  onClick={() => handlePlayGenre(genre.id)}
                >
                  {/* Background image */}
                  <img 
                    src={genre.image} 
                    alt={genre.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-5 w-full">
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
          
          {/* EMOTION ECHO SECTION */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Emotion Echo</h2>
              <Button 
                variant="link" 
                className="text-primary flex items-center"
                onClick={() => window.location.href = "/emotion-echo"}
              >
                View More <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-2 bg-card rounded-xl border border-white/10">
              <h3 className="text-lg font-medium px-4 pt-3 pb-2">Recently Analyzed Tracks</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {/* Song Card 1 */}
                <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer border border-white/5">
                  <div className="flex items-start gap-3">
                    <img 
                      src="https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="La Bohème" 
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">La Bohème</h4>
                      <p className="text-sm text-muted-foreground truncate">Charles Aznavour</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full">🇫🇷 French</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-xs font-medium mb-1">Emotional Landscape</h5>
                    <div className="flex gap-1">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">🎭 Nostalgic 48%</span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">💔 Melancholic 35%</span>
                    </div>
                  </div>
                </div>
                
                {/* Song Card 2 */}
                <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer border border-white/5">
                  <div className="flex items-start gap-3">
                    <img 
                      src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Con Te Partirò" 
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Con Te Partirò</h4>
                      <p className="text-sm text-muted-foreground truncate">Andrea Bocelli</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">🇮🇹 Italian</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-xs font-medium mb-1">Emotional Landscape</h5>
                    <div className="flex gap-1">
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">✨ Triumphant 52%</span>
                      <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">💖 Romantic 42%</span>
                    </div>
                  </div>
                </div>
                
                {/* Song Card 3 */}
                <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer border border-white/5">
                  <div className="flex items-start gap-3">
                    <img 
                      src="https://images.pexels.com/photos/7180788/pexels-photo-7180788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="99 Luftballons" 
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">99 Luftballons</h4>
                      <p className="text-sm text-muted-foreground truncate">Nena</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">🇩🇪 German</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-xs font-medium mb-1">Emotional Landscape</h5>
                    <div className="flex gap-1">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">🌀 Energetic 58%</span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">💭 Thoughtful 32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* DJ MOOD SELECTOR SECTION */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">How do you feel today?</h2>
              <Button 
                variant="link" 
                className="text-primary flex items-center"
                onClick={() => window.location.href = "/dj"}
              >
                Open DJ <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-white/10">
              <p className="text-sm text-muted-foreground mb-4">Select a mood to find music that matches your emotional state:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { mood: "Happy", icon: "😊", color: "bg-yellow-500/20 hover:bg-yellow-500/30" },
                  { mood: "Relaxed", icon: "😌", color: "bg-blue-500/20 hover:bg-blue-500/30" },
                  { mood: "Energetic", icon: "⚡", color: "bg-purple-500/20 hover:bg-purple-500/30" },
                  { mood: "Nostalgic", icon: "🕰️", color: "bg-amber-500/20 hover:bg-amber-500/30" },
                  { mood: "Focused", icon: "🧠", color: "bg-green-500/20 hover:bg-green-500/30" },
                  { mood: "Melancholic", icon: "🌧️", color: "bg-indigo-500/20 hover:bg-indigo-500/30" }
                ].map((item, i) => (
                  <Button
                    key={i}
                    className={`flex flex-col items-center justify-center h-24 ${item.color} border border-white/5 rounded-xl transition-colors`}
                    variant="ghost"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast({
                          title: "Sign in required",
                          description: "Please sign in to use the DJ feature",
                          variant: "destructive", 
                        });
                        window.location.href = "/api/login";
                        return;
                      }
                      window.location.href = `/dj?mood=${item.mood.toLowerCase()}`;
                    }}
                  >
                    <span className="text-2xl mb-2">{item.icon}</span>
                    <span className="font-medium text-sm">{item.mood}</span>
                  </Button>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-primary/10 hover:bg-primary/20" 
                variant="ghost"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to use the DJ feature",
                      variant: "destructive",
                    });
                    window.location.href = "/api/login";
                    return;
                  }
                  window.location.href = "/dj?random=true";
                }}
              >
                <SparklesIcon className="mr-2 h-4 w-4" />
                Surprise Me with Random Music
              </Button>
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
            
            <div className="bg-card rounded-xl p-6 relative border border-white/10">
              <div className="relative w-full h-[300px] bg-blue-900/30 dark:bg-blue-900/50 rounded-lg overflow-hidden">
                {/* SVG world map background */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                  alt="World Map"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center 40%" }}
                />
                
                {/* Map region markers */}
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    style={{ 
                      top: region.position.top, 
                      left: region.position.left 
                    }}
                    onClick={() => {
                      setActiveRegion(region.id);
                      toast({
                        title: region.name,
                        description: region.description,
                      });
                    }}
                  >
                    <div 
                      className={`${
                        region.id === 'north-america' ? 'bg-chart-3' : 
                        region.id === 'south-america' ? 'bg-chart-1' : 
                        region.id === 'europe' ? 'bg-chart-2' : 
                        region.id === 'africa' ? 'bg-chart-3' : 
                        region.id === 'east-asia' ? 'bg-chart-2' : 
                        'bg-chart-5'
                      } h-8 w-8 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg ${
                        region.explored ? "" : "animate-pulse hover:scale-110 transition-transform"
                      }`}
                    >
                      {region.explored ? (
                        <span className="text-white font-bold text-sm">✓</span>
                      ) : (
                        <span className="text-white font-bold text-sm">?</span>
                      )}
                    </div>
                    
                    {activeRegion === region.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black rounded-md p-2 min-w-max z-20 shadow-lg">
                        <p className="text-sm font-medium text-white">{region.name}</p>
                        <p className="text-xs text-gray-300">{region.description}</p>
                      </div>
                    )}
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
                <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((regions.filter(r => r.explored).length / regions.length) * 100)}%` }}
                  />
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