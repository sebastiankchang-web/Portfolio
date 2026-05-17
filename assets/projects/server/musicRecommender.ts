import { db } from "./db";
import { spotifyService } from "./spotify";
import { storage } from "./storage";
import { 
  genres, 
  listeningHistory, 
  exploredRegions,
  type User
} from "@shared/schema";
import { eq, and, desc, count, sum } from "drizzle-orm";

interface RecommendationParams {
  userId: string;
  genreSeed?: string;
  regionSeed?: string;
  similarToWestern?: boolean;
  includeNearbyEvents?: boolean;
  limit?: number;
}

interface TrackRecommendation {
  id: string;
  name: string;
  artist: string;
  uri: string;
  albumUrl: string;
  popularity: number;
  culturalContext?: string;
  similar?: string[];
  regionOfOrigin?: string;
}

/**
 * Cultural Music Recommender System
 * 
 * This system recommends music from different cultures based on:
 * 1. User's listening history
 * 2. User's preferred genres
 * 3. Similar Western genres to help transition to new cultural sounds
 * 4. Cultural regions the user hasn't explored yet
 * 5. Nearby music events to encourage in-person cultural experiences
 */
export class MusicRecommender {
  
  /**
   * Gets music recommendations based on various parameters
   */
  async getRecommendations(params: RecommendationParams): Promise<TrackRecommendation[]> {
    const { 
      userId, 
      genreSeed, 
      regionSeed, 
      similarToWestern = true, 
      includeNearbyEvents = true,
      limit = 10 
    } = params;
    
    let seedGenres = [];
    
    // If we have a specific genre seed, use that
    if (genreSeed) {
      seedGenres = [genreSeed];
    } 
    // Otherwise, determine genres based on user preferences and history
    else {
      // Try to get user's preferred genres from listening history
      const user = await storage.getUser(userId);
      
      // Skip preferred genres check since the column doesn't exist in database
      // We'll use listening history instead
      
      // If we don't have enough genres yet, add from listening history
      if (seedGenres.length < 2) {
        // Find top genres from user's listening history
        const genreStats = await db
          .select({
            genreId: listeningHistory.genreId,
            count: count(listeningHistory.id),
          })
          .from(listeningHistory)
          .where(eq(listeningHistory.userId, userId))
          .groupBy(listeningHistory.genreId)
          .orderBy(desc(count(listeningHistory.id)))
          .limit(2 - seedGenres.length);
        
        // Add genre names to seed genres
        for (const stat of genreStats) {
          if (stat.genreId) {
            const genre = await storage.getGenre(stat.genreId);
            if (genre && genre.name) {
              seedGenres.push(genre.name);
            }
          }
        }
      }
      
      // If we still don't have genres, use some defaults based on region if provided
      if (seedGenres.length === 0 && regionSeed) {
        // Get genres associated with this region
        const regionGenres = await db
          .select()
          .from(genres)
          .where(eq(genres.region, regionSeed))
          .limit(2);
        
        seedGenres = regionGenres.map(g => g.name);
      }
      
      // Last resort - just use some popular genres
      if (seedGenres.length === 0) {
        seedGenres = ['pop', 'rock'];
      }
    }
    
    // Get recommendations from Spotify based on seed genres
    const spotifyRecs = await spotifyService.getRecommendationsByGenre(
      seedGenres.join(','), 
      limit
    );
    
    // Transform the recommendations and add cultural context
    let recommendations = await Promise.all(
      spotifyRecs.tracks.map(async (track) => {
        // Get genre info if available
        let culturalContext;
        let similar;
        let regionOfOrigin;
        
        // Try to match track with a cultural genre
        for (const seedGenre of seedGenres) {
          const genre = await storage.getGenreByName(seedGenre);
          if (genre) {
            culturalContext = genre.description; // Use description instead of missing culturalContext
            similar = []; // Default to empty array since similarWesternGenres doesn't exist
            regionOfOrigin = genre.region;
            break;
          }
        }
        
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name || 'Unknown Artist',
          uri: track.uri,
          albumUrl: track.album?.images?.[0]?.url,
          popularity: track.popularity,
          culturalContext,
          similar,
          regionOfOrigin
        };
      })
    );
    
    // If includeNearbyEvents is true, bias recommendations toward music
    // from genres that will be performed at upcoming local events
    if (includeNearbyEvents && userId) {
      const user = await storage.getUser(userId);
      if (user?.location) {
        const events = await storage.getMusicEvents(user.location);
        if (events.length > 0) {
          // Get genre information from events
          const eventGenres = events.flatMap(event => event.eventGenres || []);
          
          if (eventGenres.length > 0) {
            // Boost recommendations that match event genres
            recommendations = recommendations.sort((a, b) => {
              const aMatchesEvent = eventGenres.some(g => 
                a.similar?.includes(g) || 
                a.regionOfOrigin === regionSeed
              );
              
              const bMatchesEvent = eventGenres.some(g => 
                b.similar?.includes(g) || 
                b.regionOfOrigin === regionSeed
              );
              
              if (aMatchesEvent && !bMatchesEvent) return -1;
              if (!aMatchesEvent && bMatchesEvent) return 1;
              return 0;
            });
          }
        }
      }
    }
    
