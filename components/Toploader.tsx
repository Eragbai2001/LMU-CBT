"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TopLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);

      // Animate progress more gradually
      let currentProgress = 0;
      const incrementProgress = () => {
        currentProgress += Math.random() * 30 + 10; // Random increment between 10-40
        if (currentProgress < 90) {
          setProgress(currentProgress);
          progressTimer = setTimeout(incrementProgress, 150 + Math.random() * 100);
        }
      };

      // Start progress animation
      setTimeout(incrementProgress, 50);

      // Complete the progress after a minimum time
      completeTimer = setTimeout(() => {
        setProgress(100);
        hideTimer = setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 300);
      }, 800); // Minimum loading time of 800ms
    };

    startLoading();

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(completeTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[1000] h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 shadow-sm"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{ 
              width: { duration: 0.3, ease: "easeOut" },
              opacity: { duration: 0.2 }
            }}
            style={{
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}