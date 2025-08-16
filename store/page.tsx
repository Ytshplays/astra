'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Search, 
  Star, 
  Filter, 
  Heart,
  Download,
  Tag,
  Calendar,
  Users
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  getStoreItems,
  getFeaturedItems,
  addToCart,
  subscribeToUserCart,
  processPurchase,
  type StoreItem,
  type CartItem
} from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import { GrokParticleBackground } from '@/components/grok-particle-background';

export default function StorePage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>([]);
  const [cartItems, setCartItems] = useState<(CartItem & StoreItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const [items, featured] = await Promise.all([
          getStoreItems(selectedCategory),
          getFeaturedItems()
        ]);
        setStoreItems(items);
        setFeaturedItems(featured);
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load store items'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [selectedCategory, toast]);

  // Subscribe to cart updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserCart(user.uid, (items: CartItem[]) => {
      // Fetch store item details for cart items
      const loadCartItems = async () => {
        const allStoreItems = await getStoreItems();
        const cartWithDetails = items.map(cartItem => {
          const storeItem = allStoreItems.find(item => item.id === cartItem.storeItemId);
          return { ...cartItem, ...storeItem } as CartItem & StoreItem;
        }).filter(item => item.title); // Filter out items not found
        
        setCartItems(cartWithDetails);
      };
      
      loadCartItems();
    });

    return () => unsubscribe();
  }, [user]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return storeItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [storeItems, searchTerm]);

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const handleAddToCart = async (item: StoreItem) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not signed in',
        description: 'You must be signed in to add items to cart.'
      });
      return;
    }

    if (!item.id) {
      toast({
        title: 'Error',
        description: 'Invalid item selected.'
      });
      return;
    }

    const result = await addToCart(user.uid, item.id);
    if (result.success) {
      toast({
        title: 'Added to Cart',
        description: `${item.title} has been added to your cart.`
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message
      });
    }
  };

  const handlePurchase = async () => {
    if (!user || cartItems.length === 0) return;

    setIsProcessingPurchase(true);
    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
      const result = await processPurchase(user.uid, cartItems, totalAmount);
      if (result.success) {
        toast({
          title: 'Purchase Successful!',
          description: 'Your games have been added to your library.'
        });
        setIsCartOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Purchase Failed',
          description: result.message
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const categories = ['all', 'action', 'adventure', 'rpg', 'strategy', 'simulation', 'sports', 'racing'];

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="space-y-1 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight">Store</h1>
          <p className="text-muted-foreground">Loading store items...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-[200px] bg-muted rounded-t-lg" />
              </CardContent>
              <CardFooter className="p-4">
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <GrokParticleBackground config="store" />
      <div className="flex flex-col gap-8 console-scanlines">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight console-text console-glow">
              [ASTRA STORE] GAME MARKETPLACE
            </h1>
            <p className="text-muted-foreground font-mono">
              &gt; Access premium gaming content and digital assets
            </p>
          </div>
          
          {/* Cart Button */}
          <Button
            variant="outline"
            onClick={() => setIsCartOpen(true)}
            className="relative console-border console-glow"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            CART [{cartItems.length}]
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500 text-black">
                {cartItems.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
            <Input
              placeholder="[SEARCH] Enter game title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 console-input"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 sm:grid-cols-8 w-full console-border bg-black"
>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-bold mb-4 console-text console-glow">
              [FEATURED] PREMIUM CONTENT
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredItems.slice(0, 2).map((item) => (
                <Card key={item.id} className="console-card console-border animated-card overflow-hidden">
                  <div className="relative h-[250px]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({item.rating})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {item.developer}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={() => handleAddToCart(item)}
                      className="console-glow"
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">All Games</h2>
          <span className="text-sm text-muted-foreground">
            {filteredItems.length} game{filteredItems.length !== 1 ? 's' : ''} found
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden animated-card console-border">
              <CardContent className="p-0">
                <div className="relative h-[200px] w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="text-xs">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 bg-card/80 space-y-3">
                <div className="w-full">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.developer}</p>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">({item.rating})</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">${item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleAddToCart(item)}
                    className="console-border"
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    {item.inStock ? 'Add' : 'Out'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No games found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md console-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({cartItems.length})
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={item.storeItemId || index} className="flex items-center gap-3 p-3 rounded-lg border console-border">
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full console-glow" 
                    size="lg"
                    onClick={handlePurchase}
                    disabled={isProcessingPurchase || cartItems.length === 0}
                  >
                    {isProcessingPurchase ? 'Processing...' : 'Purchase Now'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
}
