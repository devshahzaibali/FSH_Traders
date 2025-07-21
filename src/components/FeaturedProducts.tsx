import React from 'react';
import { products } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  rating?: number;
  discount?: number;
  isNew?: boolean;
}

const FeaturedProducts: React.FC = () => {
  const featured = products.filter((p) => p.featured);
  
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Featured Products
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our handpicked selection of premium items
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((product: Product) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full"
          >
            {/* Product badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {product.isNew && (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product.discount && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Product image */}
            <div className="relative w-full h-48 mb-6 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Product info */}
            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}

            {/* Price and CTA */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-700 font-bold text-xl">
                  ${product.price.toFixed(2)}
                  {product.discount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${(product.price * (1 + product.discount/100)).toFixed(2)}
                    </span>
                  )}
                </span>
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

      {/* View all products link */}
      <div className="text-center mt-12">
        <Link
          href="/catalog"
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group"
        >
          View all products
          <svg 
            className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;