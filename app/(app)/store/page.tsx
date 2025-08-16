
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
import { GrokParticleBackground } from '@/components/grok-particle-background';

type Game = {
    id: string;
    title: string;
    platform: string;
    price: string | number;
    imageUrl: string;
    dataAiHint: string;
    achievements: any[];
    description?: string;
}

export default function StorePage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [storeItems, setStoreItems] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchGames = async () => {
          try {
              // Add default free games if store is empty
              const gamesCollection = collection(db, 'games');
              const gamesSnapshot = await getDocs(gamesCollection);
              
              if (gamesSnapshot.empty) {
                  // Add some default free games
                  const defaultGames = [
                      {
                          id: 'valorant',
                          title: 'Valorant',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/FF4655/FFFFFF?text=Valorant',
                          platform: 'PC',
                          dataAiHint: 'tactical shooter',
                          achievements: []
                      },
                      {
                          id: 'fortnite',
                          title: 'Fortnite',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/9146FF/FFFFFF?text=Fortnite',
                          platform: 'PC, Console, Mobile',
                          dataAiHint: 'battle royale',
                          achievements: []
                      },
                      {
                          id: 'apex-legends',
                          title: 'Apex Legends',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/FF6600/FFFFFF?text=Apex+Legends',
                          platform: 'PC, Console',
                          dataAiHint: 'hero shooter',
                          achievements: []
                      },
                      {
                          id: 'league-of-legends',
                          title: 'League of Legends',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/0596AA/FFD700?text=League+of+Legends',
                          platform: 'PC',
                          dataAiHint: 'moba',
                          achievements: []
                      },
                      {
                          id: 'rocket-league',
                          title: 'Rocket League',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/FF8C00/0000FF?text=Rocket+League',
                          platform: 'PC, Console',
                          dataAiHint: 'car soccer',
                          achievements: []
                      },
                      {
                          id: 'fall-guys',
                          title: 'Fall Guys',
                          price: '0',
                          imageUrl: 'https://placehold.co/400x300/FF69B4/FFFFFF?text=Fall+Guys',
                          platform: 'PC, Console, Mobile',
                          dataAiHint: 'party game',
                          achievements: []
                      }
                  ];
                  
                  // Add default games to Firebase
                  for (const game of defaultGames) {
                      const gameRef = doc(db, 'games', game.id);
                      await setDoc(gameRef, game);
                  }
                  
                  setStoreItems(defaultGames);
              } else {
                  const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
                  setStoreItems(gamesList);
              }
          } catch (error) {
              console.error('Error fetching games:', error);
              // Set some default games even if Firebase fails
              setStoreItems([
                  {
                      id: 'valorant',
                      title: 'Valorant',
                      price: '0',
                      imageUrl: 'https://placehold.co/400x300/FF4655/FFFFFF?text=Valorant',
                      platform: 'PC',
                      dataAiHint: 'tactical shooter',
                      achievements: []
                  },
                  {
                      id: 'fortnite',
                      title: 'Fortnite',
                      price: '0',
                      imageUrl: 'https://placehold.co/400x300/9146FF/FFFFFF?text=Fortnite',
                      platform: 'PC, Console, Mobile',
                      dataAiHint: 'battle royale',
                      achievements: []
                  }
              ]);
          } finally {
              setLoading(false);
          }
      }
      fetchGames();
  }, []);

  const handleBuyGame = async (item: Game) => {
      if (!user) {
          toast({ variant: 'destructive', title: 'Not signed in', description: 'You must be signed in to purchase games.' });
          return;
      }
      
      try {
          const gameDocRef = doc(db, 'users', user.uid, 'games', item.id);
          await setDoc(gameDocRef, {
              title: item.title,
              platform: item.platform,
              imageUrl: item.imageUrl,
              dataAiHint: item.dataAiHint,
              achievements: item.achievements || [],
          });
          
          const priceText = Number(item.price) === 0 ? 'Free' : `$${item.price}`;
          toast({ 
              title: `${Number(item.price) === 0 ? 'Downloaded' : 'Purchased'}!`, 
              description: `${item.title} has been added to your library.`
          });
      } catch (e) {
          console.error(e);
          toast({ variant: 'destructive', title: 'Failed', description: 'Could not add game to your library.'});
      }
  }

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="text-lg">Loading games...</div>
          </div>
      );
  }

  return (
    <>
      <GrokParticleBackground config="store" />
      <div className="min-h-screen w-full p-4 sm:p-6">
        {/* Simple grid of all games - full screen responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
          {storeItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:scale-105 transition-all duration-200">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 16vw, 12.5vw"
                  />
                  {Number(item.price) === 0 && (
                    <div className="absolute top-1 right-1 bg-green-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
                      FREE
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-2 sm:p-3 space-y-1.5">
                <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 w-full">{item.title}</h3>
                <div className="flex justify-between items-center w-full">
                  <p className="text-xs sm:text-sm font-bold">
                    {Number(item.price) === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `$${item.price}`
                    )}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleBuyGame(item)}
                    className={`text-xs px-2 py-1 h-auto ${Number(item.price) === 0 ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  >
                    <ShoppingCart className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {Number(item.price) === 0 ? 'Get' : 'Buy'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {storeItems.length === 0 && (
          <div className="text-center py-12 min-h-screen flex flex-col justify-center">
            <p className="text-muted-foreground mb-4">No games available.</p>
            <Button 
              className="mx-auto"
              onClick={() => window.location.href = '/populate-store'}
            >
              Add Games to Store
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
