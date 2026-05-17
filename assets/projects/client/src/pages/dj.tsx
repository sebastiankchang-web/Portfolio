import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  PlayIcon, 
  PauseIcon, 
  SkipForwardIcon, 
  VolumeIcon, 
  GlobeIcon, 
  MusicIcon,
  ListMusicIcon,
  Sparkles as SparklesIcon,
  BookOpenIcon
} from "lucide-react";
import { format } from "date-fns";

interface Track {
  id: string;
  name: string;
  artist: string;
  uri: string;
  albumUrl: string;
  popularity: number;
  culturalContext?: string;
  similar?: string[];
  regionOfOrigin?: string;
}

interface DjSession {
  id: number;
  userId: string;
  sessionName: string;
  prompt?: string;
  genres?: string[];
  regions?: string[];
  createdAt: string;
  lastPlayed: string;
}

export default function DJ() {
  const { user, isLoading: isUserLoading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Handle URL query parameters for direct mood selection
  useEffect(() => {
    // Parse query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const moodParam = urlParams.get('mood');
    const randomParam = urlParams.get('random');
    
    // Handle mood parameter
    if (moodParam) {
      const moodPrompt = moodSuggestions.find(
        m => m.mood.toLowerCase() === moodParam.toLowerCase()
      )?.prompt || `Play music that makes me feel ${moodParam}`;
      
      setPrompt(moodPrompt);
      // Auto-submit after a short delay to allow state to update
      setTimeout(() => {
        createSession.mutate();
      }, 500);
    }
    
    // Handle random parameter
    if (randomParam === 'true') {
      setPrompt("Surprise me with music from around the world");
      // Auto-submit after a short delay
      setTimeout(() => {
        createSession.mutate();
      }, 500);
    }
    
    // Remove query parameters after processing to prevent resubmission on page refresh
    if (moodParam || randomParam) {
      window.history.replaceState({}, document.title, "/dj");
    }
  }, []);
  
  // Suggestion templates for users to quickly start
  const suggestions = [
    "Play me relaxing music from Southeast Asia",
    "Discover upbeat African rhythms similar to western pop",
    "I want to hear traditional instruments from Latin America",
    "Create a playlist with calming melodies from India and Japan",
    "Mix modern electronic with indigenous sounds from different cultures"
  ];
  
  // Mood-based suggestion templates
  const moodSuggestions = [
    { mood: "Happy", prompt: "Play uplifting music that makes me feel happy" },
    { mood: "Relaxed", prompt: "Play calming music to help me relax and unwind" },
    { mood: "Energetic", prompt: "Play high-energy music to boost my motivation" },
    { mood: "Nostalgic", prompt: "Play music that brings feelings of nostalgia" },
    { mood: "Focused", prompt: "Play music to help me concentrate and focus" },
    { mood: "Melancholic", prompt: "Play emotional music that feels melancholic" }
  ];
  
  // Sample DJ sessions for demonstration
  const sampleSessions: DjSession[] = [
    {
      id: 1,
      userId: "sample-user-123",
      sessionName: "Global Exploration Mix",
      prompt: "Music that blends Western pop with global rhythms",
      genres: ["Pop", "World", "Fusion"],
      regions: ["West Africa", "Latin America"],
      createdAt: "2025-05-18T12:00:00Z",
      lastPlayed: "2025-05-19T15:30:00Z"
    },
    {
      id: 2,
      userId: "sample-user-123",
      sessionName: "Relaxing Cultural Journey",
      prompt: "Calm, meditative music from around the world",
      genres: ["Ambient", "Classical", "Traditional"],
      regions: ["East Asia", "India", "Scandinavia"],
      createdAt: "2025-05-15T09:15:00Z",
      lastPlayed: "2025-05-19T10:20:00Z"
    },
    {
      id: 3,
      userId: "sample-user-123",
      sessionName: "Dance Traditions",
      prompt: "Energetic dance music from different cultures",
      genres: ["Dance", "Folk", "Electronic"],
      regions: ["Caribbean", "Balkans", "West Africa"],
      createdAt: "2025-05-10T18:30:00Z",
      lastPlayed: "2025-05-17T21:45:00Z"
    }
  ];
  
  // Get user's DJ sessions (using sample data for demonstration)
  const { data: sessions = sampleSessions, isLoading: isSessionsLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "dj-sessions"],
    queryFn: async () => {
      if (!user?.id) return [];
      return apiRequest(`/api/user/${user.id}/dj-sessions`);
    },
    enabled: false, // Disabled since we're using sample data
  });
  
  // Get active session
  const [activeSessionId, setActiveSessionId] = useState<number | null>(1); // Default to first session for demo
  
  // Sample recommendation data
  const sampleRecommendationsBySession: Record<number, Track[]> = {
    1: [
      {
        id: "track-1",
        name: "African Rhythms",
        artist: "Fela Kuti",
        uri: "spotify:track:123",
        albumUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=1074",
        popularity: 85,
        culturalContext: "Afrobeat originated in Nigeria in the late 1960s, combining elements of traditional Yoruba music, jazz, highlife, and funk. It features complex percussion, call-and-response vocals, and socially conscious lyrics.",
        similar: ["Jazz", "Funk", "Soul"],
        regionOfOrigin: "West Africa"
      },
      {
        id: "track-2",
        name: "Samba Fusion",
        artist: "João Gilberto",
        uri: "spotify:track:456",
        albumUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=1374",
        popularity: 78,
        culturalContext: "Samba is a rhythmic, percussive music and dance style that originated in Afro-Brazilian communities, particularly in Rio de Janeiro. It blends African rhythms with European influences, creating a uniquely Brazilian cultural expression.",
        similar: ["Bossa Nova", "MPB", "Latin Jazz"],
        regionOfOrigin: "Brazil"
      },
      {
        id: "track-3",
        name: "Global Pop Fusion",
        artist: "Angelique Kidjo",
        uri: "spotify:track:789",
        albumUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1470",
        popularity: 92,
        culturalContext: "A modern fusion of Western pop with traditional African vocal techniques and rhythms. This cross-cultural approach creates a bridge between different musical traditions while highlighting indigenous sounds.",
        similar: ["Pop", "World Fusion", "Afropop"],
        regionOfOrigin: "Global"
      }
    ],
    2: [
      {
        id: "track-4",
        name: "Meditation Raga",
        artist: "Ravi Shankar",
        uri: "spotify:track:321",
        albumUrl: "https://images.unsplash.com/photo-1527956041665-d7a1b380c460?auto=format&fit=crop&q=80&w=1418",
        popularity: 75,
        culturalContext: "Classical Indian ragas are melodic frameworks for improvisation, each associated with specific emotions, times of day, or seasons. This meditative piece uses the sitar and tabla to create a contemplative atmosphere.",
        similar: ["Classical", "Meditation", "Ambient"],
        regionOfOrigin: "India"
      },
      {
        id: "track-5",
        name: "Zen Garden",
        artist: "Kitaro",
        uri: "spotify:track:654",
        albumUrl: "https://images.unsplash.com/photo-1627773755683-dfcb180b3572?auto=format&fit=crop&q=80&w=1374",
        popularity: 82,
        culturalContext: "Japanese ambient music often draws from traditional instruments like the shakuhachi (bamboo flute) and koto (string instrument), creating atmospheric sounds that reflect harmony with nature and contemplative practice.",
        similar: ["New Age", "Ambient", "Meditation"],
        regionOfOrigin: "Japan"
      }
    ],
    3: [
      {
        id: "track-6",
        name: "Caribbean Carnival",
        artist: "Machel Montano",
        uri: "spotify:track:987",
        albumUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1470",
        popularity: 88,
        culturalContext: "Soca music evolved from calypso in Trinidad and Tobago, featuring uptempo beats, energetic vocals, and themes of celebration. It's a central part of Caribbean carnival culture and has influenced global dance music.",
        similar: ["Calypso", "Dancehall", "Reggae"],
        regionOfOrigin: "Caribbean"
      },
      {
        id: "track-7",
        name: "Balkan Beats",
        artist: "Goran Bregović",
        uri: "spotify:track:1234",
        albumUrl: "https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?auto=format&fit=crop&q=80&w=1470",
        popularity: 79,
        culturalContext: "Balkan folk music features complex rhythms (often in 7/8 or 9/8 time), brass instruments, and energetic melodies. This fusion incorporates traditional elements with contemporary dance rhythms, creating a unique cultural bridge.",
        similar: ["Folk", "World", "Electronic"],
        regionOfOrigin: "Balkans"
      }
    ]
  };
  
  // Get active session with sample data for demonstration
  const { data: activeSession, isLoading: isActiveSessionLoading } = useQuery({
    queryKey: ["/api/dj-sessions", activeSessionId],
    queryFn: async () => {
      if (!activeSessionId) return null;
      return apiRequest(`/api/dj-sessions/${activeSessionId}`);
    },
    enabled: false, // Disabled since we're using sample data
  });
  
  // Create a sample active session with the appropriate session ID
  const activeSessionWithRecommendations = activeSessionId ? {
    ...sampleSessions.find(s => s.id === activeSessionId) || sampleSessions[0],
    recommendations: sampleRecommendationsBySession[activeSessionId] || sampleRecommendationsBySession[1]
  } : null;
  
  // Create new DJ session
  const createSession = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/dj-sessions", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user", user?.id, "dj-sessions"] });
      setActiveSessionId(data.session.id);
      setPrompt("");
      toast({
        title: "DJ Session Created",
        description: `Your "${data.session.sessionName}" session is ready to play`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create DJ session. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Audio player simulation (just for UI display, not actually playing)
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(180); // 3 minutes in seconds
  
  // Handle play/pause button click
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle next track
  const playNextTrack = () => {
    if (!activeSessionWithRecommendations?.recommendations) return;
    
    if (currentTrackIndex < activeSessionWithRecommendations.recommendations.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      // Loop back to the first track
      setCurrentTrackIndex(0);
    }
    
    // Ensure playing state is true when skipping tracks
    if (!isPlaying) {
      setIsPlaying(true);
    }
    
    // Reset track progress and set new random track duration
    setTrackProgress(0);
    setTrackDuration(Math.floor(Math.random() * 100) + 120); // 2-3.5 minutes
    
    // Show a toast to indicate track change
    toast({
      title: "Now Playing",
      description: `Playing next track`,
    });
  };
  
  // Get current track (using sample data for demonstration)
  const currentTrack = activeSessionWithRecommendations?.recommendations?.[currentTrackIndex];
  
  // Simulate track progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentTrack) {
      progressInterval = setInterval(() => {
        setTrackProgress(prev => {
          // If we've reached the end, play the next track
          if (prev >= trackDuration) {
            playNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, currentTrack, trackDuration]);
  
  // Set initial track duration when track changes
  useEffect(() => {
    if (currentTrack) {
      // Random duration between 2-3.5 minutes
      setTrackDuration(Math.floor(Math.random() * 100) + 120);
      setTrackProgress(0);
    }
  }, [currentTrack]);
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle session selection
  const selectSession = (sessionId: number) => {
    setActiveSessionId(sessionId);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };
  
  // Loading state
  const isLoading = isUserLoading || isSessionsLoading || isActiveSessionLoading;
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Soundora DJ</h1>
            {isPlaying && currentTrack && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm font-medium">Now Playing:</span>
                <span className="text-sm">{currentTrack.name} - {currentTrack.artist}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Now Playing */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-md bg-gradient-to-b from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    Musical Journey
                  </CardTitle>
                  <CardDescription>
                    Explore music from around the world with minimal effort
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Input
                          placeholder="Example: Play me relaxing music from Southeast Asia"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        onClick={() => createSession.mutate()}
                        disabled={!prompt || createSession.isPending}
                      >
                        {createSession.isPending ? "Creating..." : "Create Session"}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">How do you want to feel?</p>
                        <div className="flex flex-wrap gap-2">
                          {moodSuggestions.map((item, index) => (
                            <Button 
                              key={`mood-${index}`} 
                              variant="outline" 
                              size="sm"
                              onClick={() => setPrompt(item.prompt)}
                              className="text-xs bg-primary/5 hover:bg-primary/20"
                            >
                              {item.mood}
                            </Button>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setPrompt("Surprise me with music from around the world");
                              createSession.mutate();
                            }}
                            className="bg-primary/10 text-xs"
                          >
                            <SparklesIcon className="h-3 w-3 mr-1" /> Random Discovery
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Quick suggestions or type your own:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              size="sm"
                              onClick={() => setPrompt(suggestion)}
                              className="text-xs"
                            >
                              {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-pulse">Loading music...</div>
                    </div>
                  ) : activeSession && currentTrack ? (
                    <div className="rounded-lg overflow-hidden">
                      <div className="aspect-square max-h-60 w-full bg-muted relative">
                        {currentTrack.albumUrl ? (
                          <img 
                            src={currentTrack.albumUrl} 
                            alt={`${currentTrack.name} album art`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <MusicIcon className="w-16 h-16 text-primary/50" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-white">
                          <div className="font-bold truncate">{currentTrack.name}</div>
                          <div className="text-sm truncate">{currentTrack.artist}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-muted p-3">
                        <div>
                          <VolumeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={playNextTrack}
                            aria-label="Next Track"
                          >
                            <SkipForwardIcon className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="text-xs">
                          {activeSession.recommendations && (
                            <span>
                              {currentTrackIndex + 1}/{activeSession.recommendations.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-60 rounded-lg bg-muted/40 flex flex-col items-center justify-center p-6 text-center">
                      <MusicIcon className="w-12 h-12 text-primary/40 mb-3" />
                      <h3 className="text-lg font-medium mb-2">Start your musical journey</h3>
                      <p className="text-sm text-muted-foreground">
                        Tell the Soundora DJ what kind of music you'd like to explore, 
                        and it will create a personalized playlist from around the world.
                      </p>
                    </div>
                  )}
                  
                  {currentTrack && currentTrack.culturalContext && (
                    <div className="mt-4 p-4 bg-muted/40 rounded-lg">
                      <div className="flex items-start gap-3">
                        <BookOpenIcon className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <h3 className="text-sm font-medium mb-1">Cultural Context</h3>
                          <p className="text-sm">{currentTrack.culturalContext}</p>
                          
                          {currentTrack.regionOfOrigin && (
                            <div className="mt-2 flex items-center gap-1">
                              <GlobeIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Region: {currentTrack.regionOfOrigin}
                              </span>
                            </div>
                          )}
                          
                          {currentTrack.similar && currentTrack.similar.length > 0 && (
                            <div className="mt-1 flex items-center gap-1">
                              <ListMusicIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Similar to: {currentTrack.similar.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Session History */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Sessions</CardTitle>
                  <CardDescription>
                    Previous musical journeys
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {isSessionsLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-pulse">Loading sessions...</div>
                    </div>
                  ) : sessions && sessions.length > 0 ? (
                    <div className="space-y-3">
                      {sessions.map((session: DjSession) => (
                        <div 
                          key={session.id} 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            activeSessionId === session.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                          onClick={() => selectSession(session.id)}
                        >
                          <div className="font-medium">{session.sessionName}</div>
                          <div className="text-xs flex justify-between mt-1">
                            <span>
                              {session.regions && session.regions.length > 0 
                                ? session.regions.join(', ') 
                                : 'Global'}
                            </span>
                            <span>
                              {format(new Date(session.lastPlayed), 'MMM d')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted/40 rounded-lg">
                      <MusicIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No sessions yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your first DJ session to start exploring global music.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}