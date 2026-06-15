import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import EditorialButton from '../ui/EditorialButton';
import SectionLabel from '../ui/SectionLabel';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const duplicateTextRef = useRef<HTMLHeadingElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion values for raw mouse coordinates relative to Hero Section
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Springs for buttery smooth lag/follow effect
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 220, mass: 0.15 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 220, mass: 0.15 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  const offsetRef = useRef({ dx: 0, dy: 0 });

  // Measure and track the offset of the duplicateTextRef relative to the sectionRef
  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateOffset = () => {
      if (duplicateTextRef.current && sectionRef.current) {
        const textRect = duplicateTextRef.current.getBoundingClientRect();
        const sectionRect = sectionRef.current.getBoundingClientRect();
        offsetRef.current = {
          dx: textRect.left - sectionRect.left,
          dy: textRect.top - sectionRect.top,
        };
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    // Run an additional update after a short delay to ensure fonts and layout have fully loaded
    const timer = setTimeout(updateOffset, 600);

    return () => {
      window.removeEventListener('resize', updateOffset);
      clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  // Perform DOM updates directly inside subscription callback to avoid React re-renders on every pixel moved.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateDOM = () => {
      const xVal = smoothX.get();
      const yVal = smoothY.get();
      const rawX = mouseX.get();
      const rawY = mouseY.get();

      // Shear/offset to simulate realistic refractive distortion
      const diffX = (rawX - xVal) * 0.045;
      const diffY = (rawY - yVal) * 0.045;

      if (duplicateTextRef.current) {
        const textX = xVal - offsetRef.current.dx;
        const textY = yVal - offsetRef.current.dy;

        // Position circle clip mask exactly over the lens center coordinate (relative to the duplicate text container)
        duplicateTextRef.current.style.clipPath = `circle(110px at ${textX}px ${textY}px)`;
        // Set transform origin dynamically to the lens center to achieve realistic local magnification
        duplicateTextRef.current.style.transformOrigin = `${textX}px ${textY}px`;
        // Scale and translate text inside lens boundary
        duplicateTextRef.current.style.transform = `scale(1.035) translate3d(${diffX}px, ${diffY}px, 0)`;
      }

      if (lensRef.current) {
        // Shift lens offset by -110px (radius) to center it on cursor
        lensRef.current.style.transform = `translate3d(${xVal - 110}px, ${yVal - 110}px, 0)`;
      }
    };

    const unsubscribeX = smoothX.on('change', updateDOM);
    const unsubscribeY = smoothY.on('change', updateDOM);

    // Initialize positions
    updateDOM();

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [smoothX, smoothY, mouseX, mouseY, prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !sectionRef.current) return;
    
    // Ignore hover effects on mobile/touch screens
    if (window.innerWidth < 768) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset positions to off-screen
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <section 
      id="hero" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-[100svh] min-h-[650px] flex items-center px-6 md:px-12 pt-20 overflow-hidden"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="./videos/bg_segment_1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/65 z-0 pointer-events-none" />

      {/* Interactive Glass Lens (Desktop only, hidden in reduced motion) */}
      {!prefersReducedMotion && (
        <div
          ref={lensRef}
          className="hidden md:block absolute w-[220px] h-[220px] rounded-full pointer-events-none z-20 transition-opacity duration-300 will-change-transform"
          style={{
            left: 0,
            top: 0,
            opacity: isHovered ? 1 : 0,
            backdropFilter: 'blur(2.5px) saturate(1.3) contrast(1.15)',
            WebkitBackdropFilter: 'blur(2.5px) saturate(1.3) contrast(1.15)',
            background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.03) 48%, rgba(255, 255, 255, 0.01) 70%)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            boxShadow: 'inset 0 0 32px rgba(255, 255, 255, 0.12), 0 20px 80px rgba(0, 0, 0, 0.45)',
          }}
        />
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end relative z-10 pb-16"
      >
        <div className="lg:col-span-8 flex flex-col items-start">
          <SectionLabel num="01" title="Hero" className="mb-8" />
          
          {/* Headline Wrap (Double layer for text clipping/magnification) */}
          <div className="mb-8 relative w-full select-none">
            {/* Base Layer (Muted outer text) */}
            <h1 className="text-[11vw] md:text-[6.5vw] font-heading font-bold leading-[0.9] tracking-tighter uppercase">
              <span className="block text-white/75">Z-LAB</span>
              <span className="block text-white/20">DIGITAL ART & ROBOTIC FABRICATION</span>
            </h1>

            {/* Duplicate Layer (Clipped inside glass radius, bright white, shifted & scaled) */}
            {!prefersReducedMotion && (
              <h1 
                ref={duplicateTextRef}
                className="absolute inset-0 text-[11vw] md:text-[6.5vw] font-heading font-bold leading-[0.9] tracking-tighter uppercase text-white pointer-events-none transition-opacity duration-300"
                style={{
                  textShadow: '1.5px 0 rgba(0, 255, 255, 0.35), -1.5px 0 rgba(255, 80, 80, 0.25)',
                  willChange: 'clip-path, transform',
                  opacity: isHovered ? 1 : 0,
                }}
              >
                <span className="block text-white">Z-LAB</span>
                <span className="block text-white">DIGITAL ART & ROBOTIC FABRICATION</span>
              </h1>
            )}
          </div>
          
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm text-[#7d8187] font-light max-w-xl leading-relaxed mb-10 tracking-wide"
          >
            数字艺术与智能建造工作室，在新媒体交互、机器人3D打印、AR增强现实沙盘与AIGC数字生命之间构建跨媒介空间体验。
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <EditorialButton 
              variant="solid" 
              onClick={() => scrollToSection('services')}
              cursorText="SERVICES"
            >
              查看核心业务
            </EditorialButton>
            <EditorialButton 
              onClick={() => scrollToSection('contact')}
              cursorText="CONTACT"
            >
              预约合作咨询
            </EditorialButton>
          </motion.div>
        </div>

        {/* Right Info Panel */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10 flex flex-col gap-6 text-[10px] font-mono tracking-widest text-[#7d8187] uppercase"
        >
          <div>
            <div className="text-white mb-1">FOUNDED / 2026</div>
            <div>SHANGHAI, CHINA</div>
          </div>
          <div>
            <div className="text-white mb-1">FOCUS</div>
            <div>DIGITAL ART · ROBOTIC FABRICATION · INTERACTIVE MEDIA</div>
          </div>
          <div>
            <div className="text-white mb-1">STATUS</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff7a17] rounded-full animate-pulse" />
              <span>ACTIVE WORKSPACE</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
