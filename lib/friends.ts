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
  getDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: any;
  updatedAt: any;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  status: 'online' | 'offline' | 'away' | 'in-game';
  lastSeen?: any;
  currentGame?: string;
  addedAt: any;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'in-game';
  lastSeen?: any;
  currentGame?: string;
}

// Send a friend request
export const sendFriendRequest = async (
  fromUserId: string, 
  fromUserName: string, 
  fromUserAvatar: string,
  toUserEmail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // First, find the user by email
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', toUserEmail)
    );
    
    const userSnapshot = await getDocs(usersQuery);
    
    if (userSnapshot.empty) {
      return { success: false, message: 'User not found' };
    }

    const toUser = userSnapshot.docs[0];
    const toUserId = toUser.id;
    const toUserData = toUser.data();

    // Check if users are already friends
    const friendsQuery = query(
      collection(db, 'friends'),
      where('userId', '==', fromUserId),
      where('friendId', '==', toUserId)
    );
    
    const existingFriendship = await getDocs(friendsQuery);
    if (!existingFriendship.empty) {
      return { success: false, message: 'Already friends' };
    }

    // Check if there's already a pending request
    const requestQuery = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', toUserId),
      where('status', '==', 'pending')
    );
    
    const existingRequest = await getDocs(requestQuery);
    if (!existingRequest.empty) {
      return { success: false, message: 'Friend request already sent' };
    }

    // Create friend request
    await addDoc(collection(db, 'friendRequests'), {
      fromUserId,
      fromUserName,
      fromUserAvatar: fromUserAvatar || '',
      toUserId,
      toUserName: toUserData.displayName || 'Unknown User',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Friend request sent successfully' };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return { success: false, message: 'Failed to send friend request' };
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const requestDoc = await getDoc(doc(db, 'friendRequests', requestId));
    if (!requestDoc.exists()) {
      return { success: false, message: 'Friend request not found' };
    }

    const requestData = requestDoc.data() as FriendRequest;
    const batch = writeBatch(db);

    // Update request status
    batch.update(doc(db, 'friendRequests', requestId), {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });

    // Add friendship for both users
    const friendship1Ref = doc(collection(db, 'friends'));
    batch.set(friendship1Ref, {
      userId: requestData.fromUserId,
      friendId: requestData.toUserId,
      friendName: requestData.toUserName,
      friendAvatar: '',
      status: 'offline',
      addedAt: serverTimestamp()
    });

    const friendship2Ref = doc(collection(db, 'friends'));
    batch.set(friendship2Ref, {
      userId: requestData.toUserId,
      friendId: requestData.fromUserId,
      friendName: requestData.fromUserName,
      friendAvatar: requestData.fromUserAvatar || '',
      status: 'offline',
      addedAt: serverTimestamp()
    });

    await batch.commit();
    return { success: true, message: 'Friend request accepted' };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return { success: false, message: 'Failed to accept friend request' };
  }
};

// Decline a friend request
export const declineFriendRequest = async (requestId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'declined',
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Friend request declined' };
  } catch (error) {
    console.error('Error declining friend request:', error);
    return { success: false, message: 'Failed to decline friend request' };
  }
};

// Get pending friend requests for a user
export const getPendingFriendRequests = (
  userId: string,
  callback: (requests: FriendRequest[]) => void
) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );

  return onSnapshot(q, (snapshot) => {
    const requests: FriendRequest[] = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as FriendRequest);
    });
    callback(requests);
  });
};

// Get user's friends list
export const getUserFriends = (
  userId: string,
  callback: (friends: Friend[]) => void
) => {
  const q = query(
    collection(db, 'friends'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const friends: Friend[] = [];
    snapshot.forEach((doc) => {
      friends.push({ id: doc.id, ...doc.data() } as Friend);
    });
    callback(friends);
  });
};

// Update user's online status
export const updateUserStatus = async (
  userId: string, 
  status: 'online' | 'offline' | 'away' | 'in-game',
  currentGame?: string
) => {
  try {
    // Update user's own status
    await updateDoc(doc(db, 'users', userId), {
      status,
      lastSeen: serverTimestamp(),
      currentGame: currentGame || null
    });

    // Update status in all friendships where this user appears
    const friendsQuery = query(
      collection(db, 'friends'),
      where('friendId', '==', userId)
    );
    
    const friendsSnapshot = await getDocs(friendsQuery);
    const batch = writeBatch(db);

    friendsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        status,
        lastSeen: serverTimestamp(),
        currentGame: currentGame || null
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

// Remove a friend
export const removeFriend = async (userId: string, friendId: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Remove both friendship documents
    const friendship1Query = query(
      collection(db, 'friends'),
      where('userId', '==', userId),
      where('friendId', '==', friendId)
    );

    const friendship2Query = query(
      collection(db, 'friends'),
      where('userId', '==', friendId),
      where('friendId', '==', userId)
    );

    const [friendship1Snapshot, friendship2Snapshot] = await Promise.all([
      getDocs(friendship1Query),
      getDocs(friendship2Query)
    ]);

    const batch = writeBatch(db);

    friendship1Snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    friendship2Snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return { success: true, message: 'Friend removed successfully' };
  } catch (error) {
    console.error('Error removing friend:', error);
    return { success: false, message: 'Failed to remove friend' };
  }
};
