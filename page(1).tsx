'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trophy } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';

type UserProfileData = {
    bio: string;
    favoriteGenres: string[];
}

// Debounce utility for performance
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function ProfilePage() {
    const [user] = useAuthState(auth);
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    
    const [profileData, setProfileData] = useState<UserProfileData>({bio: '', favoriteGenres: []});
    const [gamesOwned, setGamesOwned] = useState(0);
    const [totalAchievements, setTotalAchievements] = useState(0);
    const [recentAchievements, setRecentAchievements] = useState<any[]>([]);

    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        favoriteGenres: ''
    });

    // Memoized user data to prevent unnecessary re-renders
    const userData = useMemo(() => ({
        userName: user?.displayName || 'ASTRA Player',
        userHandle: user?.email ? `@${user.email.split('@')[0]}` : '',
        userAvatar: user?.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user?.uid}`
    }), [user?.displayName, user?.email, user?.photoURL, user?.uid]);

    useEffect(() => {
        if (!user) return;
        
        const fetchProfileData = async () => {
            try {
                const profileDoc = await getDoc(doc(db, 'users', user.uid));
                if (profileDoc.exists()) {
                    const data = profileDoc.data() as UserProfileData;
                    setProfileData(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        
        fetchProfileData();
    }, [user?.uid]); // Only depend on user.uid, not entire user object

    useEffect(() => {
        if (user && isEditing) {
            setEditForm({
                name: user.displayName || '',
                bio: profileData.bio,
                favoriteGenres: profileData.favoriteGenres.join(', ')
            });
        }
    }, [user?.displayName, profileData.bio, profileData.favoriteGenres, isEditing]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!user) {
            toast({ 
                variant: 'destructive', 
                title: 'Error', 
                description: 'You must be signed in to update your profile.' 
            });
            return;
        }
        
        try {
            await updateProfile(user, { displayName: editForm.name });
            
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                bio: editForm.bio,
                favoriteGenres: editForm.favoriteGenres.split(',').map(g => g.trim()).filter(g => g),
            }, { merge: true });

            setIsEditing(false);
            toast({ 
                title: 'Profile Updated', 
                description: 'Your changes have been successfully saved.' 
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({ 
                variant: 'destructive', 
                title: 'Update Failed', 
                description: 'Failed to update profile. Please try again.' 
            });
        }
    }, [user, toast]);

    // Debounced search for better performance if dealing with large data sets
    const debouncedEditForm = useDebounce(editForm, 300);

    // Memoized achievements list to prevent unnecessary re-renders
    const achievementsList = useMemo(() => {
        if (recentAchievements.length === 0) {
            return (
                <p className="text-sm text-muted-foreground">
                    No achievements yet. Start playing to earn some!
                </p>
            );
        }

        return (
            <div className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                    <div key={achievement.id || index} className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{achievement.name}</span>
                    </div>
                ))}
            </div>
        );
    }, [recentAchievements]);

    // Memoized genre badges to prevent unnecessary re-renders
    const genreBadges = useMemo(() => {
        return profileData.favoriteGenres.map((genre, index) => (
            <Badge key={`genre-${index}`} variant="secondary" className="text-xs">
                {genre}
            </Badge>
        ));
    }, [profileData.favoriteGenres]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4" role="form" aria-describedby="edit-profile-description">
                            <p id="edit-profile-description" className="sr-only">
                                Edit your display name, bio, and favorite gaming genres
                            </p>
                            <div>
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your display name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="favoriteGenres">Favorite Genres</Label>
                                <Input
                                    id="favoriteGenres"
                                    name="favoriteGenres"
                                    value={editForm.favoriteGenres}
                                    onChange={handleInputChange}
                                    placeholder="RPG, Action, Strategy (comma separated)"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={userData.userAvatar} alt={userData.userName} />
                                <AvatarFallback>{userData.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{userData.userName}</h2>
                                <p className="text-sm text-muted-foreground">{userData.userHandle}</p>
                            </div>
                            {profileData.bio && (
                                <p className="text-sm text-center text-muted-foreground">
                                    {profileData.bio}
                                </p>
                            )}
                            {profileData.favoriteGenres.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {genreBadges}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Games Owned</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{gamesOwned}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalAchievements}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Playtime</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0h</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {achievementsList}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
