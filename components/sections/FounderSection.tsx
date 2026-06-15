import React from 'react';
import { User, Sparkles, Compass } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import ProfileCard from '../ui/ProfileCard';

interface FounderSectionProps {
  onImageClick: () => void;
  scrollToSection?: (id: string) => void;
}

const FounderSection: React.FC<FounderSectionProps> = ({ onImageClick, scrollToSection }) => {
  return (
    <section id="about" className="py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <SectionLabel num="05" title="Founder" className="mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Profile */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase leading-[1.1] mb-8 select-none">
              FOUNDER / <br />
              <span className="text-[#8d928d]">CREATIVE TECHNOLOGIST</span>
            </h2>
            
            <h3 className="text-xl font-bold font-sans mb-1 text-white">朱元双 (Zhu Yuanshuang)</h3>
            <p className="text-[10px] font-mono tracking-widest text-[#8d928d] uppercase mb-8">团队负责人 / 数字艺术家 / 智能建造专家</p>
            
            <p className="text-xs md:text-sm text-[#8d928d] font-light leading-relaxed mb-10 tracking-wide">
              曾任同济大学建筑设计研究院数字实验室负责人，长期致力于将前沿科学技术与空间艺术深度融合，探索智慧城市空间下的新型多维交互与建造表现方式。
            </p>
            
            <div className="space-y-8">
              {[
                { icon: User, title: '专业背景', desc: '同济大学数字实验室背景，深耕 VR/AR、机械臂建造与智能空间交互多年。' },
                { icon: Sparkles, title: '核心技术领域', desc: '新媒体装置艺术、多轴机械臂三维增材制造、实时人脸与运动追踪、AIGC智能体开发。' },
                { icon: Compass, title: '主创及设计项目', desc: '主持及参与第46届家博会ADD特展、上海国际光影节、南京颐和路互动景观墙等多项国家及国际性重点项目。' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 border border-white/5 shrink-0 text-[#9de8cf]">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-1.5 font-sans tracking-wide text-white">{feature.title}</h4>
                    <p className="text-xs text-[#8d928d] leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center items-center">
            <div 
              onClick={onImageClick}
              className="relative cursor-zoom-in"
              data-hover="true"
              data-cursor-text="ZOOM"
            >
              <ProfileCard
                name="朱元双"
                title="数字艺术家 / 智能建造专家"
                handle="yuanshuang.zhu"
                status="Online"
                contactText="联系我 / Contact"
                avatarUrl="slides/founder_avatar.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => {
                  if (scrollToSection) {
                    scrollToSection('contact');
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                behindGlowEnabled={true}
                behindGlowColor="rgba(157, 232, 207, 0.45)"
                innerGradient="linear-gradient(145deg, rgba(20, 24, 22, 0.9) 0%, rgba(157, 232, 207, 0.15) 100%)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
