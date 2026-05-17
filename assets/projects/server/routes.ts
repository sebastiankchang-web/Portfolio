import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { withSpotify, spotifyService } from "./spotify";
import express from "express";
import { z } from "zod";
import { insertListeningHistorySchema, insertExploredRegionSchema } from "@shared/schema";
import cron from "node-cron";

// Using sample data instead of database interactions for demo
function setupDailyChallenge() {
  console.log("Demo mode - using static sample data instead of creating a challenge");
  return Promise.resolve();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // DEMO MODE: Using sample data for all routes instead of database queries
  console.log("Initializing Soundora app in DEMO MODE with sample data");
  
  // ===== SAMPLE DATA FOR DEMO =====
  // Sample genres data
  const sampleGenres = [
    {
      id: 1,
      name: "Afrobeat",
      description: "A combination of West African musical styles with American funk and jazz influences.",
      color: "#FF9500",
      imageUrl: "https://images.unsplash.com/photo-1619037108877-55082f60e8ab?w=500&q=80",
      region: "West Africa",
      cultural_context: "Afrobeat emerged in the 1960s-70s, pioneered by Fela Kuti in Nigeria, combining traditional Yoruba music with American jazz and funk."
    },
    {
      id: 2,
      name: "K-Pop",
      description: "Korean popular music characterized by a wide variety of audiovisual elements.",
      color: "#FF2D55",
      imageUrl: "https://images.unsplash.com/photo-1619035101707-6d3f21167f9a?w=500&q=80",
      region: "East Asia",
      cultural_context: "K-Pop is a modern global phenomenon that showcases Korean culture through highly produced music, choreography, and fashion."
    },
    {
      id: 3,
      name: "Flamenco",
      description: "A form of Spanish folk music that originated in Andalusia in the south of Spain.",
      color: "#FF3B30",
      imageUrl: "https://images.unsplash.com/photo-1519792351846-8f272ec3511b?w=500&q=80",
      region: "Southern Europe",
      cultural_context: "Flamenco evolved from the diverse cultures of Andalusia, with influences from Moorish, Jewish, and Roma traditions."
    },
    {
      id: 4,
      name: "Reggaeton",
      description: "A music style that blends reggae and Latin American rhythms.",
      color: "#5AC8FA",
      imageUrl: "https://images.unsplash.com/photo-1563218819-44da7d088078?w=500&q=80",
      region: "Caribbean",
      cultural_context: "Reggaeton originated in Puerto Rico in the 1990s, mixing Jamaican reggae and dancehall with Latin American sounds and Spanish rapping."
    },
    {
      id: 5,
      name: "Bollywood",
      description: "The music of Hindi films from India, characterized by its melodious and rhythmic qualities.",
      color: "#4CD964",
      imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80",
      region: "South Asia",
      cultural_context: "Bollywood music is integral to Indian cinema, blending traditional Indian classical music with global influences and elaborate dance numbers."
    }
  ];
  
  // Sample daily challenge
  const sampleChallenge = {
    id: 1,
    title: "Afrobeat Challenge",
    description: "Discover the energetic rhythms of Afrobeat music and learn about its cultural significance.",
    genreId: 1,
    date: new Date(),
    playlistUri: "spotify:playlist:37i9dQZF1DWYkaDif7Ztbp",
    createdAt: new Date(),
    cultural_insight: "Afrobeat emerged in the 1960s-70s, pioneered by Fela Kuti in Nigeria, combining traditional Yoruba music with American jazz and funk.",
    genre: sampleGenres[0]
  };
  
  // Sample music events
  const sampleEvents = [
    {
      id: 1,
      name: "Global Rhythms Festival",
      description: "A 3-day celebration of music from around the world featuring artists from over 20 countries.",
      location: "New York, NY",
      venue: "Central Park",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      eventGenres: ["Afrobeat", "Latin", "Reggae", "World"],
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format",
      ticketUrl: "https://example.com/tickets/global-rhythms",
      latitude: 40.7812,
      longitude: -73.9665
    },
    {
      id: 2,
      name: "K-Pop Night",
      description: "An evening dedicated to the biggest K-Pop hits with dance competitions and Korean food.",
      location: "Los Angeles, CA",
      venue: "The Wiltern",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      eventGenres: ["K-Pop"],
      imageUrl: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=600&auto=format",
      ticketUrl: "https://example.com/tickets/kpop-night",
      latitude: 34.0623,
      longitude: -118.3093
    },
    {
      id: 3,
      name: "Flamenco Fusion",
      description: "Traditional flamenco dancers and musicians blend with modern interpretations.",
      location: "Miami, FL",
      venue: "Adrienne Arsht Center",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      eventGenres: ["Flamenco", "Fusion"],
      imageUrl: "https://images.unsplash.com/photo-1564528183203-ec84690e06a8?w=600&auto=format",
      ticketUrl: "https://example.com/tickets/flamenco-fusion",
      latitude: 25.7876,
      longitude: -80.1896
    },
    {
      id: 4,
      name: "Bollywood Dance Party",
      description: "Dance the night away to the biggest Bollywood hits with professional dance instructors.",
      location: "Chicago, IL",
      venue: "Navy Pier",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      eventGenres: ["Bollywood", "Dance"],
      imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format",
      ticketUrl: "https://example.com/tickets/bollywood-dance",
      latitude: 41.8919,
      longitude: -87.6089
    },
    {
      id: 5,
      name: "Reggaeton Summer Bash",
      description: "The hottest reggaeton artists perform live at this summer beach party.",
      location: "San Diego, CA",
      venue: "Waterfront Park",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      eventGenres: ["Reggaeton", "Latin"],
      imageUrl: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=600&auto=format",
      ticketUrl: "https://example.com/tickets/reggaeton-bash",
      latitude: 32.7174,
      longitude: -117.1628
    }
  ];
  
  // DEMO ROUTE HANDLERS - Using sample data instead of database queries
  
  // Auth route - no authentication required for this sample app
  app.get('/api/auth/user', (req, res) => {
    // Sample user data for demonstration
    const sampleUser = {
      id: "sample-user-123",
      email: "user@soundora.com",
      firstName: "Alex",
      lastName: "Johnson",
      profileImageUrl: "https://randomuser.me/api/portraits/men/36.jpg",
      score: 1250,
      streak: 14,
      lastPlayed: new Date(),
      spotifyConnected: true,
      spotifyId: "sample-spotify-id",
      preferred_genres: ["Afrobeat", "K-Pop", "Flamenco"],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.json(sampleUser);
  });
  
  // Genres routes
  app.get('/api/genres', (req, res) => {
    return res.json(sampleGenres);
  });
  
  app.get('/api/genres/:id', (req, res) => {
    const genreId = parseInt(req.params.id);
    const genre = sampleGenres.find(g => g.id === genreId);
    
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    
    return res.json(genre);
  });
  
  // Daily challenge route
  app.get('/api/challenges/daily', (req, res) => {
    return res.json(sampleChallenge);
  });
  
  // Events routes
  app.get('/api/events', (req, res) => {
    // Handle nearby events request
    if (req.query.nearby === 'true') {
      return res.json(sampleEvents);
    }
    
    // If location is provided, filter events
    const location = req.query.location as string;
    if (location) {
      const filteredEvents = sampleEvents.filter(event => 
        event.location.toLowerCase().includes(location.toLowerCase())
      );
      return res.json(filteredEvents);
    }
    
    return res.json(sampleEvents);
  });
  
  // Leaderboard route
  app.get('/api/leaderboard', (req, res) => {
    const sampleLeaderboard = [
      {
        id: "sample-user-123",
        firstName: "Alex", 
        lastName: "Johnson",
        email: "user@soundora.com",
        profileImageUrl: "https://randomuser.me/api/portraits/men/36.jpg",
        score: 1250,
        streak: 14
      },
      {
        id: "user-456",
        firstName: "Taylor",
        lastName: "Smith",
        email: "taylor@example.com",
        profileImageUrl: "https://i.pravatar.cc/150?img=33",
        score: 980,
        streak: 7
      },
      {
        id: "user-789",
        firstName: "Jordan",
        lastName: "Lee",
        email: "jordan@example.com", 
        profileImageUrl: "https://i.pravatar.cc/150?img=40",
        score: 1100,
        streak: 12
      }
    ];
    
    return res.json(sampleLeaderboard);
  });
  
  // DJ and Music Recommendations routes
  app.get('/api/recommendations', (req, res) => {
    // Sample music recommendations with cultural context
    const sampleRecommendations = [
      {
        id: "spotify:track:6habFhsOp2NvshLv26DqMb",
        name: "Essence",
        artist: "WizKid ft. Tems",
        uri: "spotify:track:6habFhsOp2NvshLv26DqMb",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b2739abdf14e6058bd3213df0092",
        popularity: 85,
        culturalContext: "Nigerian afrobeats blending traditional West African rhythms with contemporary R&B influences.",
        similar: ["Amapiano", "West African Highlife"],
        regionOfOrigin: "West Africa"
      },
      {
        id: "spotify:track:4y3OI86AEP6PQoDE6olYhO",
        name: "Dynamite",
        artist: "BTS",
        uri: "spotify:track:4y3OI86AEP6PQoDE6olYhO",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b273a9ae5c19b4bde92a02e7d414",
        popularity: 95,
        culturalContext: "Korean pop music characterized by highly produced visuals, choreography, and musical influences from across genres.",
        similar: ["J-Pop", "Mandopop"],
        regionOfOrigin: "East Asia"
      },
      {
        id: "spotify:track:7ytR5pFWmSjzHJIeQkgog4",
        name: "DÁKITI",
        artist: "Bad Bunny & Jhay Cortez",
        uri: "spotify:track:7ytR5pFWmSjzHJIeQkgog4",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b273bd69dea3be3a0fdbcc37a46a",
        popularity: 90,
        culturalContext: "Puerto Rican reggaeton with Latin trap influences and Caribbean musical traditions.",
        similar: ["Latin Urban", "Dembow"],
        regionOfOrigin: "Caribbean"
      },
      {
        id: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
        name: "Blinding Lights",
        artist: "The Weeknd",
        uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        popularity: 97,
        culturalContext: "North American pop/R&B with 1980s synthwave influences, showing how Western music often borrows from retro eras.",
        similar: ["Synthwave", "Alt R&B"],
        regionOfOrigin: "North America"
      },
      {
        id: "spotify:track:3Wrjm47oTz2sjIgck11l5e",
        name: "Tum Hi Ho",
        artist: "Arijit Singh",
        uri: "spotify:track:3Wrjm47oTz2sjIgck11l5e",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b2736cb0b8d66be640657c029fa2",
        popularity: 83,
        culturalContext: "Modern Bollywood ballad featuring classical Indian vocal techniques and orchestration blending with contemporary production.",
        similar: ["Ghazal", "Qawwali"],
        regionOfOrigin: "South Asia"
      }
    ];
    
    return res.json(sampleRecommendations);
  });
  
  app.post('/api/dj/session', (req, res) => {
    // Create sample DJ session
    const sampleDjSession = {
      id: 1,
      userId: "sample-user-123",
      sessionName: "Cultural Exploration Mix",
      prompt: req.body.prompt || "Create a global music journey through different cultures",
      genres: req.body.genres || ["Afrobeat", "K-Pop", "Flamenco"],
      regions: req.body.regions || ["West Africa", "East Asia", "Southern Europe"],
      createdAt: new Date().toISOString(),
      lastPlayed: new Date().toISOString()
    };
    
    return res.json({ session: sampleDjSession });
  });
  
  app.get('/api/dj/sessions', (req, res) => {
    // Sample DJ sessions list
    const sampleDjSessions = [
      {
        id: 1,
        userId: "sample-user-123",
        sessionName: "Cultural Exploration Mix",
        prompt: "Create a global music journey through different cultures",
        genres: ["Afrobeat", "K-Pop", "Flamenco"],
        regions: ["West Africa", "East Asia", "Southern Europe"],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastPlayed: new Date().toISOString()
      },
      {
        id: 2,
        userId: "sample-user-123",
        sessionName: "Latin Vibes",
        prompt: "Discover the best Latin music from different regions",
        genres: ["Reggaeton", "Salsa", "Bachata"],
        regions: ["Caribbean", "South America"],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        userId: "sample-user-123",
        sessionName: "Asian Music Discovery",
        prompt: "Explore traditional and modern Asian music",
        genres: ["K-Pop", "J-Pop", "Bollywood"],
        regions: ["East Asia", "South Asia"],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastPlayed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return res.json(sampleDjSessions);
  });
  
  app.get('/api/dj/sessions/:id/recommendations', (req, res) => {
    // Sample recommendations for a DJ session
    const sampleRecommendations = [
      {
        id: "spotify:track:6habFhsOp2NvshLv26DqMb",
        name: "Essence",
        artist: "WizKid ft. Tems",
        uri: "spotify:track:6habFhsOp2NvshLv26DqMb",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b2739abdf14e6058bd3213df0092",
        popularity: 85,
        culturalContext: "Nigerian afrobeats blending traditional West African rhythms with contemporary R&B influences.",
        similar: ["Amapiano", "West African Highlife"],
        regionOfOrigin: "West Africa"
      },
      {
        id: "spotify:track:4y3OI86AEP6PQoDE6olYhO",
        name: "Dynamite",
        artist: "BTS",
        uri: "spotify:track:4y3OI86AEP6PQoDE6olYhO",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b273a9ae5c19b4bde92a02e7d414",
        popularity: 95,
        culturalContext: "Korean pop music characterized by highly produced visuals, choreography, and musical influences from across genres.",
        similar: ["J-Pop", "Mandopop"],
        regionOfOrigin: "East Asia"
      },
      {
        id: "spotify:track:1W4deeYq3aK7wOB5JJWj8z",
        name: "Entre Dos Tierras",
        artist: "Héroes del Silencio",
        uri: "spotify:track:1W4deeYq3aK7wOB5JJWj8z",
        albumUrl: "https://i.scdn.co/image/ab67616d0000b2733e77ace3df29c6d75e7a9d58",
        popularity: 76,
        culturalContext: "Spanish rock with flamenco influences, showcasing the fusion of traditional Spanish music with modern rock elements.",
        similar: ["Flamenco Fusion", "Spanish Folk Rock"],
        regionOfOrigin: "Southern Europe"
      }
    ];
    
    return res.json({ recommendations: sampleRecommendations });
  });
  
  // Achievements routes
  app.get('/api/achievements', (req, res) => {
    // Sample achievements data
    const sampleAchievements = [
      {
        id: 1,
        name: "Global Explorer",
        description: "Listen to music from 5 different regions",
        points: 100,
        imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=300&q=80",
        completed: true
      },
      {
        id: 2,
        name: "Cultural Enthusiast",
        description: "Complete 10 daily genre challenges",
        points: 200,
        imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&q=80",
        completed: true
      },
      {
        id: 3,
        name: "Music Marathon",
        description: "Maintain a 7-day listening streak",
        points: 150,
        imageUrl: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?w=300&q=80",
        completed: true
      },
      {
        id: 4,
        name: "Genre Connoisseur",
        description: "Listen to 20 different musical genres",
        points: 300,
        imageUrl: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=300&q=80",
        completed: false
      },
      {
        id: 5,
        name: "Event Explorer",
        description: "Attend a global music event",
        points: 250,
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=80",
        completed: false
      }
    ];
    
    return res.json(sampleAchievements);
  });

  // Explored regions routes
  app.get('/api/explored-regions', (req, res) => {
    // Sample explored regions data
    const sampleExploredRegions = [
      {
        id: 1,
        name: "West Africa",
        description: "Home to Afrobeat, Highlife, and other vibrant musical traditions",
        image_url: "https://images.unsplash.com/photo-1535912267867-3cab85593546?w=400&q=80",
        explored_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "sample-user-123"
      },
      {
        id: 2,
        name: "East Asia",
        description: "Birthplace of K-Pop, J-Pop, and traditional East Asian musical forms",
        image_url: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&q=80",
        explored_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "sample-user-123"
      },
      {
        id: 3,
        name: "Caribbean",
        description: "Known for Reggae, Reggaeton, Calypso, and other influential genres",
        image_url: "https://images.unsplash.com/photo-1580541631731-54e7c2a09d6c?w=400&q=80",
        explored_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "sample-user-123"
      }
    ];
    
    return res.json(sampleExploredRegions);
  });
  
  // Simplified Spotify auth routes for demo
  app.get('/api/spotify/login', (req, res) => {
    // In demo mode, we return a mock auth URL
    const mockAuthUrl = "https://accounts.spotify.com/authorize?demo=true";
    console.log('Demo mode - Returning mock Spotify auth URL');
    res.json({ authUrl: mockAuthUrl });
  });
  
  // Simplified auth URL endpoint for demo
  app.get('/api/spotify/auth-url', (req, res) => {
    // Return a mock URL for demo purposes
    const mockAuthUrl = "https://accounts.spotify.com/authorize?demo=true";
    console.log("Demo mode - Returning mock Spotify auth URL");
    return res.json({ url: mockAuthUrl });
  });
  
  app.get('/api/spotify/callback', (req, res) => {
    // In demo mode, we simulate a successful Spotify connection
    console.log('Demo mode - Simulating successful Spotify connection');
    
    // Redirect back to the app with success parameter
    res.redirect('/?spotify=connected');
  });
  
  // Genre routes
  app.get('/api/genres', async (req, res) => {
    try {
      // Return sample genre data instead of querying database
      const sampleGenres = [
        {
          id: 1,
          name: "Afrobeat",
          description: "A combination of West African musical styles with American funk and jazz influences.",
          color: "#FF9500",
          imageUrl: "https://images.unsplash.com/photo-1619037108877-55082f60e8ab?w=500&q=80",
          region: "West Africa",
          cultural_context: "Afrobeat emerged in the 1960s-70s, pioneered by Fela Kuti in Nigeria, combining traditional Yoruba music with American jazz and funk."
        },
        {
          id: 2,
          name: "K-Pop",
          description: "Korean popular music characterized by a wide variety of audiovisual elements.",
          color: "#FF2D55",
          imageUrl: "https://images.unsplash.com/photo-1619035101707-6d3f21167f9a?w=500&q=80",
          region: "East Asia",
          cultural_context: "K-Pop is a modern global phenomenon that showcases Korean culture through highly produced music, choreography, and fashion."
        },
        {
          id: 3,
          name: "Flamenco",
          description: "A form of Spanish folk music that originated in Andalusia in the south of Spain.",
          color: "#FF3B30",
          imageUrl: "https://images.unsplash.com/photo-1519792351846-8f272ec3511b?w=500&q=80",
          region: "Southern Europe",
          cultural_context: "Flamenco evolved from the diverse cultures of Andalusia, with influences from Moorish, Jewish, and Roma traditions."
        },
        {
          id: 4,
          name: "Reggaeton",
          description: "A music style that blends reggae and Latin American rhythms.",
          color: "#5AC8FA",
          imageUrl: "https://images.unsplash.com/photo-1563218819-44da7d088078?w=500&q=80",
          region: "Caribbean",
          cultural_context: "Reggaeton originated in Puerto Rico in the 1990s, mixing Jamaican reggae and dancehall with Latin American sounds and Spanish rapping."
        },
        {
          id: 5,
          name: "Bollywood",
          description: "The music of Hindi films from India, characterized by its melodious and rhythmic qualities.",
          color: "#4CD964",
          imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80",
          region: "South Asia",
          cultural_context: "Bollywood music is integral to Indian cinema, blending traditional Indian classical music with global influences and elaborate dance numbers."
        }
      ];
      
      res.json(sampleGenres);
    } catch (error) {
      console.error("Error creating sample genres:", error);
      res.status(500).json({ message: "Failed to create sample genres" });
    }
  });
  
  app.get('/api/genres/:id', async (req, res) => {
    try {
      // Sample genres with the same data as the /api/genres endpoint
      const sampleGenres = [
        {
          id: 1,
          name: "Afrobeat",
          description: "A combination of West African musical styles with American funk and jazz influences.",
          color: "#FF9500",
          imageUrl: "https://images.unsplash.com/photo-1619037108877-55082f60e8ab?w=500&q=80",
          region: "West Africa",
          cultural_context: "Afrobeat emerged in the 1960s-70s, pioneered by Fela Kuti in Nigeria, combining traditional Yoruba music with American jazz and funk."
        },
        {
          id: 2,
          name: "K-Pop",
          description: "Korean popular music characterized by a wide variety of audiovisual elements.",
          color: "#FF2D55",
          imageUrl: "https://images.unsplash.com/photo-1619035101707-6d3f21167f9a?w=500&q=80",
          region: "East Asia",
          cultural_context: "K-Pop is a modern global phenomenon that showcases Korean culture through highly produced music, choreography, and fashion."
        },
        {
          id: 3,
          name: "Flamenco",
          description: "A form of Spanish folk music that originated in Andalusia in the south of Spain.",
          color: "#FF3B30",
          imageUrl: "https://images.unsplash.com/photo-1519792351846-8f272ec3511b?w=500&q=80",
          region: "Southern Europe",
          cultural_context: "Flamenco evolved from the diverse cultures of Andalusia, with influences from Moorish, Jewish, and Roma traditions."
        },
        {
          id: 4,
          name: "Reggaeton",
          description: "A music style that blends reggae and Latin American rhythms.",
          color: "#5AC8FA",
          imageUrl: "https://images.unsplash.com/photo-1563218819-44da7d088078?w=500&q=80",
          region: "Caribbean",
          cultural_context: "Reggaeton originated in Puerto Rico in the 1990s, mixing Jamaican reggae and dancehall with Latin American sounds and Spanish rapping."
        },
        {
          id: 5,
          name: "Bollywood",
          description: "The music of Hindi films from India, characterized by its melodious and rhythmic qualities.",
          color: "#4CD964",
          imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80",
          region: "South Asia",
          cultural_context: "Bollywood music is integral to Indian cinema, blending traditional Indian classical music with global influences and elaborate dance numbers."
        }
      ];
      
      // Find the genre with the matching ID
      const genreId = parseInt(req.params.id);
      const genre = sampleGenres.find(g => g.id === genreId);
      
      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }
      
      res.json(genre);
    } catch (error) {
      console.error("Error providing sample genre:", error);
      res.status(500).json({ message: "Failed to fetch genre" });
    }
  });
  
  // Challenge routes
  app.get('/api/challenges/daily', (req, res) => {
    // Create a sample daily challenge with genre information
    const sampleChallenge = {
      id: 1,
      title: "Afrobeat Challenge",
      description: "Discover the energetic rhythms of Afrobeat music and learn about its cultural significance.",
      genreId: 1,
      date: new Date(),
      playlistUri: "spotify:playlist:37i9dQZF1DWYkaDif7Ztbp",
      createdAt: new Date(),
      cultural_insight: "Afrobeat emerged in the 1960s-70s, pioneered by Fela Kuti in Nigeria, combining traditional Yoruba music with American jazz and funk.",
      genre: {
        id: 1,
        name: "Afrobeat",
        description: "A combination of West African musical styles with American funk and jazz influences.",
        color: "#FF9500",
        imageUrl: "https://images.unsplash.com/photo-1619037108877-55082f60e8ab?w=500&q=80",
        region: "West Africa"
      }
    };
    
    res.json(sampleChallenge);
  });
  
  // Achievements routes
  app.get('/api/achievements', async (req, res) => {
    try {
      // Sample achievement data
      const sampleAchievements = [
        {
          id: 1,
          name: "Global Explorer",
          description: "Discover music from 5 different regions",
          icon: "🌍",
          requiredScore: 100,
          createdAt: new Date()
        },
        {
          id: 2,
          name: "Rhythm Enthusiast",
          description: "Listen to 10 different genres",
          icon: "🎵",
          requiredScore: 200,
          createdAt: new Date()
        },
        {
          id: 3,
          name: "Melody Master",
          description: "Complete 7 daily challenges in a row",
          icon: "🏆",
          requiredStreak: 7,
          createdAt: new Date()
        },
        {
          id: 4,
          name: "Cultural Connoisseur",
          description: "Learn about cultural context of 15 different tracks",
          icon: "📚",
          requiredScore: 300,
          createdAt: new Date()
        },
        {
          id: 5,
          name: "Festival Fanatic",
          description: "Attend 3 global music events",
          icon: "🎪",
          requiredScore: 500,
          createdAt: new Date()
        }
      ];
      
      res.json(sampleAchievements);
    } catch (error) {
      console.error("Error creating sample achievements:", error);
      res.status(500).json({ message: "Failed to create sample achievements" });
    }
  });
  
  app.get('/api/users/:userId/achievements', async (req, res) => {
    try {
      // Sample user achievements with completion status
      const sampleUserAchievements = [
        {
          id: 1,
          name: "Global Explorer",
          description: "Discover music from 5 different regions",
          icon: "🌍",
          requiredScore: 100,
          completed: true,
          completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdAt: new Date()
        },
        {
          id: 2,
          name: "Rhythm Enthusiast",
          description: "Listen to 10 different genres",
          icon: "🎵",
          requiredScore: 200,
          completed: true,
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date()
        },
        {
          id: 3,
          name: "Melody Master",
          description: "Complete 7 daily challenges in a row",
          icon: "🏆",
          requiredStreak: 7,
          completed: false,
          createdAt: new Date()
        },
        {
          id: 4,
          name: "Cultural Connoisseur",
          description: "Learn about cultural context of 15 different tracks",
          icon: "📚",
          requiredScore: 300,
          completed: false,
          createdAt: new Date()
        },
        {
          id: 5,
          name: "Festival Fanatic",
          description: "Attend 3 global music events",
          icon: "🎪",
          requiredScore: 500,
          completed: false,
          createdAt: new Date()
        }
      ];
      
      res.json(sampleUserAchievements);
    } catch (error) {
      console.error("Error creating sample user achievements:", error);
      res.status(500).json({ message: "Failed to create sample user achievements" });
    }
  });
  
  // Listening history routes
  // Music events routes
  app.get('/api/events', async (req, res) => {
    try {
      // Sample music events data
      const sampleEvents = [
        {
          id: 1,
          name: "Global Rhythms Festival",
          description: "A 3-day celebration of music from around the world featuring artists from over 20 countries.",
          location: "New York, NY",
          venue: "Central Park",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          eventGenres: ["Afrobeat", "Latin", "Reggae", "World"],
          imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format",
          ticketUrl: "https://example.com/tickets/global-rhythms",
          latitude: 40.7812,
          longitude: -73.9665
        },
        {
          id: 2,
          name: "K-Pop Night",
          description: "An evening dedicated to the biggest K-Pop hits with dance competitions and Korean food.",
          location: "Los Angeles, CA",
          venue: "The Wiltern",
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          eventGenres: ["K-Pop"],
          imageUrl: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=600&auto=format",
          ticketUrl: "https://example.com/tickets/kpop-night",
          latitude: 34.0623,
          longitude: -118.3093
        },
        {
          id: 3,
          name: "Flamenco Fusion",
          description: "Traditional flamenco dancers and musicians blend with modern interpretations.",
          location: "Miami, FL",
          venue: "Adrienne Arsht Center",
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          eventGenres: ["Flamenco", "Fusion"],
          imageUrl: "https://images.unsplash.com/photo-1564528183203-ec84690e06a8?w=600&auto=format",
          ticketUrl: "https://example.com/tickets/flamenco-fusion",
          latitude: 25.7876,
          longitude: -80.1896
        },
        {
          id: 4,
          name: "Bollywood Dance Party",
          description: "Dance the night away to the biggest Bollywood hits with professional dance instructors.",
          location: "Chicago, IL",
          venue: "Navy Pier",
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          eventGenres: ["Bollywood", "Dance"],
          imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format",
          ticketUrl: "https://example.com/tickets/bollywood-dance",
          latitude: 41.8919,
          longitude: -87.6089
        },
        {
          id: 5,
          name: "Reggaeton Summer Bash",
          description: "The hottest reggaeton artists perform live at this summer beach party.",
          location: "San Diego, CA",
          venue: "Waterfront Park",
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          eventGenres: ["Reggaeton", "Latin"],
          imageUrl: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=600&auto=format",
          ticketUrl: "https://example.com/tickets/reggaeton-bash",
          latitude: 32.7174,
          longitude: -117.1628
        }
      ];
      
      // Handle nearby events request
      if (req.query.nearby === 'true') {
        // For demo purposes, just return all events when nearby is requested
        return res.json(sampleEvents);
      }
      
      // If location is provided, filter events
      const location = req.query.location as string;
      if (location) {
        const filteredEvents = sampleEvents.filter(event => 
          event.location.toLowerCase().includes(location.toLowerCase())
        );
        return res.json(filteredEvents);
      }
      
      res.json(sampleEvents);
    } catch (error) {
      console.error("Error creating sample music events:", error);
      res.status(500).json({ message: "Failed to fetch music events" });
    }
  });
  
  app.post('/api/users/:userId/listening', isAuthenticated, async (req: any, res) => {
    try {
      // Ensure the user can only add their own listening history
      if (req.user.claims.sub !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const payload = insertListeningHistorySchema.parse(req.body);
      const history = await storage.addListeningHistory({
        ...payload,
        userId: req.params.userId,
      });
      
      // Update user streak when they listen
      await storage.updateUserStreak(req.params.userId);
      
      res.json(history);
    } catch (error) {
      console.error("Error adding listening history:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add listening history" });
    }
  });
  
  // Explored regions routes
  app.post('/api/users/:userId/regions', isAuthenticated, async (req: any, res) => {
    try {
      // Ensure the user can only add their own explored regions
      if (req.user.claims.sub !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const payload = insertExploredRegionSchema.parse(req.body);
      const region = await storage.addExploredRegion({
        ...payload,
        userId: req.params.userId,
      });
      
      res.json(region);
    } catch (error) {
      console.error("Error adding explored region:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add explored region" });
    }
  });
  
  app.get('/api/users/:userId/regions', isAuthenticated, async (req: any, res) => {
    try {
      // Ensure the user can only access their own explored regions
      if (req.user.claims.sub !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const regions = await storage.getUserExploredRegions(req.params.userId);
      res.json(regions);
    } catch (error) {
      console.error("Error fetching user explored regions:", error);
      res.status(500).json({ message: "Failed to fetch user explored regions" });
    }
  });
  
  // User profile routes
  app.patch('/api/users/:userId/profile', async (req, res) => {
    try {
      const { firstName, profileImageUrl } = req.body;
      
      // Return updated sample user with the changes applied
      const updatedUser = {
        id: "sample-user-123",
        firstName: firstName || "Alex",
        lastName: "Johnson",
        email: "user@soundora.com",
        profileImageUrl: profileImageUrl || "https://randomuser.me/api/portraits/men/36.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        score: 1250,
        streak: 14,
        spotifyConnected: true
      };
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Leaderboard route
  // Remove isAuthenticated middleware from all routes to allow viewing without login
  
  app.get('/api/leaderboard', async (req, res) => {
    try {
      // Create sample leaderboard data
      const sampleLeaderboard = [
        {
          id: "sample-user-123",
          firstName: "Alex",
          lastName: "Johnson",
          email: "user@soundora.com",
          profileImageUrl: "https://randomuser.me/api/portraits/men/36.jpg",
          score: 1250,
          streak: 14
        },
        {
          id: "user-456",
          firstName: "Taylor",
          lastName: "Smith",
          email: "taylor@example.com",
          profileImageUrl: "https://i.pravatar.cc/150?img=33",
          score: 980,
          streak: 7
        },
        {
          id: "user-789",
          firstName: "Jordan",
          lastName: "Lee",
          email: "jordan@example.com",
          profileImageUrl: "https://i.pravatar.cc/150?img=67",
          score: 870,
          streak: 10
        },
        {
          id: "user-101",
          firstName: "Jamie",
          lastName: "Garcia",
          email: "jamie@example.com",
          profileImageUrl: "https://i.pravatar.cc/150?img=48",
          score: 760,
          streak: 5
        },
        {
          id: "user-102",
          firstName: "Riley",
          lastName: "Chen",
          email: "riley@example.com",
          profileImageUrl: "https://i.pravatar.cc/150?img=41",
          score: 720,
          streak: 3
        }
      ];
      
      res.json(sampleLeaderboard);
    } catch (error) {
      console.error("Error creating leaderboard data:", error);
      res.status(500).json({ message: "Failed to create leaderboard data" });
    }
  });
  
  // Spotify auth routes
  app.get('/api/spotify/login', (req, res) => {
    try {
      const authUrl = spotifyService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating Spotify auth URL:", error);
      res.status(500).json({ message: "Failed to generate Spotify login URL" });
    }
  });

  app.get('/api/spotify/callback', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: "Missing authorization code" });
      }
      
      // Handle the callback from Spotify
      const authData = await spotifyService.handleCallback(code);
      
      // If user is authenticated, store their Spotify info
      if (req.isAuthenticated() && req.user) {
        const userId = (req.user as any).claims.sub;
        
        // Store tokens for future API calls
        spotifyService.storeUserTokens(
          userId,
          authData.accessToken,
          authData.refreshToken,
          authData.expiresIn
        );
        
        // Update user profile with Spotify data
        await storage.updateUserPreferences(userId, {
          spotifyId: authData.user.id,
          spotifyConnected: true,
          updatedAt: new Date()
        });
      }
      
      // Redirect back to app
      res.redirect('/');
    } catch (error) {
      console.error("Error processing Spotify callback:", error);
      res.status(500).json({ message: "Failed to complete Spotify authentication" });
    }
  });
  
  // User-specific Spotify endpoints - requires authentication
  app.get('/api/spotify/user/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const api = await spotifyService.getUserApi(userId);
      
      if (!api) {
        return res.status(401).json({ message: "Spotify connection expired, please reconnect" });
      }
      
      const profile = await api.getMe();
      res.json(profile.body);
    } catch (error) {
      console.error("Error fetching Spotify profile:", error);
      res.status(500).json({ message: "Failed to fetch Spotify profile" });
    }
  });
  
  app.get('/api/spotify/user/top-tracks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const api = await spotifyService.getUserApi(userId);
      
      if (!api) {
        return res.status(401).json({ message: "Spotify connection expired, please reconnect" });
      }
      
      const timeRange = req.query.time_range || 'medium_term';
      const limit = parseInt(req.query.limit as string) || 20;
      
      const topTracks = await api.getMyTopTracks({
        time_range: timeRange as 'short_term' | 'medium_term' | 'long_term',
        limit
      });
      
      res.json(topTracks.body);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      res.status(500).json({ message: "Failed to fetch top tracks" });
    }
  });
  
  app.get('/api/spotify/user/top-artists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const api = await spotifyService.getUserApi(userId);
      
      if (!api) {
        return res.status(401).json({ message: "Spotify connection expired, please reconnect" });
      }
      
      const timeRange = req.query.time_range || 'medium_term';
      const limit = parseInt(req.query.limit as string) || 20;
      
      const topArtists = await api.getMyTopArtists({
        time_range: timeRange as 'short_term' | 'medium_term' | 'long_term',
        limit
      });
      
      res.json(topArtists.body);
    } catch (error) {
      console.error("Error fetching top artists:", error);
      res.status(500).json({ message: "Failed to fetch top artists" });
    }
  });
  
  app.get('/api/spotify/user/recommendations', async (req, res) => {
    try {
      // Create sample recommendations based on the genres/regions in the query
      const genres = req.query.genres ? 
        (Array.isArray(req.query.genres) ? req.query.genres : [req.query.genres]) : 
        ['afrobeat']; // Default genre if none provided
      
      // Get region from query or default to West Africa
      const region = req.query.region || 'West Africa';
      
      // Create sample recommendations
      const sampleRecommendations = {
        tracks: [
          {
            id: "track1",
            name: "Ye",
            artist: "Burna Boy",
            uri: "spotify:track:6Z1WLLdYQWK6DlNYLgiaFl",
            albumUrl: "https://i.scdn.co/image/ab67616d0000b27358704f1cebbccd3520578eb1",
            popularity: 75,
            culturalContext: "A fusion of afrobeat, dancehall, and pop music from Nigeria",
            regionOfOrigin: "West Africa"
          },
          {
            id: "track2",
            name: "Essence",
            artist: "WizKid ft. Tems",
            uri: "spotify:track:5uY89D6NmT3MwfuuFTXFmx",
            albumUrl: "https://i.scdn.co/image/ab67616d0000b273c0e7bf5cdd630f314f20586a",
            popularity: 80,
            culturalContext: "Nigerian afrobeats ballad that gained international popularity",
            regionOfOrigin: "West Africa"
          },
          {
            id: "track3",
            name: "Jerusalema",
            artist: "Master KG ft. Nomcebo",
            uri: "spotify:track:2MlOUXmcofMackX3bxfSwi",
            albumUrl: "https://i.scdn.co/image/ab67616d0000b273dca9bafbc12412959feb39c7",
            popularity: 85,
            culturalContext: "South African house music with spiritual lyrics in Zulu",
            regionOfOrigin: "Southern Africa"
          },
          {
            id: "track4", 
            name: "Joha",
            artist: "Asake",
            uri: "spotify:track:4TlVDevNpKDXuUBoe7xYGN",
            albumUrl: "https://i.scdn.co/image/ab67616d0000b273dfd9c1ce2c575594fcc3129a",
            popularity: 70,
            culturalContext: "Contemporary afrobeats with traditional Yoruba influences",
            regionOfOrigin: "West Africa"
          },
          {
            id: "track5",
            name: "Calm Down",
            artist: "Rema",
            uri: "spotify:track:0SuG9kyzGRpDqrGUBpbf5t",
            albumUrl: "https://i.scdn.co/image/ab67616d0000b273bdf7f56dbc23735c5d342eb0",
            popularity: 90,
            culturalContext: "Modern afrobeats from Nigeria's new generation of artists",
            regionOfOrigin: "West Africa"
          }
        ],
        seeds: genres.map(genre => ({ id: genre, type: "GENRE" }))
      };
      
      res.json(sampleRecommendations);
    } catch (error) {
      console.error("Error creating sample recommendations:", error);
      res.status(500).json({ message: "Failed to create recommendations" });
    }
  });

  // Standard Spotify API proxy endpoints
  app.get('/api/spotify/recommendations/:genre', async (req, res) => {
    try {
      const recommendations = await spotifyService.getRecommendationsByGenre(
        req.params.genre,
        parseInt(req.query.limit as string) || 10
      );
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching Spotify recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });
  
  app.get('/api/spotify/genres', async (req, res) => {
    try {
      const genres = await spotifyService.getGenreSeeds();
      res.json(genres);
    } catch (error) {
      console.error("Error fetching Spotify genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });
  
  app.get('/api/spotify/playlist/:id', async (req, res) => {
    try {
      const playlist = await spotifyService.getPlaylist(req.params.id);
      res.json(playlist);
    } catch (error) {
      console.error("Error fetching Spotify playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });
  
  app.get('/api/spotify/track/:id', async (req, res) => {
    try {
      const track = await spotifyService.getTrack(req.params.id);
      res.json(track);
    } catch (error) {
      console.error("Error fetching Spotify track:", error);
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
