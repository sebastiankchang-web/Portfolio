import { useState, useEffect } from "react";
import { X, Clock, HelpCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRecordListening } from "@/hooks/useSpotify";
import { Challenge } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

type Region = {
  name: string;
  countries: string[];
};

// Sample regions for the game
const regions: Region[] = [
  { name: "South America", countries: "Peru, Bolivia, Ecuador" },
  { name: "Middle East", countries: "Egypt, Turkey, Iran" },
  { name: "East Asia", countries: "China, Japan, Korea" },
  { name: "India", countries: "North India, South India" },
];

type GameOverlayProps = {
  challenge: Challenge & { genre?: { id: number; name: string } };
  onClose: () => void;
};

export function GameOverlay({ challenge, onClose }: GameOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(10);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { user } = useAuth();
  const recordListening = useRecordListening();
  
  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Handle region selection
  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region);
    
    // For demo purposes, let's say the correct answer is "India"
    const isCorrect = region === "India";
    
    setTimeout(() => {
      toast({
        title: isCorrect ? "Correct!" : "Not quite right",
        description: isCorrect 
          ? "That's the right region for this instrument!" 
          : "The correct region was India. Keep listening!",
        variant: isCorrect ? "default" : "destructive",
      });
      
      // Move to next question or end game
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedRegion(null);
      } else {
        handleGameEnd();
      }
    }, 1000);
  };
  
  // Handle game end
  const handleGameEnd = () => {
    // Record listening session
    if (user && challenge.genre?.id) {
      recordListening.mutate({
        userId: user.id,
        genreId: challenge.genre.id,
        trackUri: challenge.playlistUri || "",
        durationMs: (600 - timeLeft) * 1000, // Convert seconds to ms
      });
    }
    
    toast({
      title: "Game completed!",
      description: "You've completed today's challenge.",
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/10" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
          
          <div className="bg-white bg-opacity-10 rounded-full px-4 py-2 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span className="text-white font-medium">{formatTime(timeLeft)}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/10"
            onClick={() => {
              toast({
                title: "How to play",
                description: "Listen to the music and match it to the correct region of the world.",
              });
            }}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
              <Volume2 className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Listen Carefully!</h2>
            <p className="text-foreground/80 mb-6">
              This instrument is from one of these regions. Can you match it to the correct location?
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {regions.map((region) => (
                <Button
                  key={region.name}
                  variant="outline"
                  className={`h-auto p-3 justify-start text-left ${
                    selectedRegion === region.name 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  onClick={() => handleSelectRegion(region.name)}
                >
                  <div>
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.countries}</p>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="link" 
                className="text-muted-foreground flex items-center p-0"
                onClick={() => {
                  toast({
                    title: "Playing audio",
                    description: "Playing music sample again...",
                  });
                }}
              >
                <Volume2 className="mr-1 h-4 w-4" /> Play Again
              </Button>
              
              <div>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
