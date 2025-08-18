
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, MessageCircle, Search, UserPlus, X } from 'lucide-react';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GrokParticleBackground } from '@/components/grok-particle-background';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, arrayUnion, arrayRemove, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';


const statusStyles = {
  online: 'border-accent text-accent bg-accent/20',
  offline: 'border-muted-foreground/50 text-muted-foreground',
  idle: 'border-yellow-500/80 text-yellow-500 bg-yellow-500/20',
};

type UserProfile = {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
}

type Friend = {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'idle';
    playing: string;
}

type FriendRequest = {
    id: string;
    from: string;
    fromName: string;
    fromAvatar: string;
}

function ChatDialog({ friend, isOpen, onOpenChange }: { friend: Friend | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState<{ id: string, text: string, senderId: string, timestamp: any }[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const chatId = useMemo(() => {
        if (!user || !friend) return null;
        return [user.uid, friend.id].sort().join('_');
    }, [user, friend]);

    useEffect(() => {
        if (!chatId) return;
        const messagesQuery = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'), limit(50));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !chatId) return;

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: newMessage,
            senderId: user.uid,
            timestamp: serverTimestamp()
        });
        setNewMessage('');
    };

    if (!friend) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] h-[70vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chat with {friend.name}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.uid ? "justify-end" : "justify-start")}>
                           {msg.senderId !== user?.uid && <Avatar className='h-8 w-8'><AvatarImage src={friend.avatar} /><AvatarFallback>{friend.name[0]}</AvatarFallback></Avatar>}
                            <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", msg.senderId === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <form onSubmit={handleSendMessage} className='w-full flex gap-2'>
                        <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder='Type a message...' className='min-h-0 h-10' />
                        <Button type="submit">Send</Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function FriendList({ friends, onChat }: { friends: Friend[], onChat: (friend: Friend) => void }) {
    if (friends.length === 0) {
        return <div className="text-center py-8 sm:py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <p className="text-base sm:text-lg text-muted-foreground font-mono console-text">No friends yet.</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-mono">Use the search to find and add friends!</p>
        </div>
    }
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map((friend) => (
        <Card key={friend.id} className="h-full transition-all duration-300 hover:border-primary/60 hover:bg-card/90 animated-card console-border">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="relative self-center sm:self-auto">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-border console-border">
                  <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person" />
                  <AvatarFallback className="console-text bg-black/50">{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                 {friend.status === 'online' && <span className="absolute bottom-0 right-0 block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-accent ring-2 ring-card" />}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-sm sm:text-lg font-semibold console-text font-mono truncate">{friend.name}</p>
              {friend.playing ? (
                <p className="truncate text-xs sm:text-sm text-muted-foreground font-mono">
                  Playing {friend.playing}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground italic font-mono">
                  Not in a game
                </p>
              )}
            </div>
             <Button size="sm" variant="outline" onClick={() => onChat(friend)} className="console-border hover:console-glow w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">[CHAT]</span>
              </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SocialPage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [chatFriend, setChatFriend] = useState<Friend | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = (friend: Friend) => {
    setChatFriend(friend);
    setIsChatOpen(true);
  }

  const fetchFriends = useCallback(async () => {
    if(!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
        const userData = snapshot.data();
        if (userData?.friends) {
            const friendDocs = await getDocs(query(collection(db, 'users'), where('uid', 'in', userData.friends)));
            const friendList = friendDocs.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.uid,
                    name: data.displayName,
                    avatar: data.photoURL,
                    status: 'offline' as 'offline' | 'online' | 'idle', // Properly typed status
                    playing: ''
                }
            })
            setFriends(friendList);
        } else {
            setFriends([]);
        }
    });
    return unsubscribe;
  }, [user]);

  const fetchFriendRequests = useCallback(async () => {
    if(!user) return;
    const requestsQuery = query(collection(db, 'friend_requests'), where('to', '==', user.uid));
    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FriendRequest));
        setPendingRequests(requests);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    let unsubs: (()=>void)[] = [];
    if(user) {
        fetchFriends().then(unsub => unsub && unsubs.push(unsub));
        fetchFriendRequests().then(unsub => unsub && unsubs.push(unsub));
    }
    return () => unsubs.forEach(unsub => unsub());
  }, [user, fetchFriends, fetchFriendRequests]);
  
  const handleSearch = async () => {
      if(!searchTerm.trim() || !user) return;
      setIsSearching(true);
      // Use single field query to avoid compound index requirement
      const usersQuery = query(collection(db, 'users'), where('email', '==', searchTerm.trim()));
      const querySnapshot = await getDocs(usersQuery);
      // Filter out current user on client side
      const results = querySnapshot.docs
        .map(doc => doc.data() as UserProfile)
        .filter(userData => userData.uid !== user.uid);
      setSearchResults(results);
      setIsSearching(false);
  }
  
  const handleSendRequest = async (toUid: string) => {
      if(!user) return;
      await addDoc(collection(db, 'friend_requests'), {
          from: user.uid,
          fromName: user.displayName,
          fromAvatar: user.photoURL,
          to: toUid,
          status: 'pending'
      });
      toast({ title: 'Success', description: 'Friend request sent!' });
  }

  const handleAccept = async (request: FriendRequest) => {
    if(!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const friendDocRef = doc(db, 'users', request.from);
      
      // Check if user documents exist, create if they don't
      const [userDoc, friendDoc] = await Promise.all([
        getDoc(userDocRef),
        getDoc(friendDocRef)
      ]);
      
      // Create user document if it doesn't exist
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'ASTRA Player',
          photoURL: user.photoURL || '',
          bio: 'A new player exploring the ASTRA platform.',
          status: 'Online',
          friends: [],
          games: [],
          achievements: [],
          joinedAt: new Date()
        });
      }
      
      // Create friend document if it doesn't exist
      if (!friendDoc.exists()) {
        await setDoc(friendDocRef, {
          uid: request.from,
          displayName: request.fromName || 'ASTRA Player',
          photoURL: request.fromAvatar || '',
          bio: 'A new player exploring the ASTRA platform.',
          status: 'Online',
          friends: [],
          games: [],
          achievements: [],
          joinedAt: new Date()
        });
      }
      
      // Now safely update both documents
      await updateDoc(userDocRef, { friends: arrayUnion(request.from) });
      await updateDoc(friendDocRef, { friends: arrayUnion(user.uid) });
      
      await updateDoc(doc(db, 'friend_requests', request.id), { status: 'accepted' });
      toast({ title: 'Friend Added!', description: `You are now friends with ${request.fromName}` });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({ 
        variant: 'destructive',
        title: 'Error', 
        description: 'Failed to accept friend request. Please try again.' 
      });
    }
  }

  const handleDecline = async (id: string) => {
    await updateDoc(doc(db, 'friend_requests', id), { status: 'declined' });
    toast({ title: 'Request Declined' });
  }

  return (
    <>
      <GrokParticleBackground config="social" />
      <div className="flex flex-col gap-4 md:gap-8 console-scanlines max-w-7xl mx-auto w-full">
        {/* Console Status Bar */}
        <div className="console-status-bar text-xs md:text-sm">
          <span>[ASTRA SOCIAL] - NETWORK ACCESS</span>
          <span className="hidden sm:inline">{friends.length} CONNECTIONS | STATUS: ONLINE</span>
        </div>

      <Card className="console-border console-glow backdrop-blur-sm w-full">
        <CardHeader className="pb-4">
          <CardTitle className="console-text font-mono text-lg md:text-xl">[SOCIAL HUB]</CardTitle>
          <CardDescription className="text-muted-foreground font-mono text-sm">
            &gt; Connect with friends and fellow gamers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:max-w-lg">
            <div className="relative flex-1">
                <Input 
                    type="email" 
                    placeholder="Find friends by email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="console-input font-mono text-sm"
                />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="console-border hover:console-glow w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">{isSearching ? 'Searching...' : '[SEARCH]'}</span><span className="sm:hidden">{isSearching ? '...' : 'FIND'}</span>
            </Button>
          </div>
          {searchResults.length > 0 && (
             <div className='mt-4 space-y-2'>
                <h3 className='font-semibold console-text font-mono text-sm md:text-base'>[SEARCH RESULTS]</h3>
                {searchResults.map(foundUser => (
                     <Card key={foundUser.uid} className="console-border">
                          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 console-border">
                                  <AvatarImage src={foundUser.photoURL} alt={foundUser.displayName} data-ai-hint="person" />
                                  <AvatarFallback className="console-text bg-black/50">{foundUser.displayName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                  <p className="font-semibold console-text font-mono text-sm sm:text-base truncate">{foundUser.displayName}</p>
                                  <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">&gt; {foundUser.email}</p>
                              </div>
                              <Button size="sm" onClick={() => handleSendRequest(foundUser.uid)} className="console-border hover:console-glow w-full sm:w-auto mt-2 sm:mt-0">
                                <UserPlus className='mr-2 h-3 w-3 sm:h-4 sm:w-4' /> <span className="text-xs sm:text-sm">[ADD FRIEND]</span>
                              </Button>
                          </CardContent>
                      </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 console-border">
          <TabsTrigger value="all" className="console-text font-mono text-xs sm:text-sm data-[state=active]:console-glow">
            <span className="hidden sm:inline">[ALL FRIENDS]</span><span className="sm:hidden">[ALL]</span> ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="online" className="console-text font-mono text-xs sm:text-sm data-[state=active]:console-glow">
            <span className="hidden sm:inline">[ONLINE]</span><span className="sm:hidden">[ON]</span> ({friends.filter(f => f.status === 'online').length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="console-text font-mono text-xs sm:text-sm data-[state=active]:console-glow">
            <span className="hidden sm:inline">[PENDING]</span><span className="sm:hidden">[REQ]</span>
            {pendingRequests.length > 0 && 
            <span className="ml-1 sm:ml-2 flex h-4 w-4 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#00ff41] text-black text-xs font-bold console-glow">
                {pendingRequests.length}
            </span>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <FriendList friends={friends} onChat={handleOpenChat} />
        </TabsContent>
        <TabsContent value="online" className="mt-6">
           <FriendList friends={friends.filter(f => f.status === 'online')} onChat={handleOpenChat} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4 sm:mt-6">
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pendingRequests.map((request) => (
                  <Card key={request.id} className="animated-card console-border">
                      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 console-border">
                              <AvatarImage src={request.fromAvatar} alt={request.fromName} data-ai-hint="person" />
                              <AvatarFallback className="console-text bg-black/50">{request.fromName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                              <p className="font-semibold console-text font-mono text-sm sm:text-base truncate">{request.fromName}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground font-mono">Friend Request</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                              <Button size="sm" className="flex-1 sm:flex-none h-8 w-8 sm:h-9 sm:w-9 bg-accent text-accent-foreground hover:bg-accent/90 console-border" onClick={() => handleAccept(request)}>
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button size="sm" className="flex-1 sm:flex-none h-8 w-8 sm:h-9 sm:w-9 console-border" variant="destructive" onClick={() => handleDecline(request.id)}>
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
                <p className="text-base sm:text-lg text-muted-foreground font-mono console-text">No pending friend requests.</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-mono">Your social circle is all up to date!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ChatDialog friend={chatFriend} isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
    </>
  );
}
