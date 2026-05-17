import { Link, useLocation } from "wouter";
import { Home, Compass, PlusCircle, Briefcase, User } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-light z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-4 ${location === '/' ? 'text-primary-DEFAULT' : 'text-neutral-medium'}`}>
            <Home className="text-lg" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/explore">
          <a className={`flex flex-col items-center py-2 px-4 ${location === '/explore' ? 'text-primary-DEFAULT' : 'text-neutral-medium'}`}>
            <Compass className="text-lg" />
            <span className="text-xs mt-1">Explore</span>
          </a>
        </Link>
        <Link href="/add-trip">
          <a className="flex flex-col items-center py-2 px-4 text-neutral-medium">
            <PlusCircle className="text-2xl text-primary-DEFAULT -mt-4" />
            <span className="text-xs mt-1">Add</span>
          </a>
        </Link>
        <Link href="/book">
          <a className={`flex flex-col items-center py-2 px-4 ${location === '/book' ? 'text-primary-DEFAULT' : 'text-neutral-medium'}`}>
            <Briefcase className="text-lg" />
            <span className="text-xs mt-1">Book</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center py-2 px-4 ${location === '/profile' ? 'text-primary-DEFAULT' : 'text-neutral-medium'}`}>
            <User className="text-lg" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
