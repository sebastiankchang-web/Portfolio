import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

type LeaderboardFilter = "friends" | "global";

export function Leaderboard() {
  const [filter, setFilter] = useState<LeaderboardFilter>("friends");
  const { user } = useAuth();
  const { data: leaderboardUsers, isLoading } = useLeaderboard();
  
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

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Leaderboard</h2>
          <div className="flex items-center animate-pulse">
            <div className="bg-muted h-8 w-24 rounded-full mr-2"></div>
            <div className="bg-muted h-8 w-20 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl overflow-hidden">
          <div className="border-b border-border p-3">
            <div className="animate-pulse flex justify-between">
              <div className="h-6 w-1/2 bg-muted rounded"></div>
            </div>
          </div>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="border-b border-border p-4 animate-pulse">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-muted rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-muted rounded mb-1"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
                <div className="h-5 w-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Leaderboard</h2>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="text-sm rounded-full mr-2"
            onClick={() => setFilter(filter === "friends" ? "global" : "friends")}
          >
            <span className="mr-1">{filter === "friends" ? "Friends" : "Global"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="link" className="text-primary text-sm flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Streak</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Last Played</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leaderboardUsers?.map((leaderboardUser, index) => (
              <tr 
                key={leaderboardUser.id} 
                className={leaderboardUser.id === user?.id ? "bg-primary bg-opacity-10" : ""}
              >
                <td className="py-3 px-4 text-sm font-medium">
                  <div className="flex items-center">
                    <span className={`${index === 0 ? "bg-primary" : "bg-white bg-opacity-20"} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center">
                    {leaderboardUser.profileImageUrl ? (
                      <img 
                        src={leaderboardUser.profileImageUrl} 
                        alt={leaderboardUser.firstName || "User"} 
                        className="w-8 h-8 rounded-full mr-3 object-cover" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full mr-3 bg-muted flex items-center justify-center">
                        <span className="text-xs">{(leaderboardUser.firstName || "U")[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {leaderboardUser.firstName || leaderboardUser.email || `User ${index + 1}`}
                      </p>
                      {leaderboardUser.id === user?.id && (
                        <p className="text-xs text-muted-foreground">You</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-medium">{leaderboardUser.score || 0}</td>
                <td className="py-3 px-4 text-sm hidden md:table-cell">
                  {leaderboardUser.streak ? (
                    <div className="flex items-center">
                      <span>{leaderboardUser.streak} days</span>
                      <div className="w-2 h-2 rounded-full bg-primary ml-2 streak-pulse"></div>
                    </div>
                  ) : (
                    <span>0 days</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                  {formatDate(leaderboardUser.lastPlayed)}
                </td>
              </tr>
            ))}
            
            {(!leaderboardUsers || leaderboardUsers.length === 0) && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No users found on the leaderboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
