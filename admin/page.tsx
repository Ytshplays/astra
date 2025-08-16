'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { sampleStoreItems } from '@/lib/populate-store';
import { addStoreItem } from '@/lib/store';

export default function AdminPage() {
  const { toast } = useToast();
  const [isPopulating, setIsPopulating] = useState(false);
  const [populatedItems, setPopulatedItems] = useState<string[]>([]);

  const populateStore = async () => {
    setIsPopulating(true);
    setPopulatedItems([]);
    
    try {
      for (const item of sampleStoreItems) {
        try {
          const result = await addStoreItem(item);
          if (result.success) {
            setPopulatedItems(prev => [...prev, `✓ Added ${item.title}`]);
          } else {
            setPopulatedItems(prev => [...prev, `✗ Failed to add ${item.title}: ${result.message}`]);
          }
        } catch (error) {
          setPopulatedItems(prev => [...prev, `✗ Error adding ${item.title}: ${error}`]);
        }
      }
      
      toast({
        title: 'Store Population Complete',
        description: 'All sample items have been processed.'
      });
    } catch (error) {
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
    <div className="container mx-auto p-6 space-y-6">
      <Card className="console-border">
        <CardHeader>
          <CardTitle>Store Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page allows you to populate the store with sample data for testing.
          </p>
          
          <Button 
            onClick={populateStore}
            disabled={isPopulating}
            className="console-glow"
          >
            {isPopulating ? 'Populating Store...' : 'Populate Store with Sample Data'}
          </Button>
          
          {populatedItems.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Population Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono space-y-1 max-h-40 overflow-y-auto">
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
