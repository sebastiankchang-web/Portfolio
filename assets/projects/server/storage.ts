import {
  users, type User, type UpsertUser,
  genres, type Genre, type InsertGenre,
  challenges, type Challenge, type InsertChallenge,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement,
  listeningHistory, type ListeningHistory, type InsertListeningHistory,
  exploredRegions, type ExploredRegion, type InsertExploredRegion,
  musicEvents, type MusicEvent, type InsertMusicEvent,
  aiDjSessions, type AiDjSession, type InsertAiDjSession,
} from "@shared/schema";
import { db } from "./db";
import { and, desc, eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPreferences(userId: string, preferences: Partial<UpsertUser>): Promise<User>;
  
  // Genre operations
  getGenre(id: number): Promise<Genre | undefined>;
  getGenreByName(name: string): Promise<Genre | undefined>;
  getAllGenres(): Promise<Genre[]>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  getSimilarWesternGenres(genreId: number): Promise<string[]>;
  
  // Challenge operations
  getChallenge(id: number): Promise<Challenge | undefined>;
  getDailyChallenge(): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(Achievement & { completed: boolean })[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Listening history operations
  addListeningHistory(history: InsertListeningHistory): Promise<ListeningHistory>;
  getUserListeningHistory(userId: string): Promise<ListeningHistory[]>;
  
  // Explored regions operations
  addExploredRegion(region: InsertExploredRegion): Promise<ExploredRegion>;
  getUserExploredRegions(userId: string): Promise<ExploredRegion[]>;
  
  // User streak and stats
  updateUserStreak(userId: string): Promise<User>;
  getLeaderboard(): Promise<User[]>;
  
  // Music events
  getMusicEvents(location?: string): Promise<MusicEvent[]>;
  getNearbyEvents(latitude: number, longitude: number, radius?: number): Promise<MusicEvent[]>; 
  createMusicEvent(event: InsertMusicEvent): Promise<MusicEvent>;
  
  // AI DJ
  createAiDjSession(session: InsertAiDjSession): Promise<AiDjSession>;
  getUserAiDjSessions(userId: string): Promise<AiDjSession[]>;
  getAiDjSession(id: number): Promise<AiDjSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      // Query user with a safe approach using a raw SQL query
      // that only includes columns known to exist in the database
      const query = `
        SELECT 
          id, email, first_name as "firstName", last_name as "lastName",
          profile_image_url as "profileImageUrl", score, streak, 
          last_played as "lastPlayed", created_at as "createdAt",
          updated_at as "updatedAt", spotify_id as "spotifyId",
          spotify_connected as "spotifyConnected"
        FROM users 
        WHERE id = $1
      `;
      
      const { rows } = await db.execute(query, [id]);
      
      if (!rows || rows.length === 0) {
        return undefined;
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error("Error in getUser:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // Use raw SQL to avoid schema mismatches
      const checkQuery = `SELECT id FROM users WHERE id = $1`;
      const { rows: existing } = await db.execute(checkQuery, [userData.id]);
      
      if (existing.length > 0) {
        // Update existing user
        const updateQuery = `
          UPDATE users SET
            email = $1,
            first_name = $2,
            last_name = $3,
            profile_image_url = $4,
            updated_at = NOW(),
            spotify_id = $5,
            spotify_connected = $6
          WHERE id = $7
          RETURNING *
        `;
        
        const { rows } = await db.execute(updateQuery, [
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.profileImageUrl,
          userData.spotifyId,
          userData.spotifyConnected,
          userData.id
        ]);
        
        return rows[0] as User;
      } else {
        // Insert new user
        const insertQuery = `
          INSERT INTO users (
            id, email, first_name, last_name, profile_image_url,
            created_at, updated_at, spotify_id, spotify_connected
          ) VALUES (
            $1, $2, $3, $4, $5, NOW(), NOW(), $6, $7
          )
          RETURNING *
        `;
        
        const { rows } = await db.execute(insertQuery, [
          userData.id,
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.profileImageUrl,
          userData.spotifyId,
          userData.spotifyConnected
        ]);
        
        return rows[0] as User;
      }
    } catch (error) {
      console.error("Error in upsertUser:", error);
      throw error;
    }
  }
  
  async updateUserPreferences(userId: string, preferences: Partial<UpsertUser>): Promise<User> {
    try {
      // Build query with only the fields we know exist in the database
      let query = `
        UPDATE users SET
          updated_at = NOW()
      `;
      
      const params: any[] = [];
      let paramCount = 1;
      
      // Build dynamic parts of the query based on what was provided
      if (preferences.firstName !== undefined) {
        query += `, first_name = $${paramCount}`;
        params.push(preferences.firstName);
        paramCount++;
      }
      
      if (preferences.lastName !== undefined) {
        query += `, last_name = $${paramCount}`;
        params.push(preferences.lastName);
        paramCount++;
      }
      
      if (preferences.profileImageUrl !== undefined) {
        query += `, profile_image_url = $${paramCount}`;
        params.push(preferences.profileImageUrl);
        paramCount++;
      }
      
      if (preferences.spotifyId !== undefined) {
        query += `, spotify_id = $${paramCount}`;
        params.push(preferences.spotifyId);
        paramCount++;
      }
      
      if (preferences.spotifyConnected !== undefined) {
        query += `, spotify_connected = $${paramCount}`;
        params.push(preferences.spotifyConnected);
        paramCount++;
      }
      
      // Add the WHERE clause and RETURNING
      query += ` WHERE id = $${paramCount} RETURNING *`;
      params.push(userId);
      
      const { rows } = await db.execute(query, params);
      
      if (rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error("Error in updateUserPreferences:", error);
      throw error;
    }
  }

  // Genre operations
  async getGenre(id: number): Promise<Genre | undefined> {
    try {
      const query = `
        SELECT id, name, description, region, color, image_url as "icon", 
               created_at as "createdAt"
        FROM genres
        WHERE id = $1
      `;
      
      const { rows } = await db.execute(query, [id]);
      
      if (rows.length === 0) {
        return undefined;
      }
      
      return rows[0] as Genre;
    } catch (error) {
      console.error("Error in getGenre:", error);
      return undefined;
    }
  }

  async getGenreByName(name: string): Promise<Genre | undefined> {
    try {
      const query = `
        SELECT id, name, description, region, color, image_url as "icon", 
               created_at as "createdAt"
        FROM genres
        WHERE name = $1
      `;
      
      const { rows } = await db.execute(query, [name]);
      
      if (rows.length === 0) {
        return undefined;
      }
      
      return rows[0] as Genre;
    } catch (error) {
      console.error("Error in getGenreByName:", error);
      return undefined;
    }
  }

  async getAllGenres(): Promise<Genre[]> {
    // Use raw SQL query to avoid schema mismatches
    const query = `
      SELECT id, name, description, region, color, image_url as "icon", 
             created_at as "createdAt"
      FROM genres
    `;
    
    const { rows } = await db.execute(query);
    return rows as Genre[];
  }

  async createGenre(genre: InsertGenre): Promise<Genre> {
    const insertQuery = `
      INSERT INTO genres (name, description, region, color, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, region, color, image_url as "icon", created_at as "createdAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      genre.name,
      genre.description,
      genre.region,
      genre.color,
      genre.icon // We're passing icon value to image_url column
    ]);
    
    return rows[0] as Genre;
  }
  
  async getSimilarWesternGenres(genreId: number): Promise<string[]> {
    // Use the region field to determine similar Western genres
    // This is a temporary solution that maps world regions to Western genres
    
    // First, get the region from the database
    const westernGenres: Record<number, string[]> = {
      1: ["pop", "rock", "indie"],
      2: ["hip-hop", "r&b", "electronic"],
      3: ["jazz", "classical", "ambient"],
      4: ["rock", "metal", "punk"],
      5: ["folk", "country", "americana"]
    };
    
    // Return Western genres if we have them for this ID, otherwise empty array
    return westernGenres[genreId] || [];
  }

  // Challenge operations
  async getChallenge(id: number): Promise<Challenge | undefined> {
    try {
      const query = `
        SELECT id, title, description, genre_id as "genreId", 
               date, playlist_uri as "playlistUri", created_at as "createdAt"
        FROM challenges
        WHERE id = $1
      `;
      
      const { rows } = await db.execute(query, [id]);
      
      if (rows.length === 0) {
        return undefined;
      }
      
      return rows[0] as Challenge;
    } catch (error) {
      console.error("Error in getChallenge:", error);
      return undefined;
    }
  }

  async getDailyChallenge(): Promise<Challenge | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use raw SQL query to avoid schema mismatches
    const query = `
      SELECT id, title, description, genre_id as "genreId", 
             date, playlist_uri as "playlistUri", created_at as "createdAt"
      FROM challenges
      WHERE date = $1
      LIMIT 1
    `;
    
    const { rows } = await db.execute(query, [today]);
    
    if (rows.length === 0) {
      return undefined;
    }
    
    return rows[0] as Challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const insertQuery = `
      INSERT INTO challenges (title, description, genre_id, date, playlist_uri)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, genre_id as "genreId", 
                date, playlist_uri as "playlistUri", created_at as "createdAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      challenge.title,
      challenge.description,
      challenge.genreId,
      challenge.date,
      challenge.playlistUri
    ]);
    
    return rows[0] as Challenge;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    try {
      const query = `
        SELECT id, name, description, icon, required_score as "requiredScore",
               required_streak as "requiredStreak", created_at as "createdAt"
        FROM achievements
        WHERE id = $1
      `;
      
      const { rows } = await db.execute(query, [id]);
      
      if (rows.length === 0) {
        return undefined;
      }
      
      return rows[0] as Achievement;
    } catch (error) {
      console.error("Error in getAchievement:", error);
      return undefined;
    }
  }

  async getAllAchievements(): Promise<Achievement[]> {
    const query = `
      SELECT id, name, description, icon, required_score as "requiredScore",
             required_streak as "requiredStreak", created_at as "createdAt"
      FROM achievements
    `;
    
    const { rows } = await db.execute(query);
    return rows as Achievement[];
  }

  async getUserAchievements(userId: string): Promise<(Achievement & { completed: boolean })[]> {
    // Use raw SQL to avoid schema mismatches
    const query = `
      SELECT 
        a.id, a.name, a.description, a.icon, 
        a.required_score as "requiredScore", 
        a.required_streak as "requiredStreak",
        a.created_at as "createdAt",
        COALESCE(ua.completed, false) as completed
      FROM achievements a
      LEFT JOIN user_achievements ua 
        ON ua.achievement_id = a.id 
        AND ua.user_id = $1
    `;
    
    const { rows } = await db.execute(query, [userId]);
    
    return rows.map((achievement: any) => ({
      ...achievement,
      completed: !!achievement.completed
    }));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const insertQuery = `
      INSERT INTO achievements (name, description, icon, required_score, required_streak)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, icon, required_score as "requiredScore",
                required_streak as "requiredStreak", created_at as "createdAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      achievement.name,
      achievement.description,
      achievement.icon,
      achievement.requiredScore,
      achievement.requiredStreak
    ]);
    
    return rows[0] as Achievement;
  }

  async updateUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    // Using raw SQL to avoid schema mismatches
    const checkQuery = `
      SELECT * FROM user_achievements
      WHERE user_id = $1 AND achievement_id = $2
    `;
    
    const { rows: existing } = await db.execute(checkQuery, [
      userAchievement.userId,
      userAchievement.achievementId
    ]);
    
    if (existing.length > 0) {
      // Update existing achievement
      const updateQuery = `
        UPDATE user_achievements
        SET completed = $1, 
            completed_at = $2
        WHERE id = $3
        RETURNING *
      `;
      
      const { rows } = await db.execute(updateQuery, [
        userAchievement.completed,
        userAchievement.completed ? new Date() : null,
        existing[0].id
      ]);
      
      return rows[0] as UserAchievement;
    } else {
      // Insert new achievement
      const insertQuery = `
        INSERT INTO user_achievements
        (user_id, achievement_id, completed, completed_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const { rows } = await db.execute(insertQuery, [
        userAchievement.userId, 
        userAchievement.achievementId,
        userAchievement.completed,
        userAchievement.completed ? new Date() : null
      ]);
      
      return rows[0] as UserAchievement;
    }
  }

  // Listening history operations
  async addListeningHistory(history: InsertListeningHistory): Promise<ListeningHistory> {
    const insertQuery = `
      INSERT INTO listening_history (user_id, genre_id, track_uri, listen_date, duration_ms)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id as "userId", genre_id as "genreId", 
                track_uri as "trackUri", listen_date as "listenDate", 
                duration_ms as "durationMs", created_at as "createdAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      history.userId,
      history.genreId,
      history.trackUri,
      history.listenDate,
      history.durationMs
    ]);
    
    return rows[0] as ListeningHistory;
  }

  async getUserListeningHistory(userId: string): Promise<ListeningHistory[]> {
    const query = `
      SELECT id, user_id as "userId", genre_id as "genreId", 
             track_uri as "trackUri", listen_date as "listenDate", 
             duration_ms as "durationMs", created_at as "createdAt"
      FROM listening_history
      WHERE user_id = $1
      ORDER BY listen_date DESC
    `;
    
    const { rows } = await db.execute(query, [userId]);
    return rows as ListeningHistory[];
  }

  // Explored regions operations
  async addExploredRegion(region: InsertExploredRegion): Promise<ExploredRegion> {
    // Check if user already explored this region
    const checkQuery = `
      SELECT * FROM explored_regions
      WHERE user_id = $1 AND region_name = $2
    `;
    
    const { rows: existing } = await db.execute(checkQuery, [
      region.userId, 
      region.regionName
    ]);
    
    if (existing.length > 0) {
      return existing[0] as ExploredRegion;
    }
    
    const insertQuery = `
      INSERT INTO explored_regions (user_id, genre_id, region_name, completed_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id as "userId", genre_id as "genreId", 
                region_name as "regionName", completed_at as "completedAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      region.userId,
      region.genreId,
      region.regionName,
      region.completedAt || new Date()
    ]);
    
    return rows[0] as ExploredRegion;
  }

  async getUserExploredRegions(userId: string): Promise<ExploredRegion[]> {
    const query = `
      SELECT id, user_id as "userId", genre_id as "genreId", 
             region_name as "regionName", completed_at as "completedAt"
      FROM explored_regions
      WHERE user_id = $1
    `;
    
    const { rows } = await db.execute(query, [userId]);
    return rows as ExploredRegion[];
  }

  // User streak and stats
  async updateUserStreak(userId: string): Promise<User> {
    // First get current user
    const userQuery = `
      SELECT * FROM users WHERE id = $1
    `;
    
    const { rows: userRows } = await db.execute(userQuery, [userId]);
    
    if (userRows.length === 0) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const user = userRows[0];
    const today = new Date();
    let newStreak = 1;
    let newScore = user.score || 0;
    
    // Check if user has played today already
    if (user.last_played && new Date(user.last_played).toDateString() === today.toDateString()) {
      // User already played today, don't update streak
      return this.getUser(userId) as Promise<User>;
    }
    
    // Check if user played yesterday to continue streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (user.last_played && new Date(user.last_played).toDateString() === yesterday.toDateString()) {
      // Continue streak
      newStreak = (user.streak || 0) + 1;
    } else {
      // Reset streak, but still give them 1 for today
      newStreak = 1;
    }
    
    // Add points for playing today
    newScore += 10;
    
    // Add bonus points for streak
    if (newStreak >= 5) {
      newScore += 15;
    } else if (newStreak >= 3) {
      newScore += 5;
    }
    
    const updateQuery = `
      UPDATE users
      SET streak = $1,
          score = $2,
          last_played = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name as "firstName", last_name as "lastName", 
                profile_image_url as "profileImageUrl", score, streak, 
                last_played as "lastPlayed", created_at as "createdAt", 
                updated_at as "updatedAt", spotify_id as "spotifyId",
                spotify_connected as "spotifyConnected"
    `;
    
    const { rows } = await db.execute(updateQuery, [
      newStreak,
      newScore,
      today,
      userId
    ]);
    
    return rows[0] as User;
  }

  async getLeaderboard(): Promise<User[]> {
    // Use raw SQL query to avoid schema mismatches
    const query = `
      SELECT 
        id, email, first_name as "firstName", last_name as "lastName",
        profile_image_url as "profileImageUrl", score, streak, 
        last_played as "lastPlayed", created_at as "createdAt",
        updated_at as "updatedAt", spotify_id as "spotifyId",
        spotify_connected as "spotifyConnected"
      FROM users
      ORDER BY score DESC NULLS LAST
      LIMIT 10
    `;
    
    const { rows } = await db.execute(query);
    return rows as User[];
  }
  
  // Music events
  async getMusicEvents(location?: string): Promise<MusicEvent[]> {
    let query = `
      SELECT id, name, description, location, venue, event_date as "date",
             event_genres as "eventGenres", image_url as "imageUrl", 
             ticket_url as "ticketUrl", latitude, longitude, created_at as "createdAt"
      FROM music_events
    `;
    
    const params: any[] = [];
    
    if (location) {
      query += ` WHERE location = $1`;
      params.push(location);
    }
    
    query += ` ORDER BY event_date ASC`;
    
    const { rows } = await db.execute(query, params);
    return rows as MusicEvent[];
  }

  async getNearbyEvents(latitude: number, longitude: number, radius: number = 20): Promise<MusicEvent[]> {
    // Simple distance calculation in a SQL query (approximate)
    const query = `
      SELECT id, name, description, location, venue, event_date as "date",
             event_genres as "eventGenres", image_url as "imageUrl", 
             ticket_url as "ticketUrl", latitude, longitude, created_at as "createdAt",
             (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) AS distance
      FROM music_events
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < $3
      ORDER BY event_date ASC
    `;
    
    const { rows } = await db.execute(query, [latitude, longitude, radius]);
    return rows as MusicEvent[];
  }

  async createMusicEvent(event: InsertMusicEvent): Promise<MusicEvent> {
    const insertQuery = `
      INSERT INTO music_events (
        name, description, location, venue, event_date, 
        event_genres, image_url, ticket_url, latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, description, location, venue, event_date as "date",
                event_genres as "eventGenres", image_url as "imageUrl", 
                ticket_url as "ticketUrl", latitude, longitude, created_at as "createdAt"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      event.name,
      event.description,
      event.location,
      event.venue,
      event.date,
      event.eventGenres,
      event.imageUrl,
      event.ticketUrl,
      event.latitude,
      event.longitude
    ]);
    
    return rows[0] as MusicEvent;
  }
  
  // AI DJ
  async createAiDjSession(session: InsertAiDjSession): Promise<AiDjSession> {
    const insertQuery = `
      INSERT INTO ai_dj_sessions (
        user_id, session_name, prompt, genres, regions, created_at, last_played
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, user_id as "userId", session_name as "sessionName", 
                prompt, genres, regions, created_at as "createdAt", 
                last_played as "lastPlayed"
    `;
    
    const { rows } = await db.execute(insertQuery, [
      session.userId,
      session.sessionName,
      session.prompt,
      session.genres,
      session.regions
    ]);
    
    return rows[0] as AiDjSession;
  }

  async getUserAiDjSessions(userId: string): Promise<AiDjSession[]> {
    const query = `
      SELECT id, user_id as "userId", session_name as "sessionName", 
             prompt, genres, regions, created_at as "createdAt", 
             last_played as "lastPlayed"
      FROM ai_dj_sessions
      WHERE user_id = $1
      ORDER BY last_played DESC
    `;
    
    const { rows } = await db.execute(query, [userId]);
    return rows as AiDjSession[];
  }

  async getAiDjSession(id: number): Promise<AiDjSession | undefined> {
    const query = `
      SELECT id, user_id as "userId", session_name as "sessionName", 
             prompt, genres, regions, created_at as "createdAt", 
             last_played as "lastPlayed"
      FROM ai_dj_sessions
      WHERE id = $1
    `;
    
    const { rows } = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return undefined;
    }
    
    return rows[0] as AiDjSession;
  }
}

export const storage = new DatabaseStorage();