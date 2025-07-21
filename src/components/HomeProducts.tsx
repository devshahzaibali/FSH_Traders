import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from './WishlistContext';
import { useCart } from './CartContext';
import { Product } from '@/data/products';

const HomeProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          New Arrivals
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our latest products, updated in real-time
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full"
          >
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
            <div className="relative w-full h-48 mb-6 overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {product.description}
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-700 font-bold text-xl">
                  ${isNaN(product.price) ? '0.00' : product.price.toFixed(2)}
                </span>
                {/* Quick Add to Cart */}
                <button
                  onClick={() => addToCart(product, 1)}
                  className="ml-2 px-3 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-all"
                >
                  Add to Cart
                </button>
              </div>
              <Link 
                href={`/product/${product.id}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-center py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-12">No products found.</div>
      )}
    </section>
  );
};

export default HomeProducts; 