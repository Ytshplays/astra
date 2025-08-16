
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Game = {
    id: string;
    title: string;
    platform: string;
    price: string;
    imageUrl: string;
    dataAiHint: string;
    achievements: any[];
}

export default function StorePage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [storeItems, setStoreItems] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchGames = async () => {
          const gamesCollection = collection(db, 'games');
          const gamesSnapshot = await getDocs(gamesCollection);
          const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
          setStoreItems(gamesList);
          setLoading(false);
      }
      fetchGames();
  }, []);

  const handleBuyGame = async (item: Game) => {
      if (!user) {
          toast({ variant: 'destructive', title: 'Not signed in', description: 'You must be signed in to purchase games.' });
          return;
      }
      const gameDocRef = doc(db, 'users', user.uid, 'games', item.id);
      try {
        await setDoc(gameDocRef, {
            title: item.title,
            platform: item.platform,
            imageUrl: item.imageUrl,
            dataAiHint: item.dataAiHint,
            achievements: item.achievements || [],
        });
        toast({ title: 'Purchase Successful!', description: `${item.title} has been added to your library.`});
      } catch (e) {
          console.error(e);
          toast({ variant: 'destructive', title: 'Purchase Failed', description: 'Could not add game to your library.'});
      }
  }

  if (loading) {
      return <div>Loading store...</div>
  }

  const featuredItem = storeItems[0];
  const otherItems = storeItems.slice(1);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Store</h1>
        <p className="text-muted-foreground">
          Discover and purchase the latest games.
        </p>
      </div>

      {/* Featured Item Section */}
      {featuredItem && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        <div className="rounded-xl overflow-hidden group aspect-video">
             <Image
                src={featuredItem.imageUrl}
                alt={featuredItem.title}
                width={800}
                height={450}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={featuredItem.dataAiHint}
            />
        </div>
        <div className="flex flex-col justify-center bg-card/50 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-4xl font-bold tracking-tight text-primary">{featuredItem.title}</h2>
            <p className="text-2xl font-semibold mt-2">{featuredItem.price}</p>
            <p className="text-muted-foreground mt-4">This is a featured game, a must-play for fans of the genre. Get it now and dive into an unforgettable adventure.</p>
             <Button size="lg" className="mt-6 w-full" onClick={() => handleBuyGame(featuredItem)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
            </Button>
        </div>
      </div>}

      {/* Grid of Other Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        {otherItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden animated-card">
            <CardContent className="p-0">
              <div className="relative h-[300px] w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={item.dataAiHint}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 bg-card/80">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="flex justify-between items-center w-full mt-2">
                    <p className="text-lg font-bold text-primary">{item.price}</p>
                     <Button variant="secondary" size="sm" onClick={() => handleBuyGame(item)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy
                    </Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
