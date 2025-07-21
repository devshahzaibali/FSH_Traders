"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeProducts from '../components/HomeProducts';
import CategoryGrid from "@/components/CategoryGrid";
import { useAuth } from '@/components/AuthContext';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import BackButton from '@/components/BackButton';

const SliderSection = dynamic(() => import('../components/SliderSection'), { ssr: false });

const sliderImages = [
  '/slider/pexels-dexplanet-1628026.jpg',
  '/slider/pexels-cottonbro-3993115.jpg',
  '/slider/pexels-cottonbro-7505170.jpg',
  '/slider/pexels-ninthgrid-2149521550-30688912.jpg',
  '/slider/pexels-pavel-danilyuk-6461244.jpg',
  '/slider/Mens Business Suit Shirt Certificate Photo White Transparent, Suit, Business Suit, Mens Suit PNG Transparent Clipart Image and PSD File for Free Download.jpg',
];

export default function Home() {
  const { user, role } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncProducts = async () => {
    try {
      const response = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('Products synced successfully!');
        window.location.reload();
      } else {
        alert('Failed to sync products');
      }
    } catch (error) {
      alert('Error syncing products');
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pt-20">
      <Navbar />
      <HeroSection />
      {user && role === 'admin' && (
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={handleSyncProducts}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            🔄 Sync Products to Database
          </button>
        </div>
      )}
      <HomeProducts />
      {/* Slider after New Arrivals */}
      <SliderSection />
      <CategoryGrid />
    </div>
  );
}
