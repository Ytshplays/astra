'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { SnakeGame } from './snake-game';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { GrokParticleBackground } from '@/components/grok-particle-background';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

type Game = {
    id: string;
    title: string;
    platform: string;
    imageUrl: string;
    dataAiHint: string;
}

export default function GamesPage() {
  const [user] = useAuthState(auth);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [api, setApi] = useState<CarouselApi>()
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };
    const q = collection(db, 'users', user.uid, 'games');
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const userGames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
        setGames(userGames);
        setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedGame) return; // Don't navigate while game is open

    if (e.key === 'ArrowRight') {
      setFocusedIndex((prev) => (prev + 1) % games.length);
      if (api) {
        api.scrollNext();
      }
    } else if (e.key === 'ArrowLeft') {
      setFocusedIndex((prev) => (prev - 1 + games.length) % games.length);
      if (api) {
        api.scrollPrev();
      }
    } else if (e.key === 'Enter' && games[focusedIndex]) {
      setSelectedGame(games[focusedIndex]);
    }
  }, [selectedGame, api, games, focusedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      const index = api.selectedScrollSnap()
      setFocusedIndex(index)
    }

    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (loading) {
    return (
      <>
        <GrokParticleBackground config="games" />
        <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 overflow-hidden console-scanlines">
          <div className="text-center animate-pulse">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight console-text console-glow">
              [LOADING GAME LIBRARY...]
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground font-mono mt-2">
              &gt; Initializing systems...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GrokParticleBackground config="games" />
        <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 overflow-hidden console-scanlines p-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight console-text console-glow">
              [ACCESS DENIED]
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground font-mono mt-2 mb-6">
              &gt; Authentication required to access game library
            </p>
            <Button asChild className="console-button">
              <Link href="/login">Initialize Login Sequence</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GrokParticleBackground config="games" />
      <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-start gap-4 md:gap-8 overflow-hidden console-scanlines p-4 md:p-6">
        {/* Console Status Bar */}
        <div className="w-full console-status-bar text-xs md:text-sm mb-4">
          <span>[ASTRA GAMES] - LIBRARY ACCESS</span>
          <span className="hidden sm:inline">{games.length} GAMES | STATUS: ONLINE</span>
        </div>

        <Dialog open={!!selectedGame} onOpenChange={(isOpen) => !isOpen && setSelectedGame(null)}>
          <div className="absolute inset-0" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight console-text console-glow">
                [GAME LIBRARY]
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground font-mono mt-2">
                &gt; Select a game to initialize
              </p>
            </div>
            
            <Carousel setApi={setApi} className="w-full" opts={{
              align: 'center',
              loop: true,
            }}>
              <CarouselContent className="-ml-2 md:-ml-8">
                {games.map((game, index) => (
                  <CarouselItem key={game.id} className="basis-1/2 pl-2 md:pl-8 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div className="p-1">
                      <Card
                        className={cn(
                          "group h-64 sm:h-80 md:h-[450px] flex-col overflow-hidden console-border bg-transparent shadow-none transition-all duration-300 cursor-pointer",
                          focusedIndex === index ? "console-glow-intense" : "console-glow"
                        )}
                        onClick={() => {
                          setFocusedIndex(index);
                          if (api) {
                            api.scrollTo(index);
                          }
                        }}
                      >
                        <CardContent className="relative h-full w-full p-0">
                          <Image
                            src={game.imageUrl}
                            alt={game.title}
                            fill
                            className={cn(
                              "object-cover transition-transform duration-300 ease-in-out rounded-lg",
                              focusedIndex === index ? "scale-105" : "scale-100 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                            )}
                            data-ai-hint={game.dataAiHint}
                          />
                          {/* Game title overlay for mobile */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:hidden">
                            <p className="text-white text-xs font-bold truncate">{game.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="relative z-10 mt-4 flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {games.length > 0 ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold console-text console-glow mb-2">
                  {games[focusedIndex]?.title}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-mono mb-4">
                  PLATFORM: {games[focusedIndex]?.platform}
                </p>
                <Button
                  onClick={() => setSelectedGame(games[focusedIndex])}
                  className="console-button flex items-center gap-2"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Initialize Game</span>
                  <span className="sm:hidden">Play</span>
                </Button>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold console-text console-glow mb-4">
                  [NO GAMES FOUND]
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-mono mb-6">
                  &gt; Visit the store to acquire games
                </p>
                <Button asChild className="console-button">
                  <Link href="/store">Access Game Store</Link>
                </Button>
              </div>
            )}
          </div>

          <DialogContent className="console-dialog max-w-4xl w-full h-[80vh] max-h-[600px] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="console-text console-glow">
                {selectedGame?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 p-6 pt-0">
              {selectedGame?.id === 'snake' ? (
                <SnakeGame />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground font-mono">
                    [GAME NOT IMPLEMENTED]
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
