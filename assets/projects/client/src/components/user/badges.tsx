import { useAuth } from "@/hooks/useAuth";
import { useUserAchievements } from "@/hooks/useSpotify";
import { Medal, Calendar, Clock, Map, Music, Star, Trophy } from "lucide-react";

type Badge = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  color: string;
};

const iconMap: Record<string, React.ReactNode> = {
  "medal": <Medal className="text-3xl" />,
  "calendar": <Calendar className="text-3xl" />,
  "clock": <Clock className="text-3xl" />,
  "map": <Map className="text-3xl" />,
  "music": <Music className="text-3xl" />,
  "star": <Star className="text-3xl" />,
  "trophy": <Trophy className="text-3xl" />,
};

export function Badges() {
  const { user } = useAuth();
  const { data: achievements, isLoading } = useUserAchievements(user?.id || "");
  
  const defaultBadges: Badge[] = [
    {
      id: 1,
      name: "World Traveler",
      description: "Visited 5 regions",
      icon: <Map className="text-3xl" />,
      completed: false,
      color: "from-chart-2 to-chart-1",
    },
    {
      id: 2,
      name: "5-Day Streak",
      description: "Played 5 days in a row",
      icon: <Calendar className="text-3xl" />,
      completed: user?.streak && user.streak >= 5 ? true : false,
      color: "from-chart-3 to-chart-4",
    },
    {
      id: 3,
      name: "Music Master",
      description: "Play 100 games",
      icon: <Trophy className="text-3xl" />,
      completed: false,
      color: "from-chart-5 to-chart-3",
    },
  ];
  
  const getBadges = (): Badge[] => {
    if (!achievements) return defaultBadges;
    
    return achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: iconMap[achievement.icon] || <Star className="text-3xl" />,
      completed: achievement.completed,
      color: "from-chart-1 to-chart-4",
    }));
  };
  
  const badges = getBadges();

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4 flex flex-col items-center text-center animate-pulse">
              <div className="h-16 w-16 rounded-full bg-muted mb-2"></div>
              <div className="h-4 w-24 bg-muted mb-1 rounded"></div>
              <div className="h-3 w-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className="badge bg-card rounded-lg p-4 flex flex-col items-center text-center"
          >
            <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 ${!badge.completed ? "opacity-40" : ""}`}>
              {badge.icon}
            </div>
            <h3 className={`text-sm font-medium mb-1 ${!badge.completed ? "text-muted-foreground" : ""}`}>
              {badge.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {!badge.completed ? `Locked: ${badge.description}` : badge.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
