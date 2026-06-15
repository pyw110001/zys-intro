import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SLIDES } from '../../slidesData';
import SectionLabel from '../ui/SectionLabel';

interface ProjectArchiveProps {
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsLightboxOpen: (open: boolean) => void;
}

const ProjectArchive: React.FC<ProjectArchiveProps> = ({
  activeSlideIndex,
  setActiveSlideIndex,
  setIsLightboxOpen,
}) => {
  const currentSlide = SLIDES[activeSlideIndex];

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section id="slides" className="min-h-screen flex flex-col justify-center border-t border-white/10 px-6 md:px-12 bg-[#080a09]/20 backdrop-blur-md snap-start snap-always">
      <div className="max-w-7xl mx-auto">
        <SectionLabel num="04" title="Project Archive" className="mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left: Interactive Image Viewport */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-[#0b1110]/30 border border-white/5 p-4 relative">
            <div
              className="relative aspect-video w-full overflow-hidden group shadow-lg cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              data-hover="true"
              data-cursor-text="ZOOM"
            >
              <AnimatePresence mode="wait">
                {currentSlide.images && currentSlide.images.length > 1 ? (
                  <motion.div
                    key={`grid-${activeSlideIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-2 gap-3 w-full h-full bg-black/10"
                  >
                    {currentSlide.images.map((imgUrl, i) => (
                      <div key={i} className="relative overflow-hidden w-full h-full flex items-center justify-center bg-black/10">
                        <img
                          src={imgUrl}
                          alt={`${currentSlide.title} ${i + 1}`}
                          className="w-full h-full object-contain transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.img
                    key={`img-${activeSlideIndex}`}
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-contain"
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end pointer-events-none">
                <div className="font-heading text-3xl font-bold text-white/30">
                  {currentSlide.num}
                </div>
                <div className="bg-black/60 border border-white/10 text-[9px] font-mono tracking-widest text-[#f3f0e8]/80 px-3 py-1.5 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3 h-3 text-[#9de8cf]" />
                  Click to Expand
                </div>
              </div>
            </div>

            {/* Micro navigation */}
            <div className="flex justify-between items-center mt-4 px-2 select-none">
              <button
                onClick={handlePrev}
                className="p-2.5 bg-white/5 border border-white/5 hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer"
                aria-label="Previous Slide"
                data-hover="true"
                data-cursor-text="PREV"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-[10px] font-mono text-[#8d928d] tracking-wider">
                {activeSlideIndex + 1} / {SLIDES.length} — Drag · Wheel · Arrow Keys
              </div>
              <button
                onClick={handleNext}
                className="p-2.5 bg-white/5 border border-white/5 hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer"
                aria-label="Next Slide"
                data-hover="true"
                data-cursor-text="NEXT"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Slide Text Archive & Filmstrip */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-panel border border-white/5 p-8 md:p-10 relative">
            <div className="flex-1 overflow-y-auto pr-2 max-h-[360px] scrollbar-thin">
              <div className="font-mono text-[9px] tracking-widest text-[#8d928d] block mb-4 uppercase">DECK CASE DETAILS</div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlideIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-heading font-bold uppercase leading-tight mb-6 text-white border-b border-white/5 pb-4">
                    {currentSlide.title || `Slide ${currentSlide.num}`}
                  </h3>
                  
                  <div className="text-[#8d928d] font-light text-xs leading-relaxed whitespace-pre-wrap">
                    {currentSlide.content
                      .replace(/^#(.*)$/m, '') // Remove first H1 title from body to avoid repeating
                      .replace(/---$/, '') // Remove dashes
                      .trim()}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom filmstrip */}
            <div className="mt-8 border-t border-white/5 pt-6 flex gap-3 overflow-x-auto py-2 scrollbar-none scroll-smooth">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.num}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`flex-shrink-0 w-16 h-10 overflow-hidden border transition-all relative ${
                    activeSlideIndex === idx ? 'border-[#9de8cf] scale-105' : 'border-white/10 opacity-40 hover:opacity-100'
                  }`}
                  data-hover="true"
                  data-cursor-text={`SLIDE ${slide.num}`}
                >
                  <img src={slide.image} alt={slide.num} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-mono text-[9px] text-white">
                    {slide.num}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectArchive;
