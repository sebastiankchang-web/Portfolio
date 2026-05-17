import { useAuth } from "@/hooks/useAuth";
import { Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type GenreCardProps = {
  genre: {
    id: number;
    name: string;
    description: string;
    color: string;
  };
  onPlay: (genreId: number) => void;
};

// Color mapping for all genres
const colorMap: Record<number, string> = {
  1: "bg-orange-500", // Afrobeat
  2: "bg-pink-600",   // K-Pop
  3: "bg-red-500",    // Flamenco
  4: "bg-blue-400",   // Reggaeton
  5: "bg-green-500"   // Bollywood
};

export function SimpleGenreCard({ genre, onPlay }: GenreCardProps) {
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
  
  // Get background color based on genre ID
  const bgColor = colorMap[genre.id] || "bg-orange-600";

  return (
    <div 
      className={`${bgColor} relative rounded-lg overflow-hidden h-48 cursor-pointer shadow-lg hover:shadow-xl transition-all`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl text-white">🎵</span>
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

export function SimpleGenreGrid({ genres, onPlay }: { 
  genres: Array<{
    id: number;
    name: string;
    description: string;
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
        <SimpleGenreCard key={genre.id} genre={genre} onPlay={onPlay} />
      ))}
    </div>
  );
}