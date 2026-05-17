import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  Globe, 
  Calendar, 
  Star, 
  Music
} from "lucide-react";

type LeaderboardFilter = "friends" | "global" | "leagues";
type LeagueType = "monthly" | "genres" | "regional";

// Sample users for demo
const sampleLeaderboardUsers = [
  { 
    id: "sample-user-123", 
    firstName: "Alex", 
    profileImageUrl: "https://i.pravatar.cc/150?img=21", 
    score: 950,
    streak: 15,
    lastActive: new Date()
  },
  { 
    id: "sample-user-456", 
    firstName: "Jordan", 
    profileImageUrl: "https://i.pravatar.cc/150?img=32", 
    score: 920,
    streak: 12,
    lastActive: new Date()
  },
  { 
    id: "sample-user-789", 
    firstName: "Taylor", 
    profileImageUrl: "https://i.pravatar.cc/150?img=16", 
    score: 880,
    streak: 9,
    lastActive: new Date()
  },
  { 
    id: "sample-user-101", 
    firstName: "Morgan", 
    profileImageUrl: "https://i.pravatar.cc/150?img=50", 
    score: 820,
    streak: 7
  },
  { 
    id: "sample-user-102", 
    firstName: "Casey", 
    profileImageUrl: "https://i.pravatar.cc/150?img=35", 
    score: 790,
    streak: 6
  }
];

// Sample genres
const sampleGenres = [
  { id: 1, name: "Afrobeat", color: "#FF9500" },
  { id: 2, name: "K-Pop", color: "#FF2D55" },
  { id: 3, name: "Flamenco", color: "#FF3B30" },
  { id: 4, name: "Reggaeton", color: "#5AC8FA" },
  { id: 5, name: "Bollywood", color: "#4CD964" }
];

