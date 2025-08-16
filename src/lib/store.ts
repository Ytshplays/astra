import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  writeBatch,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounts
  imageUrl: string;
  category: string;
  platform: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  rating: number; // Out of 5
  tags: string[];
  screenshots: string[];
  featured: boolean;
  inStock: boolean;
  downloadSize: string;
  systemRequirements: {
    minimum: string;
    recommended: string;
  };
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  storeItemId: string;
  quantity: number;
  addedAt: any;
}

export interface Purchase {
  id: string;
  userId: string;
  items: Array<{
    storeItemId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  purchaseDate: any;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
}

export interface UserLibrary {
  gameId: string;
  title: string;
  imageUrl: string;
  purchaseDate: any;
  lastPlayed?: any;
  playtime: number; // in minutes
  achievements: string[];
}

// Store Items Functions
export const getStoreItems = async (category?: string): Promise<StoreItem[]> => {
  try {
    let q = collection(db, 'storeItems');
    
    if (category && category !== 'all') {
      q = query(collection(db, 'storeItems'), where('category', '==', category)) as any;
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StoreItem[];
  } catch (error) {
    console.error('Error fetching store items:', error);
    return [];
  }
};

export const getFeaturedItems = async (): Promise<StoreItem[]> => {
  try {
    const q = query(
      collection(db, 'storeItems'),
      where('featured', '==', true)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StoreItem[];
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return [];
  }
};

export const getStoreItem = async (itemId: string): Promise<StoreItem | null> => {
  try {
    const docRef = doc(db, 'storeItems', itemId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as StoreItem;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store item:', error);
    return null;
  }
};

// Cart Functions
export const addToCart = async (userId: string, storeItemId: string, quantity: number = 1): Promise<{ success: boolean; message: string }> => {
  try {
    const cartRef = doc(db, 'users', userId, 'cart', storeItemId);
    const cartItemSnap = await getDoc(cartRef);
    
    if (cartItemSnap.exists()) {
      // Update quantity if item already in cart
      await updateDoc(cartRef, {
        quantity: increment(quantity),
        updatedAt: serverTimestamp()
      });
    } else {
      // Add new item to cart
      await addDoc(collection(db, 'users', userId, 'cart'), {
        storeItemId,
        quantity,
        addedAt: serverTimestamp()
      });
    }
    
    return { success: true, message: 'Item added to cart' };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: 'Failed to add item to cart' };
  }
};

export const removeFromCart = async (userId: string, cartItemId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: 'Failed to remove item from cart' };
  }
};

export const getCartItems = async (userId: string): Promise<(CartItem & StoreItem)[]> => {
  try {
    const cartSnapshot = await getDocs(collection(db, 'users', userId, 'cart'));
    const cartItems = cartSnapshot.docs.map(doc => ({
      cartId: doc.id,
      ...doc.data()
    })) as (CartItem & { cartId: string })[];
    
    // Get full store item details for each cart item
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const storeItem = await getStoreItem(cartItem.storeItemId);
        return {
          ...cartItem,
          ...storeItem
        };
      })
    );
    
    return enrichedCartItems.filter(item => item.title) as (CartItem & StoreItem)[];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const clearCart = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cartSnapshot = await getDocs(collection(db, 'users', userId, 'cart'));
    const batch = writeBatch(db);
    
    cartSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
};

// Purchase Functions
export const processPurchase = async (
  userId: string,
  cartItems: (CartItem & StoreItem)[],
  paymentMethod: string = 'credit_card'
): Promise<{ success: boolean; message: string; purchaseId?: string }> => {
  try {
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Create purchase record
    const purchaseData = {
      userId,
      items: cartItems.map(item => ({
        storeItemId: item.storeItemId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      purchaseDate: serverTimestamp(),
      status: 'completed' as const,
      paymentMethod
    };
    
    const purchaseRef = await addDoc(collection(db, 'purchases'), purchaseData);
    
    // Add games to user's library
    const batch = writeBatch(db);
    
    cartItems.forEach(item => {
      const libraryRef = doc(db, 'users', userId, 'library', item.storeItemId);
      batch.set(libraryRef, {
        gameId: item.storeItemId,
        title: item.title,
        imageUrl: item.imageUrl,
        purchaseDate: serverTimestamp(),
        playtime: 0,
        achievements: []
      });
    });
    
    // Clear cart
    const cartSnapshot = await getDocs(collection(db, 'users', userId, 'cart'));
    cartSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    return { 
      success: true, 
      message: 'Purchase completed successfully!', 
      purchaseId: purchaseRef.id 
    };
  } catch (error) {
    console.error('Error processing purchase:', error);
    return { success: false, message: 'Purchase failed. Please try again.' };
  }
};

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    const q = query(
      collection(db, 'purchases'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Purchase[];
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }
};

export const getUserLibrary = async (userId: string): Promise<UserLibrary[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'library'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserLibrary[];
  } catch (error) {
    console.error('Error fetching user library:', error);
    return [];
  }
};

// Real-time listeners
export const subscribeToCartItems = (userId: string, callback: (items: (CartItem & StoreItem)[]) => void) => {
  return onSnapshot(collection(db, 'users', userId, 'cart'), async (snapshot) => {
    const cartItems = snapshot.docs.map(doc => ({
      cartId: doc.id,
      ...doc.data()
    })) as (CartItem & { cartId: string })[];
    
    // Get full store item details
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const storeItem = await getStoreItem(cartItem.storeItemId);
        return {
          ...cartItem,
          ...storeItem
        };
      })
    );
    
    callback(enrichedCartItems.filter(item => item.title) as (CartItem & StoreItem)[]);
  });
};

// Admin functions (for populating store)
export const addStoreItem = async (item: Omit<StoreItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; message: string }> => {
  try {
    await addDoc(collection(db, 'storeItems'), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Store item added successfully' };
  } catch (error) {
    console.error('Error adding store item:', error);
    return { success: false, message: 'Failed to add store item' };
  }
};

export const updateStoreItem = async (itemId: string, updates: Partial<StoreItem>): Promise<{ success: boolean; message: string }> => {
  try {
    await updateDoc(doc(db, 'storeItems', itemId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Store item updated successfully' };
  } catch (error) {
    console.error('Error updating store item:', error);
    return { success: false, message: 'Failed to update store item' };
  }
};
