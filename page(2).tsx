

'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Gamepad2, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { NexusLogo } from '@/components/nexus-logo';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: <Gamepad2 className="h-8 w-8" />,
    name: 'Unified Library',
    description: 'All your games from any platform, in one place. Launch and play with a single click.',
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    name: 'AI Recommendations',
    description: 'Discover your next favorite game with personalized suggestions powered by AI.',
  },
  {
    icon: <Users className="h-8 w-8" />,
    name: 'Social Hub',
    description: 'Connect with friends, see what they are playing, and share your greatest gaming moments.',
  },
];


export default function LandingPage() {
  const [user, loading] = useAuthState(auth);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const getCtaButton = () => {
    if (loading) {
        return <Button disabled size="lg">Loading...</Button>
    }
    if (user) {
        return (
             <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                    Go to Dashboard
                </Link>
            </Button>
        )
    }
    return (
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/login">
                Get Started
            </Link>
        </Button>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <NexusLogo />
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href={user ? "/dashboard" : "/login"}>
                {user ? "Enter Hub" : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[60vh] w-full md:h-[70vh]">
            <div className="absolute inset-0 z-0 opacity-20">
                <Image src="https://placehold.co/1920x1080.png" alt="Gaming montage" fill className="object-cover" data-ai-hint="gaming montage" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="container relative z-10 flex h-full max-w-screen-xl flex-col items-center justify-center text-center animate-fade-in-up">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                    Your Gaming Universe, Unified.
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                    ASTRA brings all your games, friends, and achievements together in one powerful, beautiful interface. Stop juggling launchers and start playing.
                </p>
                <div className="mt-8 flex gap-4">
                    {getCtaButton()}
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24">
            <div className="container max-w-screen-xl">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Last Game Launcher You'll Ever Need</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        ASTRA is packed with features designed for the modern gamer.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={feature.name} className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {feature.icon}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">{feature.name}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-6">
          <div className="container text-center text-sm text-muted-foreground">
              © {currentYear || 2024} ASTRA. All rights reserved.
          </div>
      </footer>
    </div>
  );
}

