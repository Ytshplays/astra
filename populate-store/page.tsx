'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { populateStore } from '@/lib/populate-store';
import { addMoreGamesToStore } from '@/lib/add-more-games';
import { addFreeGamesToStore } from '@/lib/free-games';

export default function PopulateStorePage() {
  const { toast } = useToast();
  const [isPopulating, setIsPopulating] = useState(false);
  const [isAddingMore, setIsAddingMore] = useState(false);
  const [isAddingFree, setIsAddingFree] = useState(false);
  const [populatedItems, setPopulatedItems] = useState<string[]>([]);

  const handlePopulateStore = async () => {
    setIsPopulating(true);
    setPopulatedItems([]);
    
    try {
      // Use the comprehensive populate function from lib
      await populateStore();
      
      setPopulatedItems(['✓ Store populated with comprehensive game library (15+ games)']);
      
      toast({
        title: 'Store Population Complete',
        description: 'All sample games have been added to the store.'
      });
    } catch (error) {
      console.error('Error populating store:', error);
      setPopulatedItems(['✗ Failed to populate store - check console for details']);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to populate store'
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleAddMoreGames = async () => {
    setIsAddingMore(true);
    
    try {
      await addMoreGamesToStore();
      
      setPopulatedItems(prev => [...prev, '✓ Added 8 additional popular games to the store']);
      
      toast({
        title: 'Additional Games Added',
        description: 'Successfully added more games to the store including God of War, Hades, Spider-Man, and more!'
      });
    } catch (error) {
      console.error('Error adding more games:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add additional games'
      });
    } finally {
      setIsAddingMore(false);
    }
  };

  const handleAddFreeGames = async () => {
    setIsAddingFree(true);
    
    try {
      await addFreeGamesToStore();
      
      setPopulatedItems(prev => [...prev, '✓ Added 8 free-to-play games including Valorant, Fortnite, Apex Legends!']);
      
      toast({
        title: 'Free Games Added',
        description: 'Successfully added free games to the store!'
      });
    } catch (error) {
      console.error('Error adding free games:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add free games'
      });
    } finally {
      setIsAddingFree(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto console-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-green-400">
            🎮 ASTRA STORE POPULATION TOOL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-mono">
            [SYSTEM] Click the buttons below to populate the store with sample games.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleAddFreeGames} 
              disabled={isAddingFree || isPopulating || isAddingMore}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold console-border"
            >
              {isAddingFree ? '[PROCESSING] ADDING FREE GAMES...' : '[FREE] ADD FREE-TO-PLAY GAMES'}
            </Button>

            <Button 
              onClick={handlePopulateStore} 
              disabled={isPopulating || isAddingMore || isAddingFree}
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold console-border"
            >
              {isPopulating ? '[PROCESSING] POPULATING STORE...' : '[ACTION] POPULATE STORE WITH GAMES'}
            </Button>

            <Button 
              onClick={handleAddMoreGames} 
              disabled={isAddingMore || isPopulating || isAddingFree}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold console-border"
            >
              {isAddingMore ? '[PROCESSING] ADDING MORE GAMES...' : '[ACTION] ADD MORE POPULAR GAMES'}
            </Button>
          </div>

          {populatedItems.length > 0 && (
            <Card className="mt-4 console-border">
              <CardHeader>
                <CardTitle className="text-lg text-green-400 font-mono">[RESULTS] POPULATION STATUS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 font-mono text-sm">
                  {populatedItems.map((item, index) => (
                    <div key={index} className={item.startsWith('✓') ? 'text-green-400' : 'text-red-400'}>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
