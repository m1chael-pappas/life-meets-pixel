"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface Bullet {
  id: number;
  x: number;
  y: number;
}

export default function PixelCursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      const newBullet: Bullet = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setBullets((prev) => [...prev, newBullet]);

      // Remove bullet after animation
      setTimeout(() => {
        setBullets((prev) => prev.filter((b) => b.id !== newBullet.id));
      }, 600);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Main Pixel Art Spaceship/Drone */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* Retro Fighter Jet Pixel Art */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 16 16"
          style={{ imageRendering: "pixelated" }}
          className="drop-shadow-[0_0_8px_hsl(var(--primary))]"
        >
          {/* Main body */}
          <rect x="7" y="4" width="2" height="8" className="fill-primary dark:fill-white" />

          {/* Sharp Fighter Jet Wings - Left Side (swept back and up) */}
          <rect x="6" y="5" width="1" height="2" className="fill-primary dark:fill-white" opacity="0.9" />
          <rect x="5" y="6" width="1" height="1" className="fill-primary dark:fill-white" opacity="0.9" />
          <rect x="4" y="7" width="1" height="1" className="fill-primary dark:fill-white" opacity="0.9" />

          {/* Sharp Fighter Jet Wings - Right Side (swept back and up) */}
          <rect x="9" y="5" width="1" height="2" className="fill-primary dark:fill-white" opacity="0.9" />
          <rect x="10" y="6" width="1" height="1" className="fill-primary dark:fill-white" opacity="0.9" />
          <rect x="11" y="7" width="1" height="1" className="fill-primary dark:fill-white" opacity="0.9" />

          {/* Cockpit/Head */}
          <rect x="6" y="3" width="4" height="2" className="fill-primary dark:fill-white" />

          {/* Cockpit window */}
          <rect x="7" y="3" width="2" height="1" fill="#60a5fa" opacity="0.7" />

          {/* Engines/Thrusters */}
          <rect x="6" y="12" width="1" height="1" fill="#ff6b6b" />
          <rect x="9" y="12" width="1" height="1" fill="#ff6b6b" />

          {/* Sharp Nose */}
          <rect x="7" y="2" width="2" height="1" className="fill-primary dark:fill-white" />
          <rect x="7.5" y="1" width="1" height="1" className="fill-primary dark:fill-white" />
        </svg>

        {/* Animated engine glow */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scaleY: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-1 h-2 bg-orange-400 blur-[1px]" style={{ imageRendering: "pixelated" }} />
            <div className="w-1 h-2 bg-orange-400 blur-[1px]" style={{ imageRendering: "pixelated" }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Trailing particles (exhaust trail) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-40"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          transition={{
            delay: 0.04 * (i + 1),
            type: "spring",
            damping: 20 - i * 2,
            stiffness: 150 - i * 20,
          }}
        >
          <div
            className="bg-primary/30 dark:bg-white/30 rounded-full blur-[1px]"
            style={{
              width: `${8 - i}px`,
              height: `${8 - i}px`,
              imageRendering: "pixelated",
            }}
          />
        </motion.div>
      ))}

      {/* Laser bullets */}
      <AnimatePresence>
        {bullets.map((bullet) => (
          <motion.div
            key={bullet.id}
            className="pointer-events-none fixed z-50"
            initial={{
              x: bullet.x,
              y: bullet.y,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              y: bullet.y - 300,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "linear",
            }}
          >
            {/* Pixel laser bullet */}
            <div className="relative">
              <div
                className="w-1 h-3 bg-yellow-400"
                style={{ imageRendering: "pixelated" }}
              />
              <div
                className="absolute inset-0 w-1 h-3 bg-yellow-400 blur-sm"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
