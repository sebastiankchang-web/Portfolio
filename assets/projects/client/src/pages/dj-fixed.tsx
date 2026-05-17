import { useState, useEffect, useCallback } from "react";
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
  Play as PlayIcon, 
  Pause as PauseIcon, 
  SkipForward as SkipForwardIcon, 
  Volume2 as VolumeIcon, 
  Globe as GlobeIcon, 
  Music as MusicIcon,
  ListMusic as ListMusicIcon,
  Sparkles as SparklesIcon,
  BookOpen as BookOpenIcon
} from "lucide-react";
import { format } from "date-fns";

// Type definitions
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

// Sample data for demonstration
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

export default function DJ() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for DJ functionality
  const [prompt, setPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(1); // Default to first session
  
  // Suggestion templates for mood-based and cultural exploration
  const suggestions = [
    "Play me relaxing music from Southeast Asia",
    "Discover upbeat African rhythms similar to western pop",
    "I want to hear traditional instruments from Latin America",
    "Create a playlist with calming melodies from India and Japan",
    "Mix modern electronic with indigenous sounds from different cultures"
  ];
  
  // Mood-based suggestions
  const moodSuggestions = [
    { mood: "Happy", prompt: "Play uplifting music that makes me feel happy" },
    { mood: "Relaxed", prompt: "Play calming music to help me relax and unwind" },
    { mood: "Energetic", prompt: "Play high-energy music to boost my motivation" },
    { mood: "Nostalgic", prompt: "Play music that brings feelings of nostalgia" },
    { mood: "Focused", prompt: "Play music to help me concentrate and focus" },
    { mood: "Melancholic", prompt: "Play emotional music that feels melancholic" }
  ];
  
  // Simulated sessions data
  const { data: sessions = sampleSessions } = useQuery({
    queryKey: ["/api/user", user?.id, "dj-sessions"],
    queryFn: async () => {
      if (!user?.id) return [];
      // In a real app, this would fetch from the API
      return sampleSessions;
    },
    enabled: !isUserLoading,
  });
  
  // Get active session data with recommendations
  const activeSessionWithRecommendations = activeSessionId ? {
    ...sampleSessions.find(s => s.id === activeSessionId) || sampleSessions[0],
    recommendations: sampleRecommendationsBySession[activeSessionId] || sampleRecommendationsBySession[1]
  } : null;
  
  // Get current track
  const currentTrack = activeSessionWithRecommendations?.recommendations?.[currentTrackIndex];
  
  // Create new DJ session
  const createSession = useMutation({
    mutationFn: async () => {
      // In a real app, this would send to the API
      // Simulating a successful response
      const newSession = {
        id: Math.floor(Math.random() * 1000) + 10,
        userId: user?.id || "sample-user-123",
        sessionName: prompt.length > 20 ? prompt.substring(0, 20) + "..." : prompt,
        prompt: prompt,
        genres: [],
        regions: [],
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),
      };
      
      return { session: newSession };
    },
    onSuccess: (data) => {
      // Set the new session as active and start playing
      setActiveSessionId(data.session.id);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
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
  
  // Audio player implementation
  const [audio] = useState(new Audio());
  
  // Sample audio URLs for different moods/genres
  const audioSamples = [
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", // Ambient
    "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6bf1fbd.mp3", // Lofi
    "https://cdn.pixabay.com/download/audio/2022/09/02/audio_f8c23a94e4.mp3", // Upbeat
    "https://cdn.pixabay.com/download/audio/2022/10/25/audio_200a31351f.mp3", // Calm
    "https://cdn.pixabay.com/download/audio/2021/11/13/audio_cb4f1212a9.mp3", // Meditative
  ];
  
  // Handle next track with useCallback to avoid dependency issues
  const playNextTrack = useCallback(() => {
    if (!activeSessionWithRecommendations?.recommendations) return;
    
    if (currentTrackIndex < activeSessionWithRecommendations.recommendations.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      // Loop back to the first track
      setCurrentTrackIndex(0);
    }
    
    // Ensure playing state is true when skipping tracks
    setIsPlaying(true);
  }, [activeSessionWithRecommendations, currentTrackIndex]);
  
  // Handle play/pause
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Handle session selection
  const selectSession = useCallback((sessionId: number) => {
    setActiveSessionId(sessionId);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  }, []);
  
  // Set up and clean up audio on mount/unmount
  useEffect(() => {
    // Initialize audio settings
    audio.volume = 0.5;
    
    // Set up ended event listener
    const handleEnded = () => playNextTrack();
    audio.addEventListener('ended', handleEnded);
    
    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNextTrack]);
  
  // Handle query parameters for mood selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const moodParam = urlParams.get('mood');
    const randomParam = urlParams.get('random');
    
    if (moodParam) {
      const matchedMood = moodSuggestions.find(
        m => m.mood.toLowerCase() === moodParam.toLowerCase()
      );
      
      if (matchedMood) {
        setPrompt(matchedMood.prompt);
        setTimeout(() => {
          createSession.mutate();
        }, 500);
      }
    }
    
    if (randomParam === 'true') {
      setPrompt("Surprise me with music from around the world");
      setTimeout(() => {
        createSession.mutate();
      }, 500);
    }
    
    // Remove query parameters after processing
    if (moodParam || randomParam) {
      window.history.replaceState({}, document.title, "/dj");
    }
  }, []);
  
  // Update audio playback when track or playing state changes
  useEffect(() => {
    if (!currentTrack) return;
    
    try {
      // Select an audio sample based on track ID
      const trackIdCode = currentTrack.id.charCodeAt(0);
      const sampleIndex = Math.abs(trackIdCode) % audioSamples.length;
      audio.src = audioSamples[sampleIndex];
      
      if (isPlaying) {
        const playPromise = audio.play();
        
        // Handle autoplay restrictions silently
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log("Audio playback requires user interaction first");
          });
        }
      } else {
        audio.pause();
      }
    } catch (error) {
      // Silent error handling to prevent UI disruption
    }
  }, [audio, audioSamples, currentTrack, isPlaying]);
  
  const isLoading = isUserLoading || createSession.isPending;
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => window.location.href = "/"}
                aria-label="Back to Home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </Button>
              <h1 className="text-3xl font-bold">Soundora DJ</h1>
            </div>
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
                        <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
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
                  ) : activeSessionWithRecommendations && currentTrack ? (
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
                            aria-label="Next"
                          >
                            <SkipForwardIcon className="w-5 h-5" />
                          </Button>
                        </div>
                        <div>
                          <span className="text-xs font-mono">
                            {Math.floor(Math.random() * 2) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-60 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <MusicIcon className="mx-auto h-10 w-10 text-primary/30 mb-2" />
                        <p className="text-muted-foreground">Select a session or create a new one</p>
                      </div>
                    </div>
                  )}
                  
                  {currentTrack && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2 flex gap-2 items-center">
                        <GlobeIcon className="h-4 w-4" /> Cultural Context
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentTrack.culturalContext || "No cultural information available for this track."}
                      </p>
                      
                      {currentTrack.regionOfOrigin && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                            {currentTrack.regionOfOrigin}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Sessions */}
            <div className="space-y-6">
              <Tabs defaultValue="sessions">
                <TabsList className="w-full">
                  <TabsTrigger value="sessions" className="flex-1">My Sessions</TabsTrigger>
                  <TabsTrigger value="explore" className="flex-1">Explore</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sessions" className="space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ListMusicIcon className="h-4 w-4" /> Your Sessions
                      </CardTitle>
                      <CardDescription>
                        Previously created DJ sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {sessions.length > 0 ? (
                        <div className="divide-y divide-border">
                          {sessions.map((session) => (
                            <div 
                              key={session.id}
                              className={`p-3 hover:bg-muted transition-colors cursor-pointer flex items-center justify-between ${activeSessionId === session.id ? 'bg-primary/5' : ''}`}
                              onClick={() => selectSession(session.id)}
                            >
                              <div>
                                <div className="font-medium">{session.sessionName}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {session.genres?.join(", ") || "Mixed genres"}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Last played: {format(new Date(session.lastPlayed), "MMM d, yyyy")}
                                </div>
                              </div>
                              <div>
                                {activeSessionId === session.id && isPlaying ? (
                                  <PauseIcon 
                                    className="h-5 w-5 text-primary" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePlayback();
                                    }} 
                                  />
                                ) : (
                                  <PlayIcon 
                                    className="h-5 w-5 text-primary/70" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (activeSessionId === session.id) {
                                        togglePlayback();
                                      } else {
                                        selectSession(session.id);
                                      }
                                    }} 
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-muted-foreground">No sessions found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="explore" className="space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GlobeIcon className="h-4 w-4" /> Cultural Recommendations
                      </CardTitle>
                      <CardDescription>
                        Discover music from different cultures
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg hover:bg-primary/5 transition-all cursor-pointer">
                          <h3 className="font-medium mb-1">Traditional Instruments</h3>
                          <p className="text-sm text-muted-foreground">Explore the sounds of traditional instruments from around the world</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg hover:bg-primary/5 transition-all cursor-pointer">
                          <h3 className="font-medium mb-1">Indigenous Voices</h3>
                          <p className="text-sm text-muted-foreground">Discover vocal techniques and storytelling traditions</p>
                        </div>
                        
                        <div className="p-3 border rounded-lg hover:bg-primary/5 transition-all cursor-pointer">
                          <h3 className="font-medium mb-1">Cultural Fusion</h3>
                          <p className="text-sm text-muted-foreground">Experience music that blends different cultural traditions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpenIcon className="h-4 w-4" /> Learning Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <a href="#" className="text-primary hover:underline">Understanding musical traditions</a>
                        </div>
                        <div className="text-sm">
                          <a href="#" className="text-primary hover:underline">Cultural appreciation guide</a>
                        </div>
                        <div className="text-sm">
                          <a href="#" className="text-primary hover:underline">History of global music exchange</a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}