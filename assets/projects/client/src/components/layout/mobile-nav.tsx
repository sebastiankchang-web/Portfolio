import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, MapPin, Trophy, Users2, Settings, LogIn, Heart, Sparkles, Music, Headphones } from "lucide-react";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClose: () => void;
};

const NavItem = ({ href, icon, label, isActive, onClose }: NavItemProps) => {
  return (
    <li className="mb-1">
      <Link href={href}>
        <div
          onClick={onClose}
          className={`flex items-center p-3 rounded-md transition-colors cursor-pointer ${
            isActive
              ? "text-white bg-muted"
              : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <span className="mr-3">{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleClose = () => setOpen(false);

  return (
    <header className="bg-card p-4 flex justify-between items-center md:hidden">
      <Link href="/">
        <div className="text-xl font-bold font-poppins text-white flex items-center cursor-pointer">
          <span className="text-primary mr-2">♫</span> Soundora
        </div>
      </Link>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-background p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Link href="/">
                <div className="text-xl font-bold font-poppins cursor-pointer" onClick={handleClose}>
                  <span className="text-primary mr-2">♫</span> Soundora
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4">
              <ul>
                <NavItem
                  href="/"
                  icon={<Home size={18} />}
                  label="Home"
                  isActive={location === "/"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/dj"
                  icon={<Sparkles size={18} />}
                  label="Soundora DJ"
                  isActive={location === "/dj"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/emotion-echo"
                  icon={<Heart size={18} />}
                  label="Emotion Echo"
                  isActive={location === "/emotion-echo"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/duet-discovery"
                  icon={<Headphones size={18} />}
                  label="Duet Discovery"
                  isActive={location === "/duet-discovery"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/world-map"
                  icon={<MapPin size={18} />}
                  label="World Map"
                  isActive={location === "/world-map"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/achievements"
                  icon={<Trophy size={18} />}
                  label="Achievements"
                  isActive={location === "/achievements"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/leaderboard"
                  icon={<Users2 size={18} />}
                  label="Leaderboard"
                  isActive={location === "/leaderboard"}
                  onClose={handleClose}
                />
                <NavItem
                  href="/settings"
                  icon={<Settings size={18} />}
                  label="Settings"
                  isActive={location === "/settings"}
                  onClose={handleClose}
                />
              </ul>
            </nav>

            <div className="p-4 border-t border-border">
              {isAuthenticated ? (
                <div className="flex items-center p-2">
                  {user?.profileImageUrl && (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {user?.firstName || user?.email || "User"}
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">
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
                  <div className="flex items-center justify-center w-full p-2 rounded-md bg-primary hover:bg-primary/90 text-white transition-colors cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
