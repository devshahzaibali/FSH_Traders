"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

const HeroSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { user, logout } = useAuth();

  const features = [
    "Free shipping on orders $50+",
    "24/7 Customer support",
    "Secure payments",
    "30-day money back guarantee",
    "1000+ satisfied customers"
  ];

  // Add static e-commerce slider images
  const sliderImages = [
    "https://images.unsplash.com/photo-1513708927688-890a1c7b6b8a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515168833906-d2a3b82b1e1c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
    return () => unsub();
  }, []);

  // Debounced search handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.length > 1) {
      const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.description.toLowerCase().includes(value.toLowerCase()) ||
        p.category.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [allProducts]);

  return (
    <section 
      className={`relative w-full flex flex-col items-center justify-center text-center px-2 sm:px-4 py-10 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl shadow-lg mb-6 md:mb-10 overflow-hidden transition-all duration-300 mt-16`}
      style={{ marginTop: '4rem' }} // Fixed margin to account for navbar
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-28 h-28 sm:w-40 sm:h-40 bg-blue-100 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-40 sm:h-40 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse-slower"></div>
        
        {/* Floating animated elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div 
            key={i}
            className={`absolute ${i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300'} rounded-full opacity-10`}
            style={{
              width: `${6 + (i * 2)}px`,
              height: `${6 + (i * 2)}px`,
              top: `${10 + (i * 10)}%`,
              left: `${5 + (i * 12)}%`,
            }}
            animate={{
              y: [0, i % 3 === 0 ? -15 : i % 3 === 1 ? 12 : -8],
              x: [0, i % 3 === 0 ? 8 : i % 3 === 1 ? -12 : -15],
            }}
            transition={{
              duration: 8 + (i * 2),
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* Logo and Headline - Fixed positioning */}
        {/* Removed logo rendering */}

        <motion.h1 
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900 tracking-tight leading-tight animate-gradient-shift"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
        FSH Traders
          <motion.span 
            className="inline-block ml-1 sm:ml-2 text-blue-600"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ®
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 max-w-xs sm:max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
        Discover premium products, unbeatable deals, and a seamless shopping experience. 
          <motion.span 
            className="block mt-1 sm:mt-2 text-blue-600 font-medium"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            New arrivals every week!
          </motion.span>
        </motion.p>

        {/* Slider rendering logic with custom images */}
        {sliderImages.length > 0 && (
          <div className="relative w-full max-w-2xl mx-auto mt-6 mb-8">
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg bg-white">
              {sliderImages.map((img, idx) => (
                <Image
                  key={img}
                  src={img}
                  alt={`Slider Image ${idx + 1}`}
                  fill
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 bg-white ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  style={{transitionProperty: 'opacity'}}
                  draggable={false}
                />
              ))}
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-3 absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              {sliderImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 border border-blue-300 ${currentSlide === idx ? 'bg-blue-600 scale-125 shadow border-blue-600' : 'bg-blue-200'}`}
                  style={{ display: 'inline-block' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/catalog" passHref>
            <motion.button
              className="group relative overflow-hidden inline-flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="inline-flex items-center relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-5 sm:px-7 py-2 sm:py-3 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Shop Now
                <motion.svg 
                  className="ml-1 sm:ml-2 w-4 h-4"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </motion.svg>
              </span>
            </motion.button>
          </Link>

          <Link href="/about" passHref>
            <motion.button
              className="group relative inline-flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="inline-flex items-center relative z-10 border-2 border-blue-600 text-blue-700 hover:bg-blue-50/50 font-medium px-5 sm:px-7 py-2 sm:py-3 rounded-full text-base sm:text-lg shadow-sm hover:shadow transition-all duration-300">
                Learn More
                <svg className="ml-1 sm:ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="relative w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto mt-2 sm:mt-4 mb-2 sm:mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search for products..."
              className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base shadow transition-all duration-300 hover:shadow-md focus:shadow-lg"
            />
            <svg 
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <AnimatePresence>
          {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute z-50 bg-white border border-gray-200 rounded-lg mt-1 sm:mt-2 w-full shadow-xl overflow-hidden"
              >
              {searchResults.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 hover:bg-blue-50 text-gray-900 transition-colors duration-200"
                  onClick={() => { setSearch(''); setSearchResults([]); }}
                >
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-md overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover"
                        sizes="(max-width: 640px) 32px, 40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium truncate">{product.name}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{product.category}</p>
                  </div>
                    <span className="text-xs sm:text-sm font-semibold text-blue-600">${product.price}</span>
                </Link>
              ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Animated trust indicators */}
        <motion.div 
          className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white bg-opacity-50 backdrop-blur-sm border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
            <span className="whitespace-nowrap">{features[currentFeature]}</span>
          </motion.div>

          <motion.div 
            className="hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white bg-opacity-50 backdrop-blur-sm border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
            <span className="whitespace-nowrap">24/7 Support</span>
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white bg-opacity-50 backdrop-blur-sm border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
            <span className="whitespace-nowrap">Secure Payments</span>
          </motion.div>
        </motion.div>
    </div>
    
      {/* Global animations */}
    <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
      }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
    `}</style>
  </section>
);
};

export default HeroSection;