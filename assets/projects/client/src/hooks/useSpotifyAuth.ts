import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './useAuth';

export function useSpotifyAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to check if user is connected to Spotify
  const { data: spotifyStatus, isLoading } = useQuery({
    queryKey: ['/api/spotify/user/me'],
    enabled: isAuthenticated && !!user?.spotifyConnected,
    retry: false
  });

  // Function to initiate Spotify connection
  const connectSpotify = async () => {
    try {
      setIsConnecting(true);
      const response = await apiRequest('/api/spotify/login');
      
      if (response?.authUrl) {
        // Open Spotify auth URL in a new tab instead of redirecting
        window.open(response.authUrl, '_blank', 'noopener,noreferrer');
        
        // Display a message about the redirect in case it takes time
        toast({
          title: "Redirecting to Spotify",
          description: "You'll be redirected to Spotify to authorize access.",
          duration: 5000
        });
      } else {
        throw new Error('Failed to get Spotify login URL');
      }
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
      toast({
        title: 'Connection Failed',
        description: 'Unable to connect to Spotify. Please try again.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  // Get personalized recommendations based on Spotify history
  const getPersonalRecommendations = async (options?: { 
    limit?: number, 
    genres?: string[] 
  }) => {
    if (!user?.spotifyConnected) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your Spotify account first to get personalized recommendations.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString());
      }
      
      if (options?.genres && options.genres.length > 0) {
        options.genres.forEach(genre => {
          queryParams.append('genres', genre);
        });
      }

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await apiRequest(`/api/spotify/user/recommendations${query}`);
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      toast({
        title: 'Recommendation Error',
        description: 'Failed to fetch personalized recommendations.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Get user's top tracks
  const getUserTopTracks = async (options?: { 
    timeRange?: 'short_term' | 'medium_term' | 'long_term',
    limit?: number 
  }) => {
    if (!user?.spotifyConnected) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your Spotify account first to access your top tracks.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (options?.timeRange) {
        queryParams.append('time_range', options.timeRange);
      }
      
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString());
      }

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await apiRequest(`/api/spotify/user/top-tracks${query}`);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      toast({
        title: 'Spotify API Error',
        description: 'Failed to fetch your top tracks.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    isSpotifyConnected: !!user?.spotifyConnected,
    isConnecting,
    spotifyProfile: spotifyStatus,
    isLoading,
    connectSpotify,
    getPersonalRecommendations,
    getUserTopTracks
  };
}