import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useExploredRegions, useExploreRegion } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Region = {
  id: string;
  name: string;
  position: { top: string; left: string };
  color: string;
  genreId: number;
};

const regions: Region[] = [
  {
    id: "south-america",
    name: "South America",
    position: { top: "60%", left: "30%" },
    color: "bg-chart-1", // World Music
    genreId: 1,
  },
  {
    id: "asia",
    name: "Asia",
    position: { top: "40%", left: "70%" },
    color: "bg-chart-2", // Classical
    genreId: 2,
  },
  {
    id: "africa",
    name: "Africa",
    position: { top: "50%", left: "50%" },
    color: "bg-chart-3", // Jazz
    genreId: 3,
  },
  {
    id: "europe",
    name: "Europe",
    position: { top: "30%", left: "45%" },
    color: "bg-chart-4", // Electronic
    genreId: 4,
  },
  {
    id: "oceania",
    name: "Oceania",
    position: { top: "70%", left: "80%" },
    color: "bg-chart-5", // Folk
    genreId: 5,
  },
];

export function WorldMap() {
  const [hoverRegion, setHoverRegion] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { data: exploredRegions = [] } = useExploredRegions(user?.id || "");
  const exploreRegion = useExploreRegion();
  
  const handleExploreRegion = (region: Region) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to explore regions",
        variant: "destructive",
      });
      return;
    }
    
    exploreRegion.mutate({
      userId: user.id,
      genreId: region.genreId,
      regionName: region.name,
    }, {
      onSuccess: () => {
        toast({
          title: "Region Explored",
          description: `You've discovered music from ${region.name}!`,
        });
      }
    });
  };
  
  const getExplorationProgress = () => {
    if (!exploredRegions.length) return 0;
    return Math.round((exploredRegions.length / regions.length) * 100);
  };
  
  // Check if a region has been explored
  const isExplored = (regionName: string) => {
    return exploredRegions.some(r => r.regionName === regionName);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">World Map Exploration</h2>
        <Button variant="link" className="text-primary flex items-center">
          View Full Map <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-xl p-6 relative">
        <div className="relative w-full h-60 md:h-80">
          {/* World Map Background */}
          <div className="w-full h-full bg-muted rounded-lg overflow-hidden">
            {/* Using a color overlay instead of an actual map image for simplicity */}
            <div className="w-full h-full bg-muted-foreground/10"></div>
          </div>
          
          {/* Map Markers */}
          {regions.map((region) => (
            <div
              key={region.id}
              className="absolute map-marker group"
              style={{ top: region.position.top, left: region.position.left }}
              onMouseEnter={() => setHoverRegion(region.id)}
              onMouseLeave={() => setHoverRegion(null)}
              onClick={() => handleExploreRegion(region)}
            >
              <div className={`${region.color} h-5 w-5 rounded-full ${isExplored(region.name) ? "" : "animate-pulse"}`}></div>
              
              {(hoverRegion === region.id || isExplored(region.name)) && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-2 w-32 text-center">
                  <p className="text-xs font-medium">{region.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isExplored(region.name) ? "Discovered" : "Tap to explore"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Global Exploration</p>
            <p className="text-sm text-primary font-medium">{getExplorationProgress()}% Complete</p>
          </div>
          <div className="w-full bg-black bg-opacity-30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full" 
              style={{ width: `${getExplorationProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
