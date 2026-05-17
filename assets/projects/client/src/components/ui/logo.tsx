import React from "react";

export function SoundoraLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        className={`${sizeClasses[size]} text-orange-500`}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
        <path 
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path 
          d="M16 8L17.5 6.5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M16.5 16.5L20 13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold text-orange-500 dark:text-orange-400">Soundora</span>
    </div>
  );
}

export function SoundoraLogoSmall({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        className="h-8 w-8 text-orange-500"
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
        <path 
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path 
          d="M16 8L17.5 6.5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M16.5 16.5L20 13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}