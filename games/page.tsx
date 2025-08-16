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
      e.preventDefault();
      api?.scrollNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      api?.scrollPrev();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (games.length > 0) {
        setSelectedGame(games[focusedIndex]);
      }
    }
  }, [api, selectedGame, focusedIndex, games]);


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  useEffect(() => {
    if (!api) return;

    const onSelect = (api: CarouselApi) => {
      const newIndex = api.selectedScrollSnap();
      setFocusedIndex(newIndex);
    }

    api.on('select', onSelect);
    
    // Initial setup
    onSelect(api);

    return () => {
      api.off('select', onSelect);
    }
  }, [api])


  if (loading) {
      return <div>Loading your games...</div>
  }

  return (
    <div className="relative flex h-[calc(100vh-12rem)] flex-col items-center justify-center gap-8 overflow-hidden">
        <Dialog open={!!selectedGame} onOpenChange={(isOpen) => !isOpen && setSelectedGame(null)}>
            <div className="absolute inset-0" />
            
            <div className="relative z-10 w-full animate-fade-in-up">
                <Carousel setApi={setApi} className="w-full" opts={{
                    align: 'center',
                    loop: true,
                }}>
                <CarouselContent className="-ml-8">
                    {games.map((game, index) => (
                        <CarouselItem key={game.id} className="basis-1/2 pl-8 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <div className="p-1">
                                <Card
                                    className={cn(
                                    "group h-[450px] flex-col overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300",
                                    focusedIndex === index ? "border-primary" : ""
                                    )}
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
                    <h2 className="text-4xl font-bold tracking-tight text-white transition-all duration-300" key={focusedIndex}>
                        {games[focusedIndex]?.title}
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground">{games[focusedIndex]?.platform}</p>
                </>) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <Gamepad2 className="h-16 w-16 text-muted-foreground" />
                        <h2 className="mt-4 text-2xl font-bold">Your Game Library is Empty</h2>
                        <p className="mt-2 text-muted-foreground">Games you own will appear here.</p>
                        <Button className="mt-6" variant="secondary" asChild>
                            <Link href="/store">Explore the Store</Link>
                        </Button>
                    </div>
                )
                }
                {games.length > 0 && <Button
                    className="mt-6 w-64 bg-accent py-6 text-lg font-bold text-accent-foreground hover:bg-accent/90"
                    onClick={() => games.length > 0 && setSelectedGame(games[focusedIndex])}
                    disabled={games.length === 0}
                >
                    <Gamepad2 className="mr-3 h-6 w-6" />
                    Play Now
                </Button>}
            </div>
            <DialogContent className="max-w-max p-0 border-0 bg-card/80 backdrop-blur-sm">
                <DialogHeader className='p-4'>
                <DialogTitle>Playing: {selectedGame?.title}</DialogTitle>
                </DialogHeader>
                <SnakeGame />
            </DialogContent>
        </Dialog>
    </div>
  );
}
}
