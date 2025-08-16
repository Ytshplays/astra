
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  friends,
  games,
  upcomingReleases
} from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { WelcomeDialog } from './welcome-dialog';
import { GrokParticleBackground } from '@/components/grok-particle-background';

type UserGame = {
  id: string;
  title: string;
  platform: string;
  imageUrl: string;
  dataAiHint: string;
};

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  
  const onlineFriends = friends.filter((f) => f.status === 'online');
  const userName = user?.displayName?.split(' ')[0] || 'gamer';

  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const userGamesCollection = collection(db, 'users', user.uid, 'games');
        const gamesSnapshot = await getDocs(userGamesCollection);
        const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserGame));
        setUserGames(gamesList);
      } catch (error) {
        console.error('Error fetching user games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [user]);

  return (
    <>
      <WelcomeDialog />
      <GrokParticleBackground config="dashboard" />
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 console-scanlines p-4 sm:p-6 lg:p-8">
        <div className="space-y-1 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight console-text console-glow">
            [WELCOME] {userName.toUpperCase()}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-mono">
            &gt; System initialized. Gaming operations ready.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-3">
          <Card className="xl:col-span-2 console-border console-glow backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="console-text font-mono text-lg sm:text-xl">[RECENTLY PLAYED]</CardTitle>
              <CardDescription className="text-muted-foreground font-mono text-sm">
                &gt; Jump back into your favorite games.
              </CardDescription>
            </CardHeader>
                        <CardContent className="p-4 sm:p-6">
              {loading ? (
                <div className="text-center text-muted-foreground font-mono">
                  &gt; Loading your games...
                </div>
              ) : userGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {userGames.slice(0, 10).map((game) => (
                    <Link href="/games" key={game.id} className="group relative overflow-hidden rounded-lg console-border hover:console-glow-intense transition-all aspect-[3/4]">
                      <Image
                        src={game.imageUrl}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2">{game.title}</h3>
                        <p className="text-white/70 text-xs">{game.platform}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-32 sm:h-48 rounded-lg border-2 border-dashed console-border">
                      <p className="text-muted-foreground font-mono text-sm sm:text-base text-center px-4">&gt; No games in your library yet.</p>
                      <Button variant="link" asChild className="console-text hover:console-glow mt-2">
                        <Link href="/store" className="font-mono text-sm sm:text-base">[VISIT STORE]</Link>
                      </Button>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card className="console-border console-glow backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="console-text font-mono text-lg sm:text-xl">[FRIENDS ACTIVITY]</CardTitle>
              <CardDescription className="text-muted-foreground font-mono text-sm">
                &gt; See what your friends are up to.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ul className="space-y-3 sm:space-y-4">
                {onlineFriends.map((friend) => (
                  <li key={friend.id} className="flex items-center gap-3 sm:gap-4 transition-colors duration-200 hover:bg-[#00ff41]/5 p-2 rounded-md console-border">
                    <div className="relative">
                      <Avatar className="console-border w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person"/>
                        <AvatarFallback className="console-text bg-black/50 text-xs sm:text-sm">
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#00ff41] ring-1 sm:ring-2 ring-black console-glow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium console-text font-mono text-sm sm:text-base truncate">{friend.name}</p>
                      <p className="truncate text-xs sm:text-sm text-muted-foreground font-mono">
                        &gt; Playing {friend.playing}
                      </p>
                    </div>
                  </li>
                ))}
                {onlineFriends.length === 0 && (
                  <div className="text-center text-muted-foreground py-4 space-y-2">
                    <p className="font-mono text-sm sm:text-base">&gt; No friends currently online.</p>
                    <Button variant="secondary" size="sm" asChild className="console-border hover:console-glow">
                      <Link href="/social" className="font-mono text-xs sm:text-sm">[FIND FRIENDS]</Link>
                    </Button>
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Card className="console-border console-glow backdrop-blur-sm">
            <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="console-text font-mono text-lg sm:text-xl">[UPCOMING RELEASES]</CardTitle>
                <CardDescription className="text-muted-foreground font-mono text-sm">
                  &gt; Get hyped for the next big titles.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="console-border hover:console-glow w-full sm:w-auto">
                <Link href="#" className="console-text hover:console-glow font-mono text-xs sm:text-sm">
                  [VIEW ALL] <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6">
              {upcomingReleases.map((game) => (
                <div key={game.id} className="group relative overflow-hidden rounded-lg console-border hover:console-glow-intense transition-all aspect-video">
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={game.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white console-text">{game.title}</h3>
                    <p className="text-xs sm:text-sm text-white/80 font-mono">&gt; {game.releaseDate}</p>
                  </div>
                </div>
              ))}
              {upcomingReleases.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center h-32 sm:h-48 rounded-lg border-2 border-dashed console-border">
                      <p className="text-muted-foreground font-mono text-sm sm:text-base text-center px-4">&gt; No upcoming releases detected in database.</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