export default function Leaderboard() {
  const [filter, setFilter] = useState<LeaderboardFilter>("global");
  const [leagueType, setLeagueType] = useState<LeagueType>("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { data } = useLeaderboard();
  
  // Use the sample data or data from API
  const leaderboardUsers = data || sampleLeaderboardUsers;
  const isLoading = false;
  
  // For demo purposes only - would come from the API in real app
  const monthlyLeague = {
    name: "May 2025 Global League",
    endsIn: "11 days",
    participants: 1247,
    rewards: [
      { position: 1, reward: "3-month Soundora Premium + Limited Badge" },
      { position: 2, reward: "2-month Soundora Premium + Badge" },
      { position: 3, reward: "1-month Soundora Premium + Badge" }
    ]
  };
  
  const formatDate = (dateString?: Date | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank against friends and music enthusiasts worldwide
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="bg-background border rounded-md inline-flex">
              <button 
                className={`px-4 py-2 rounded-l-md flex items-center ${filter === 'global' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => setFilter('global')}
              >
                <Globe className="mr-2 h-4 w-4" />
                Global
              </button>
              <button 
                className={`px-4 py-2 flex items-center ${filter === 'leagues' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => setFilter('leagues')}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Leagues
              </button>
              <button 
                className={`px-4 py-2 rounded-r-md flex items-center ${filter === 'friends' ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => setFilter('friends')}
              >
                <Users className="mr-2 h-4 w-4" />
                Friends
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full md:w-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select defaultValue="allTime">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filter === "global" && (
            <>
              <Card className="mb-6">
                <CardHeader className="pb-0">
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center space-x-8 py-8">
                      {[2, 1, 3].map((position) => (
                        <div key={position} className="flex flex-col items-center animate-pulse">
                          <div className={`h-16 w-16 rounded-full bg-muted mb-2 ${position === 1 ? 'h-20 w-20' : ''}`}></div>
                          <div className="h-4 w-20 bg-muted mb-1 rounded"></div>
                          <div className="h-3 w-16 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-8 py-4">
                      {leaderboardUsers.slice(0, 3).map((topUser, index) => {
                        // Arrange them as 2nd, 1st, 3rd
                        const position = index === 0 ? 1 : index === 1 ? 0 : 2;
                        const user = leaderboardUsers[position];
                        const rank = position + 1;
                        
                        return (
                          <div key={user.id} className="flex flex-col items-center">
                            <div className="relative">
                              {user.profileImageUrl ? (
                                <img 
                                  src={user.profileImageUrl} 
                                  alt={user.firstName || "User"} 
                                  className={`rounded-full object-cover border-4 ${
                                    rank === 1 
                                      ? 'border-yellow-400 h-20 w-20' 
                                      : rank === 2 
                                        ? 'border-zinc-400 h-16 w-16' 
                                        : 'border-amber-600 h-16 w-16'
                                  }`}
                                />
                              ) : (
                                <div className={`rounded-full flex items-center justify-center bg-muted ${
                                  rank === 1 
                                    ? 'border-yellow-400 h-20 w-20' 
                                    : rank === 2 
                                      ? 'border-zinc-400 h-16 w-16' 
                                      : 'border-amber-600 h-16 w-16'
                                }`}>
                                  <span className="text-xl">{(user.firstName || "U")[0]}</span>
                                </div>
                              )}
                              <div className={`absolute -top-2 -right-2 rounded-full flex items-center justify-center p-1 ${
                                rank === 1 
                                  ? 'bg-yellow-400' 
                                  : rank === 2 
                                    ? 'bg-zinc-400' 
                                    : 'bg-amber-600'
                              }`}>
                                <span className="text-xs font-bold text-black">{rank}</span>
                              </div>
                            </div>
                            <p className="font-medium mt-2">{user.firstName || `User ${rank}`}</p>
                            <p className="text-sm text-muted-foreground">{user.score || 0} pts</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Global Leaderboard</CardTitle>
                  <CardDescription>Top music discoverers worldwide</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Rank</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Points</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="p-3">
                              <div className="h-6 w-6 bg-muted rounded-full"></div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-muted rounded-full mr-3"></div>
                                <div className="h-4 w-24 bg-muted rounded"></div>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        leaderboardUsers.map((user, index) => (
                          <tr key={user.id} className={user.id === 'sample-user-123' ? 'bg-primary/5' : ''}>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  index === 0 
                                    ? 'bg-yellow-400/20 text-yellow-400' 
                                    : index === 1 
                                      ? 'bg-zinc-400/20 text-zinc-400' 
                                      : index === 2
                                        ? 'bg-amber-600/20 text-amber-600'
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                {user.profileImageUrl ? (
                                  <img
                                    src={user.profileImageUrl}
                                    alt={user.firstName || "User"}
                                    className="w-8 h-8 rounded-full object-cover mr-3"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                                    <span className="text-sm">{(user.firstName || "U")[0]}</span>
                                  </div>
                                )}
                                <span className={user.id === 'sample-user-123' ? 'font-medium' : ''}>
                                  {user.firstName || `User ${index + 1}`}
                                  {user.id === 'sample-user-123' && <span className="ml-2 text-xs text-primary">(You)</span>}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right font-medium">
                              {user.score || Math.floor(1000 - index * 50)} pts
                            </td>
                            <td className="p-3 text-right text-sm text-muted-foreground">
                              {formatDate(user.lastActive) || (index < 3 ? 'Today' : index < 5 ? 'Yesterday' : '3 days ago')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
          
          {filter === "leagues" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{monthlyLeague.name}</CardTitle>
                        <CardDescription>Competition ends in {monthlyLeague.endsIn} • {monthlyLeague.participants} participants</CardDescription>
                      </div>
                      <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs">Monthly</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-2" /> 
                        Rewards
                      </h3>
                      <div className="space-y-4">
                        {monthlyLeague.rewards.map((reward) => (
                          <div key={reward.position} className="flex items-center">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              reward.position === 1 
                                ? 'bg-yellow-400/20 text-yellow-400' 
                                : reward.position === 2 
                                  ? 'bg-zinc-400/20 text-zinc-400' 
                                  : 'bg-amber-600/20 text-amber-600'
                            }`}>
                              {reward.position === 1 ? (
                                <Trophy className="h-4 w-4" />
                              ) : reward.position === 2 ? (
                                <Medal className="h-4 w-4" />
                              ) : (
                                <Award className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Position #{reward.position}</p>
                              <p className="text-sm text-muted-foreground">{reward.reward}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Music className="h-5 w-5 text-primary mr-2" /> 
                        Your Position
                      </h3>
                      {user ? (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              24
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">You're in the top 2%</p>
                                <p className="text-sm font-semibold">750 pts</p>
                              </div>
                              <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">250 pts needed to reach position #3</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/30 rounded-lg text-center">
                          <p className="text-muted-foreground">Sign in to participate in leagues</p>
                          <Button size="sm" className="mt-2">
                            <Users className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>League Types</CardTitle>
                    <CardDescription>Join different competitions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      <div 
                        className={`p-4 cursor-pointer ${leagueType === 'monthly' ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                        onClick={() => setLeagueType('monthly')}
                      >
                        <div className="flex items-center">
                          <div className="bg-purple-500/20 text-purple-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Monthly Leagues</p>
                            <p className="text-xs text-muted-foreground">Resets every month with new rewards</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`p-4 cursor-pointer ${leagueType === 'genres' ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                        onClick={() => setLeagueType('genres')}
                      >
                        <div className="flex items-center">
                          <div className="bg-green-500/20 text-green-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <Music className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Genre Masters</p>
                            <p className="text-xs text-muted-foreground">Compete in specific music genres</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`p-4 cursor-pointer ${leagueType === 'regional' ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                        onClick={() => setLeagueType('regional')}
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-500/20 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Regional Explorers</p>
                            <p className="text-xs text-muted-foreground">Compete in regional music discovery</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Current League Standings</CardTitle>
                  <CardDescription>May 2025 Global League</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Rank</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Points</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {leaderboardUsers.map((user, index) => (
                        <tr key={user.id} className={user.id === 'sample-user-123' ? 'bg-primary/5' : ''}>
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                index === 0 
                                  ? 'bg-yellow-400/20 text-yellow-400' 
                                  : index === 1 
                                    ? 'bg-zinc-400/20 text-zinc-400' 
                                    : index === 2
                                      ? 'bg-amber-600/20 text-amber-600'
                                      : 'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              {user.profileImageUrl ? (
                                <img
                                  src={user.profileImageUrl}
                                  alt={user.firstName || "User"}
                                  className="w-8 h-8 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm">{(user.firstName || "U")[0]}</span>
                                </div>
                              )}
                              <span>
                                {user.firstName || `User ${index + 1}`}
                                {user.id === 'sample-user-123' && <span className="ml-2 text-xs text-primary">(You)</span>}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium">
                            {user.score || Math.floor(1000 - index * 50)} pts
                          </td>
                          <td className="p-3 text-right text-sm text-muted-foreground">
                            {formatDate(user.lastActive) || (index < 3 ? 'Today' : index < 5 ? 'Yesterday' : '3 days ago')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {leagueType === 'monthly' && (
                    <div className="p-3 text-center border-t border-border">
                      <Button variant="ghost" size="sm">
                        View All {leaderboardUsers.length} Users
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          
          {filter === "friends" && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Friends</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Follow friends to see how you compare and celebrate each other's music discoveries
              </p>
              <Button>
                Find Friends
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}