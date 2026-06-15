import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    let currentAmplitude = isPlaying ? 4.5 : 0;

    const pathElement = pathRef.current;
    if (!pathElement) return;

    const tick = () => {
      const targetAmplitude = isPlaying ? 4.5 : 0;
      // Smoothly interpolate amplitude
      currentAmplitude += (targetAmplitude - currentAmplitude) * 0.12;

      // Increment time for flowing wave
      if (isPlaying) {
        time += 0.08; // speed of the wave flow
      }

      // Generate the path points
      const points = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const x = 6 + (12 * i) / steps;
        const normX = i / steps; // 0 to 1
        const envelope = Math.sin(Math.PI * normX);
        const wave = Math.sin(1.5 * 2 * Math.PI * normX - time);
        const y = 12 + currentAmplitude * envelope * wave;
        points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
      }
      
      pathElement.setAttribute("d", "M " + points.join(" L "));

      // Continue loop if we are playing or if the transition is still active (amplitude not yet 0)
      if (isPlaying || currentAmplitude > 0.01) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Hard reset to perfect flat line when animation completes
        pathElement.setAttribute("d", "M 6 12 L 18 12");
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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
          strokeWidth="2.2" 
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            ref={pathRef}
            d="M 6 12 L 18 12"
            className="stroke-current text-black"
          />
        </svg>
      </button>
    </div>
  );
}
