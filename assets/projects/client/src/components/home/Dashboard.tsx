import { useQuery } from "@tanstack/react-query";
import { UserStats } from "@shared/schema";
import { 
  Route,
  Leaf,
  Medal,
  Users
} from "lucide-react";

export function Dashboard() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col items-center animate-pulse">
            <div className="w-8 h-8 bg-neutral-light rounded-full mb-2"></div>
            <div className="w-16 h-4 bg-neutral-light mb-2"></div>
            <div className="w-8 h-6 bg-neutral-light"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="text-primary-DEFAULT mb-2">
          <Route className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-medium uppercase">Total Trips</p>
        <p className="text-2xl font-bold font-heading">{stats?.totalTrips || 0}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="text-primary-DEFAULT mb-2">
          <Leaf className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-medium uppercase">Carbon Saved</p>
        <p className="text-2xl font-bold font-heading">{stats?.carbonSaved || 0} kg</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="text-primary-DEFAULT mb-2">
          <Medal className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-medium uppercase">Achievements</p>
        <p className="text-2xl font-bold font-heading">{stats?.achievementsCompleted || 0}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="text-primary-DEFAULT mb-2">
          <Users className="w-6 h-6" />
        </div>
        <p className="text-xs text-neutral-medium uppercase">Friends</p>
        <p className="text-2xl font-bold font-heading">{stats?.friendsCount || 0}</p>
      </div>
    </div>
  );
}
