import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MapPin, 
  Trophy, 
  Users2, 
  Settings, 
  Music, 
  CalendarDays, 
  Sparkles, 
  Heart, 
  Headphones
} from "lucide-react";
import { SoundoraLogo } from "@/components/ui/logo";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <li>
      <Link href={href}>
        <div
          className={cn(
            "flex items-center p-2 rounded-md transition-colors cursor-pointer",
            isActive
              ? "text-white bg-sidebar-accent dark:text-white dark:bg-sidebar-accent bg-primary/90"
              : "text-gray-700 hover:text-gray-900 dark:text-sidebar-foreground/70 dark:hover:text-sidebar-foreground"
          )}
        >
          <span className="mr-3">{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="hidden md:flex flex-col w-60 bg-black dark:bg-black bg-gray-100 p-6">
      <div className="mb-8">
        <SoundoraLogo size="lg" className="mb-2" />
        <p className="text-sm text-gray-600 dark:text-orange-300/70">
          Global Music Discovery
        </p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem
            href="/"
            icon={<Home size={18} />}
            label="Home"
            isActive={location === "/"}
          />
          <NavItem
            href="/dj"
            icon={<Sparkles size={18} />}
            label="Soundora DJ"
            isActive={location === "/dj"}
          />
          <NavItem
            href="/emotion-echo"
            icon={<Heart size={18} />}
            label="Emotion Echo"
            isActive={location === "/emotion-echo"}
          />
          <NavItem
            href="/world-map"
            icon={<MapPin size={18} />}
            label="World Map"
            isActive={location === "/world-map"}
          />
          <NavItem
            href="/events"
            icon={<CalendarDays size={18} />}
            label="Events"
            isActive={location === "/events"}
          />
          <NavItem
            href="/achievements"
            icon={<Trophy size={18} />}
            label="Achievements"
            isActive={location === "/achievements"}
          />
          <NavItem
            href="/duet-discovery"
            icon={<Headphones size={18} />}
            label="Duet Discovery"
            isActive={location === "/duet-discovery"}
          />
          <NavItem
            href="/leaderboard"
            icon={<Users2 size={18} />}
            label="Leaderboard"
            isActive={location === "/leaderboard"}
          />
          <NavItem
            href="/settings"
            icon={<Settings size={18} />}
            label="Settings"
            isActive={location === "/settings"}
          />
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-300 dark:border-sidebar-border">
        {isAuthenticated ? (
          <div className="flex items-center p-2">
            {user?.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName || user?.email || "User"}
              </p>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-sidebar-foreground/70">
                  {user?.streak || 0} day streak
                </span>
                {user?.streak ? (
                  <div className="w-2 h-2 rounded-full bg-primary ml-2 streak-pulse"></div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <Link href="/api/login">
            <div className="flex items-center p-2 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer">
              <span>Sign In</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
