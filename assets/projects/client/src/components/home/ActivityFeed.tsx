import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  AlertCircle,
  Clock,
  Backpack,
  Mountain,
  Leaf,
  Medal
} from "lucide-react";

export function ActivityFeed() {
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-neutral-light pb-6 mb-6 last:border-0 animate-pulse">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-neutral-light mr-3"></div>
              <div className="flex-grow">
                <div className="h-4 bg-neutral-light w-1/3 mb-2"></div>
                <div className="h-3 bg-neutral-light w-1/5"></div>
              </div>
            </div>
            <div className="h-5 bg-neutral-light w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-light w-full mb-4"></div>
            <div className="h-40 bg-neutral-light w-full mb-4 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-neutral-dark">
        <AlertCircle className="mr-2 h-5 w-5 text-error" />
        <p>Failed to load activity feed. Please try again later.</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-neutral-medium">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2">No activities yet</h3>
        <p className="text-sm text-center">Follow more travelers or start sharing your own sustainable journeys!</p>
      </div>
    );
  }

  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.id} className="border-b border-neutral-light pb-6 mb-6 last:border-0">
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={activity.user.profileImageUrl || "https://via.placeholder.com/150"} 
                alt={`${activity.user.firstName || 'User'}'s profile`} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium">
                <span>{activity.user.firstName} {activity.user.lastName}</span>{' '}
                <span className="text-neutral-medium">
                  {activity.type === 'post' && 'shared a new journey'}
                  {activity.type === 'booking' && 'booked an eco-friendly hotel'}
                  {activity.type === 'achievement' && 'shared a carbon achievement'}
                </span>
              </p>
              <p className="text-xs text-neutral-medium">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            <button className="text-neutral-medium hover:text-neutral-dark">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {activity.type === 'post' && (
            <>
              <h3 className="font-heading font-semibold text-lg mb-2">{activity.post.content.split('\n')[0]}</h3>
              <p className="text-neutral-dark mb-4">{activity.post.content.split('\n').slice(1).join('\n')}</p>
              
              {activity.post.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={activity.post.imageUrl} className="w-full h-auto" alt="Trip" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                  {activity.post.distance && (
                    <div className="flex items-center">
                      <Backpack className="text-primary-DEFAULT mr-2 h-4 w-4" />
                      <span className="text-sm">{activity.post.distance}</span>
                    </div>
                  )}
                  {activity.post.elevation && (
                    <div className="flex items-center">
                      <Mountain className="text-primary-DEFAULT mr-2 h-4 w-4" />
                      <span className="text-sm">{activity.post.elevation}</span>
                    </div>
                  )}
                  {activity.post.duration && (
                    <div className="flex items-center">
                      <Clock className="text-primary-DEFAULT mr-2 h-4 w-4" />
                      <span className="text-sm">{activity.post.duration}</span>
                    </div>
                  )}
                </div>
                {activity.post.carbonSaved > 0 && (
                  <div className="flex items-center">
                    <Leaf className="text-success mr-1 h-4 w-4" />
                    <span className="text-sm font-medium text-success">-{activity.post.carbonSaved}kg CO₂</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <Heart className="mr-1 h-4 w-4" />
                    <span className="text-sm">{activity.post.likes}</span>
                  </button>
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">{activity.post.comments}</span>
                  </button>
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <button className="text-neutral-medium hover:text-primary-DEFAULT">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {activity.type === 'booking' && (
            // Hotel booking post rendering
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {activity.hotel.name} Getaway
              </h3>
              <p className="text-neutral-dark mb-4">
                Just booked my stay at this amazing sustainable resort for next month!
              </p>
              
              {activity.hotel.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={activity.hotel.imageUrl} className="w-full h-auto" alt={activity.hotel.name} />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <Heart className="mr-1 h-4 w-4" />
                    <span className="text-sm">28</span>
                  </button>
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">7</span>
                  </button>
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <button className="text-neutral-medium hover:text-primary-DEFAULT">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activity.type === 'achievement' && (
            <div>
              <div className="bg-primary-light/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-primary-DEFAULT">
                    {activity.achievement.title}
                  </h3>
                  <Medal className="text-2xl text-accent-DEFAULT" />
                </div>
                <p className="text-neutral-dark mb-3">{activity.achievement.description}</p>
                <div className="carbon-progress mb-2">
                  <div style={{ width: `${(activity.achievement.progress / activity.achievement.target) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-neutral-medium">
                  <span>0kg</span>
                  <span>{activity.achievement.progress}kg of {activity.achievement.target}kg</span>
                  <span>{activity.achievement.target}kg</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <Heart className="mr-1 h-4 w-4" />
                    <span className="text-sm">56</span>
                  </button>
                  <button className="flex items-center text-neutral-medium hover:text-primary-DEFAULT">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">14</span>
                  </button>
                </div>
                <button className="text-neutral-medium hover:text-primary-DEFAULT">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
