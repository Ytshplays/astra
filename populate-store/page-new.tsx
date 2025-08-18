'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { populateStore } from '@/lib/populate-store';

export default function PopulateStorePage() {
  const { toast } = useToast();
  const [isPopulating, setIsPopulating] = useState(false);
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
            [SYSTEM] Click the button below to populate the store with sample games including Cyberpunk 2077, The Witcher 3, GTA V, FIFA 24, and many more.
          </p>
          
          <Button 
            onClick={handlePopulateStore} 
            disabled={isPopulating}
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold console-border"
          >
            {isPopulating ? '[PROCESSING] POPULATING STORE...' : '[ACTION] POPULATE STORE WITH GAMES'}
          </Button>

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
