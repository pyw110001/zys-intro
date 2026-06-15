import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import NavBar from './components/layout/NavBar';
import HeroSection from './components/sections/HeroSection';
import PhilosophySection from './components/sections/PhilosophySection';
import ServicesIndex, { SERVICES } from './components/sections/ServicesIndex';
import ProjectArchive from './components/sections/ProjectArchive';
import FounderSection from './components/sections/FounderSection';
import ContactSection from './components/sections/ContactSection';
import { SLIDES } from './slidesData';

const App: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation for slides AND full-page scroll hijacking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Horizontal slides in slider section (only if current page is slides, which is activeIndex === 3)
      if (activeIndex === 3 && !isLightboxOpen && !selectedService) {
        if (e.key === 'ArrowLeft') {
          setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
          return;
        }
        if (e.key === 'ArrowRight') {
          setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
          return;
        }
      }

      // 2. Global vertical pages navigation
      if (isScrolling.current || isLightboxOpen || selectedService) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (activeIndex < 5) {
          isScrolling.current = true;
          setActiveIndex(prev => prev + 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (activeIndex > 0) {
          isScrolling.current = true;
          setActiveIndex(prev => prev - 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      }
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setSelectedService(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isLightboxOpen, selectedService]);

  // Track scroll and touch gestures to trigger slide animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLightboxOpen || selectedService) return;
      e.preventDefault(); // Lock native browser scroll

      if (isScrolling.current) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 30) return; // filter minor scroll jitter

      if (deltaY > 0) {
        if (activeIndex < 5) {
          isScrolling.current = true;
          setActiveIndex(prev => prev + 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      } else {
        if (activeIndex > 0) {
          isScrolling.current = true;
          setActiveIndex(prev => prev - 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isLightboxOpen || selectedService) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLightboxOpen || selectedService) return;
      e.preventDefault(); // Lock touch scroll
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLightboxOpen || selectedService) return;
      if (isScrolling.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY; // swipe up is positive

      if (Math.abs(deltaY) < 50) return; // swipe threshold

      if (deltaY > 0) {
        if (activeIndex < 5) {
          isScrolling.current = true;
          setActiveIndex(prev => prev + 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      } else {
        if (activeIndex > 0) {
          isScrolling.current = true;
          setActiveIndex(prev => prev - 1);
          setTimeout(() => { isScrolling.current = false; }, 1000);
        }
      }
    };

    // Attach native non-passive listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, isLightboxOpen, selectedService]);

  const scrollToSection = (id: string) => {
    const indexMap: Record<string, number> = {
      'hero': 0,
      'philosophy': 1,
      'services': 2,
      'slides': 3,
      'about': 4,
      'contact': 5,
      'contact-section': 5
    };
    const targetIndex = indexMap[id];
    if (targetIndex !== undefined) {
      setActiveIndex(targetIndex);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    }, 5000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden text-white selection:bg-[#9de8cf] selection:text-black cursor-auto md:cursor-none bg-[#050706]"
    >
      <CustomCursor />
      <ThreeBackground />
      
      {/* Navigation */}
      <NavBar scrollToSection={scrollToSection} />

      {/* Floating Vertical Navigation Indicators */}
      <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[40] hidden md:flex flex-col gap-6 select-none mix-blend-difference">
        {[
          { id: 'hero', num: '01', name: 'Intro' },
          { id: 'philosophy', num: '02', name: 'Philosophy' },
          { id: 'services', num: '03', name: 'Services' },
          { id: 'slides', num: '04', name: 'Slides' },
          { id: 'about', num: '05', name: 'Creator' },
          { id: 'contact-section', num: '06', name: 'Contact' }
        ].map((item, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center justify-end gap-3 text-right bg-transparent border-0 cursor-pointer focus:outline-none"
              aria-label={`Go to section ${item.name}`}
            >
              <span className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${
                isActive ? 'text-[#9de8cf] scale-105 opacity-100' : 'text-[#8d928d]/40 opacity-0 group-hover:opacity-100 group-hover:text-white/80'
              }`}>
                {item.name}
              </span>
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#9de8cf] scale-150' : 'bg-white/20 group-hover:bg-white/60'
                }`} />
                {isActive && (
                  <motion.div
                    layoutId="activeDotOutline"
                    className="absolute inset-0 border border-[#9de8cf] rounded-full scale-125"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout - JS Scroll Hijacking sliding container */}
      <main className="relative z-10 w-full h-full">
        <motion.div
          animate={{ y: `-${activeIndex * 100}vh` }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex flex-col"
        >
          {/* 01 / HERO */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden">
            <HeroSection scrollToSection={scrollToSection} />
          </div>

          {/* 02 / PHILOSOPHY */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden border-t border-white/5">
            <PhilosophySection />
          </div>

          {/* 03 / SERVICES */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden border-t border-white/5">
            <ServicesIndex onServiceSelect={(srv) => setSelectedService(srv)} />
          </div>

          {/* 04 / PROJECT ARCHIVE */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden border-t border-white/5">
            <ProjectArchive 
              activeSlideIndex={activeSlideIndex}
              setActiveSlideIndex={setActiveSlideIndex}
              setIsLightboxOpen={setIsLightboxOpen}
            />
          </div>

          {/* 05 / FOUNDER */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden border-t border-white/5">
            <FounderSection 
              onImageClick={() => { setActiveSlideIndex(0); setIsLightboxOpen(true); }} 
              scrollToSection={scrollToSection}
            />
          </div>

          {/* 06 / CONTACT + FOOTER (Combined in one full-screen slide) */}
          <div className="w-full h-screen flex-shrink-0 flex flex-col justify-between relative overflow-hidden border-t border-white/5 bg-[#080a09]/10">
            <div className="flex-1 flex flex-col justify-center">
              <ContactSection 
                formSubmitted={formSubmitted}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
              />
            </div>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-8 md:py-12 bg-[#050706]">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <div className="font-heading text-lg font-bold tracking-tight mb-2 text-white">Z-LAB</div>
                   <p className="text-[10px] font-mono text-[#8d928d] tracking-wider uppercase">
                     © 2026 朱元双数字艺术与智能建造工作室. All rights reserved.
                   </p>
                </div>
                
                <div className="flex gap-6 md:gap-8 flex-wrap font-mono text-[10px] text-[#8d928d] tracking-widest uppercase">
                  <span className="text-[#9de8cf]">Art meets Science. Built with precision.</span>
                </div>
              </div>
            </footer>
          </div>
        </motion.div>
      </main>

      {/* SERVICE DETAIL MODAL (Redesigned for Editorial Look) */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#050706]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.98, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-panel border border-white/10 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 select-none"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                data-hover="true"
                data-cursor-text="CLOSE"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/5 border border-white/5 text-[#9de8cf]">
                    {React.createElement(selectedService.icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-sans tracking-tight text-white">{selectedService.title}</h3>
                    <p className="text-[#8d928d] font-mono text-xs uppercase tracking-widest mt-1">{selectedService.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-[#8d928d] leading-relaxed font-light mb-8">
                  {selectedService.description}
                </p>

                <h4 className="text-[10px] font-mono uppercase text-[#9de8cf] tracking-widest mb-4">技术与应用要点</h4>
                <ul className="space-y-3 mb-8 text-xs text-[#f3f0e8]/80 font-light">
                  {selectedService.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-[#9de8cf] rounded-full mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-white/40 tracking-widest mb-4">精选案例项目</h4>
                  <div className="space-y-2.5">
                    {selectedService.cases.map((caseName, idx) => (
                      <div key={idx} className="p-3 bg-white/5 border border-white/5 text-xs text-[#f3f0e8]/70 font-light">
                        {caseName}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedService(null); scrollToSection('contact'); }}
                  className="w-full py-3.5 text-[10px] font-mono uppercase tracking-[0.2em] border border-white/10 hover:border-white/40 hover:bg-white hover:text-black transition-all mt-8 cursor-pointer"
                  data-hover="true"
                  data-cursor-text="DISCUSS"
                >
                  咨询合作
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Zoom Modal (Redesigned for Editorial Look) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[70] bg-[#050706]/98 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out select-none"
          >
            <div 
              className="relative max-w-7xl max-h-[85vh] aspect-video w-full bg-black border border-white/15 overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              {SLIDES[activeSlideIndex].images && SLIDES[activeSlideIndex].images!.length > 1 ? (
                <div className="grid grid-cols-2 gap-3 w-full h-full p-2 bg-[#050706]">
                  {SLIDES[activeSlideIndex].images!.map((imgUrl, i) => (
                    <div key={i} className="relative overflow-hidden w-full h-full flex items-center justify-center bg-black/40">
                      <img
                        src={imgUrl}
                        alt={`${SLIDES[activeSlideIndex].title} ${i + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <img 
                  src={SLIDES[activeSlideIndex].image} 
                  alt={SLIDES[activeSlideIndex].title} 
                  className="w-full h-full object-contain" 
                />
              )}
              
              {/* Image metadata overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16 pointer-events-none">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[#9de8cf] font-mono text-[9px] tracking-widest uppercase mb-1.5 block">Slide {SLIDES[activeSlideIndex].num}</span>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-white uppercase tracking-tight">{SLIDES[activeSlideIndex].title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8d928d] tracking-wider">{activeSlideIndex + 1} / {SLIDES.length}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                data-hover="true"
                data-cursor-text="CLOSE"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                data-hover="true"
                data-cursor-text="PREV"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setActiveSlideIndex(prev => (prev + 1) % SLIDES.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                data-hover="true"
                data-cursor-text="NEXT"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Chat Assistant */}
      <AIChat />
    </div>
  );
};

export default App;
