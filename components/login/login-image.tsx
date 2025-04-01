"use client";
import { carouselData } from "@/app/api/auth/login/carousel-data";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LoginImageProps {
  title?: string;
  description?: string;
}

export function LoginImage({ title }: LoginImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { images, quotes } = carouselData;

  // Automatic image change every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
      {/* Image with simple fade transition */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100">
        <Image
          src={images[currentIndex]}
          alt="Students taking online exams"
          fill
          className="object-cover brightness-110"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-8">
        <div className="max-w-md text-center text-white mb-8">
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          <div className="bg-black/40 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-lg italic mb-2">{quotes[currentIndex].text}</p>
            <p className="mt-2">{quotes[currentIndex].rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
