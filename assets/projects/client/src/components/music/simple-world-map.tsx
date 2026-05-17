import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Simple world map regions with reliable display properties
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
    id: "asia",
    name: "East Asia",
    description: "K-Pop and traditional music",
    position: { top: "40%", left: "70%" },
    color: "bg-pink-600",
    explored: false
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

export function SimpleWorldMap() {
  const [hoverRegion, setHoverRegion] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  
  // Calculate exploration progress as a percentage
  const getExplorationProgress = () => {
    const exploredCount = regions.filter(r => r.explored).length;
    return Math.round((exploredCount / regions.length) * 100);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">World Music Exploration</h2>
        <Button 
          variant="link" 
          className="text-primary flex items-center"
          onClick={() => setLocation("/world-map")}
        >
          View Full Map <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-xl p-6 relative">
        <div className="relative w-full h-60 md:h-80">
          {/* World Map Background - simple vector SVG for reliability */}
          <div className="w-full h-full rounded-lg overflow-hidden bg-blue-900/10">
            <svg className="w-full h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* North America */}
              <path d="M150,120 Q200,100 250,120 T300,150 T250,200 T150,170 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* South America */}
              <path d="M250,250 Q280,230 310,250 T330,320 T290,370 T240,330 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* Europe */}
              <path d="M450,130 Q480,110 520,130 T550,170 T520,210 T460,180 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* Africa */}
              <path d="M480,220 Q510,200 550,220 T580,300 T530,340 T470,310 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* Asia */}
              <path d="M600,130 Q650,100 720,130 T780,200 T720,270 T630,230 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* Oceania */}
              <path d="M750,300 Q780,280 820,300 T840,350 T800,380 T760,350 Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
              
              {/* Simple grid lines */}
              <path d="M100,150 L900,150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M100,250 L900,250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M100,350 L900,350" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              
              <path d="M200,50 L200,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M400,50 L400,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M600,50 L600,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M800,50 L800,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
          </div>
          
          {/* Map Region Markers */}
          {regions.map((region) => (
            <div
              key={region.id}
              className="absolute map-marker cursor-pointer group"
              style={{ top: region.position.top, left: region.position.left }}
              onMouseEnter={() => setHoverRegion(region.id)}
              onMouseLeave={() => setHoverRegion(null)}
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
                className={`${region.color} h-8 w-8 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg transform 
                  ${!region.explored && "animate-pulse"}`}
              >
                {region.explored ? (
                  <span className="text-white font-bold text-sm">✓</span>
                ) : (
                  <span className="text-white text-sm font-bold">?</span>
                )}
              </div>
              
              {hoverRegion === region.id && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-2 w-40 text-center z-10">
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
            <p className="text-sm text-primary font-medium">{getExplorationProgress()}% Complete</p>
          </div>
          <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500" 
              style={{ width: `${getExplorationProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}