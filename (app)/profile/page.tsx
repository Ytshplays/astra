
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, onSnapshot, setDoc, collection, getDocs, query } from 'firebase/firestore';

type UserProfileData = {
    bio: string;
    favoriteGenres: string[];
}

export default function ProfilePage() {
    const [user] = useAuthState(auth);
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    
    const [profileData, setProfileData] = useState<UserProfileData>({bio: '', favoriteGenres: []});
    const [gamesOwned, setGamesOwned] = useState(0);
    const [totalAchievements, setTotalAchievements] = useState(0);
    const [recentAchievements, setRecentAchievements] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setProfileData({
                    bio: data.bio || 'A new player exploring the Nexus Hub.',
                    favoriteGenres: data.favoriteGenres || ['RPG', 'Strategy', 'Indie'],
                });
            }
        });
        
        const gamesColRef = collection(db, 'users', user.uid, 'games');
        const unsubGames = onSnapshot(gamesColRef, (snapshot) => {
            setGamesOwned(snapshot.size);
            let achievementsUnlocked = 0;
            let recent: any[] = [];
            snapshot.docs.forEach(doc => {
                const game = doc.data();
                if (game.achievements) {
                    const unlocked = game.achievements.filter((a: any) => a.unlocked);
                    achievementsUnlocked += unlocked.length;
                    recent = [...recent, ...unlocked.map((a:any) => ({...a, gameTitle: game.title}))];
                }
            });
            setTotalAchievements(achievementsUnlocked);
            setRecentAchievements(recent.slice(0, 5));
        });

        return () => {
            unsubscribe();
            unsubGames();
        };

    }, [user]);

    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        favoriteGenres: ''
    });

    useEffect(() => {
        if(user) {
            setEditForm({ 
                name: user.displayName || '', 
                bio: profileData.bio,
                favoriteGenres: profileData.favoriteGenres.join(', ')
            });
        }
    }, [user, profileData, isEditing]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be signed in to update your profile.' });
            return;
        }
        try {
            await updateProfile(user, { displayName: editForm.name });
            
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                bio: editForm.bio,
                favoriteGenres: editForm.favoriteGenres.split(',').map(g => g.trim()),
            }, { merge: true });

            toast({ title: 'Profile Updated', description: 'Your changes have been successfully saved.' });
        } catch(e) {
            const error = e as Error;
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        }
        setIsEditing(false);
    };

    const userName = user?.displayName || 'Nexus Player';
    const userHandle = user?.email ? `@${user.email.split('@')[0]}`: '';
    const userAvatar = user?.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user?.uid}`;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-8 lg:col-span-1">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={userAvatar} alt={userName} data-ai-hint="person"/>
              <AvatarFallback className="text-3xl">
                {userName?.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userName}</h1>
              <p className="text-muted-foreground">{userHandle}</p>
            </div>
            <p className="text-sm">{profileData.bio}</p>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" value={editForm.name} onChange={handleInputChange} className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <Textarea id="bio" name="bio" value={editForm.bio} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="favoriteGenres" className="text-right">
                      Genres
                    </Label>
                    <Input id="favoriteGenres" name="favoriteGenres" placeholder="RPG, Strategy, Indie" value={editForm.favoriteGenres} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                  <Button type="submit" onClick={handleSave}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Favorite Genres</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {profileData.favoriteGenres.length > 0 ? (
                    profileData.favoriteGenres.map(genre => (
                        <Badge key={genre} variant="secondary" className="text-base py-1 px-3">{genre}</Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No favorite genres set yet.</p>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-8 lg:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">Games Owned</p>
                    <p className="text-3xl font-bold">{gamesOwned}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">Achievements Unlocked</p>
                    <p className="text-3xl font-bold">{totalAchievements}</p>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAchievements.length > 0 ? (
                <ul className="space-y-4">
                    {recentAchievements.map(ach => (
                        <li key={ach.id} className="flex items-center gap-4">
                            <Trophy className="h-6 w-6 text-accent" />
                            <div>
                                <p className="font-medium">Unlocked: <span className='font-bold'>{ach.title}</span></p>
                                <p className="text-sm text-muted-foreground">in {ach.gameTitle}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">No recent activity to show.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
