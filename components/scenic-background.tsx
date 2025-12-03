"use client";

import {
  useEffect,
  useState,
} from 'react';

import { Ship } from 'lucide-react';

// Bubble component for animated rising bubbles
function Bubble({
  size,
  left,
  delay,
  duration,
}: {
  size: number;
  left: string;
  delay: number;
  duration: number;
}) {
  return (
    <div
      className="absolute bottom-0 rounded-full bg-white/30 animate-rise"
      style={{
        width: size,
        height: size,
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

interface ScenicBackgroundProps {
  simplified?: boolean;
}

export default function ScenicBackground({
  simplified = false,
}: ScenicBackgroundProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / scrollHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate gradient position based on scroll (0% = top/space, 100% = bottom/underwater)
  const gradientPosition = scrollProgress * 100;

  // Generate random bubbles
  const bubbles = [
    { size: 8, left: "5%", delay: 0, duration: 8 },
    { size: 12, left: "15%", delay: 2, duration: 10 },
    { size: 6, left: "25%", delay: 4, duration: 7 },
    { size: 14, left: "35%", delay: 1, duration: 12 },
    { size: 10, left: "45%", delay: 3, duration: 9 },
    { size: 8, left: "55%", delay: 5, duration: 8 },
    { size: 16, left: "65%", delay: 2, duration: 11 },
    { size: 6, left: "75%", delay: 0, duration: 7 },
    { size: 12, left: "85%", delay: 4, duration: 10 },
    { size: 10, left: "95%", delay: 1, duration: 9 },
    { size: 5, left: "10%", delay: 6, duration: 6 },
    { size: 9, left: "30%", delay: 3, duration: 8 },
    { size: 7, left: "50%", delay: 5, duration: 7 },
    { size: 11, left: "70%", delay: 2, duration: 10 },
    { size: 8, left: "90%", delay: 4, duration: 8 },
  ];

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden transition-all duration-100 ${
        simplified ? "scenic-bg-simplified" : "scenic-bg-full"
      }`}
    >
      {/* Dynamic gradient that shifts with scroll */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom,
            #0a0a1a 0%,
            #1a1a3a 10%,
            #2d1b4e 20%,
            #4a2c6a 30%,
            #6b4d8a 38%,
            #ff9a56 45%,
            #ffb347 50%,
            #87ceeb 55%,
            #5fb3d4 65%,
            #2d8bb5 78%,
            #1a5a7a 88%,
            #0d3d5c 100%
          )`,
          backgroundSize: "100% 300%",
          backgroundPosition: `center ${gradientPosition}%`,
        }}
      />

      {/* Stars layer - fades out as you scroll down */}
      {!simplified && (
        <div
          className="absolute inset-0"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 2.5) }}
        >
          <div className="stars-small" />
          <div className="stars-medium" />
          <div className="stars-large" />

          {/* Moon - visible in space/night section */}
          <div
            className="absolute top-[12%] right-[15%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            style={{
              transform: `translateY(${scrollProgress * 200}px)`,
              opacity: Math.max(0, 1 - scrollProgress * 3),
            }}
          />

          {/* Distant stars/galaxies */}
          <div className="absolute top-[5%] left-[10%] w-2 h-2 rounded-full bg-purple-300 opacity-60 animate-pulse" />
          <div className="absolute top-[12%] left-[25%] w-1 h-1 rounded-full bg-blue-200 opacity-70" />
          <div
            className="absolute top-[8%] left-[60%] w-1.5 h-1.5 rounded-full bg-pink-200 opacity-50 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-[15%] right-[20%] w-1 h-1 rounded-full bg-yellow-200 opacity-60" />
          <div
            className="absolute top-[18%] left-[40%] w-1.5 h-1.5 rounded-full bg-blue-300 opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      )}

      {/* Sun glow - appears during sky/sunset section */}
      {!simplified && (
        <div
          className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full"
          style={{
            top: "20%",
            right: "20%",
            background:
              "radial-gradient(circle, rgba(255,200,100,0.8) 0%, rgba(255,150,50,0.4) 40%, transparent 70%)",
            opacity: Math.max(
              0,
              Math.min(1, (scrollProgress - 0.2) * 4) *
                (1 - Math.max(0, (scrollProgress - 0.5) * 3))
            ),
            transform: `translateY(${scrollProgress * 150}px)`,
          }}
        />
      )}

      {/* Clouds layer - visible during sky section */}
      {!simplified && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: Math.max(
              0,
              Math.min(1, (scrollProgress - 0.25) * 4) *
                (1 - Math.max(0, (scrollProgress - 0.6) * 3))
            ),
          }}
        >
          {/* Cloud 1 */}
          <div
            className="absolute top-[30%] left-[5%]"
            style={{ transform: `translateX(${scrollProgress * -50}px)` }}
          >
            <div className="relative">
              <div className="w-32 h-12 md:w-48 md:h-16 bg-white/80 rounded-full blur-sm" />
              <div className="absolute -top-4 left-6 w-20 h-10 md:w-28 md:h-12 bg-white/70 rounded-full blur-sm" />
              <div className="absolute -top-2 left-16 w-24 h-10 md:w-32 md:h-14 bg-white/75 rounded-full blur-sm" />
            </div>
          </div>

          {/* Cloud 2 */}
          <div
            className="absolute top-[40%] right-[10%]"
            style={{ transform: `translateX(${scrollProgress * 30}px)` }}
          >
            <div className="relative">
              <div className="w-40 h-14 md:w-56 md:h-18 bg-white/75 rounded-full blur-sm" />
              <div className="absolute -top-5 left-8 w-24 h-12 md:w-32 md:h-14 bg-white/65 rounded-full blur-sm" />
              <div className="absolute -top-3 left-20 w-28 h-12 md:w-36 md:h-16 bg-white/70 rounded-full blur-sm" />
            </div>
          </div>

          {/* Cloud 3 */}
          <div
            className="absolute top-[50%] left-[30%]"
            style={{ transform: `translateX(${scrollProgress * -20}px)` }}
          >
            <div className="relative">
              <div className="w-28 h-10 md:w-40 md:h-14 bg-white/70 rounded-full blur-sm" />
              <div className="absolute -top-3 left-4 w-16 h-8 md:w-24 md:h-10 bg-white/60 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Mountains silhouette - visible during transition to water */}
      {!simplified && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: Math.max(
              0,
              Math.min(1, (scrollProgress - 0.4) * 4) *
                (1 - Math.max(0, (scrollProgress - 0.7) * 4))
            ),
          }}
        >
          {/* Back mountain range */}
          <svg
            className="absolute bottom-[40%] w-full h-[25%]"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ transform: `translateY(${scrollProgress * 100}px)` }}
          >
            <path
              d="M0,200 L0,120 L120,80 L240,110 L360,60 L480,90 L600,40 L720,70 L840,30 L960,80 L1080,50 L1200,90 L1320,70 L1440,100 L1440,200 Z"
              fill="rgba(45,75,95,0.9)"
            />
          </svg>

          {/* Front mountain range */}
          <svg
            className="absolute bottom-[35%] w-full h-[20%]"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            style={{ transform: `translateY(${scrollProgress * 80}px)` }}
          >
            <path
              d="M0,160 L0,100 L180,60 L300,90 L420,40 L540,80 L680,20 L800,70 L920,45 L1060,85 L1180,55 L1320,90 L1440,70 L1440,160 Z"
              fill="rgba(35,60,80,0.95)"
            />
          </svg>

          {/* Snow caps */}
          <svg
            className="absolute bottom-[40%] w-full h-[25%] opacity-50"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            style={{ transform: `translateY(${scrollProgress * 100}px)` }}
          >
            <path
              d="M355,65 L360,60 L365,65 Z M595,45 L600,40 L605,45 Z M835,35 L840,30 L845,35 Z M1075,55 L1080,50 L1085,55 Z"
              fill="white"
            />
          </svg>
        </div>
      )}

      {/* Water effects - visible in underwater section */}
      {!simplified && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: Math.max(0, (scrollProgress - 0.6) * 2.5),
          }}
        >
          {/* Water surface shimmer */}
          <div
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent"
            style={{ top: `${30 - scrollProgress * 20}%` }}
          />

          {/* Light rays in water */}
          <div className="absolute top-[40%] left-[20%] w-1 h-40 bg-gradient-to-b from-white/15 to-transparent rotate-[15deg] blur-sm" />
          <div className="absolute top-[45%] left-[40%] w-0.5 h-32 bg-gradient-to-b from-white/10 to-transparent rotate-[-10deg] blur-sm" />
          <div className="absolute top-[35%] right-[30%] w-1 h-36 bg-gradient-to-b from-white/15 to-transparent rotate-[8deg] blur-sm" />
          <div className="absolute top-[50%] right-[15%] w-0.5 h-28 bg-gradient-to-b from-white/10 to-transparent rotate-[-5deg] blur-sm" />

          {/* Animated rising bubbles */}
          {bubbles.map((bubble, index) => (
            <Bubble key={index} {...bubble} />
          ))}

          {/* Playful submarine */}
          <div
            className="absolute animate-submarine"
            style={{
              bottom: "25%",
            }}
          >
            <div className="relative flex items-center gap-1">
              <Ship
                className="w-12 h-12 md:w-16 md:h-16 text-yellow-400/80 rotate-[-10deg]"
                strokeWidth={1.5}
              />
              {/* Submarine bubbles trail */}
              <div className="absolute -right-2 top-1/2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-1 h-1 rounded-full bg-white/20 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>

          {/* Fish emojis swimming */}
          <div
            className="absolute text-2xl md:text-3xl animate-fish-1"
            style={{ top: "60%" }}
          >
            🐠
          </div>
          <div
            className="absolute text-xl md:text-2xl animate-fish-2"
            style={{ top: "70%" }}
          >
            🐟
          </div>
          <div
            className="absolute text-2xl md:text-3xl animate-fish-3"
            style={{ top: "80%" }}
          >
            🐡
          </div>

          {/* Seaweed at bottom */}
          <div className="absolute bottom-0 left-[10%] text-3xl md:text-4xl opacity-60">
            🌿
          </div>
          <div className="absolute bottom-0 left-[30%] text-2xl md:text-3xl opacity-50">
            🌱
          </div>
          <div className="absolute bottom-0 right-[25%] text-3xl md:text-4xl opacity-60">
            🌿
          </div>
          <div className="absolute bottom-0 right-[10%] text-2xl md:text-3xl opacity-50">
            🌱
          </div>
        </div>
      )}
    </div>
  );
}
