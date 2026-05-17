import {
  pgTable,
  text,
  serial,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  date,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Spotify Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  score: integer("score").default(0),
  streak: integer("streak").default(0),
  lastPlayed: date("last_played"),
  // Location field may not exist in all DB setups - make it optional
  location: text("location"),
  spotifyId: varchar("spotify_id").unique(),
  spotifyConnected: boolean("spotify_connected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Music genres table
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  region: text("region"),
  // Removed columns that don't exist in the database
  color: text("color").default("#808080"), // Color for UI display (hex or hsl)
  icon: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily challenges table
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  genreId: integer("genre_id").references(() => genres.id),
  date: date("date").notNull(),
  playlistUri: text("playlist_uri"),
  // Removed culturalInsight column that doesn't exist in the database
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requiredScore: integer("required_score"),
  requiredStreak: integer("required_streak"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievement progress table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User listening history table
export const listeningHistory = pgTable("listening_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  genreId: integer("genre_id").references(() => genres.id),
  trackUri: text("track_uri"),
  listenDate: date("listen_date").defaultNow(),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Explored regions for world map
export const exploredRegions = pgTable("explored_regions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  genreId: integer("genre_id").references(() => genres.id),
  regionName: text("region_name").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Music events table
export const musicEvents = pgTable("music_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  venue: text("venue").notNull(),
  date: timestamp("date").notNull(),
  eventGenres: text("event_genres").array(),
  imageUrl: text("image_url"),
  ticketUrl: text("ticket_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI DJ sessions table
export const aiDjSessions = pgTable("ai_dj_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sessionName: text("session_name").notNull(),
  prompt: text("prompt"),
  genres: text("genres").array(),
  regions: text("regions").array(),
  createdAt: timestamp("created_at").defaultNow(),
  lastPlayed: timestamp("last_played"),
});

// Export Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertGenre = typeof genres.$inferInsert;
export type Genre = typeof genres.$inferSelect;

export type InsertChallenge = typeof challenges.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;

export type InsertAchievement = typeof achievements.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertListeningHistory = typeof listeningHistory.$inferInsert;
export type ListeningHistory = typeof listeningHistory.$inferSelect;

export type InsertExploredRegion = typeof exploredRegions.$inferInsert;
export type ExploredRegion = typeof exploredRegions.$inferSelect;

export type InsertMusicEvent = typeof musicEvents.$inferInsert;
export type MusicEvent = typeof musicEvents.$inferSelect;

export type InsertAiDjSession = typeof aiDjSessions.$inferInsert;
export type AiDjSession = typeof aiDjSessions.$inferSelect;

// Create validation schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertGenreSchema = createInsertSchema(genres);
export const insertChallengeSchema = createInsertSchema(challenges);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const insertListeningHistorySchema = createInsertSchema(listeningHistory);
export const insertExploredRegionSchema = createInsertSchema(exploredRegions);
export const insertMusicEventSchema = createInsertSchema(musicEvents);
export const insertAiDjSessionSchema = createInsertSchema(aiDjSessions);
