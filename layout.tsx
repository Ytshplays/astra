'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

const AuthGate = React.memo(function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return <BootingAnimation />;
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
});

const AppLayout = React.memo(function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userName = user?.displayName || 'ASTRA Player';
  const userAvatar = user?.photoURL;
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  return (
    <AuthGate>
      <TooltipProvider>
        <div className="relative min-h-screen w-full bg-background text-foreground animated-gradient">
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-background/30 px-6 backdrop-blur-xl">
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
                    "text-lg font-semibold transition-colors duration-300",
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
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                    <Avatar className="size-10 border-2 border-transparent hover:border-primary transition-colors">
                      {userAvatar && <AvatarImage src={userAvatar} alt={userName} data-ai-hint="person" />}
                      <AvatarFallback>
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
                    <LogOut className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign Out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>
          <main className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="animate-fade-in-up">
              {children}
            </div>
          </main>
          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 backdrop-blur-lg">
            <div className="flex justify-around items-center h-16">
              {navItems.slice(0, 5).map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-colors duration-200",
                        pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-6 w-6" />
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
    </AuthGate>
    );
});

export default AppLayout;