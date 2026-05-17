import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/useAuth";
import { useExploredRegions } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Info, Bookmark, BookmarkCheck, Globe, Heart, Edit, X, Archive, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Region = {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { top: string; left: string };
  explored: boolean;
};

// Interface for bookmarked regions with user notes
interface BookmarkedRegion {
  id: string;  // Region ID
  name: string;
  dateBookmarked: string;
  notes: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  isArchived: boolean;
}

export default function WorldMap() {
  const { user, isAuthenticated } = useAuth();
  
  // Simple static array for demo exploration regions
  const exploredRegionNames = ["North America", "Europe"];
  
  // State for bookmarked regions
  const [bookmarkedRegions, setBookmarkedRegions] = useState<BookmarkedRegion[]>([]);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [bookmarkNotes, setBookmarkNotes] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [favoriteArtists, setFavoriteArtists] = useState("");
  const [showBookmarkCollection, setShowBookmarkCollection] = useState(false);
  
  // Load bookmarked regions from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedRegions');
    if (savedBookmarks) {
      setBookmarkedRegions(JSON.parse(savedBookmarks));
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkedRegions', JSON.stringify(bookmarkedRegions));
  }, [bookmarkedRegions]);
  
  // Check if a region is bookmarked
  const isBookmarked = (regionId: string) => {
    return bookmarkedRegions.some(bookmark => bookmark.id === regionId && !bookmark.isArchived);
  };
  
  // Check if a region is archived
  const isArchived = (regionId: string) => {
    return bookmarkedRegions.some(bookmark => bookmark.id === regionId && bookmark.isArchived);
  };
  
  // Handle bookmark dialog open
  const openBookmarkDialog = (region: Region) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark regions",
        variant: "destructive",
      });
      return;
    }
    
    setActiveRegion(region);
    
    // If already bookmarked, load existing data
    const existingBookmark = bookmarkedRegions.find(bookmark => bookmark.id === region.id);
    if (existingBookmark) {
      setBookmarkNotes(existingBookmark.notes);
      setFavoriteGenres(existingBookmark.favoriteGenres.join(", "));
      setFavoriteArtists(existingBookmark.favoriteArtists.join(", "));
    } else {
      setBookmarkNotes("");
      setFavoriteGenres("");
      setFavoriteArtists("");
    }
    
    setShowBookmarkDialog(true);
  };
  
  // Save bookmark
  const saveBookmark = () => {
    if (!activeRegion) return;
    
    const genresList = favoriteGenres.split(",").map(genre => genre.trim()).filter(genre => genre !== "");
    const artistsList = favoriteArtists.split(",").map(artist => artist.trim()).filter(artist => artist !== "");
    
    // If already bookmarked, update it
    const existingIndex = bookmarkedRegions.findIndex(bookmark => bookmark.id === activeRegion.id);
    
    if (existingIndex >= 0) {
      const updatedBookmarks = [...bookmarkedRegions];
      updatedBookmarks[existingIndex] = {
        ...updatedBookmarks[existingIndex],
        notes: bookmarkNotes,
        favoriteGenres: genresList,
        favoriteArtists: artistsList,
        isArchived: false, // Ensure it's not archived when updated
      };
      setBookmarkedRegions(updatedBookmarks);
    } else {
      // Create new bookmark
      const newBookmark: BookmarkedRegion = {
        id: activeRegion.id,
        name: activeRegion.name,
        dateBookmarked: new Date().toISOString(),
        notes: bookmarkNotes,
        favoriteGenres: genresList,
        favoriteArtists: artistsList,
        isArchived: false,
      };
      
      setBookmarkedRegions([...bookmarkedRegions, newBookmark]);
    }
    
    setShowBookmarkDialog(false);
    
    toast({
      title: `${activeRegion.name} bookmarked`,
      description: "Region added to your personal music diary",
    });
  };
  
  // Remove bookmark
  const removeBookmark = (regionId: string) => {
    setBookmarkedRegions(bookmarkedRegions.filter(bookmark => bookmark.id !== regionId));
    
    toast({
      title: "Bookmark removed",
      description: "Region removed from your bookmarks",
    });
  };
  
  // Archive bookmark
  const toggleArchiveBookmark = (regionId: string) => {
    const updatedBookmarks = bookmarkedRegions.map(bookmark => {
      if (bookmark.id === regionId) {
        return { ...bookmark, isArchived: !bookmark.isArchived };
      }
      return bookmark;
    });
    
    setBookmarkedRegions(updatedBookmarks);
    
    const bookmark = bookmarkedRegions.find(b => b.id === regionId);
    const isCurrentlyArchived = bookmark?.isArchived || false;
    
    toast({
      title: isCurrentlyArchived ? "Region unarchived" : "Region archived",
      description: isCurrentlyArchived 
        ? "Region moved back to active bookmarks" 
        : "Region archived in your collection",
    });
  };
  
  const regions: Region[] = [
    {
      id: "south-america",
      name: "South America",
      description: "Home to vibrant rhythms of samba, bossa nova, and Andean folk music",
      color: "bg-chart-1", // World Music
      position: { top: "65%", left: "30%" },
      explored: exploredRegionNames.includes("South America"),
    },
    {
      id: "north-america",
      name: "North America",
      description: "The birthplace of jazz, blues, country, and rock and roll",
      color: "bg-chart-3", // Jazz
      position: { top: "35%", left: "20%" },
      explored: exploredRegionNames.includes("North America"),
    },
    {
      id: "europe",
      name: "Europe",
      description: "Classical masterpieces, folk traditions, and modern electronic music",
      color: "bg-chart-2", // Classical
      position: { top: "35%", left: "48%" },
      explored: exploredRegionNames.includes("Europe"),
    },
    {
      id: "africa",
      name: "Africa",
      description: "Rich polyrhythms, call-and-response vocals, and unique instruments",
      color: "bg-chart-3", // Jazz
      position: { top: "50%", left: "52%" },
      explored: exploredRegionNames.includes("Africa"),
    },
    {
      id: "middle-east",
      name: "Middle East",
      description: "Ornate melodies, quarter tones, and ancient musical traditions",
      color: "bg-chart-1", // World Music
      position: { top: "45%", left: "62%" },
      explored: exploredRegionNames.includes("Middle East"),
    },
    {
      id: "south-asia",
      name: "South Asia",
      description: "Rich classical traditions, elaborate rhythmic cycles, and Bollywood",
      color: "bg-chart-4", // Electronic
      position: { top: "48%", left: "72%" },
      explored: exploredRegionNames.includes("South Asia"),
    },
    {
      id: "east-asia",
      name: "East Asia",
      description: "Pentatonic scales, traditional instruments, and philosophical influences",
      color: "bg-chart-2", // Classical
      position: { top: "40%", left: "85%" },
      explored: exploredRegionNames.includes("East Asia"),
    },
    {
      id: "oceania",
      name: "Oceania",
      description: "Aboriginal didgeridoo traditions and Polynesian vocal harmonies",
      color: "bg-chart-5", // Folk
      position: { top: "65%", left: "92%" },
      explored: exploredRegionNames.includes("Oceania"),
    },
  ];
  
  const getExplorationProgress = () => {
    const exploredCount = exploredRegionNames.length;
    return Math.round((exploredCount / regions.length) * 100);
  };

  // Render a region on the map - positioned using percentages for consistent scaling
  const RegionMarker = ({ region }: { region: Region }) => (
    <div
      className="absolute map-marker group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
      style={{ 
        top: region.position.top, 
        left: region.position.left,
        zIndex: 20 // Ensure markers appear above map
      }}
      onClick={() => {
        toast({
          title: region.name,
          description: region.description,
        });
      }}
    >
      <div 
        className={`${region.color} h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full flex items-center justify-center border-2 sm:border-3 md:border-4 border-white/80 shadow-lg transform ${
          region.explored ? "scale-100" : "animate-pulse hover:scale-110 transition-transform"
        }`}
      >
        {region.explored ? (
          <span className="text-white font-bold text-xs sm:text-sm md:text-base">✓</span>
        ) : (
          <span className="text-white text-xs sm:text-sm md:text-base font-bold">?</span>
        )}
      </div>
      
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black bg-opacity-90 rounded-lg p-2 sm:p-3 w-28 sm:w-36 md:w-40 lg:w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl border border-gray-800">
        <p className="text-xs sm:text-sm font-medium text-white mb-1">{region.name}</p>
        <p className="text-2xs sm:text-xs text-gray-300 line-clamp-2">{region.description}</p>
        {region.explored && (
          <div className="bg-primary/20 text-primary text-2xs sm:text-xs rounded-sm px-2 py-0.5 mt-1 font-medium inline-block">
            Explored
          </div>
        )}
      </div>
    </div>
  );

  // Render a region card in the grid - with colorful theme
  const RegionCard = ({ region }: { region: Region }) => (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center mb-2">
        <div className={`${region.color} h-3 w-3 rounded-full mr-2`}></div>
        <h3 className="font-medium">{region.name}</h3>
        <div className="ml-auto flex items-center space-x-1">
          {isBookmarked(region.id) && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center">
              <BookmarkCheck className="h-3 w-3 mr-1" />
              Bookmarked
            </span>
          )}
          {isArchived(region.id) && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full flex items-center">
              <Archive className="h-3 w-3 mr-1" />
              Archived
            </span>
          )}
          {region.explored && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              Explored
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{region.description}</p>
      <div className="flex space-x-2">
        <Button 
          variant={region.explored ? "outline" : "default"} 
          size="sm" 
          className="flex-1"
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: "Sign in required",
                description: "Please sign in to explore regions",
                variant: "destructive",
              });
              return;
            }
            
            toast({
              title: `Exploring ${region.name}`,
              description: "Starting musical journey...",
            });
          }}
        >
          {region.explored ? "Revisit" : "Explore"} Region
        </Button>
        
        {isBookmarked(region.id) ? (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
            onClick={() => openBookmarkDialog(region)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : isArchived(region.id) ? (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/20"
            onClick={() => toggleArchiveBookmark(region.id)}
          >
            <BookmarkCheck className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20"
            onClick={() => openBookmarkDialog(region)}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">World Music Exploration</h1>
            <p className="text-muted-foreground">
              Discover music from different cultures around the world
            </p>
          </div>
          
          {/* Progress tracker */}
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Your Exploration</h2>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated 
                    ? `You've explored ${exploredRegionNames.length} of ${regions.length} regions`
                    : "Sign in to track your exploration progress"}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{getExplorationProgress()}%</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 mb-6">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${getExplorationProgress()}%` }}
              />
            </div>
          </div>
          
          {/* World Map */}
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="relative w-full bg-blue-900/30 dark:bg-blue-900/50 rounded-lg p-4">
              {/* Use SVG directly for consistent positioning */}
              <div className="w-full" style={{ position: "relative" }}>
                <div style={{ paddingBottom: "45%" }}> {/* Custom aspect ratio to focus on habitable regions */}
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                    alt="World Map"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      position: "absolute", 
                      top: 0, 
                      left: 0,
                      objectPosition: "center 40%", /* Shift focus slightly toward equator */
                      backgroundColor: "rgba(30, 58, 138, 0.1)" 
                    }}
                  />
                </div>
                
                {/* Map regions - absolute position using exact coordinates */}
                {regions.map(region => (
                  <div
                    key={region.id}
                    style={{
                      position: "absolute",
                      top: region.position.top,
                      left: region.position.left,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10
                    }}
                    className="group cursor-pointer"
                    onClick={() => {
                      toast({
                        title: region.name,
                        description: region.description,
                      });
                    }}
                  >
                    <div 
                      className={`${region.color} w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 sm:border-3 border-white/80 shadow-lg ${
                        region.explored ? "" : "animate-pulse hover:scale-110 transition-transform"
                      }`}
                    >
                      {region.explored ? (
                        <span className="text-white font-bold text-sm sm:text-base">✓</span>
                      ) : (
                        <span className="text-white font-bold text-sm sm:text-base">?</span>
                      )}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black rounded-md p-2 w-40 pointer-events-none">
                      <p className="text-sm font-medium text-white">{region.name}</p>
                      <p className="text-xs text-gray-300 line-clamp-2">{region.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Create a similar map container for the region selection similar to the one above */}
          {/* Music Atlas Section - NEW */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Musical Atlas</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowBookmarkCollection(!showBookmarkCollection)}
              >
                <BookOpen className="h-4 w-4" />
                {showBookmarkCollection ? "Hide Collection" : "View Collection"}
              </Button>
            </div>
            
            {showBookmarkCollection && (
              <div className="bg-card rounded-xl p-4 border border-border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Your Bookmarked Regions</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${!showBookmarkCollection ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                      onClick={() => setShowBookmarkCollection(false)}
                    >
                      Active
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${showBookmarkCollection ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : ''}`}
                      onClick={() => setShowBookmarkCollection(true)}
                    >
                      Archived
                    </Button>
                  </div>
                </div>
                
                {bookmarkedRegions.length === 0 ? (
                  <div className="text-center py-10">
                    <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">Your atlas is empty</h3>
                    <p className="text-muted-foreground">
                      Bookmark regions you've explored to create your personal music diary
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarkedRegions
                      .filter(bookmark => !bookmark.isArchived)
                      .map(bookmark => {
                        const region = regions.find(r => r.id === bookmark.id);
                        if (!region) return null;
                        
                        return (
                          <Card key={bookmark.id} className="overflow-hidden">
                            <CardHeader className={`${region.color} bg-opacity-10 dark:bg-opacity-20 p-4 pb-3`}>
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{bookmark.name}</CardTitle>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => openBookmarkDialog(region)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => toggleArchiveBookmark(bookmark.id)}
                                  >
                                    <Archive className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:text-red-700"
                                    onClick={() => removeBookmark(bookmark.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardDescription>
                                Bookmarked on {new Date(bookmark.dateBookmarked).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                              {bookmark.notes && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                                  <p className="text-sm text-muted-foreground">{bookmark.notes}</p>
                                </div>
                              )}
                              
                              {bookmark.favoriteGenres.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium mb-1">Favorite Genres</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {bookmark.favoriteGenres.map(genre => (
                                      <span 
                                        key={genre}
                                        className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded"
                                      >
                                        {genre}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {bookmark.favoriteArtists.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Favorite Artists</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {bookmark.favoriteArtists.map(artist => (
                                      <span 
                                        key={artist}
                                        className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                                      >
                                        {artist}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
                
                {/* Archived Bookmarks Section */}
                {showBookmarkCollection && bookmarkedRegions.some(b => b.isArchived) && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Archived Regions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bookmarkedRegions
                        .filter(bookmark => bookmark.isArchived)
                        .map(bookmark => {
                          const region = regions.find(r => r.id === bookmark.id);
                          if (!region) return null;
                          
                          return (
                            <Card key={bookmark.id} className="bg-muted/20 overflow-hidden">
                              <CardHeader className="p-4 pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{bookmark.name}</CardTitle>
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => toggleArchiveBookmark(bookmark.id)}
                                    >
                                      <BookmarkCheck className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-700"
                                      onClick={() => removeBookmark(bookmark.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                {bookmark.notes && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{bookmark.notes}</p>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Region Explorer Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Explore Music by Region</h2>
            
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regions.map(region => (
                  <RegionCard key={region.id} region={region} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Bookmark Dialog */}
          <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isBookmarked(activeRegion?.id || "") ? "Edit bookmark" : "Bookmark region"}</DialogTitle>
                <DialogDescription>
                  Save this region to your personal music diary and record your musical discoveries.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Personal Notes</h4>
                  <Textarea
                    placeholder="Write your thoughts about the music from this region..."
                    value={bookmarkNotes}
                    onChange={(e) => setBookmarkNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Favorite Genres</h4>
                  <Input
                    placeholder="e.g. Samba, Bossa Nova, Tango (comma separated)"
                    value={favoriteGenres}
                    onChange={(e) => setFavoriteGenres(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Favorite Artists</h4>
                  <Input
                    placeholder="e.g. Caetano Veloso, Astor Piazzolla (comma separated)"
                    value={favoriteArtists}
                    onChange={(e) => setFavoriteArtists(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>Cancel</Button>
                <Button onClick={saveBookmark}>Save to Atlas</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
