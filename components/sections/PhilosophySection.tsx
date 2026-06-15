import React from 'react';
import SectionLabel from '../ui/SectionLabel';

const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="relative w-full h-full flex items-center px-6 md:px-12 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="./videos/bg_segment_2.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/65 z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <SectionLabel num="02" title="Philosophy" className="mb-12" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5.5vw font-heading font-bold uppercase leading-tight tracking-tighter text-white mb-8 select-none">
              WE BUILD EXPERIENCES BETWEEN MATTER, DATA AND LIGHT.
            </h2>
          </div>
          
          <div className="lg:col-span-4 lg:pt-3">
            <p className="text-xs md:text-sm text-[#7d8187] font-light leading-relaxed tracking-wide">
              我们将机械臂建造、实时交互、数字孪生与AI生成能力整合到空间项目中，为品牌活动、公共艺术、建筑展示与未来城市空间提供从概念到落地的一体化创作方案。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
