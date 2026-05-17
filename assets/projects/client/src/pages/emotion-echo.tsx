import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Globe, 
  Music, 
  Repeat, 
  ThumbsUp, 
  PlayCircle, 
  PlusCircle, 
  Heart, 
  Calendar,
  MessageCircle,
  Palette,
  RefreshCw,
  PlusSquare,
  Headphones,
  BookOpen,
  Save,
  History
} from "lucide-react";

// Interface for mood journal entries
interface MoodJournalEntry {
  id: string;
  trackId: string;
  trackName: string;
  artist: string;
  beforeMood: string;
  afterMood: string;
  emojiRating: string;
  notes: string;
  timestamp: string;
}

export default function EmotionEcho() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showTranslation, setShowTranslation] = useState(false);
  const [beforeMood, setBeforeMood] = useState<string>("");
  const [afterMood, setAfterMood] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [journalNote, setJournalNote] = useState<string>("");
  const [journalEntries, setJournalEntries] = useState<MoodJournalEntry[]>([]);
  const [showJournalHistory, setShowJournalHistory] = useState(false);
  
  // Load journal entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodJournalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  // Sample tracks data - in a real implementation, this would come from the API
  const tracks = [
    {
      id: "spotify:track:4KdtEKjY3Gi5x9M3CKhjCF",
      name: "La Bohème",
      artist: "Charles Aznavour",
      language: "French",
      flagEmoji: "🇫🇷",
      duration: "3:47",
      genre: "Chanson / Jazz",
      artwork: "https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      uri: "spotify:track:4KdtEKjY3Gi5x9M3CKhjCF",
      emotions: [
        { name: "Nostalgic", percentage: 48 },
        { name: "Melancholic", percentage: 35 },
        { name: "Dreamy", percentage: 17 }
      ],
      description: "A smooth waltz rhythm paired with longing melodies suggests a yearning for the past.",
      lyricsSnippet: "I talk about a time that the young don't know...",
      lyricsAnalysis: "Lyrics suggest reflection, memory, and sorrow of lost youth.",
      themes: [
        { name: "Time & Memory", emoji: "🕰️" },
        { name: "The struggle of being an artist", emoji: "🎨" },
        { name: "Lost love", emoji: "❤️" }
      ],
      communityReactions: [
        "Felt like I was walking through Paris in the rain ☔",
        "Didn't know the words, but my heart understood it.",
        "Made me miss people I've never met."
      ],
      gradientColors: ["#E0F2FE", "#F9FAFB", "#FEF3C7", "#F3F4F6"]
    },
    {
      id: "spotify:track:2CU2rXdJd1RwcNWz7nRtTv",
      name: "Con Te Partirò",
      artist: "Andrea Bocelli",
      language: "Italian",
      flagEmoji: "🇮🇹",
      duration: "4:11",
      genre: "Opera / Classical Crossover",
      artwork: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      uri: "spotify:track:2CU2rXdJd1RwcNWz7nRtTv",
      emotions: [
        { name: "Triumphant", percentage: 52 },
        { name: "Romantic", percentage: 42 },
        { name: "Reflective", percentage: 6 }
      ],
      description: "Soaring, powerful vocals with orchestral swells create a sense of profound emotional journey and resolution.",
      lyricsSnippet: "Con te partirò, paesi che non ho mai...",
      lyricsAnalysis: "Lyrics convey a journey of love that transcends physical distance, expressing both sadness and hope.",
      themes: [
        { name: "Journey & Discovery", emoji: "🧭" },
        { name: "Enduring Love", emoji: "💞" },
        { name: "New Beginnings", emoji: "🌅" }
      ],
      communityReactions: [
        "My grandmother played this though I never understood Italian - now it makes me cry.",
        "The emotion in his voice tells the whole story without needing translation.",
        "First time I realized music could make you feel something beyond the words."
      ],
      gradientColors: ["#DBEAFE", "#EFF6FF", "#BFDBFE", "#93C5FD"]
    },
    {
      id: "spotify:track:3Wrjm47oTz2sjIgck11l5e",
      name: "99 Luftballons",
      artist: "Nena",
      language: "German",
      flagEmoji: "🇩🇪",
      duration: "3:52",
      genre: "New Wave / Pop Rock",
      artwork: "https://images.pexels.com/photos/7180788/pexels-photo-7180788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      uri: "spotify:track:3Wrjm47oTz2sjIgck11l5e",
      emotions: [
        { name: "Energetic", percentage: 58 },
        { name: "Thoughtful", percentage: 32 },
        { name: "Anxious", percentage: 10 }
      ],
      description: "Upbeat synth-pop melody creates a deceptively cheerful sound that contrasts with the song's deeper anti-war message.",
      lyricsSnippet: "99 Luftballons auf ihrem Weg zum Horizont...",
      lyricsAnalysis: "The lyrics use the image of balloons floating away to explore themes of war, miscommunication, and senseless destruction.",
      themes: [
        { name: "War & Peace", emoji: "☮️" },
        { name: "Innocence Lost", emoji: "🎈" },
        { name: "Political Commentary", emoji: "🌍" }
      ],
      communityReactions: [
        "Loved this song for years before realizing it was about nuclear war!",
        "The German version has so much more emotion than the English one.",
        "Proves you can dance to songs with really deep meanings."
      ],
      gradientColors: ["#FEF2F2", "#FEE2E2", "#FECACA", "#FCA5A5"]
    }
  ];
  
  // Use the first track as the current track (in a real app, this would be selected by the user)
  const currentTrack = tracks[0];

  const handleAddToPlaylist = () => {
    toast({
      title: "Added to playlist",
      description: "Track added to 'Feel First, Understand Later' playlist",
    });
  };

  const handleReplay = () => {
    toast({
      title: "Playing track",
      description: "Playing with translation overlay",
    });
  };

  const handleDiscoverSimilar = () => {
    toast({
      title: "Discovering similar tracks",
      description: "Finding more nostalgic tracks in unfamiliar languages",
    });
  };
  
  // Save a new mood journal entry
  const saveMoodJournalEntry = () => {
    if (!beforeMood || !afterMood || !selectedEmoji) {
      toast({
        title: "Missing information",
        description: "Please rate your mood before and after listening, and add an emoji rating",
        variant: "destructive"
      });
      return;
    }
    
    const newEntry: MoodJournalEntry = {
      id: Date.now().toString(),
      trackId: currentTrack.id,
      trackName: currentTrack.name,
      artist: currentTrack.artist,
      beforeMood,
      afterMood,
      emojiRating: selectedEmoji,
      notes: journalNote,
      timestamp: new Date().toISOString()
    };
    
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries));
    
    // Reset form
    setBeforeMood("");
    setAfterMood("");
    setSelectedEmoji("");
    setJournalNote("");
    
    toast({
      title: "Journal entry saved",
      description: "Your mood journal entry has been saved successfully",
    });
  };
  
  // Delete a journal entry
  const deleteJournalEntry = (entryId: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== entryId);
    setJournalEntries(updatedEntries);
    localStorage.setItem('moodJournalEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry deleted",
      description: "Journal entry has been removed from your history",
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <div className="container max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">Emotion Echo</h1>
                <p className="text-muted-foreground">
                  Experiencing music beyond language
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? "Hide Translation" : "Show Translation"}
                </Button>
              </div>
            </div>
            
            {/* Song Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">More Songs to Experience</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                  toast({
                    title: `Selected ${tracks[0].name}`,
                    description: `Analyzing ${tracks[0].language} lyrics and emotions`,
                  });
                }}>
                  <div className="relative">
                    <img 
                      src={tracks[0].artwork} 
                      alt={tracks[0].name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/60 text-white">
                        {tracks[0].flagEmoji} {tracks[0].language}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{tracks[0].name}</h3>
                    <p className="text-sm text-muted-foreground">{tracks[0].artist}</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                  toast({
                    title: `Selected ${tracks[1].name}`,
                    description: `Analyzing ${tracks[1].language} lyrics and emotions`,
                  });
                }}>
                  <div className="relative">
                    <img 
                      src={tracks[1].artwork} 
                      alt={tracks[1].name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/60 text-white">
                        {tracks[1].flagEmoji} {tracks[1].language}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{tracks[1].name}</h3>
                    <p className="text-sm text-muted-foreground">{tracks[1].artist}</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                  toast({
                    title: `Selected ${tracks[2].name}`,
                    description: `Analyzing ${tracks[2].language} lyrics and emotions`,
                  });
                }}>
                  <div className="relative">
                    <img 
                      src={tracks[2].artwork} 
                      alt={tracks[2].name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/60 text-white">
                        {tracks[2].flagEmoji} {tracks[2].language}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{tracks[2].name}</h3>
                    <p className="text-sm text-muted-foreground">{tracks[2].artist}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Track Overview Card */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-6"
                        style={{
                          background: `linear-gradient(to bottom, 
                            rgba(0,0,0,0) 0%, 
                            rgba(0,0,0,0.7) 100%)`
                        }}
                      >
                        <div className="text-white">
                          <h2 className="text-2xl font-bold">{currentTrack.name}</h2>
                          <p className="text-lg opacity-90">{currentTrack.artist}</p>
                        </div>
                      </div>
                      <img 
                        src={currentTrack.artwork} 
                        alt={`${currentTrack.name} by ${currentTrack.artist}`}
                        className="w-full aspect-[1.85/1] object-cover"
                      />
                    </div>
                    
                    <div className="p-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Language</p>
                            <p className="font-medium">{currentTrack.language} {currentTrack.flagEmoji}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Duration Listened</p>
                            <p className="font-medium">{currentTrack.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Music className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Genre</p>
                            <p className="font-medium">{currentTrack.genre}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Added to Favorites</p>
                            <p className="font-medium">Yes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cultural Context Card - NEW */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-orange-500" /> 
                      Cultural Context
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-orange-500">BACKGROUND</h4>
                        <p className="text-sm">
                          "La Bohème" depicts the struggling artist life in Paris's Montmartre neighborhood in the early 20th century. Charles Aznavour, known as "France's Frank Sinatra," wrote this song as a tribute to Paris's artistic golden age.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-orange-500">MUSICAL TRADITION</h4>
                        <p className="text-sm">
                          This song embodies "chanson française" - a distinctly French style that prioritizes poetic storytelling and emotional depth over musical complexity. The waltz rhythm is a nod to classical French ballroom traditions.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-orange-500">CULTURAL SIGNIFICANCE</h4>
                        <p className="text-sm">
                          References to the Seine river and Parisian landmarks connect with French cultural pride. The bohemian lifestyle celebrated in the song represents the French values of artistic freedom and creative expression.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Emotional Landscape Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-orange-500" /> 
                      Emotional Landscape
                    </h3>
                    <p className="text-muted-foreground mb-4">Detected Mood (via Spotify Audio Analysis & Lyrics API):</p>
                    
                    <div className="space-y-4 mb-6">
                      {currentTrack.emotions.map((emotion, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              {emotion.name === "Nostalgic" && "🎭 "}
                              {emotion.name === "Melancholic" && "💔 "}
                              {emotion.name === "Dreamy" && "💫 "}
                              <span>{emotion.name}</span>
                            </div>
                            <span>{emotion.percentage}%</span>
                          </div>
                          <Progress value={emotion.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm mt-4">{currentTrack.description}</p>
                  </CardContent>
                </Card>
                
                {/* Lyrics Snapshot Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-orange-500" /> 
                      Lyrics Snapshot
                    </h3>
                    <div className={`bg-muted p-4 rounded-md mb-4 ${showTranslation ? 'italic' : ''}`}>
                      {showTranslation ? (
                        <p className="text-lg">"{currentTrack.lyricsSnippet}"</p>
                      ) : (
                        <p className="text-lg">"Je vous parle d'un temps que les moins de vingt ans ne peuvent pas connaître..."</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">— {currentTrack.lyricsAnalysis}</p>
                  </CardContent>
                </Card>
                
                {/* Lyrical Themes */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-orange-500" /> 
                      Lyrical Themes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentTrack.themes.map((theme, index) => (
                        <div key={index} className="bg-muted p-4 rounded-md text-center">
                          <p className="text-3xl mb-2">{theme.emoji}</p>
                          <p className="font-medium">{theme.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* What's Next Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2 text-orange-500" /> 
                      What's Next?
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleReplay}
                      >
                        <Repeat className="h-4 w-4 mr-2" />
                        Replay with translation
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleDiscoverSimilar}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Discover more nostalgic tracks
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleAddToPlaylist}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add to "Feel First" playlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Community Feelings Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Headphones className="h-5 w-5 mr-2 text-orange-500" /> 
                      Community Feelings
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Top emotional reactions from global listeners:</p>
                    
                    <div className="space-y-3">
                      {currentTrack.communityReactions.map((reaction, index) => (
                        <div key={index} className="bg-muted p-3 rounded-md text-sm">
                          <p>"{reaction}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* NEW: Mood Journal Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-orange-500" /> 
                      Mood Journal
                    </CardTitle>
                    <CardDescription>
                      Record how this music makes you feel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">How did you feel before listening?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Relaxed", "Anxious", "Happy", "Sad", "Energetic", "Tired"].map((mood) => (
                          <Button 
                            key={mood}
                            variant={beforeMood === mood ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBeforeMood(mood)}
                            className={beforeMood === mood ? "bg-orange-500 hover:bg-orange-600" : ""}
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">How do you feel after listening?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Relaxed", "Moved", "Inspired", "Nostalgic", "Energized", "Reflective"].map((mood) => (
                          <Button 
                            key={mood}
                            variant={afterMood === mood ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAfterMood(mood)}
                            className={afterMood === mood ? "bg-orange-500 hover:bg-orange-600" : ""}
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Rate your experience with an emoji</label>
                      <div className="flex justify-between py-2">
                        {["😍", "😊", "🤔", "😢", "🤯"].map((emoji) => (
                          <Button 
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`text-2xl ${selectedEmoji === emoji ? 'bg-orange-100 dark:bg-orange-900/30' : ''}`}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                      <textarea 
                        className="w-full h-20 p-2 border rounded-md bg-background resize-none"
                        placeholder="How did this music make you feel? What memories or emotions did it trigger?"
                        value={journalNote}
                        onChange={(e) => setJournalNote(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={saveMoodJournalEntry}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Journal Entry
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowJournalHistory(!showJournalHistory)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      {showJournalHistory ? "Hide Journal History" : "View Journal History"}
                    </Button>
                    
                    {showJournalHistory && journalEntries.length > 0 && (
                      <div className="border rounded-md mt-4 divide-y">
                        <div className="p-3 bg-muted/50 font-medium text-sm">
                          Your Previous Journal Entries
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {journalEntries.map((entry) => (
                            <div key={entry.id} className="p-3 text-sm hover:bg-muted/30">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">{entry.trackName}</span>
                                <span className="text-2xl">{entry.emojiRating}</span>
                              </div>
                              <div className="text-muted-foreground mb-2">
                                {formatDate(entry.timestamp)}
                              </div>
                              <div className="flex gap-2 mb-2">
                                <span className="bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded text-xs">
                                  Before: {entry.beforeMood}
                                </span>
                                <span className="bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs">
                                  After: {entry.afterMood}
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-muted-foreground text-xs italic">
                                  "{entry.notes}"
                                </p>
                              )}
                              <div className="mt-2 flex justify-end">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-red-500 hover:text-red-700"
                                  onClick={() => deleteJournalEntry(entry.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {showJournalHistory && journalEntries.length === 0 && (
                      <div className="text-center p-4 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground">Your journal history is empty</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Visualised Emotion Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-orange-500" /> 
                      Visualised Emotion
                    </h3>
                    
                    <div className="rounded-lg overflow-hidden mb-4">
                      <div className="h-28 w-full rounded-md" style={{
                        background: `linear-gradient(90deg, ${currentTrack.gradientColors.join(', ')})`
                      }}></div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm">
                        A flowing colour gradient shifts from pale blue to sepia tones, mirroring the nostalgic journey of the song.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Colors are algorithmically generated based on the emotional analysis and audio characteristics of the track.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}