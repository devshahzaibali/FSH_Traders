'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Load from localStorage or Firestore on mount/login
  useEffect(() => {
    const loadWishlist = async () => {
      let local: string[] = [];
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) local = JSON.parse(stored);
      } catch {}
      if (user && user.uid) {
        // Load from Firestore
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        let remote: string[] = [];
        if (snap.exists() && Array.isArray(snap.data().wishlist)) {
          remote = snap.data().wishlist;
        }
        // Merge and dedupe
        const merged = Array.from(new Set([...local, ...remote]));
        setWishlist(merged);
        localStorage.setItem('wishlist', JSON.stringify(merged));
        // Optionally update Firestore if local had new items
        if (local.length > 0 && merged.length > remote.length) {
          await updateDoc(userRef, { wishlist: merged });
        }
      } else {
        setWishlist(local);
      }
    };
    loadWishlist();
  }, [user]);

  // Save to localStorage and Firestore
  const saveWishlist = async (newList: string[]) => {
    setWishlist(newList);
    localStorage.setItem('wishlist', JSON.stringify(newList));
    if (user && user.uid) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { wishlist: newList });
    }
  };

  const addToWishlist = (id: string) => {
    if (!wishlist.includes(id)) {
      saveWishlist([...wishlist, id]);
    }
  };
  const removeFromWishlist = (id: string) => {
    saveWishlist(wishlist.filter(pid => pid !== id));
  };
  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };
  const isWishlisted = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
} 