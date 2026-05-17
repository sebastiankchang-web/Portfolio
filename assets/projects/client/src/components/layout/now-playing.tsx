import { useState, useEffect } from "react";
import { SkipBack, SkipForward, Pause, Play, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Track = {
  id: string;
  name: string;
  artist: string;
  genre: string;
  albumArt: string;
  duration: number; // in milliseconds
  uri: string;
};

type NowPlayingProps = {
  track?: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function NowPlaying({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: NowPlayingProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (!track) return;

    // Calculate duration
    const minutes = Math.floor(track.duration / 60000);
    const seconds = Math.floor((track.duration % 60000) / 1000);
    setDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);

    // Reset progress when track changes
    setProgress(0);
    setCurrentTime("0:00");

    // Update progress
    let interval: number;
    if (isPlaying) {
      const startTime = Date.now();
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / track.duration) * 100, 100);
        setProgress(newProgress);

        // Update current time
        const currentMs = elapsed;
        const currentMinutes = Math.floor(currentMs / 60000);
        const currentSeconds = Math.floor((currentMs % 60000) / 1000);
        setCurrentTime(
          `${currentMinutes}:${currentSeconds.toString().padStart(2, "0")}`
        );

        // Stop when reached end
        if (newProgress >= 100) {
          clearInterval(interval);
          onNext();
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [track, isPlaying, onNext]);

  if (!track) {
    return null;
  }

  return (
    <div className="bg-black border-t border-border py-3 px-4">
      <div className="flex items-center">
        <img
          src={track.albumArt}
          alt={track.name}
          className="w-12 h-12 rounded-md object-cover"
        />

        <div className="ml-3 flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{track.name}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {track.artist} • {track.genre}
          </p>

          <div className="mt-1">
            <div className="player-progress">
              <div
                className="player-progress-filled"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center ml-4 space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onPrevious}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <SkipBack size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button
            onClick={onPlayPause}
            className="bg-white rounded-full h-8 w-8 flex items-center justify-center text-black hover:bg-white/90 transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onNext}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <SkipForward size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
