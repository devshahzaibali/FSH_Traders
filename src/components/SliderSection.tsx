'use client';
import React, { useState, useEffect } from 'react';

const sliderImages = [
  '/slider/pexels-dexplanet-1628026.jpg',
  '/slider/pexels-cottonbro-3993115.jpg',
  '/slider/pexels-cottonbro-7505170.jpg',
  '/slider/pexels-ninthgrid-2149521550-30688912.jpg',
  '/slider/pexels-pavel-danilyuk-6461244.jpg',
  '/slider/Mens Business Suit Shirt Certificate Photo White Transparent, Suit, Business Suit, Mens Suit PNG Transparent Clipart Image and PSD File for Free Download.jpg',
];

export default function SliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center mb-10 relative left-1/2 right-1/2 -translate-x-1/2">
      <div className="relative w-full h-screen rounded-none overflow-hidden shadow-lg border border-blue-200 bg-white">
        {sliderImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Slider Image ${idx + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-700 bg-white ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{transitionProperty: 'opacity'}}
            draggable={false}
          />
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3 absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        {sliderImages.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 border border-blue-300 ${currentSlide === idx ? 'bg-blue-600 scale-125 shadow border-blue-600' : 'bg-blue-200'}`}
            style={{ display: 'inline-block' }}
          />
        ))}
      </div>
    </div>
  );
} 