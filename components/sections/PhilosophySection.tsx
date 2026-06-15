import React from 'react';
import SectionLabel from '../ui/SectionLabel';

const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-24 md:py-36 border-t border-white/10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <SectionLabel num="02" title="Philosophy" className="mb-12" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5.5vw font-heading font-bold uppercase leading-tight tracking-tighter text-white mb-8 select-none">
              WE BUILD EXPERIENCES BETWEEN MATTER, DATA AND LIGHT.
            </h2>
          </div>
          
          <div className="lg:col-span-4 lg:pt-3">
            <p className="text-xs md:text-sm text-[#8d928d] font-light leading-relaxed tracking-wide">
              我们将机械臂建造、实时交互、数字孪生与AI生成能力整合到空间项目中，为品牌活动、公共艺术、建筑展示与未来城市空间提供从概念到落地的一体化创作方案。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
