"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import { db } from '../../../firebase';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../../components/WishlistContext';

interface CategoryPageProps {
  params: { category: string };
}

const CategoryPage: React.FC<{ params: Promise<{ category: string }> }> = ({ params }) => {
  const { category } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const { addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="w-full min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 capitalize">{category.replace(/-/g, ' ')} Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center group relative">
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full border border-gray-200 bg-white hover:bg-pink-50 transition-colors"
                aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWishlisted(product.id) ? (
                  <HeartIconSolid className="w-6 h-6 text-pink-600" />
                ) : (
                  <HeartIconOutline className="w-6 h-6 text-gray-400 hover:text-pink-600" />
                )}
              </button>
              {product.image && product.image.trim() !== '' ? (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 bg-white"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 mb-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-sm">No Image</div>
                  </div>
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2 text-gray-900 text-center">{product.name}</h3>
              <span className="text-blue-700 font-bold text-lg mb-2">${isNaN(product.price) ? '0.00' : product.price.toFixed(2)}</span>
              {/* Quick Add to Cart */}
              <button
                onClick={() => addToCart(product, 1)}
                className="mb-2 px-3 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-all"
              >
                Add to Cart
              </button>
              <Link href={`/product/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mb-2 w-full text-center">
                View Details
              </Link>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl font-medium mb-2">No products found</div>
            <div className="text-gray-400">Try a different category or check back later for new products.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 