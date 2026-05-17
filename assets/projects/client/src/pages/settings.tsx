import { useState, useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SpotifyConnect } from "@/components/spotify/spotify-connect";
import { SpotifyLoginButton } from "@/components/spotify/spotify-login-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  Sun,
  Moon,
  Volume2,
  Bell,
  Layers,
  Languages,
  Music2,
  Globe,
  User,
  Upload,
  Pencil,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [volume, setVolume] = useState(80);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [dataUsage, setDataUsage] = useState<"normal" | "high" | "low">("normal");
  const [language, setLanguage] = useState("english");
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const availableGenres = [
    { id: "world", name: "World Music" },
    { id: "classical", name: "Classical" },
    { id: "jazz", name: "Jazz" },
    { id: "electronic", name: "Electronic" },
    { id: "folk", name: "Folk" },
    { id: "rock", name: "Rock" }
  ];
  
  const toggleGenre = (genreId: string) => {
    if (preferredGenres.includes(genreId)) {
      setPreferredGenres(preferredGenres.filter(id => id !== genreId));
    } else {
      setPreferredGenres([...preferredGenres, genreId]);
    }
  };
  
  // Upload profile image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user?.id) return null;
      
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          profileImageUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };
  
  const resetSettings = () => {
    setVolume(80);
    setNotificationsEnabled(true);
    setAutoplayEnabled(true);
    setDataUsage("normal");
    setLanguage("english");
    setPreferredGenres([]);
    setTheme("dark");
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your experience and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative">
                          {user?.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt="Profile"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-8 w-8 text-primary/50" />
                            </div>
                          )}
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full"
                            onClick={() => setIsEditingProfile(true)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{user?.firstName || user?.email || "User"}</h3>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          {user?.streak && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">{user.streak} day streak</span>
                              <div className="w-2 h-2 rounded-full bg-primary ml-2 streak-pulse"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          <User className="h-4 w-4" /> Edit Profile
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = "/api/logout"}>
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                      </div>

                      {/* Edit Profile Dialog */}
                      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                              Customize your profile information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                              {profileImageUrl ? (
                                <img
                                  src={profileImageUrl}
                                  alt="Profile"
                                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-12 w-12 text-primary/50" />
                                </div>
                              )}
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <Button 
                                  variant="outline" 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" /> Change Photo
                                </Button>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="name">Display Name</Label>
                              <Input
                                id="name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your display name"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditingProfile(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => updateProfile.mutate()} 
                              disabled={updateProfile.isPending}
                            >
                              {updateProfile.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-4">Sign in to manage your account settings</p>
                      <Button onClick={() => window.location.href = "/api/login"}>
                        Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Spotify Integration */}
              <Card>
                <CardHeader>
                  <CardTitle>Spotify Integration</CardTitle>
                  <CardDescription>
                    Connect your Spotify account for personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.spotifyConnected ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-green-500">
                        <LogOut className="h-5 w-5" />
                        <span>Your Spotify account is connected</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You can now enjoy personalized music recommendations and explore music from around the world
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        Sign in with Spotify to discover music from different cultures based on your preferences and explore new sounds from around the world.
                      </p>
                      <SpotifyLoginButton />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Appearance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how Soundora looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"} 
                        className="flex items-center gap-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" /> Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" /> Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => setTheme("system")}
                      >
                        <Layers className="h-4 w-4" /> System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Audio Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Audio</CardTitle>
                  <CardDescription>
                    Control your audio playback preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume">Volume</Label>
                      <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="volume"
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setVolume(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoplay">Autoplay</Label>
                      <Switch
                        id="autoplay"
                        checked={autoplayEnabled}
                        onCheckedChange={setAutoplayEnabled}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically play music when starting a challenge
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="quality">Audio Quality</Label>
                    <Select value={dataUsage} onValueChange={(value) => setDataUsage(value as "normal" | "high" | "low")}>
                      <SelectTrigger id="quality">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Data Saver)</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage notifications and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Notification Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Challenge</span>
                        <Switch defaultChecked disabled={!notificationsEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Achievements</span>
                        <Switch defaultChecked disabled={!notificationsEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Friend Activity</span>
                        <Switch disabled={!notificationsEnabled} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Language</CardTitle>
                  <CardDescription>
                    Choose your preferred language
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="language">Display Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="flex items-center">
                        <Languages className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Español</SelectItem>
                        <SelectItem value="french">Français</SelectItem>
                        <SelectItem value="german">Deutsch</SelectItem>
                        <SelectItem value="portuguese">Português</SelectItem>
                        <SelectItem value="chinese">中文</SelectItem>
                        <SelectItem value="japanese">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Content Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Preferences</CardTitle>
                  <CardDescription>
                    Select your preferred genres and regions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Genres</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableGenres.map(genre => (
                        <Button
                          key={genre.id}
                          variant={preferredGenres.includes(genre.id) ? "default" : "outline"}
                          size="sm"
                          className="justify-start"
                          onClick={() => toggleGenre(genre.id)}
                        >
                          <Music2 className="mr-2 h-4 w-4" />
                          {genre.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Featured Region</Label>
                    <Select defaultValue="global">
                      <SelectTrigger id="region" className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="southAmerica">South America</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings}>
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
