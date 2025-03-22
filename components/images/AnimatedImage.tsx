"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const AnimatedImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-[400px]">
      {/* Placeholder with animation while loading */}
      {!imageLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            background: ["#f0f0f0", "#e0e0e0", "#f0f0f0"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        />
      )}

      {/* Actual image with fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: imageLoaded ? 1 : 0,
          y: imageLoaded ? 0 : 10,
        }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <img
          src="/authimg/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg" // Replace with your actual image path
          alt="Students taking online exams"
          className="object-contain rounded-lg"
        />
      </motion.div>
    </div>
  );
};

export default AnimatedImage;
