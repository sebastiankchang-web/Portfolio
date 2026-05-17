import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/useAuth";
import { useUserAchievements } from "@/hooks/useSpotify";
import { Medal, Calendar, Clock, Map, Music, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const iconMap: Record<string, React.ReactNode> = {
  "medal": <Medal className="text-3xl" />,
  "calendar": <Calendar className="text-3xl" />,
  "clock": <Clock className="text-3xl" />,
  "map": <Map className="text-3xl" />,
  "music": <Music className="text-3xl" />,
  "star": <Star className="text-3xl" />,
  "trophy": <Trophy className="text-3xl" />,
};

export default function Achievements() {
  const { user } = useAuth();
  const { data: achievements, isLoading } = useUserAchievements(user?.id || "");
  const [activeTab, setActiveTab] = useState("all");
  
  const defaultAchievements = [
    {
      id: 1,
      name: "World Traveler",
      description: "Visited 5 regions",
      icon: "map",
      completed: false,
      color: "from-chart-2 to-chart-1",
      progress: 20,
    },
    {
      id: 2,
      name: "5-Day Streak",
      description: "Played 5 days in a row",
      icon: "calendar",
      completed: user?.streak && user.streak >= 5 ? true : false,
      color: "from-chart-3 to-chart-4",
      progress: user?.streak ? (user.streak / 5) * 100 : 0,
    },
    {
      id: 3,
      name: "Music Master",
      description: "Play 100 games",
      icon: "trophy",
      completed: false,
      color: "from-chart-5 to-chart-3",
      progress: 5,
    },
    {
      id: 4,
      name: "Genre Explorer",
      description: "Discover all music genres",
      icon: "music",
      completed: false,
      color: "from-chart-1 to-chart-4",
      progress: 30,
    },
    {
      id: 5,
      name: "Perfect Score",
      description: "Get all answers right in a challenge",
      icon: "star",
      completed: false,
      color: "from-chart-4 to-chart-5",
      progress: 0,
    },
    {
      id: 6,
      name: "Early Bird",
      description: "Complete a challenge before 9am",
      icon: "clock",
      completed: false,
      color: "from-chart-2 to-chart-3",
      progress: 0,
    },
    {
      id: 7,
      name: "Night Owl",
      description: "Complete a challenge after 10pm",
      icon: "clock",
      completed: true,
      color: "from-chart-3 to-chart-1",
      progress: 100,
    },
    {
      id: 8,
      name: "Social Butterfly",
      description: "Invite 3 friends to join",
      icon: "medal",
      completed: false,
      color: "from-chart-5 to-chart-2",
      progress: 0,
    },
  ];
  
  const getBadges = () => {
    if (!achievements) return defaultAchievements;
    
    return achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon || "star",
      completed: achievement.completed,
      color: "from-chart-1 to-chart-4",
      progress: achievement.completed ? 100 : 50, // Sample progress
    }));
  };
  
  const badges = getBadges();
  const completedBadges = badges.filter(badge => badge.completed);
  const inProgressBadges = badges.filter(badge => !badge.completed);
  
  const getCompletionPercentage = () => {
    return Math.round((completedBadges.length / badges.length) * 100);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
            <p className="text-muted-foreground">
              Track your progress and earn badges as you explore music
            </p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Achievement Progress</h2>
                  <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                    You've earned {completedBadges.length} of {badges.length} badges
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2 mr-2">
                    {completedBadges.slice(0, 3).map((badge, index) => (
                      <div
                        key={index}
                        className={`h-8 w-8 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-xs border-2 border-background`}
                      >
                        {iconMap[badge.icon]}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{getCompletionPercentage()}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>
              
              <Progress value={getCompletionPercentage()} className="h-2" />
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="badge bg-card rounded-lg p-4 flex flex-col items-center text-center animate-pulse">
                      <div className="h-16 w-16 rounded-full bg-muted mb-2"></div>
                      <div className="h-4 w-3/4 bg-muted mb-1 rounded"></div>
                      <div className="h-3 w-1/2 bg-muted rounded"></div>
                    </div>
                  ))
                ) : (
                  badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="badge bg-card rounded-lg p-4 flex flex-col items-center text-center"
                    >
                      <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 ${!badge.completed ? "opacity-40" : ""}`}>
                        {iconMap[badge.icon]}
                      </div>
                      <h3 className={`text-sm font-medium mb-1 ${!badge.completed ? "text-muted-foreground" : ""}`}>
                        {badge.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {!badge.completed ? `${badge.description}` : badge.description}
                      </p>
                      {!badge.completed && (
                        <Progress value={badge.progress} className="h-1 mt-2 w-3/4" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {completedBadges.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-1">No achievements yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete challenges to earn your first achievement badge
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("in-progress")}>
                    View In-Progress Achievements
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {completedBadges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="badge bg-card rounded-lg p-4 flex flex-col items-center text-center"
                    >
                      <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2`}>
                        {iconMap[badge.icon]}
                      </div>
                      <h3 className="text-sm font-medium mb-1">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {inProgressBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className="badge bg-card rounded-lg p-4 flex flex-col items-center text-center"
                  >
                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 opacity-40`}>
                      {iconMap[badge.icon]}
                    </div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <Progress value={badge.progress} className="h-1 mt-2 w-3/4" />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Achievements</h2>
              <div className="space-y-4">
                {inProgressBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mr-4 opacity-40`}>
                      {iconMap[badge.icon]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{badge.name}</h3>
                        <span className="text-xs text-muted-foreground">{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
