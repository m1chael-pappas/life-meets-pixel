'use client';

import React from 'react';

import { motion } from 'motion/react';
import Image from 'next/image';

type HeartSize = "sm" | "md" | "lg" | "xl";
type HeartState = "empty" | "half" | "full";

interface PixelHeartRatingProps {
  reviewScore: number; // 0-10 from CMS
  readonly?: boolean;
  size?: HeartSize;
  className?: string;
  showScore?: boolean;
  animate?: boolean;
  animationDelay?: number;
}

interface PixelHeartProps {
  state: HeartState;
  index: number;
  size: HeartSize;
  animate?: boolean;
  animationDelay?: number;
}

interface SizeClasses {
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
}

const PixelHeartRating: React.FC<PixelHeartRatingProps> = ({
  reviewScore,
  size = "md",
  className = "",
  showScore = false,
  animate = false,
  animationDelay = 0,
}) => {
  const sizeClasses: SizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  } as const;

  // Convert 0-10 score to heart states
  const getHeartStates = (score: number): HeartState[] => {
    const clampedScore = Math.max(0, Math.min(10, score));
    const hearts: HeartState[] = [];

    for (let i = 0; i < 5; i++) {
      const heartValue = i * 2; // Each heart represents 2 points

      if (clampedScore >= heartValue + 2) {
        hearts.push("full");
      } else if (clampedScore >= heartValue + 1) {
        hearts.push("half");
      } else {
        hearts.push("empty");
      }
    }

    return hearts;
  };

  const heartStates = getHeartStates(reviewScore);

  const PixelHeart: React.FC<PixelHeartProps> = ({ state, index, size, animate, animationDelay }) => {
    const heartContent = (
      <div
        className={`
          ${sizeClasses[size]}
          [image-rendering:pixelated]
          relative
        `}
        role="img"
        aria-label={`Heart ${index + 1}: ${state}`}
      >
        {state === "full" && (
          <Image
            src="/heart.svg"
            alt="Full heart"
            width={32}
            height={32}
            className="w-full h-full [image-rendering:pixelated] dark:[filter:drop-shadow(0_0_1px_white)_drop-shadow(0_0_1px_white)]"
            draggable={false}
          />
        )}

        {state === "half" && (
          <>
            <Image
              src="/heart.svg"
              alt="Half heart background"
              className="w-full h-full [image-rendering:pixelated] opacity-30 [filter:grayscale(1)_brightness(0.5)] dark:[filter:grayscale(1)_brightness(0.5)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_1px_white)] dark:opacity-50"
              width={32}
              height={32}
              draggable={false}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            >
              <Image
                src="/heart.svg"
                alt="Half heart filled"
                width={32}
                height={32}
                className="w-full h-full [image-rendering:pixelated] dark:[filter:drop-shadow(0_0_1px_white)_drop-shadow(0_0_1px_white)]"
                draggable={false}
              />
            </div>
          </>
        )}

        {state === "empty" && (
          <Image
            src="/heart.svg"
            alt="Empty heart"
            width={32}
            height={32}
            className="w-full h-full [image-rendering:pixelated] opacity-30 [filter:grayscale(1)_brightness(0.5)] dark:[filter:grayscale(1)_brightness(0.5)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_2px_white)_drop-shadow(0_0_1px_white)] dark:opacity-50"
            draggable={false}
          />
        )}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.5,
            delay: (animationDelay || 0) + (index * 0.3),
          }}
        >
          {heartContent}
        </motion.div>
      );
    }

    return heartContent;
  };

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`Rating: ${reviewScore} out of 10`}
    >
      {heartStates.map((state, index) => (
        <PixelHeart
          key={index}
          state={state}
          index={index}
          size={size}
          animate={animate}
          animationDelay={animationDelay}
        />
      ))}
      {showScore && (
        <span className="ml-2 text-sm font-mono text-muted-foreground">
          {reviewScore}/10
        </span>
      )}
    </div>
  );
};

export default PixelHeartRating;
export type { HeartSize, HeartState, PixelHeartRatingProps };
