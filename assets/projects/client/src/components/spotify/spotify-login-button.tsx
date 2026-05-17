import { Button } from "@/components/ui/button";
import { Music, Loader2 } from "lucide-react";
import { useState } from "react";

export function SpotifyLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Use server-side login instead of direct Spotify connection
    // This avoids CORS issues by using our backend as a proxy
    window.location.href = '/api/spotify/login';
    
    // We don't reset loading state since we're navigating away
  };

  return (
    <Button 
      onClick={handleLogin}
      className="bg-primary hover:bg-primary/90 text-white w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Music className="mr-2 h-4 w-4" />
          Sign in with Spotify
        </>
      )}
    </Button>
  );
}