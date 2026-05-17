import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  Music, 
  Share2, 
  Users, 
  Clock, 
  Trophy, 
  Headphones, 
  ArrowRight, 
  Plus,
  User as UserIcon,
  CornerRightUp,
  Mail,
  CheckCircle2,
  Globe
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Types for duet discovery
interface DuetInvite {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  genreName: string;
  regionName?: string;
  message: string;
  status: 'pending' | 'accepted' | 'completed' | 'expired';
  createdAt: string;
  expiresAt: string;
}

interface Friend {
  id: string;
  name: string;
  image: string;
  email: string;
  status: 'online' | 'offline';
  lastActive: string;
}

interface DuetReward {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
}

// Sample data
const sampleFriends: Friend[] = [
  {
    id: 'friend-1',
    name: 'Maya Thompson',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'maya@example.com',
    status: 'online',
    lastActive: new Date().toISOString()
  },
  {
    id: 'friend-2',
    name: 'Raj Patel',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'raj@example.com',
    status: 'offline',
    lastActive: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'friend-3',
    name: 'Sofia Garcia',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'sofia@example.com',
    status: 'online',
    lastActive: new Date().toISOString()
  },
  {
    id: 'friend-4',
    name: 'James Wilson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'james@example.com',
    status: 'offline',
    lastActive: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

const samplePendingInvites: DuetInvite[] = [
  {
    id: 'invite-1',
    senderId: 'friend-1',
    senderName: 'Maya Thompson',
    senderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    receiverId: 'user-123',
    receiverName: 'You',
    genreName: 'K-Pop',
    regionName: 'East Asia',
    message: 'Let\'s explore K-Pop together! I heard some amazing new tracks.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: 'invite-2',
    senderId: 'friend-3',
    senderName: 'Sofia Garcia',
    senderImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    receiverId: 'user-123',
    receiverName: 'You',
    genreName: 'Afrobeat',
    regionName: 'West Africa',
    message: 'I discovered this amazing Afrobeat playlist. Want to explore it together?',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  }
];

const sampleSentInvites: DuetInvite[] = [
  {
    id: 'sent-1',
    senderId: 'user-123',
    senderName: 'You',
    senderImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
    receiverId: 'friend-2',
    receiverName: 'Raj Patel',
    genreName: 'Classical Indian',
    regionName: 'South Asia',
    message: 'Would love to explore some classical Indian music with you!',
    status: 'pending',
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  }
];

const sampleCompletedDuets: DuetInvite[] = [
  {
    id: 'completed-1',
    senderId: 'friend-4',
    senderName: 'James Wilson',
    senderImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    receiverId: 'user-123',
    receiverName: 'You',
    genreName: 'Jazz',
    regionName: 'North America',
    message: 'Jazz exploration session complete! That was amazing!',
    status: 'completed',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    expiresAt: new Date(Date.now() - 518400000).toISOString() // 6 days ago
  },
  {
    id: 'completed-2',
    senderId: 'user-123',
    senderName: 'You',
    senderImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
    receiverId: 'friend-1',
    receiverName: 'Maya Thompson',
    genreName: 'Reggae',
    regionName: 'Caribbean',
    message: 'Reggae session was fantastic! Let\'s do it again sometime.',
    status: 'completed',
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
    expiresAt: new Date(Date.now() - 1123200000).toISOString() // 13 days ago
  }
];

const sampleRewards: DuetReward[] = [
  {
    id: 'reward-1',
    title: 'First Duet',
    description: 'Complete your first music discovery duet with a friend',
    points: 50,
    icon: '🎵'
  },
  {
    id: 'reward-2',
    title: 'Global Explorer',
    description: 'Complete duets exploring music from 5 different regions',
    points: 200,
    icon: '🌎'
  },
  {
    id: 'reward-3',
    title: 'Genre Adventurer',
    description: 'Explore 10 different music genres through duets',
    points: 300,
    icon: '🎸'
  },
  {
    id: 'reward-4',
    title: 'Social Butterfly',
    description: 'Complete duets with 5 different friends',
    points: 250,
    icon: '🦋'
  },
  {
    id: 'reward-5',
    title: 'Weekly Duet',
    description: 'Complete at least one duet every week for a month',
    points: 400,
    icon: '📅'
  }
];

// Genre options for the invite form
const genreOptions = [
  { id: 'genre-1', name: 'Afrobeat', region: 'West Africa' },
  { id: 'genre-2', name: 'K-Pop', region: 'East Asia' },
  { id: 'genre-3', name: 'Reggae', region: 'Caribbean' },
  { id: 'genre-4', name: 'Flamenco', region: 'Europe' },
  { id: 'genre-5', name: 'Classical Indian', region: 'South Asia' },
  { id: 'genre-6', name: 'Jazz', region: 'North America' },
  { id: 'genre-7', name: 'Bossa Nova', region: 'South America' },
  { id: 'genre-8', name: 'Aboriginal', region: 'Oceania' },
  { id: 'genre-9', name: 'Arabic Pop', region: 'Middle East' }
];

export default function DuetDiscovery() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("invites");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [inviteForm, setInviteForm] = useState({
    genreId: '',
    message: ''
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [sentInvites, setSentInvites] = useState(sampleSentInvites);
  const [pendingInvites, setPendingInvites] = useState(samplePendingInvites);
  const [completedDuets, setCompletedDuets] = useState(sampleCompletedDuets);
  
  const handleInviteSend = () => {
    if (!selectedFriend) return;
    if (!inviteForm.genreId) {
      toast({
        title: "Missing genre",
        description: "Please select a genre to explore together",
        variant: "destructive"
      });
      return;
    }
    
    const selectedGenre = genreOptions.find(g => g.id === inviteForm.genreId);
    if (!selectedGenre) return;
    
    // Create new invite
    const newInvite: DuetInvite = {
      id: `sent-${Date.now()}`,
      senderId: 'user-123',
      senderName: 'You',
      senderImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
      receiverId: selectedFriend.id,
      receiverName: selectedFriend.name,
      genreName: selectedGenre.name,
      regionName: selectedGenre.region,
      message: inviteForm.message || `Let's explore ${selectedGenre.name} music together!`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString() // Expires in 24 hours
    };
    
    // Add to sent invites
    setSentInvites([newInvite, ...sentInvites]);
    
    // Reset form and close dialog
    setInviteForm({ genreId: '', message: '' });
    setSelectedFriend(null);
    setInviteDialogOpen(false);
    
    toast({
      title: "Invite sent!",
      description: `Duet invite sent to ${selectedFriend.name}`,
    });
  };
  
  const handleAcceptInvite = (inviteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to accept duet invites",
        variant: "destructive"
      });
      return;
    }
    
    // Update pending invites
    setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
    
    // Simulate moving to completed after "listening together"
    setTimeout(() => {
      const accepted = pendingInvites.find(invite => invite.id === inviteId);
      if (accepted) {
        const completed = {
          ...accepted,
          status: 'completed' as const,
          message: `You explored ${accepted.genreName} together. Great duet!`
        };
        setCompletedDuets([completed, ...completedDuets]);
        
        toast({
          title: "Duet completed!",
          description: `You earned 50 points for completing a duet with ${accepted.senderName}`,
        });
      }
    }, 500);
    
    toast({
      title: "Invite accepted!",
      description: "Redirecting to discovery session...",
    });
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return format(date, 'MMM d');
  };
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col w-full">
        <MobileNav />
        
        <main className="flex-1 w-full overflow-y-auto p-3 sm:p-6">
          <div className="w-full mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Duet Discovery</h1>
                <p className="text-muted-foreground mt-1">
                  Explore new music together with friends and earn rewards
                </p>
              </div>
              
              <Button 
                onClick={() => setInviteDialogOpen(true)}
                className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
              >
                <Users size={16} />
                <span>Invite a Friend</span>
              </Button>
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">
              {/* Main content - Invites and History */}
              <div className="order-2 lg:order-1 lg:col-span-2">
                <Tabs defaultValue="invites" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="invites" className="relative">
                      Invites
                      {pendingInvites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {pendingInvites.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  
                  {/* Pending Invites Tab */}
                  <TabsContent value="invites" className="mt-4">
                    {pendingInvites.length === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No pending invites</h3>
                        <p className="text-muted-foreground mb-4">
                          You don't have any duet discovery invites yet
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setInviteDialogOpen(true)}
                          className="bg-primary/10"
                        >
                          Invite Friends
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingInvites.map(invite => (
                          <Card key={invite.id} className="overflow-hidden border-primary/10">
                            <div className="flex flex-col sm:flex-row">
                              <div className="w-full sm:max-w-[30%] bg-primary/5 p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                                <div className="flex items-center sm:flex-col w-full">
                                  <Avatar className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mb-0 sm:mb-2 flex-shrink-0">
                                    <AvatarImage src={invite.senderImage} alt={invite.senderName} />
                                    <AvatarFallback>{invite.senderName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="ml-3 sm:ml-0 text-left sm:text-center">
                                    <h3 className="font-medium text-sm sm:text-base">{invite.senderName}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      {formatTimeAgo(invite.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="mt-2 bg-primary/10 text-xs whitespace-nowrap">
                                  {invite.genreName}
                                </Badge>
                              </div>
                              
                              <div className="flex-1 p-3 sm:p-4 flex flex-col">
                                <div className="mb-auto">
                                  <div className="flex items-center mb-2">
                                    <Music className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                    <h3 className="font-medium text-sm sm:text-base">Duet Discovery Invite</h3>
                                  </div>
                                  <p className="text-xs sm:text-sm mb-3 italic">"{invite.message}"</p>
                                  
                                  <div className="bg-muted/30 p-2 sm:p-3 rounded-md mb-3">
                                    <div className="flex items-center text-xs sm:text-sm">
                                      <Globe className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                      <span className="line-clamp-1">{invite.regionName} music exploration</span>
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm mt-1">
                                      <Clock className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                      <span>Expires in {Math.floor((new Date(invite.expiresAt).getTime() - Date.now()) / 3600000)} hours</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col xs:flex-row gap-2 mt-2">
                                  <Button 
                                    className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-9"
                                    onClick={() => handleAcceptInvite(invite.id)}
                                  >
                                    Accept Invite
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="flex-1 text-xs sm:text-sm py-1 h-8 sm:h-9"
                                    onClick={() => {
                                      setPendingInvites(pendingInvites.filter(i => i.id !== invite.id));
                                      toast({
                                        title: "Invite declined",
                                        description: "The duet invitation has been declined",
                                      });
                                    }}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Sent Invites Tab */}
                  <TabsContent value="sent" className="mt-4">
                    {sentInvites.length === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <CornerRightUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No sent invites</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't sent any duet discovery invites yet
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setInviteDialogOpen(true)}
                          className="bg-primary/10"
                        >
                          Invite Friends
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sentInvites.map(invite => (
                          <Card key={invite.id} className="overflow-hidden">
                            <div className="flex items-center p-4">
                              <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src={invite.receiverImage} alt={invite.receiverName} />
                                <AvatarFallback>{invite.receiverName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-medium">{invite.receiverName}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-amber-500/10 text-amber-600 border-amber-200"
                                  >
                                    Pending
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  {invite.genreName} • {invite.regionName}
                                </p>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Sent {formatTimeAgo(invite.createdAt)}
                                  </span>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => {
                                      setSentInvites(sentInvites.filter(i => i.id !== invite.id));
                                      toast({
                                        title: "Invite cancelled",
                                        description: "Your duet invitation has been cancelled",
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* History Tab */}
                  <TabsContent value="history" className="mt-4">
                    {completedDuets.length === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No completed duets</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't completed any discovery duets yet
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("invites")}
                          className="bg-primary/10"
                        >
                          Check Invites
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {completedDuets.map(duet => (
                          <Card key={duet.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-1/3 bg-muted/20 p-4 flex items-center">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    {duet.senderId === 'user-123' ? (
                                      <>
                                        <AvatarImage src={duet.receiverImage} alt={duet.receiverName} />
                                        <AvatarFallback>{duet.receiverName.charAt(0)}</AvatarFallback>
                                      </>
                                    ) : (
                                      <>
                                        <AvatarImage src={duet.senderImage} alt={duet.senderName} />
                                        <AvatarFallback>{duet.senderName.charAt(0)}</AvatarFallback>
                                      </>
                                    )}
                                  </Avatar>
                                  
                                  <div>
                                    <h3 className="font-medium">
                                      {duet.senderId === 'user-123' ? duet.receiverName : duet.senderName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                      {formatTimeAgo(duet.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <Music className="h-4 w-4 mr-2 text-primary" />
                                    <h3 className="font-medium">{duet.genreName} Exploration</h3>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-green-500/10 text-green-600 border-green-200"
                                  >
                                    Completed
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  {duet.regionName} • +50 points earned
                                </p>
                                
                                <div className="text-sm text-muted-foreground italic">
                                  "{duet.message}"
                                </div>
                                
                                <div className="flex justify-end mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary text-xs"
                                    onClick={() => {
                                      toast({
                                        title: "Coming Soon",
                                        description: "Duet analysis will be available soon!",
                                      });
                                    }}
                                  >
                                    View Recommendations
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar - Rewards and Friends */}
              <div className="space-y-6">
                {/* Rewards Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" /> Duet Rewards
                    </CardTitle>
                    <CardDescription>
                      Earn points by discovering music together
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sampleRewards.map((reward, index) => (
                      <div 
                        key={reward.id} 
                        className={`flex items-center p-3 rounded-lg ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'border border-muted hover:bg-muted/20'}`}
                      >
                        <div className="text-2xl mr-3">{reward.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{reward.title}</h4>
                          <p className="text-xs text-muted-foreground">{reward.description}</p>
                        </div>
                        <div className="text-primary font-semibold">+{reward.points}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Friends Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> Friends
                    </CardTitle>
                    <CardDescription>
                      People to explore music with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleFriends.map(friend => (
                        <div 
                          key={friend.id}
                          className="flex items-center p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedFriend(friend);
                            setInviteDialogOpen(true);
                          }}
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={friend.image} alt={friend.name} />
                              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div 
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-background
                                ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}
                            ></div>
                          </div>
                          
                          <div className="ml-3 flex-1">
                            <div className="font-medium">{friend.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {friend.status === 'online' ? 'Online now' : `Last seen ${formatTimeAgo(friend.lastActive)}`}
                            </div>
                          </div>
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full mt-3 text-primary border border-dashed border-primary/30"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Friend
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Invite Friend Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to Duet Discovery</DialogTitle>
            <DialogDescription>
              Select a genre to explore together and send an invitation
            </DialogDescription>
          </DialogHeader>
          
          {selectedFriend ? (
            <div className="flex items-center p-3 bg-muted/30 rounded-lg mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedFriend.image} alt={selectedFriend.name} />
                <AvatarFallback>{selectedFriend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedFriend.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1" />
                  {selectedFriend.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div className="text-sm font-medium">Select a friend:</div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {sampleFriends.map(friend => (
                  <div 
                    key={friend.id}
                    className="flex items-center p-2 hover:bg-muted rounded-lg cursor-pointer"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={friend.image || ""} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm truncate">{friend.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select genre to explore</label>
              <select
                value={inviteForm.genreId}
                onChange={(e) => setInviteForm({...inviteForm, genreId: e.target.value})}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">-- Select a genre --</option>
                {genreOptions.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name} ({genre.region})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Personal message (optional)</label>
              <Input
                placeholder="Let's explore this music together!"
                value={inviteForm.message}
                onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setInviteForm({ genreId: '', message: '' });
                setSelectedFriend(null);
                setInviteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleInviteSend}
              disabled={!selectedFriend || !inviteForm.genreId}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}