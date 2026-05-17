import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="text-primary-DEFAULT text-2xl" />
          <h1 className="font-heading font-bold text-xl text-primary-DEFAULT">EcoTravel</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`font-heading font-medium ${location === '/' ? 'text-primary-DEFAULT' : 'text-neutral-dark hover:text-primary-DEFAULT'}`}>
              Home
            </a>
          </Link>
          <Link href="/explore">
            <a className={`font-heading font-medium ${location === '/explore' ? 'text-primary-DEFAULT' : 'text-neutral-dark hover:text-primary-DEFAULT'}`}>
              Explore
            </a>
          </Link>
          <Link href="/book">
            <a className={`font-heading font-medium ${location === '/book' ? 'text-primary-DEFAULT' : 'text-neutral-dark hover:text-primary-DEFAULT'}`}>
              Book
            </a>
          </Link>
          <Link href="/connect">
            <a className={`font-heading font-medium ${location === '/connect' ? 'text-primary-DEFAULT' : 'text-neutral-dark hover:text-primary-DEFAULT'}`}>
              Connect
            </a>
          </Link>
          <Link href="/achievements">
            <a className={`font-heading font-medium ${location === '/achievements' ? 'text-primary-DEFAULT' : 'text-neutral-dark hover:text-primary-DEFAULT'}`}>
              Achievements
            </a>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-neutral-dark">
            <i className="fas fa-search text-lg"></i>
          </button>
          <div className="relative hidden md:block">
            <Input 
              type="text" 
              placeholder="Search destinations..." 
              className="px-4 py-2 rounded-full bg-neutral-lightest border border-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <i className="fas fa-search absolute right-3 top-2.5 text-neutral-medium"></i>
          </div>
          {isAuthenticated ? (
            <>
              <div className="flex items-center">
                <div className="relative">
                  <i className="fas fa-bell text-lg text-neutral-dark cursor-pointer"></i>
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </div>
              </div>
              <Link href="/profile">
                <a className="hidden md:block w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={user?.profileImageUrl || "https://via.placeholder.com/150"} 
                    alt="User profile" 
                    className="w-full h-full object-cover" 
                  />
                </a>
              </Link>
            </>
          ) : (
            <Button 
              onClick={() => window.location.href = '/api/login'}
              variant="outline"
              className="text-primary-DEFAULT border-primary-DEFAULT hover:bg-primary-DEFAULT hover:text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
