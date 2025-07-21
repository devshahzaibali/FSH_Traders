"use client";
import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/components/WishlistContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/data/products';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const prods: Product[] = [];
      for (const id of wishlist) {
        try {
          const snap = await getDoc(doc(db, 'products', id));
          if (snap.exists()) {
            prods.push({ id: snap.id, ...snap.data() } as Product);
          }
        } catch {}
      }
      setProducts(prods);
    };
    if (wishlist.length > 0) fetchProducts();
    else setProducts([]);
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">My Wishlist</h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-6xl mb-4">💖</div>
            <div className="text-xl font-medium mb-2">Your wishlist is empty</div>
            <div className="text-gray-400">Browse products and add your favorites to your wishlist!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center group relative">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full border border-gray-200 bg-white hover:bg-pink-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <HeartIconSolid className="w-6 h-6 text-pink-600" />
                </button>
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain bg-white"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 text-center">{product.name}</h3>
                <span className="text-blue-700 font-bold text-lg mb-2">${isNaN(product.price) ? '0.00' : product.price.toFixed(2)}</span>
                <Link href={`/product/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mb-2 w-full text-center">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 