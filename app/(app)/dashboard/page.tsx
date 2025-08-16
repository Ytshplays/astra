
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
      <div className="min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Welcome Header - Responsive */}
        <div className="mb-6 sm:mb-8 lg:mb-10 space-y-2 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight console-text console-glow">
            [WELCOME] {userName.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-mono">
            &gt; System initialized. Gaming operations ready.
          </p>
        </div>

        {/* Main Dashboard Grid - Fully Responsive */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4">
          
          {/* Recently Played Games - Takes 2/3 width on large screens, full width on mobile */}
          <Card className="lg:col-span-2 2xl:col-span-3 console-border console-glow backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="console-text font-mono text-base sm:text-lg md:text-xl">[RECENTLY PLAYED]</CardTitle>
              <CardDescription className="text-muted-foreground font-mono text-xs sm:text-sm">
                &gt; Jump back into your favorite games.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-32 sm:h-40 md:h-48">
                  <div className="text-center text-muted-foreground font-mono text-sm sm:text-base">
                    &gt; Loading your games...
                  </div>
                </div>
              ) : userGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                  {userGames.slice(0, 12).map((game) => (
                    <Link 
                      href="/games" 
                      key={game.id} 
                      className="group relative overflow-hidden rounded-lg console-border hover:console-glow-intense transition-all aspect-[3/4] min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
                    >
                      <Image
                        src={game.imageUrl}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                        <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-tight">{game.title}</h3>
                      </div>
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 rounded-lg border-2 border-dashed console-border">
                  <p className="text-muted-foreground font-mono text-xs sm:text-sm md:text-base text-center px-4">&gt; No games in your library yet.</p>
                  <Button variant="link" asChild className="console-text hover:console-glow mt-2">
                    <Link href="/store" className="font-mono text-xs sm:text-sm md:text-base">[VISIT STORE]</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Friends Activity - 1/3 width on large screens, full width on mobile */}
          <Card className="lg:col-span-1 2xl:col-span-1 console-border console-glow backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="console-text font-mono text-base sm:text-lg md:text-xl">[FRIENDS ACTIVITY]</CardTitle>
              <CardDescription className="text-muted-foreground font-mono text-xs sm:text-sm">
                &gt; See what your friends are up to.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <ul className="space-y-2 sm:space-y-3">
                {onlineFriends.slice(0, 6).map((friend) => (
                  <li key={friend.id} className="flex items-center gap-2 sm:gap-3 transition-colors duration-200 hover:bg-[#00ff41]/5 p-2 rounded-md console-border">
                    <div className="relative flex-shrink-0">
                      <Avatar className="console-border w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                        <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person"/>
                        <AvatarFallback className="console-text bg-black/50 text-xs">
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 block h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 rounded-full bg-[#00ff41] ring-1 ring-black console-glow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium console-text font-mono text-xs sm:text-sm truncate">{friend.name}</p>
                      <p className="truncate text-xs text-muted-foreground font-mono">
                        &gt; Playing {friend.playing}
                      </p>
                    </div>
                  </li>
                ))}
                {onlineFriends.length === 0 && (
                  <div className="text-center text-muted-foreground py-4 sm:py-6 space-y-2">
                    <p className="font-mono text-xs sm:text-sm">&gt; No friends currently online.</p>
                    <Button variant="secondary" size="sm" asChild className="console-border hover:console-glow">
                      <Link href="/social" className="font-mono text-xs">[FIND FRIENDS]</Link>
                    </Button>
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Releases - Full width section */}
        <div className="mt-6 sm:mt-8 lg:mt-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Card className="console-border console-glow backdrop-blur-sm">
            <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="console-text font-mono text-base sm:text-lg md:text-xl">[UPCOMING RELEASES]</CardTitle>
                <CardDescription className="text-muted-foreground font-mono text-xs sm:text-sm">
                  &gt; Get hyped for the next big titles.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="console-border hover:console-glow w-full sm:w-auto">
                <Link href="#" className="console-text hover:console-glow font-mono text-xs sm:text-sm">
                  [VIEW ALL] <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {upcomingReleases.map((game) => (
                  <div key={game.id} className="group relative overflow-hidden rounded-lg console-border hover:console-glow-intense transition-all aspect-video min-h-[120px] sm:min-h-[140px]">
                    <Image
                      src={game.imageUrl}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={game.dataAiHint}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 md:p-4">
                      <h3 className="font-bold text-xs sm:text-sm md:text-base text-white console-text line-clamp-2">{game.title}</h3>
                      <p className="text-xs text-white/80 font-mono">&gt; {game.releaseDate}</p>
                    </div>
                  </div>
                ))}
                {upcomingReleases.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 rounded-lg border-2 border-dashed console-border">
                    <p className="text-muted-foreground font-mono text-xs sm:text-sm md:text-base text-center px-4">&gt; No upcoming releases detected in database.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
