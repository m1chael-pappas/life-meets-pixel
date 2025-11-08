"use client";

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip transition on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Start transition
    setIsTransitioning(true);

    // End transition after heart zooms in
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Heart Zoom Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={`transition-${pathname}`}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Zooming Heart - Smooth Overflow */}
            <motion.div
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 50, opacity: 0 }}
              transition={{
                duration: 4,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative"
            >
              {/* Pixel Heart */}
              <div className="w-16 h-16 relative">
                <Image
                  src="/heart.svg"
                  alt="Loading heart"
                  width={64}
                  height={64}
                  className="w-full h-full [image-rendering:pixelated] drop-shadow-[0_0_20px_hsl(var(--primary))] dark:[filter:drop-shadow(0_0_20px_hsl(var(--primary)))_drop-shadow(0_0_2px_white)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_1px_white)]"
                  draggable={false}
                />
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              className="absolute mt-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              transition={{
                opacity: {
                  times: [0, 0.15, 0.7, 1],
                  duration: 4,
                },
                y: { duration: 0.5 },
              }}
            >
              <h2 className="text-2xl font-bold text-foreground font-mono animate-pulse">
                LOADING PIXELS...
              </h2>
              <div className="flex justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content - No extra animation */}
      {children}
    </>
  );
}
