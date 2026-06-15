import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  // 1. Default state is playing (ON)
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const maxVolume = 0.35; // Soft background music volume
  const isPlayingRef = useRef(isPlaying);
  const targetVolumeRef = useRef(maxVolume);
  const currentVolRef = useRef(0);
  const timeRef = useRef(0);
  const isLoopActiveRef = useRef(false);

  const startAnimationLoop = () => {
    if (isLoopActiveRef.current) return;
    isLoopActiveRef.current = true;

    const tick = () => {
      const audio = audioRef.current;
      const pathElement = pathRef.current;
      if (!audio || !pathElement) {
        isLoopActiveRef.current = false;
        return;
      }

      const targetVolume = targetVolumeRef.current;
      
      // Smoothly interpolate volume (fade-in / fade-out)
      currentVolRef.current += (targetVolume - currentVolRef.current) * 0.05;

      // Clamp close values
      if (Math.abs(currentVolRef.current - targetVolume) < 0.005) {
        currentVolRef.current = targetVolume;
      }

      // Update actual audio element volume
      audio.volume = currentVolRef.current;

      // Pause audio element if it was fading out and has reached 0
      if (currentVolRef.current === 0 && !isPlayingRef.current && !audio.paused) {
        audio.pause();
      }

      // Calculate wave amplitude relative to current volume
      const currentAmplitude = 4.5 * (currentVolRef.current / maxVolume);

      // Increment wave phase time if there is movement
      if (currentAmplitude > 0.05) {
        timeRef.current += 0.08;
      }

      // Generate the path points for a continuous 1.5 cycle sine wave
      const points = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const x = 6 + (12 * i) / steps;
        const normX = i / steps;
        const envelope = Math.sin(Math.PI * normX);
        const wave = Math.sin(1.5 * 2 * Math.PI * normX - timeRef.current);
        const y = 12 + currentAmplitude * envelope * wave;
        points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
      }
      
      pathElement.setAttribute("d", "M " + points.join(" L "));

      // Continue loop if playing or if volume is still fading (currentVol > 0)
      if (isPlayingRef.current || currentVolRef.current > 0.001) {
        requestAnimationFrame(tick);
      } else {
        // Hard reset to perfect flat line
        pathElement.setAttribute("d", "M 6 12 L 18 12");
        isLoopActiveRef.current = false;
      }
    };

    requestAnimationFrame(tick);
  };

  // Initialize audio volume to 0 on first render to prevent spikes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  }, []);

  // Synchronize target volume and audio play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      targetVolumeRef.current = maxVolume;
      
      // Attempt to play
      audio.play().then(() => {
        startAnimationLoop();
      }).catch((err) => {
        // If it failed (likely autoplay block on first mount), set up interaction triggers
        console.warn("Audio play deferred or blocked:", err);
        
        const startOnInteraction = () => {
          if (audio && isPlayingRef.current) {
            audio.play().then(() => {
              startAnimationLoop();
            }).catch(e => console.error(e));
          }
          cleanup();
        };

        const cleanup = () => {
          window.removeEventListener('click', startOnInteraction);
          window.removeEventListener('touchstart', startOnInteraction);
          window.removeEventListener('keydown', startOnInteraction);
        };

        window.addEventListener('click', startOnInteraction);
        window.addEventListener('touchstart', startOnInteraction);
        window.addEventListener('keydown', startOnInteraction);
      });
    } else {
      targetVolumeRef.current = 0;
      startAnimationLoop();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center pointer-events-auto select-none">
      <audio 
        ref={audioRef} 
        src="./audio/Equinox in Slow Motion.mp3" 
        loop 
        preload="auto"
      />
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eef2f5] text-black shadow-md border border-black/5 hover:scale-105 hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer"
        data-hover="true"
        data-cursor-text={isPlaying ? "MUTE" : "PLAY"}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5" 
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
