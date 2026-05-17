import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlaying } from "@/components/layout/now-playing";
import { EnhancedDailyChallenge } from "@/components/music/enhanced-daily-challenge";
import { Badges } from "@/components/user/badges";
import { Leaderboard } from "@/components/user/leaderboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Play, ChevronRight, Globe, Music } from "lucide-react";

export default function EnhancedHome() {
  const { isAuthenticated } = useAuth();
  
  // Define genres with high-quality background images
  const genres = [
    {
      id: 1,
      name: "Afrobeat",
      description: "West African musical styles with American funk and jazz",
      backgroundImage: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
    },
    {
      id: 2,
      name: "K-Pop",
      description: "Korean popular music with audiovisual elements",
      backgroundImage: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Flamenco",
      description: "Spanish folk music from Andalusia",
      backgroundImage: "https://images.unsplash.com/photo-1544535830-9df3f56fd1d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    }
  ];
  
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
      albumArt: "https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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

  // Define regions for the world map
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
      id: "east-asia",
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
          <EnhancedDailyChallenge />
          
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
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${genre.backgroundImage})` }}
                  ></div>
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{genre.name}</h3>
                        <p className="text-sm text-white text-opacity-90">{genre.description}</p>
                      </div>
                      <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
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
            
            <div className="bg-card rounded-xl p-6 relative border border-white/10">
              <div className="absolute top-6 right-6 text-muted-foreground">
                <Globe className="h-6 w-6" />
              </div>
              
              <div className="relative w-full h-60 md:h-80">
                {/* World Map Background - realistic SVG world map */}
                <div className="w-full h-full rounded-lg overflow-hidden bg-blue-900/20 relative flex items-center justify-center">
                  <svg 
                    viewBox="0 0 1000 500" 
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    {/* World Map SVG Paths */}
                    <g fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                      {/* North America */}
                      <path d="M122,108 L134,102 L159,91 L170,91 L171,87 L179,85 L180,79 L194,78 L199,76 L205,76 L207,70 L215,70 L225,60 L225,55 L229,55 L232,50 L237,50 L240,45 L253,45 L256,51 L269,51 L279,46 L279,42 L286,41 L286,35 L290,35 L294,28 L300,28 L304,31 L310,31 L310,27 L316,27 L316,23 L325,19 L334,19 L345,12 L351,12 L353,16 L368,16 L372,11 L375,11 L375,19 L379,19 L379,30 L384,30 L384,23 L390,23 L390,30 L396,30 L396,35 L407,35 L407,30 L425,29 L432,24 L432,20 L437,20 L437,29 L443,29 L443,41 L451,41 L451,29 L458,29 L465,24 L488,24 L488,33 L496,39 L503,39 L503,46 L510,46 L512,51 L532,51 L532,55 L522,64 L515,64 L515,68 L504,76 L504,83 L499,83 L499,87 L493,94 L493,99 L488,99 L486,103 L478,103 L478,106 L470,106 L470,115 L465,115 L457,122 L457,128 L451,128 L451,133 L446,133 L446,140 L437,140 L437,147 L426,147 L426,153 L421,158 L421,164 L408,176 L408,183 L404,188 L397,188 L390,193 L385,193 L385,199 L378,199 L378,204 L372,204 L364,211 L359,211 L359,205 L351,205 L351,193 L345,193 L340,187 L334,187 L334,178 L328,178 L328,187 L321,187 L321,192 L315,192 L315,198 L309,198 L309,192 L302,192 L302,198 L295,198 L295,205 L275,205 L268,197 L256,197 L247,189 L240,189 L234,195 L225,195 L225,199 L207,199 L198,193 L198,181 L192,181 L192,171 L185,171 L178,165 L178,158 L172,158 L165,153 L165,147 L156,142 L156,133 L151,133 L151,127 L144,127 L136,117 L128,117 L122,111 Z" />
                      
                      {/* South America */}
                      <path d="M235,206 L244,206 L244,211 L252,211 L252,217 L261,217 L261,224 L269,224 L269,231 L277,231 L277,239 L283,239 L283,247 L291,247 L291,255 L299,255 L299,263 L306,263 L306,271 L313,271 L313,278 L319,278 L319,286 L326,286 L326,293 L332,293 L332,301 L338,301 L338,308 L336,315 L328,315 L328,322 L323,327 L315,327 L315,334 L307,341 L300,341 L291,348 L282,348 L282,343 L274,343 L267,349 L258,349 L258,341 L250,341 L250,334 L242,334 L242,328 L235,328 L235,321 L227,321 L227,315 L219,315 L219,307 L215,303 L215,289 L217,282 L217,273 L224,268 L224,260 L232,252 L232,244 L226,237 L226,229 L235,221 Z" />
                      
                      {/* Europe */}
                      <path d="M458,92 L466,92 L466,98 L475,98 L475,103 L483,103 L483,108 L491,108 L491,115 L500,115 L500,120 L509,120 L509,128 L517,128 L517,131 L524,131 L524,124 L530,124 L530,117 L536,117 L536,124 L544,124 L544,129 L551,129 L551,136 L560,136 L560,131 L568,131 L568,124 L575,124 L575,119 L584,119 L584,112 L593,112 L593,119 L600,119 L600,127 L608,127 L608,121 L615,121 L615,114 L621,114 L628,107 L636,107 L636,112 L641,117 L641,122 L649,122 L649,128 L657,128 L657,124 L663,124 L663,116 L671,116 L671,123 L678,123 L678,132 L670,132 L670,145 L661,145 L661,152 L653,152 L653,157 L643,157 L643,152 L636,152 L636,158 L629,158 L629,152 L620,152 L620,158 L611,158 L611,152 L602,152 L602,158 L594,158 L594,152 L585,152 L585,158 L576,158 L576,152 L567,152 L567,147 L558,147 L558,141 L547,141 L547,135 L539,135 L539,131 L530,131 L530,138 L521,138 L521,145 L513,145 L511,140 L504,140 L504,133 L497,133 L497,128 L490,128 L490,124 L483,124 L483,120 L473,120 L466,113 L466,107 L458,107 Z" />
                      
                      {/* Africa */}
                      <path d="M458,140 L467,140 L467,147 L476,147 L476,154 L485,154 L485,161 L494,161 L494,168 L502,168 L502,174 L511,174 L511,181 L520,181 L520,188 L529,188 L529,195 L538,195 L538,203 L547,203 L553,209 L553,217 L559,217 L559,226 L569,226 L569,233 L577,233 L577,240 L588,240 L588,247 L596,247 L596,254 L604,254 L604,262 L612,262 L612,269 L621,269 L621,276 L626,282 L626,289 L618,289 L618,284 L610,284 L610,277 L601,277 L601,271 L592,271 L592,264 L583,264 L583,270 L577,270 L577,276 L569,276 L569,283 L560,283 L560,289 L551,289 L551,294 L542,294 L542,302 L533,302 L533,307 L525,307 L525,301 L516,301 L516,295 L507,295 L507,289 L499,289 L499,284 L490,284 L490,279 L481,279 L481,274 L472,274 L472,267 L464,267 L464,262 L455,262 L455,254 L448,254 L448,248 L445,243 L445,234 L453,226 L454,219 L454,210 L452,203 L452,196 L450,190 L450,181 L448,176 L448,168 L445,164 L445,158 L450,152 L450,146 L458,146 Z" />
                      
                      {/* Asia */}
                      <path d="M675,103 L683,103 L683,110 L694,110 L694,118 L701,118 L701,125 L709,125 L709,132 L718,132 L718,139 L726,139 L726,147 L734,147 L734,154 L742,154 L742,161 L750,161 L750,167 L758,167 L758,176 L765,176 L765,183 L772,183 L772,189 L780,189 L780,196 L788,196 L788,203 L797,203 L797,209 L805,209 L805,215 L812,215 L812,220 L820,220 L820,210 L826,210 L826,200 L831,200 L831,189 L837,189 L837,178 L843,178 L843,169 L850,169 L850,158 L856,158 L856,148 L863,148 L863,138 L868,138 L868,128 L876,128 L876,119 L884,119 L884,110 L891,110 L891,101 L898,101 L898,110 L903,110 L903,119 L894,119 L894,128 L886,128 L886,138 L877,138 L877,148 L870,148 L870,158 L863,158 L863,169 L857,169 L857,178 L850,178 L850,189 L844,189 L844,200 L838,200 L838,210 L832,210 L832,221 L826,221 L826,231 L820,231 L820,241 L814,241 L814,249 L805,249 L805,242 L797,242 L797,236 L788,236 L788,231 L780,231 L780,226 L772,226 L772,220 L765,220 L765,213 L759,213 L759,207 L750,207 L750,201 L742,201 L742,195 L734,195 L734,189 L726,189 L726,183 L718,183 L718,176 L709,176 L709,169 L701,169 L701,162 L693,162 L693,155 L685,155 L685,149 L677,149 L677,142 L668,142 L668,135 L662,135 L662,128 L670,128 L670,119 L675,119 Z" />
                      
                      {/* Australia */}
                      <path d="M780,265 L791,265 L791,272 L801,272 L801,280 L810,280 L810,287 L820,287 L820,295 L828,295 L828,303 L838,303 L838,310 L846,310 L846,317 L855,317 L855,324 L865,324 L865,331 L873,331 L873,338 L881,338 L881,344 L887,344 L887,350 L877,350 L877,342 L868,342 L868,336 L860,336 L860,330 L851,330 L851,324 L841,324 L841,317 L832,317 L832,310 L823,310 L823,303 L814,303 L814,295 L805,295 L805,289 L796,289 L796,282 L786,282 L786,275 L780,275 Z" />
                    </g>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="167" x2="1000" y2="167" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="333" x2="1000" y2="333" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="250" y1="0" x2="250" y2="500" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="750" y1="0" x2="750" y2="500" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
                  </svg>
                </div>
                
                {/* Map Region Markers */}
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute z-10 cursor-pointer transition-transform hover:scale-110"
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
                      className={`${region.color} h-10 w-10 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg transform 
                        ${!region.explored && "animate-pulse"}`}
                    >
                      {region.explored ? (
                        <span className="text-white font-bold text-sm">✓</span>
                      ) : (
                        <Music className="h-5 w-5 text-white" />
                      )}
                    </div>
                    
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-semibold text-center w-20 text-white/80">
                      {region.name}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-8">
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