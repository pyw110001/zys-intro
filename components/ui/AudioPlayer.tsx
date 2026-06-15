import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt to play on user interaction or mount if browser allows
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio autoplay blocked or failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // The wavy path is constructed to seamlessly loop when translated horizontally by exactly 12 units.
  const wavyPath = 
    "M -12 12 C -10.5 12, -10.5 7, -9 7 C -7.5 7, -7.5 12, -6 12 C -4.5 12, -4.5 17, -3 17 C -1.5 17, -1.5 12, 0 12 C 1.5 12, 1.5 7, 3 7 C 4.5 7, 4.5 12, 6 12 C 7.5 12, 7.5 17, 9 17 C 10.5 17, 10.5 12, 12 12 C 13.5 12, 13.5 7, 15 7 C 16.5 7, 16.5 12, 18 12 C 19.5 12, 19.5 17, 21 17 C 22.5 17, 22.5 12, 24 12 C 25.5 12, 25.5 7, 27 7 C 28.5 7, 28.5 12, 30 12 C 31.5 12, 31.5 17, 33 17 C 34.5 17, 34.5 12, 36 12";

  // The straight path has the exact same number of control points at y=12, enabling smooth Framer Motion morphing.
  const straightPath = 
    "M -12 12 C -10.5 12, -10.5 12, -9 12 C -7.5 12, -7.5 12, -6 12 C -4.5 12, -4.5 12, -3 12 C -1.5 12, -1.5 12, 0 12 C 1.5 12, 1.5 12, 3 12 C 4.5 12, 4.5 12, 6 12 C 7.5 12, 7.5 12, 9 12 C 10.5 12, 10.5 12, 12 12 C 13.5 12, 13.5 12, 15 12 C 16.5 12, 16.5 12, 18 12 C 19.5 12, 19.5 12, 21 12 C 22.5 12, 22.5 12, 24 12 C 25.5 12, 25.5 12, 27 12 C 28.5 12, 28.5 12, 30 12 C 31.5 12, 31.5 12, 33 12 C 34.5 12, 34.5 12, 36 12";

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 flex items-center justify-center pointer-events-auto select-none">
      <audio 
        ref={audioRef} 
        src="./audio/Equinox in Slow Motion.mp3" 
        loop 
        preload="auto"
      />
      <button
        onClick={togglePlay}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#eef2f5] text-black shadow-lg border border-black/5 hover:scale-105 hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer"
        data-hover="true"
        data-cursor-text={isPlaying ? "MUTE" : "PLAY"}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        >
          <defs>
            {/* Mask to clip the wave horizontally to mimic the user's screenshots */}
            <clipPath id="wave-clip-mask">
              <rect x="7" y="4" width="10" height="16" rx="1.25" ry="1.25" />
            </clipPath>
          </defs>
          <g clipPath="url(#wave-clip-mask)">
            <motion.path
              animate={isPlaying ? { x: [0, -12] } : { x: 0 }}
              transition={isPlaying ? {
                ease: "linear",
                duration: 1.5,
                repeat: Infinity
              } : {
                duration: 0.35
              }}
              d={isPlaying ? wavyPath : straightPath}
              className="text-black"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
