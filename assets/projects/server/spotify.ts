import { RequestHandler } from "express";
import SpotifyWebApi from "spotify-web-api-node";

// Generate a random string for state verification
function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This class handles Spotify API communication
export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private spotifyApi: SpotifyWebApi;
  
  // Store user tokens by userId
  private userTokens: Map<string, {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }> = new Map();

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || "";
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
    // Use the current domain for callback
    const domain = process.env.REPLIT_DOMAINS 
      ? process.env.REPLIT_DOMAINS.split(',')[0]
      : "localhost:3000";
    
    // For Replit domains, we need to make sure we're using HTTPS
    this.redirectUri = domain.includes("localhost")
      ? `http://${domain}/api/spotify/callback`
      : `https://${domain}/api/spotify/callback`;
      
    // Spotify requires exact match with registered redirect URI
    // For security, no IP addresses are allowed
    // Make sure our callback URL is registered in the Spotify Developer Dashboard
      
    console.log("Spotify redirect URI:", this.redirectUri);
    
    this.spotifyApi = new SpotifyWebApi({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri
    });
    
    if (!this.clientId || !this.clientSecret) {
      console.warn("Spotify API keys not provided. Some features will be limited.");
    }
  }
  
  // Generate a login URL for Spotify OAuth
  getAuthUrl(): string {
    const state = generateRandomString(16);
    // Add CORS headers for Spotify authorization
    const scopes = [
      'user-read-private', 
      'user-read-email', 
      'user-top-read',
      'user-read-recently-played',
      'user-library-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state'
    ];
    
    // Use Spotify auth URL with parameters to avoid connection issues
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('show_dialog', 'true'); // Force dialog display to avoid caching issues
    
    return authUrl.toString();
  }
  
  // Handle the callback from Spotify OAuth
  async handleCallback(code: string): Promise<{ 
    accessToken: string; 
    refreshToken: string;
    expiresIn: number;
    user: any;
  }> {
    const data = await this.spotifyApi.authorizationCodeGrant(code);
    
    this.spotifyApi.setAccessToken(data.body.access_token);
    this.spotifyApi.setRefreshToken(data.body.refresh_token);
    
    const user = await this.spotifyApi.getMe();
    
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
      user: user.body
    };
  }
  
  // Store user tokens for future use
  storeUserTokens(userId: string, accessToken: string, refreshToken: string, expiresIn: number): void {
    this.userTokens.set(userId, {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    });
  }
  
  // Get user-specific Spotify API instance
  async getUserApi(userId: string): Promise<SpotifyWebApi | null> {
    const userToken = this.userTokens.get(userId);
    if (!userToken) return null;
    
    // If token is expired, refresh it
    if (Date.now() > userToken.expiresAt) {
      try {
        this.spotifyApi.setRefreshToken(userToken.refreshToken);
        const data = await this.spotifyApi.refreshAccessToken();
        
        // Update stored tokens
        this.storeUserTokens(
          userId,
          data.body.access_token,
          userToken.refreshToken,
          data.body.expires_in
        );
        
        // Create new API instance with refreshed token
        const api = new SpotifyWebApi({
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          redirectUri: this.redirectUri,
          accessToken: data.body.access_token,
          refreshToken: userToken.refreshToken
        });
        
        return api;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
      }
    }
    
    // Return API instance with current token
    return new SpotifyWebApi({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
      accessToken: userToken.accessToken,
      refreshToken: userToken.refreshToken
    });
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if it's still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Convert expires_in (seconds) to milliseconds and set expiration time
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error fetching Spotify access token:', error);
      throw error;
    }
  }

  private async spotifyRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    try {
      const token = await this.getAccessToken();
      
      const options: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Spotify API error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in Spotify API request to ${endpoint}:`, error);
      throw error;
    }
  }

  // API methods for genre-based playlists
  async getGenreSeeds(): Promise<string[]> {
    const response = await this.spotifyRequest<{ genres: string[] }>('/recommendations/available-genre-seeds');
    return response.genres;
  }

  async getRecommendationsByGenre(genre: string, limit: number = 10) {
    return this.spotifyRequest(`/recommendations?seed_genres=${genre}&limit=${limit}`);
  }

  async getPlaylist(playlistId: string) {
    return this.spotifyRequest(`/playlists/${playlistId}`);
  }

  async searchPlaylists(query: string, limit: number = 10) {
    return this.spotifyRequest(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`);
  }

  async getTrack(trackId: string) {
    return this.spotifyRequest(`/tracks/${trackId}`);
  }
}

// Create a middleware for Spotify API endpoints
export const withSpotify: RequestHandler = async (req: any, res, next) => {
  if (!req.spotify) {
    req.spotify = new SpotifyService();
  }
  next();
};

// Create a singleton instance
export const spotifyService = new SpotifyService();
