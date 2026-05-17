import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { Loader2, Music, Link, CheckCircle } from "lucide-react";

export function SpotifyConnect() {
  const { 
    isSpotifyConnected, 
    isConnecting, 
    spotifyProfile, 
    isLoading, 
    connectSpotify 
  } = useSpotifyAuth();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Spotify Connection
          </CardTitle>
          <CardDescription>
            Checking your Spotify connection...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isSpotifyConnected && spotifyProfile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Spotify Connected
            <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
          </CardTitle>
          <CardDescription>
            Your Spotify account is connected to Soundora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {spotifyProfile.images && spotifyProfile.images[0]?.url ? (
                <AvatarImage src={spotifyProfile.images[0].url} alt={spotifyProfile.display_name || 'Spotify User'} />
              ) : (
                <AvatarFallback>
                  <Music className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{spotifyProfile.display_name || 'Spotify User'}</h3>
              <p className="text-sm text-muted-foreground">{spotifyProfile.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {spotifyProfile.product && (
                  <Badge variant={spotifyProfile.product === 'premium' ? 'default' : 'outline'}>
                    {spotifyProfile.product === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                )}
                {spotifyProfile.followers && (
                  <Badge variant="outline">{spotifyProfile.followers.total} Followers</Badge>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Personalized recommendations based on your listening history
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Create custom DJ playlists with music you already love
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Unlock achievements for exploring new music across cultures
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="h-5 w-5 mr-2" />
          Connect Spotify
        </CardTitle>
        <CardDescription>
          Connect your Spotify account to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Why connect?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Get recommendations based on your listening history
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Create custom DJ playlists with music you already love
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Unlock achievements for exploring new music across cultures
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={connectSpotify} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4" />
              Connect Spotify
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}