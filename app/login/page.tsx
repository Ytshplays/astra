
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NexusLogo } from '@/components/nexus-logo';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GrokParticleBackground } from '@/components/grok-particle-background';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const createUserProfile = async (user: any, displayName?: string) => {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`,
            friends: [],
            bio: 'A new player exploring Astra.',
            favoriteGenres: [],
        });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      toast({ title: 'Success', description: "You're now signed in." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: "You're now signed in." });
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const name = email.split('@')[0];
        await updateProfile(result.user, { displayName: name });
        await createUserProfile(result.user, name);
        toast({ title: 'Account Created', description: "You're now signed in." });
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isLogin ? 'Sign In Failed' : 'Sign Up Failed',
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <GrokParticleBackground config="login" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 animated-gradient">
        <div className="absolute top-4 left-4">
            <NexusLogo />
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Create an Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to access your unified gaming universe.' : 'Join Astra today!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              Sign in with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="w-full text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-primary underline-offset-4 hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
