import { useQuery } from "@tanstack/react-query";
import { UserStats } from "@shared/schema";
import { 
  CircleHelp, 
  Footprints, 
  Train,
  Building,
  Leaf,
  Network,
  Mountain,
  Car,
  Utensils,
  Backpack,
  Info,
  Check,
  Gift
} from "lucide-react";
import { CarbonSource, Reward } from "@/lib/types";

export function SustainabilityTracking() {
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/user/achievements"],
  });

  const { data: vouchers, isLoading: vouchersLoading } = useQuery({
    queryKey: ["/api/user/vouchers"],
  });

  // Carbon sources
  const carbonSources: CarbonSource[] = [
    { name: 'Footprints/Biking', icon: 'fa-walking', amount: 42 },
    { name: 'Public Transport', icon: 'fa-train', amount: 63 },
    { name: 'Eco-Accommodations', icon: 'fa-hotel', amount: 38 }
  ];

  // Rewards
  const upcomingRewards: Reward[] = [
    { name: 'Free EV rental day', icon: 'fa-car', pointsNeeded: 20 },
    { name: 'Farm-to-table dinner', icon: 'fa-utensils', pointsNeeded: 35 },
    { name: 'Free guided hike', icon: 'fa-hiking', pointsNeeded: 50 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-bold text-xl">Your Sustainability Impact</h2>
        <button className="text-primary-DEFAULT hover:text-primary-dark">
          <Info className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carbon Footprint Section */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4">Carbon Footprint</h3>
          <div className="rounded-lg bg-neutral-lightest p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Emissions Saved</span>
              <span className="text-primary-DEFAULT font-bold">{stats?.carbonSaved || 0} kg CO₂</span>
            </div>
            <div className="carbon-progress mb-1">
              <div style={{ width: `${Math.min(((stats?.carbonSaved || 0) / 200) * 100, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-neutral-medium">
              <span>0kg</span>
              <span>Target: 200kg</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {carbonSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-light last:border-b-0">
                <div className="flex items-center">
                  {source.name === 'Footprints/Biking' && <Footprints className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                  {source.name === 'Public Transport' && <Train className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                  {source.name === 'Eco-Accommodations' && <Building className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                  <span className="text-sm">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-success">+{source.amount}kg</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements Section */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4">Achievements</h3>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-neutral-lightest rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary-light/30 flex items-center justify-center mr-3">
                <Leaf className="text-2xl text-primary-DEFAULT h-6 w-6" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">First Steps</h4>
                <p className="text-xs text-neutral-medium">Completed 5 sustainable trips</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center">
                <Check className="text-white h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-neutral-lightest rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary-light/30 flex items-center justify-center mr-3">
                <Network className="text-2xl text-primary-DEFAULT h-6 w-6" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">Carbon Champion</h4>
                <p className="text-xs text-neutral-medium">Saved 100kg of carbon emissions</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center">
                <Check className="text-white h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-neutral-lightest rounded-lg">
              <div className="h-12 w-12 rounded-full bg-accent-light/30 flex items-center justify-center mr-3">
                <Mountain className="text-2xl text-accent-DEFAULT h-6 w-6" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">Nature Explorer</h4>
                <p className="text-xs text-neutral-medium">Visited 3 natural parks</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-neutral-light flex items-center justify-center">
                <span className="text-xs font-bold">2/3</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards Section */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4">Rewards</h3>
          
          <div className="bg-accent-light/10 rounded-lg p-4 mb-4 border border-accent-light/30">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-accent-dark">Eco-Traveler Voucher</h4>
                <p className="text-sm text-neutral-medium">15% off your next eco-hotel booking</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent-DEFAULT flex items-center justify-center">
                <Gift className="text-white h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-medium">Valid until: Aug 31, 2023</span>
              <button className="text-accent-DEFAULT text-sm font-medium hover:underline">
                Redeem
              </button>
            </div>
          </div>
          
          <div className="bg-neutral-lightest rounded-lg p-4">
            <h4 className="font-medium mb-3">Next Available Rewards</h4>
            <div className="space-y-3">
              {upcomingRewards.map((reward, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    {reward.name.includes('EV rental') && <Car className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                    {reward.name.includes('dinner') && <Utensils className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                    {reward.name.includes('hike') && <Backpack className="text-primary-DEFAULT mr-2 h-4 w-4" />}
                    <span className="text-sm">{reward.name}</span>
                  </div>
                  <span className="text-xs font-medium">{reward.pointsNeeded} points away</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
