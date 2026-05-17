import { MemStorage } from "./storage";
import { User, Trip, Post, Achievement, Voucher, Hotel, Destination, UserStats } from "@shared/schema";

// This file contains mock data to initialize the in-memory storage
export function initializeStorage(storage: MemStorage) {
  // Sample users
  const users: User[] = [
    {
      id: "user1",
      username: "alexmorgan",
      email: "alex@example.com",
      firstName: "Alex",
      lastName: "Morgan",
      profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15")
    },
    {
      id: "user2",
      username: "sarahchen",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Chen",
      profileImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2023-02-20")
    },
    {
      id: "user3",
      username: "marcusjohnson",
      email: "marcus@example.com",
      firstName: "Marcus",
      lastName: "Johnson",
      profileImageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-03-10")
    }
  ];

  // Sample trips
  const trips: Trip[] = [
    {
      id: 1,
      userId: "user1",
      title: "Weekend Hiking Trip - Mt. Rainier",
      description: "Completed an amazing 12-mile hike at Mt. Rainier. The views were absolutely breathtaking and worth every step!",
      startDate: new Date("2023-05-20"),
      endDate: new Date("2023-05-22"),
      location: "Mt. Rainier National Park",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      carbonSaved: 12,
      isCompleted: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 2,
      userId: "user2",
      title: "Costa Rica Eco-Resort Getaway",
      description: "Just booked my stay at this amazing sustainable resort in Costa Rica for next month. Can't wait to explore the rainforest!",
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      location: "Costa Rica",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      carbonSaved: 0, // Not completed yet
      isCompleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      userId: "user3",
      title: "Swiss Alps Eco-Tour",
      description: "Planning a sustainable tour of the Swiss Alps, focusing on train travel and eco-friendly accommodations.",
      startDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
      endDate: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000), // 39 days from now
      location: "Swiss Alps",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
      carbonSaved: 0, // Not completed yet
      isCompleted: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      userId: "user1",
      title: "Oregon Coast Drive",
      description: "Explored the Oregon Coast in an electric car, staying at eco-friendly B&Bs along the way.",
      startDate: new Date("2023-05-10"),
      endDate: new Date("2023-05-15"),
      location: "Oregon Coast",
      imageUrl: "https://images.unsplash.com/photo-1609102026400-3c0ca378e4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
      carbonSaved: 36,
      isCompleted: true,
      createdAt: new Date("2023-05-05"),
      updatedAt: new Date("2023-05-16")
    },
    {
      id: 5,
      userId: "user2",
      title: "Yosemite Weekend",
      description: "Spent the weekend hiking and camping in Yosemite, practicing Leave No Trace principles.",
      startDate: new Date("2023-04-22"),
      endDate: new Date("2023-04-24"),
      location: "Yosemite National Park",
      imageUrl: "https://images.unsplash.com/photo-1535224206242-487f7090b5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
      carbonSaved: 18,
      isCompleted: true,
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-04-25")
    },
    {
      id: 6,
      userId: "user3",
      title: "Barcelona Trip",
      description: "Used public transportation to explore Barcelona's sustainable architecture and eco-friendly neighborhoods.",
      startDate: new Date("2023-02-12"),
      endDate: new Date("2023-02-20"),
      location: "Barcelona, Spain",
      imageUrl: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
      carbonSaved: 42,
      isCompleted: true,
      createdAt: new Date("2023-02-01"),
      updatedAt: new Date("2023-02-22")
    }
  ];

  // Sample posts
  const posts: Post[] = [
    {
      id: 1,
      userId: "user1",
      tripId: 1,
      content: "Weekend Hiking Trip - Mt. Rainier\nCompleted an amazing 12-mile hike at Mt. Rainier this weekend. The views were absolutely breathtaking and worth every step!",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      distance: "12.5 miles",
      elevation: "3,200 ft",
      duration: "5h 30m",
      carbonSaved: 12,
      likes: 42,
      comments: 12,
      createdAt: new Date("2023-05-23"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 2,
      userId: "user2",
      tripId: 2,
      content: "Costa Rica Eco-Resort Getaway\nJust booked my stay at this amazing sustainable resort in Costa Rica for next month. Can't wait to explore the rainforest!",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      distance: null,
      elevation: null,
      duration: null,
      carbonSaved: 0,
      likes: 28,
      comments: 7,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  // Sample achievements
  const achievements: Achievement[] = [
    {
      id: 1,
      userId: "user1",
      title: "First Steps",
      description: "Completed 5 sustainable trips",
      progress: 5,
      target: 5,
      icon: "leaf",
      isCompleted: true,
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 2,
      userId: "user1",
      title: "Carbon Champion",
      description: "Saved 100kg of carbon emissions",
      progress: 98,
      target: 100,
      icon: "tree",
      isCompleted: false,
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 3,
      userId: "user1",
      title: "Nature Explorer",
      description: "Visited 3 natural parks",
      progress: 2,
      target: 3,
      icon: "mountain",
      isCompleted: false,
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 4,
      userId: "user3",
      title: "Carbon Champion Level 2",
      description: "I've saved over 100kg of carbon emissions by choosing sustainable travel options!",
      progress: 75,
      target: 100,
      icon: "tree",
      isCompleted: false,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  // Sample vouchers
  const vouchers: Voucher[] = [
    {
      id: 1,
      userId: "user1",
      title: "Eco-Traveler Voucher",
      description: "15% off your next eco-hotel booking",
      validUntil: new Date("2023-08-31"),
      isRedeemed: false,
      createdAt: new Date("2023-05-23"),
      updatedAt: new Date("2023-05-23")
    },
    {
      id: 2,
      userId: "user2",
      title: "Green Transport Discount",
      description: "10% off your next electric car rental",
      validUntil: new Date("2023-07-31"),
      isRedeemed: false,
      createdAt: new Date("2023-04-25"),
      updatedAt: new Date("2023-04-25")
    },
    {
      id: 3,
      userId: "user3",
      title: "Sustainable Tour Credit",
      description: "€50 credit for any certified eco-tour",
      validUntil: new Date("2023-06-30"),
      isRedeemed: true,
      createdAt: new Date("2023-03-22"),
      updatedAt: new Date("2023-05-15")
    }
  ];

  // Sample hotels
  const hotels: Hotel[] = [
    {
      id: 1,
      name: "Green Canopy Eco Resort",
      location: "Ubud, Bali",
      imageUrl: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      price: 120,
      sustainabilityRating: 4,
      features: ["Solar Powered", "Farm-to-Table"],
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15")
    },
    {
      id: 2,
      name: "Mountain Vista Lodge",
      location: "Aspen, Colorado",
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      price: 175,
      sustainabilityRating: 3,
      features: ["Zero Waste", "Local Materials"],
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2023-02-20")
    },
    {
      id: 3,
      name: "Ocean Breeze Eco Hotel",
      location: "Tulum, Mexico",
      imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      price: 145,
      sustainabilityRating: 5,
      features: ["Renewable Energy", "Plastic-Free"],
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-03-10")
    }
  ];

  // Sample destinations
  const destinations: Destination[] = [
    {
      id: 1,
      name: "Costa Rica",
      description: "Eco-tourism paradise",
      imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15")
    },
    {
      id: 2,
      name: "Copenhagen",
      description: "Sustainable city model",
      imageUrl: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2023-02-20")
    },
    {
      id: 3,
      name: "New Zealand",
      description: "Conservation focused",
      imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-03-10")
    },
    {
      id: 4,
      name: "Slovenia",
      description: "Green destination award winner",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      createdAt: new Date("2023-04-15"),
      updatedAt: new Date("2023-04-15")
    }
  ];

  // Sample user stats
  const stats: UserStats[] = [
    {
      userId: "user1",
      totalTrips: 12,
      carbonSaved: 143,
      achievementsCompleted: 7,
      friendsCount: 28,
      updatedAt: new Date("2023-05-23")
    },
    {
      userId: "user2",
      totalTrips: 8,
      carbonSaved: 87,
      achievementsCompleted: 5,
      friendsCount: 15,
      updatedAt: new Date("2023-05-15")
    },
    {
      userId: "user3",
      totalTrips: 6,
      carbonSaved: 64,
      achievementsCompleted: 3,
      friendsCount: 21,
      updatedAt: new Date("2023-05-10")
    }
  ];

  // Insert data into storage
  for (const user of users) {
    storage.upsertUser(user);
  }

  for (const trip of trips) {
    storage.createTrip(trip);
  }

  for (const post of posts) {
    storage.createPost(post);
  }

  for (const achievement of achievements) {
    storage.createAchievement(achievement);
  }

  for (const voucher of vouchers) {
    storage.createVoucher(voucher);
  }

  for (const hotel of hotels) {
    storage.getEcoFriendlyHotels().then(existingHotels => {
      if (!existingHotels.some(h => h.id === hotel.id)) {
        const now = new Date();
        storage["hotels"].set(hotel.id, {
          ...hotel,
          createdAt: now,
          updatedAt: now
        });
      }
    });
  }

  for (const destination of destinations) {
    storage.getDestinations().then(existingDestinations => {
      if (!existingDestinations.some(d => d.id === destination.id)) {
        const now = new Date();
        storage["destinations"].set(destination.id, {
          ...destination,
          createdAt: now,
          updatedAt: now
        });
      }
    });
  }

  for (const stat of stats) {
    storage.getUserStats(stat.userId).then(existingStat => {
      if (!existingStat) {
        storage["stats"].set(stat.userId, {
          ...stat,
          updatedAt: new Date()
        });
      }
    });
  }
}
