"use client";

import React, { useEffect, useState } from "react";

const SignInButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Function to toggle animation state
    const toggleAnimation = () => {
      setIsAnimating(true);

      // Reset animation after it completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Reduced to 2 seconds for the animation
    };

    // Initial animation
    toggleAnimation();

    // Set up interval to run more frequently
    const interval = setInterval(() => {
      toggleAnimation();
    }, 4000); // 2s for animation + 2s pause between animations

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center ">
      <button className="relative">
        <span className="text-lg font-medium text-gray-800  py-2">Sign In</span>
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-800  to-red-500 transition-all duration-[2000ms] ease-in-out ${
            isAnimating ? "w-full" : "w-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default SignInButton;
