import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Home from "@/pages/final-home";
import WorldMap from "@/pages/world-map";
import Achievements from "@/pages/achievements";
import Leaderboard from "@/pages/leaderboard";
import Settings from "@/pages/settings";
import Events from "@/pages/events";
import DJ from "@/pages/dj-fixed";
import EmotionEcho from "@/pages/emotion-echo";
import DuetDiscovery from "@/pages/duet-discovery";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/world-map" component={WorldMap} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/settings" component={Settings} />
      <Route path="/events" component={Events} />
      <Route path="/dj" component={DJ} />
      <Route path="/emotion-echo" component={EmotionEcho} />
      <Route path="/duet-discovery" component={DuetDiscovery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
