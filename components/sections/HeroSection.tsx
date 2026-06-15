import React from 'react';
import { motion } from 'framer-motion';
import EditorialButton from '../ui/EditorialButton';
import SectionLabel from '../ui/SectionLabel';

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
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

  return (
    <section id="hero" className="relative h-[100svh] min-h-[650px] flex items-center px-6 md:px-12 pt-20 overflow-hidden">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end relative z-10 pb-16"
      >
        <div className="lg:col-span-8 flex flex-col items-start">
          <SectionLabel num="01" title="Hero" className="mb-8" />
          
          <div className="mb-8">
            <h1 className="text-[11vw] md:text-[6.5vw] font-heading font-bold leading-[0.9] tracking-tighter uppercase select-none">
              <span className="block text-white">Z-LAB</span>
              <span className="block text-white/30">DIGITAL ART & ROBOTIC FABRICATION</span>
            </h1>
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
