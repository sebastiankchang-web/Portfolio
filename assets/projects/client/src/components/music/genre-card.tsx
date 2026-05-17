import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type GenreCardProps = {
  genre: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    color: string;
  };
  onPlay: (genreId: number) => void;
};

export function GenreCard({ genre, onPlay }: GenreCardProps) {
  const { isAuthenticated } = useAuth();
  
  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to explore this genre",
        variant: "destructive",
      });
      return;
    }
    
    onPlay(genre.id);
  };
  
  // Get background color based on genre ID for reliability
  const getColorById = (id: number) => {
    const colorMap: Record<number, string> = {
      1: "bg-orange-500",   // Afrobeat
      2: "bg-pink-600",     // K-Pop
      3: "bg-red-500",      // Flamenco
      4: "bg-blue-400",     // Reggaeton
      5: "bg-green-500",    // Bollywood
    };
    
    return colorMap[id] || "bg-orange-600"; // Default to orange (Soundora theme)
  };

  return (
    <div 
      className={`genre-card relative rounded-lg overflow-hidden h-48 cursor-pointer ${getColorById(genre.id)} shadow-lg hover:shadow-xl transition-all`}
      onClick={handleClick}
    >
      {/* Reliable fallback display with emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl text-white">🎵</span>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{genre.name}</h3>
            <p className="text-sm text-white text-opacity-80">{genre.description}</p>
          </div>
          <div className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
            <Play className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenreGrid({ genres, onPlay }: { 
  genres: Array<{
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    color: string;
  }>;
  onPlay: (genreId: number) => void;
}) {
  if (!genres || genres.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No genres available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {genres.map((genre) => (
        <GenreCard key={genre.id} genre={genre} onPlay={onPlay} />
      ))}
    </div>
  );
}
