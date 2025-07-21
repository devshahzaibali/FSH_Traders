'use client';

import React, { useEffect, useState } from 'react';
import { categories } from '@/data/categories';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '@/components/WishlistContext';
import { Product } from '@/data/products';

const SliderSection = dynamic(() => import('../../components/SliderSection'), { ssr: false });

const sliderImages = [
  '/slider p/p0001.jpg',
  '/slider p/p0002.jpg',
  '/slider p/p0003.jpg',
  '/slider p/p0004.jpg',
  '/slider p/p0005.jpg',
  '/slider p/p0006.jpg',
  '/slider p/p0007.jpg',
  '/slider p/p0008.jpg',
  '/slider p/p0009.jpg',
];

const CatalogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [search, setSearch] = useState('');
  const { addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category && p.category.toLowerCase() === selectedCategory);
  const searchedProducts = filteredProducts.filter((p) =>
    p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Product Catalog</h1>
        
        {/* Category Filter as Buttons */}
        <div className="mb-8">
          <div className="flex flex-col gap-3">
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex flex-nowrap gap-2 sm:gap-3">
                <button
                  className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </button>
                {categories.map((category, index) => (
                  <button
                    key={`category-${index}`}
                    className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category.name.toLowerCase() ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                    onClick={() => setSelectedCategory(category.name.toLowerCase())}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Search Bar */}
            <div className="w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow transition-all duration-300"
              />
            </div>
          </div>
        </div>
        {/* Slider after New Arrivals/category filter */}
        <SliderSection />
        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.name.toLowerCase() === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600 text-sm">
              {searchedProducts.length} product{searchedProducts.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchedProducts.map((product) => (
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
        {searchedProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl font-medium mb-2">No products found</div>
            <div className="text-gray-400">Try selecting a different category or check back later for new products.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage; 