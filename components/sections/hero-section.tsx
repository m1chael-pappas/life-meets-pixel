"use client";

import { motion } from 'motion/react';

import PixelCursorFollower from '@/components/pixel-cursor-follower';
import PixelHeartRating from '@/components/ui/pixel-heart-rating';

export default function HeroSection() {
  return (
    <section className="text-center mb-12 py-8 relative overflow-hidden">
      {/* Pixelated cursor follower - only visible in hero area */}
      <div className="absolute inset-0 pointer-events-none">
        <PixelCursorFollower />
      </div>
      <motion.h2
        className="text-5xl font-bold text-white mb-4 font-mono drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-primary">Reviews</span>{" "}
        <span className="text-white/90">&</span> Stuff;
      </motion.h2>
      <motion.div
        className="flex items-center justify-center gap-4 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-2xl">🎮</span>
        <PixelHeartRating
          reviewScore={7}
          showScore={false}
          size="md"
          animate={true}
          animationDelay={0}
        />
        <span className="text-2xl hidden md:inline">🎬</span>
        <PixelHeartRating
          reviewScore={7}
          showScore={false}
          size="md"
          className="hidden md:flex"
          animate={true}
          animationDelay={1.5}
        />
        <span className="text-2xl">📚</span>
      </motion.div>
      <motion.p
        className="text-white/80 text-lg max-w-3xl mx-auto drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Hello there, General Kenobi{" "}
        <motion.span
          className="inline-block"
          animate={{
            rotate: [0, 14, -8, 14, -4, 10, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          👋
        </motion.span>
        (oops wrong universe) <br /> Welcome to our little corner of the
        internet. It&apos;s just me here and my partner Jenna, sharing honest
        thoughts on the games, movies, books, and tech we love (or sometimes
        don&apos;t). <br /> No sponsors. No PR fluff. <br /> Just real reviews
        from a fellow nerd and his sidekick.
      </motion.p>
      <motion.div
        className="flex justify-center gap-4 mt-6 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="text-lg">🎯</span>
          <span>Honest Reviews</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="text-lg">🧠</span>
          <span>Personal Insights</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="text-lg">🔥</span>
          <span>Geek-Centric Picks</span>
        </div>
      </motion.div>
    </section>
  );
}
