'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  declineFriendRequest,
  getPendingFriendRequests,
  getUserFriends,
  removeFriend,
  updateUserStatus,
  type Friend,
  type FriendRequest
} from '@/lib/friends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Trash2, 
  Mail,
  Gamepad2,
  Clock,
  Circle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function FriendsPanel() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set user as online when component mounts
    updateUserStatus(user.uid, 'online');

    // Listen for friends
    const unsubscribeFriends = getUserFriends(user.uid, setFriends);
    
    // Listen for pending requests
    const unsubscribeRequests = getPendingFriendRequests(user.uid, setPendingRequests);

    // Set user as offline when component unmounts
    return () => {
      updateUserStatus(user.uid, 'offline');
      unsubscribeFriends();
      unsubscribeRequests();
    };
  }, [user]);

  const handleSendFriendRequest = async () => {
    if (!user || !newFriendEmail.trim()) return;

    setIsAddingFriend(true);
    const result = await sendFriendRequest(
      user.uid,
      user.displayName || 'Unknown User',
      user.photoURL || '',
      newFriendEmail.trim()
    );

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      setNewFriendEmail('');
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsAddingFriend(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    const result = await acceptFriendRequest(requestId);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const handleDeclineRequest = async (requestId: string) => {
    const result = await declineFriendRequest(requestId);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    
    const result = await removeFriend(user.uid, friendId);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
      case 'away':
        return <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />;
      case 'in-game':
        return <Gamepad2 className="h-3 w-3 text-blue-500" />;
      default:
        return <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />;
    }
  };

  const getStatusText = (status: string, currentGame?: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'in-game':
        return currentGame ? `Playing ${currentGame}` : 'In Game';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Friend Section */}
      <Card className="console-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" />
            Add Friend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter friend's email address"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSendFriendRequest()}
            />
            <Button
              onClick={handleSendFriendRequest}
              disabled={isAddingFriend || !newFriendEmail.trim()}
              className="console-glow"
            >
              {isAddingFriend ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="console-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Mail className="h-5 w-5" />
              Friend Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.fromUserAvatar} />
                      <AvatarFallback>{request.fromUserName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.fromUserName}</p>
                      <p className="text-sm text-muted-foreground">Wants to be your friend</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="console-glow"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card className="console-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Friends ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No friends yet</p>
              <p className="text-sm">Add some friends to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.friendAvatar} />
                        <AvatarFallback>{friend.friendName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        {getStatusIcon(friend.status)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{friend.friendName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getStatusText(friend.status, friend.currentGame)}
                        {friend.status === 'offline' && friend.lastSeen && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last seen recently</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Friend</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to remove {friend.friendName} from your friends list?</p>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveFriend(friend.friendId)}
                          >
                            Remove Friend
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