    // If similarToWestern is true, prioritize tracks from non-Western cultures
    // that have similarities to Western genres the user may be familiar with
    if (similarToWestern) {
      // Get user's listening history to determine familiar Western genres
      const history = await storage.getUserListeningHistory(userId);
      
      if (history.length > 0) {
        // Extract genre IDs from history
        const historyGenreIds = history.map(h => h.genreId).filter(Boolean);
        
        // Get genres from IDs
        const userGenres = await Promise.all(
          historyGenreIds.map(id => storage.getGenre(id))
        );
        
        // Extract Western genres the user is familiar with
        const westernGenres = userGenres
          .filter(g => g && (!g.region || g.region === 'Western'))
          .map(g => g.name);
        
        if (westernGenres.length > 0) {
          // Prioritize recommendations with Western similarities
          recommendations = recommendations.sort((a, b) => {
            const aHasSimilarity = a.similar?.some(g => westernGenres.includes(g));
            const bHasSimilarity = b.similar?.some(g => westernGenres.includes(g));
            
            if (aHasSimilarity && !bHasSimilarity) return -1;
            if (!aHasSimilarity && bHasSimilarity) return 1;
            return 0;
          });
        }
      }
    }
    
    return recommendations.slice(0, limit);
  }
  
  /**
   * Create a DJ session with curated recommendations based on user
   * preferences and cultural exploration goals
   */
  async createDjSession(userId: string, prompt?: string) {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Parse the prompt to understand user's preferences
    // E.g., "Play me some relaxing music from Southeast Asia"
    let genreSeed: string | undefined;
    let regionSeed: string | undefined;
    
    if (prompt) {
      // Simple keyword extraction for region
      const regions = [
        'Africa', 'East Asia', 'South Asia', 'Southeast Asia',
        'Middle East', 'Latin America', 'Caribbean', 'Eastern Europe',
        'Western Europe', 'Oceania', 'Nordic'
      ];
      
      for (const region of regions) {
        if (prompt.toLowerCase().includes(region.toLowerCase())) {
          regionSeed = region;
          break;
        }
      }
      
      // Simple keyword extraction for genre mood
      const moodToGenre = {
        'relaxing': ['ambient', 'chill', 'classical'],
        'energetic': ['dance', 'electronic', 'pop'],
        'happy': ['pop', 'reggae', 'ska'],
        'sad': ['blues', 'soul', 'indie'],
        'focus': ['instrumental', 'classical', 'ambient'],
        'party': ['dance', 'electronic', 'hip-hop'],
        'workout': ['electronic', 'rock', 'hip-hop']
      };
      
      for (const [mood, genres] of Object.entries(moodToGenre)) {
        if (prompt.toLowerCase().includes(mood)) {
          // Pick a random genre from the mood
          genreSeed = genres[Math.floor(Math.random() * genres.length)];
          break;
        }
      }
    }
    
    // Identify user's unexplored regions to prioritize cultural discovery
    const exploredRegions = await storage.getUserExploredRegions(userId);
    const exploredRegionNames = exploredRegions.map(r => r.regionName);
    
    // Get all available regions from genres
    const allGenres = await storage.getAllGenres();
    const allRegions = [...new Set(allGenres.map(g => g.region).filter(Boolean))];
    
    // Find unexplored regions
    const unexploredRegions = allRegions.filter(r => 
      r && !exploredRegionNames.includes(r)
    );
    
    // If no region specified and there are unexplored regions, pick one
    if (!regionSeed && unexploredRegions.length > 0) {
      regionSeed = unexploredRegions[Math.floor(Math.random() * unexploredRegions.length)];
    }
    
    // Get recommendations with our parameters
    const recommendations = await this.getRecommendations({
      userId,
      genreSeed,
      regionSeed,
      similarToWestern: true,
      includeNearbyEvents: true,
      limit: 20 // Get more tracks for a full session
    });
    
    // Create session name based on region and genre
    let sessionName = "Music Journey";
    if (regionSeed) {
      sessionName = `Explore ${regionSeed}`;
      if (genreSeed) {
        sessionName += ` (${genreSeed})`;
      }
    } else if (genreSeed) {
      sessionName = `${genreSeed.charAt(0).toUpperCase() + genreSeed.slice(1)} Exploration`;
    }
    
    // Create DJ session in database
    const session = await storage.createAiDjSession({
      userId,
      sessionName,
      prompt,
      genres: [genreSeed].filter(Boolean),
      regions: [regionSeed].filter(Boolean),
      createdAt: new Date(),
      lastPlayed: new Date()
    });
    
    // Return session with recommendations
    return {
      session,
      recommendations,
      culturalContext: recommendations[0]?.culturalContext || null
    };
  }
}

export const musicRecommender = new MusicRecommender();