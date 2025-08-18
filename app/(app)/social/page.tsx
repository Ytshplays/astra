
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
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
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
        return <div className="text-center py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <p className="text-lg text-muted-foreground">No friends yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Use the search to find and add friends!</p>
        </div>
    }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map((friend) => (
        <li key={friend.id}>
          <Card className="h-full transition-all duration-300 hover:border-primary/60 hover:bg-card/90 animated-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person" />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                   {friend.status === 'online' && <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-accent ring-2 ring-card" />}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">{friend.name}</p>
                {friend.playing ? (
                  <p className="truncate text-sm text-muted-foreground">
                    Playing {friend.playing}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Not in a game
                  </p>
                )}
              </div>
               <Button size="icon" variant="outline" onClick={() => onChat(friend)}>
                    <MessageCircle className="h-5 w-5" />
                </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
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
                    status: 'offline', // Placeholder status
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
    const userDocRef = doc(db, 'users', user.uid);
    const friendDocRef = doc(db, 'users', request.from);
    
    await updateDoc(userDocRef, { friends: arrayUnion(request.from) });
    await updateDoc(friendDocRef, { friends: arrayUnion(user.uid) });
    
    await updateDoc(doc(db, 'friend_requests', request.id), { status: 'accepted' });
    toast({ title: 'Friend Added!', description: `You are now friends with ${request.fromName}` });
  }

  const handleDecline = async (id: string) => {
    await updateDoc(doc(db, 'friend_requests', id), { status: 'declined' });
    toast({ title: 'Request Declined' });
  }

  return (
    <>
      <GrokParticleBackground config="social" />
      <div className="flex flex-col gap-8 console-scanlines">
        {/* Console Status Bar */}
        <div className="console-status-bar">
          <span>[ASTRA SOCIAL] - NETWORK ACCESS</span>
          <span>{friends.length} CONNECTIONS | STATUS: ONLINE</span>
        </div>

      <Card className="console-border console-glow backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="console-text font-mono">[SOCIAL HUB]</CardTitle>
          <CardDescription className="text-muted-foreground font-mono">
            &gt; Connect with friends and fellow gamers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative flex-1">
                <Input 
                    type="email" 
                    placeholder="Find friends by email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="console-input font-mono"
                />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="console-border hover:console-glow">
              <Search className="mr-2 h-4 w-4" /> {isSearching ? 'Searching...' : '[SEARCH]'}
            </Button>
          </div>
          {searchResults.length > 0 && (
             <div className='mt-4 space-y-2'>
                <h3 className='font-semibold console-text font-mono'>[SEARCH RESULTS]</h3>
                {searchResults.map(foundUser => (
                     <Card key={foundUser.uid} className="console-border">
                          <CardContent className="flex items-center gap-4 p-4">
                              <Avatar className="h-12 w-12 console-border">
                                  <AvatarImage src={foundUser.photoURL} alt={foundUser.displayName} data-ai-hint="person" />
                                  <AvatarFallback className="console-text bg-black/50">{foundUser.displayName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                  <p className="font-semibold console-text font-mono">{foundUser.displayName}</p>
                                  <p className="text-sm text-muted-foreground font-mono">&gt; {foundUser.email}</p>
                              </div>
                              <Button size="sm" onClick={() => handleSendRequest(foundUser.uid)} className="console-border hover:console-glow">
                                <UserPlus className='mr-2' /> [ADD FRIEND]
                              </Button>
                          </CardContent>
                      </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px] console-border">
          <TabsTrigger value="all" className="console-text font-mono data-[state=active]:console-glow">[ALL FRIENDS] ({friends.length})</TabsTrigger>
          <TabsTrigger value="online" className="console-text font-mono data-[state=active]:console-glow">[ONLINE] ({friends.filter(f => f.status === 'online').length})</TabsTrigger>
          <TabsTrigger value="pending" className="console-text font-mono data-[state=active]:console-glow">
            [PENDING]
            {pendingRequests.length > 0 && 
            <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#00ff41] text-black text-xs font-bold console-glow">
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
        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((request) => (
                  <li key={request.id}>
                      <Card className="animated-card">
                          <CardContent className="flex items-center gap-4 p-4">
                              <Avatar className="h-12 w-12">
                                  <AvatarImage src={request.fromAvatar} alt={request.fromName} data-ai-hint="person" />
                                  <AvatarFallback>{request.fromName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                  <p className="font-semibold">{request.fromName}</p>
                                  <p className="text-sm text-muted-foreground">Friend Request</p>
                              </div>
                              <div className="flex gap-2">
                                  <Button size="icon" className="h-9 w-9 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleAccept(request)}>
                                    <Check className="h-5 w-5" />
                                  </Button>
                                  <Button size="icon" className="h-9 w-9" variant="destructive" onClick={() => handleDecline(request.id)}>
                                    <X className="h-5 w-5" />
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
                <p className="text-lg text-muted-foreground">No pending friend requests.</p>
                <p className="text-sm text-muted-foreground mt-1">Your social circle is all up to date!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ChatDialog friend={chatFriend} isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
    </>
  );
}
