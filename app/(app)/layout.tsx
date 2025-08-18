

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Gamepad2,
  LayoutDashboard,
  Lightbulb,
  Newspaper,
  Trophy,
  Users,
  LogOut,
  Store,
} from 'lucide-react';

import { NexusLogo } from '@/components/nexus-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BootingAnimation from '@/components/booting-animation';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/games', icon: Gamepad2, label: 'My Games' },
  { href: '/discover', icon: Lightbulb, label: 'Discover' },
  { href: '/store', icon: Store, label: 'Store' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/achievements', icon: Trophy, label: 'Achievements' },
  { href: '/news', icon: Newspaper, label: 'News' },
];

function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return <BootingAnimation />;
  }

  if (!user) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">Access Restricted</DialogTitle>
            <DialogDescription>
              You need to be signed in to access Astra.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="mb-2 font-semibold">
              Sign in to unlock these features:
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">
                  Unified Game Library:
                </span>{' '}
                All your games, one place.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  AI Recommendations:
                </span>{' '}
                Discover your next favorite game.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Social Hub:
                </span>{' '}
                Connect and play with friends.
              </li>
               <li>
                <span className="font-semibold text-foreground">
                  Achievement Tracking:
                </span>{' '}
                Showcase your gaming prowess.
              </li>
            </ul>
          </div>
          <Button
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Go to Sign In
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const router = useRouter();

  const userName = user?.displayName || 'Astra Player';
  const userAvatar = user?.photoURL;
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  return (
    <AuthGate>
        <TooltipProvider>
            <div className="relative min-h-screen w-full max-w-full bg-background text-foreground animated-gradient overflow-x-hidden">

                {/* Header */}
                <header className="sticky top-0 z-50 flex h-16 md:h-20 items-center justify-between border-b border-white/10 bg-background/30 px-4 md:px-6 backdrop-blur-xl">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <NexusLogo />
                    </Link>

                    {/* Main Navigation */}
                    <nav className="hidden items-center gap-2 lg:flex">
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                asChild
                                className={cn(
                                    "text-sm lg:text-lg font-semibold transition-colors duration-300",
                                    pathname.startsWith(item.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </Button>
                        ))}
                    </nav>

                    {/* Profile and Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                                    <Avatar className="size-8 md:size-10 border-2 border-transparent hover:border-primary transition-colors">
                                        {userAvatar && <AvatarImage src={userAvatar} alt={userName} data-ai-hint="person" />}
                                        <AvatarFallback className="text-xs md:text-sm">
                                            {userName?.split(' ').map((n) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Profile</p>
                            </TooltipContent>
                        </Tooltip>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                    <LogOut className="h-4 w-4 md:h-6 md:w-6 text-muted-foreground transition-colors hover:text-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Sign Out</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </header>

                <main className="relative z-10 p-2 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] pb-20 lg:pb-8">
                    <div className="animate-fade-in-up w-full max-w-full overflow-x-hidden">
                        {children}
                    </div>
                </main>

                 {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 backdrop-blur-lg">
                    <div className="flex justify-around items-center h-16 max-w-full overflow-x-auto px-2">
                    {navItems.slice(0, 5).map((item) => (
                        <Tooltip key={item.href}>
                             <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                    "flex flex-col items-center justify-center gap-1 p-1 md:p-2 rounded-md transition-colors duration-200 min-w-[3rem] flex-shrink-0",
                                    pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                    <span className="text-[10px] md:text-xs font-medium truncate max-w-16 text-center">{item.label}</span>
                                </Link>
                            </TooltipTrigger>
                             <TooltipContent>
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </div>
                </nav>
            </div>
        </TooltipProvider>
    </AuthGate>
  );
}
