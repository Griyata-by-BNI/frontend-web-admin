// app/(debtor)/developers/components/ImageSlider.tsx

"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  urls: string[];
  altText: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ urls, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!urls || urls.length === 0) {
    return (
      <div className="relative w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No Image Available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? urls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === urls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
      {/* Main Image */}
      <Image
        src={urls[currentIndex]}
        alt={altText}
        layout="fill"
        objectFit="cover"
        className="transition-opacity duration-500 ease-in-out"
        key={currentIndex} // Key change forces re-render for transition effect
      />

      {/* Navigation Arrows */}
      <div 
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </div>
      <div 
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {urls.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer h-2 w-2 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;