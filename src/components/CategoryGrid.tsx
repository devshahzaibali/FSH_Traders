'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import Image from 'next/image';

const CategoryGrid: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover products in your favorite categories</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={`category-${index}`}
              href={`/catalog/${category.name.toLowerCase().replace(/ & | /g, '-').replace(/[^a-z0-9-]/g, '')}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center py-6 cursor-pointer"
            >
              <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-blue-100 shadow">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-gray-900 font-semibold text-base text-center px-2 drop-shadow-lg">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/catalog"
            className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-200"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;