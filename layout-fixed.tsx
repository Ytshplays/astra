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
  Lock,
} from 'lucide-react';
import { AstraLogo } from '@/components/nexus-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
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

function LockedDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] responsive-spacing">
      <div className="console-border responsive-padding rounded-lg text-center space-y-4 max-w-xs sm:max-w-sm md:max-w-md">
        <Lock className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-primary console-glow" />
        <h2 className="responsive-text-xl font-bold console-text">ASTRA HUB LOCKED</h2>
        <p className="text-muted-foreground responsive-text-sm">
          Access to Astra Hub requires authentication. Please sign in to unlock your gaming experience.
        </p>
        <Button 
          onClick={() => router.push('/login')}
          className="console-glow mt-4 w-full sm:w-auto"
          size="lg"
        >
          UNLOCK ASTRA HUB
        </Button>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return <BootingAnimation />;
  }

  // If user is not authenticated and not on login page, show locked dashboard
  if (!user && pathname !== '/login') {
    return (
      <TooltipProvider>
        <div className="relative min-h-screen w-full bg-background text-foreground animated-gradient">
          {/* Header with locked state */}
          <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-background/30 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <AstraLogo />
            </div>
            {/* Locked Navigation */}
            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  disabled
                  className="text-lg font-semibold text-muted-foreground/50 cursor-not-allowed"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
            {/* Login Button */}
            <Button onClick={() => window.location.href = '/login'} className="console-glow">
              SIGN IN
            </Button>
          </header>
          <main className="relative z-10 p-4 sm:p-6 lg:p-8">
            <LockedDashboard />
          </main>
        </div>
      </TooltipProvider>
    );
  }

  // If not authenticated but on login page, show children (login page)
  if (!user && pathname === '/login') {
    return <>{children}</>;
  }

  // If authenticated, show full app
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
    router.push('/dashboard'); // Redirect to locked dashboard after signout
  };
  
  return (
    <AuthGate>
      {user ? (
        <TooltipProvider>
          <div className="relative min-h-screen w-full bg-background text-foreground animated-gradient">
            {/* Header */}
            <header className="sticky top-0 z-50 flex console-header items-center justify-between border-b border-white/10 bg-background/30 responsive-container backdrop-blur-xl">
              <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
                <AstraLogo />
              </Link>
              {/* Main Navigation */}
              <nav className="console-nav items-center gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "responsive-text-base font-semibold transition-colors duration-300",
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
              <div className="flex items-center gap-2 sm:gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} className="touch-target">
                      <Avatar className="size-8 sm:size-10 border-2 border-transparent hover:border-primary transition-colors">
                        {userAvatar && <AvatarImage src={userAvatar} alt={userName} data-ai-hint="person" />}
                        <AvatarFallback className="responsive-text-sm">
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
                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="touch-target">
                      <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground transition-colors hover:text-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </header>
            <main className="relative z-10 responsive-container responsive-padding">
              <div className="animate-fade-in-up">
                {children}
              </div>
            </main>
            {/* Mobile Bottom Navigation */}
            <nav className="console-nav-mobile fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 backdrop-blur-lg">
              <div className="flex justify-around items-center h-16 sm:h-20">
                {navItems.slice(0, 5).map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-colors duration-200 touch-target",
                          pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-xs font-medium">{item.label}</span>
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
      ) : (
        children
      )}
    </AuthGate>
  );
}
