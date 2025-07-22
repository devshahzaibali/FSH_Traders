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

  // Remove handleSyncProducts and related button code

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pt-20">
      <Navbar />
      <HeroSection />
      {/* Remove Sync Products button for admin users */}
      <HomeProducts />
      {/* Slider after New Arrivals */}
      <SliderSection />
      <CategoryGrid />
    </div>
  );
}
