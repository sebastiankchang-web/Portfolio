import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useGenres() {
  return useQuery({
    queryKey: ['/api/genres'],
  });
}

export function useSpotifyGenres() {
  return useQuery({
    queryKey: ['/api/spotify/genres'],
  });
}

export function useRecommendations(genre: string, limit: number = 10) {
  return useQuery({
    queryKey: [`/api/spotify/recommendations/${genre}`, limit],
    enabled: !!genre,
  });
}

export function usePlaylist(playlistId: string) {
  return useQuery({
    queryKey: [`/api/spotify/playlist/${playlistId}`],
    enabled: !!playlistId,
  });
}

export function useTrack(trackId: string) {
  return useQuery({
    queryKey: [`/api/spotify/track/${trackId}`],
    enabled: !!trackId,
  });
}

export function useDailyChallenge() {
  return useQuery({
    queryKey: ['/api/challenges/daily'],
  });
}

export function useRecordListening() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, genreId, trackUri, durationMs }: { 
      userId: string, 
      genreId: number, 
      trackUri: string, 
      durationMs: number 
    }) => {
      const response = await apiRequest('POST', `/api/users/${userId}/listening`, {
        genreId,
        trackUri,
        durationMs,
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${variables.userId}/listening`] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] }); // To refresh streak
    },
  });
}

export function useExploreRegion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, genreId, regionName }: { 
      userId: string, 
      genreId: number, 
      regionName: string 
    }) => {
      const response = await apiRequest('POST', `/api/users/${userId}/regions`, {
        genreId,
        regionName,
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${variables.userId}/regions`] });
    },
  });
}

export function useUserAchievements(userId: string) {
  return useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    enabled: !!userId,
  });
}

export function useExploredRegions(userId: string) {
  return useQuery({
    queryKey: [`/api/users/${userId}/regions`],
    enabled: !!userId,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['/api/leaderboard'],
  });
}
