'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to dashboard
    router.replace('/dashboard');
  }, [router]);

  // Return null to prevent any flash of content
  return null;
}
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-8 w-32 bg-muted rounded mx-auto"></div>
        <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
      </div>
    </div>
  );
}
} from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { WelcomeDialog } from './welcome-dialog';

import { InteractiveBackground } from '@/components/interactive-background';
export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const recentlyPlayed = games.slice(0, 0); // Empty array, no placeholder data
  const onlineFriends = friends.filter((f) => f.status === 'online');
  const userName = user?.displayName?.split(' ')[0] || 'gamer';

  return (
    <>
      <WelcomeDialog />
      <InteractiveBackground />
      <div className="flex flex-col gap-8">
        <div className="space-y-1 animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Here&apos;s what&apos;s happening in your gaming world.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-card/80 border-border/50 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle>Recently Played</CardTitle>
              <CardDescription>
                Jump back into your favorite games.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentlyPlayed.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {recentlyPlayed.map((game) => (
                    <Link href="#" key={game.id} className="group relative overflow-hidden rounded-lg animated-card">
                      <Image
                        src={game.imageUrl}
                        alt={game.title}
                        width={300}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
 priority
                        data-ai-hint={game.dataAiHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                        <PlayCircle className="w-12 h-12 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <h3 className="truncate font-semibold text-white">{game.title}</h3>
                        <p className="text-sm text-white/70">{game.platform}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-muted-foreground/30">
                      <p className="text-muted-foreground">You haven't played any games recently.</p>
                      <Button variant="link" asChild><Link href="/games">Explore your library</Link></Button>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border/50 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle>Friends Activity</CardTitle>
              <CardDescription>See what your friends are up to.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {onlineFriends.map((friend) => (
                  <li key={friend.id} className="flex items-center gap-4 transition-colors duration-200 hover:bg-white/5 p-2 rounded-md">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person"/>
                        <AvatarFallback>
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{friend.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        Playing {friend.playing}
                      </p>
                    </div>
                  </li>
                ))}
                {onlineFriends.length === 0 && (
                  <div className="text-center text-muted-foreground py-4 space-y-2">
                    <p>No friends currently online.</p>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href="/social">Find Friends</Link>
                    </Button>
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Releases</CardTitle>
                <CardDescription>
                  Get hyped for the next big titles.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="#" className="text-accent hover:text-accent/80">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              {upcomingReleases.map((game) => (
                <div key={game.id} className="group relative overflow-hidden rounded-lg animated-card">
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={game.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-bold text-lg text-white">{game.title}</h3>
                    <p className="text-sm text-white/80">{game.releaseDate}</p>
                  </div>
                </div>
              ))}
              {upcomingReleases.length === 0 && (
                  <div className="md:col-span-3 flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-muted-foreground/30">
                      <p className="text-muted-foreground">No upcoming releases to show right now.</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
