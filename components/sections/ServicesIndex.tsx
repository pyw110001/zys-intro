import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Sparkles, Layers, Cpu } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import FlowingMenu, { FlowingMenuItem } from '../ui/FlowingMenu';
import ThreeBackground from '../ThreeBackground';

export const SERVICES = [
  {
    id: '3d-print',
    title: '机器人3D打印',
    subtitle: 'Robotic 3D Printing',
    icon: Printer,
    color: 'teal',
    image: 'slides/核心业务缩略图/智能制造.png',
    description: '利用多轴工业机械臂的增材制造工艺，配合高性能、可循环的塑料复合材料（如ASA、PC等），实现大尺寸异形雕塑、空间构件与建筑表皮的高精度快速建造。',
    details: [
      '大尺寸参数化异形雕塑打印',
      '材料混配（碳纤维增强、阻燃剂等）',
      '基于多轴路径规划 of 无支撑结构打印',
      '设计-仿真-建造一体化数字工作流'
    ],
    cases: ['第46届家博会ADD特展', '多伦路《重树》艺术装置', '进博会雅诗兰黛展位装置']
  },
  {
    id: 'interactive',
    title: '新媒体交互装置',
    subtitle: 'Interactive Art & VFX',
    icon: Sparkles,
    color: 'mint',
    image: 'slides/核心业务缩略图/新媒体艺术.gif',
    description: '融合视觉特效、空间投影、智能感应与新媒体艺术，通过在数字与物理空间之间搭建互动桥梁，创造沉浸式的情境艺术体验。',
    details: [
      '实时互动墙面与感应灯光矩阵',
      '人脸追踪技术（NVIDIA AR SDK 3D网格）',
      '定制化三维CG视觉特效与VJ演出',
      '数字多媒体展厅、VR体验策划'
    ],
    cases: ['南京颐和路互动景观墙', '城市博览会互动展墙', '上海国际光影节“光之秘境”']
  },
  {
    id: 'sandbox',
    title: 'AR增强现实沙盘',
    subtitle: 'AR Sandbox & Digital Twin',
    icon: Layers,
    color: 'periwinkle',
    image: 'slides/核心业务缩略图/增强现实.gif',
    description: '通过高精度的数字孪生与图像追踪定位技术，将实体空间沙盘与虚拟数字规划无缝融合，提供全方位的交互式、多维度规划方案呈现。',
    details: [
      '物理沙盘与虚拟三维动态数据叠加',
      '图像触发与物理世界高精度空间铆钉',
      '多终端联动与交互式规划展示',
      '建筑内外部结构剖析与三维透视'
    ],
    cases: ['上海城市规划展览馆AR沙盘', '金桥元中心AR沙盘', '远东集团展厅数字沙盘']
  },
  {
    id: 'digital-life',
    title: 'AIGC与数字生命',
    subtitle: 'AIGC & Digital Human',
    icon: Cpu,
    color: 'purple',
    image: 'slides/核心业务缩略图/数字生命.png',
    description: '结合先进的大语言模型与超拟真数字人技术，定制可模拟人类外貌、表情、声音及动作的数字分身，为品牌及个人量身打造智能生活助手。',
    details: [
      '高可定制数字人外貌、音色与表情系统',
      '基于LLM的自然语言对话与专业问答能力',
      '数字人多端运行与跨平台应用集成',
      '场景化智能助手与内容自动化创作'
    ],
    cases: ['个人数字人定制助手', '多语言AI客服', '企业数字品牌代言人']
  }
];

interface ServicesIndexProps {
  onServiceSelect: (srv: typeof SERVICES[0]) => void;
}

const ServicesIndex: React.FC<ServicesIndexProps> = ({ onServiceSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const flowingItems: FlowingMenuItem[] = SERVICES.map((srv, idx) => ({
    num: `0${idx + 1}`,
    title: srv.title,
    text: srv.title,
    image: srv.image,
    rawItem: srv
  }));

  return (
    <section id="services" className="relative w-full h-full flex items-center px-6 md:px-12 overflow-hidden">
      <ThreeBackground />
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <SectionLabel num="03" title="Services" className="mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Index List */}
          <div className="lg:col-span-6 flex flex-col">
            <FlowingMenu
              items={flowingItems}
              activeIndex={activeIndex}
              onItemHover={(idx) => setActiveIndex(idx)}
              onItemClick={(srv) => onServiceSelect(srv)}
            />
          </div>

          {/* Right: Dynamic Details Preview */}
          <div className="lg:col-span-6 bg-panel border border-white/5 p-8 md:p-12 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff7a17]/30 via-transparent to-transparent" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6 text-[#ff7a17]">
                    {React.createElement(SERVICES[activeIndex].icon, { className: 'w-5 h-5' })}
                    <span className="font-mono text-[10px] tracking-widest uppercase">{SERVICES[activeIndex].subtitle}</span>
                  </div>
                  
                  <p className="text-xs md:text-sm text-[#7d8187] font-light leading-relaxed mb-8">
                    {SERVICES[activeIndex].description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {SERVICES[activeIndex].details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-3 text-[11px] text-white/80">
                        <span className="w-1 h-1 bg-[#ff7a17] rounded-full mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 mt-6">
                  <span className="font-mono text-[9px] tracking-widest text-[#7d8187] block mb-3 uppercase">SELECTED CASES</span>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES[activeIndex].cases.map((cName, cIdx) => (
                      <span key={cIdx} className="text-[10px] bg-white/5 text-white/60 px-3 py-1.5 border border-white/5">
                        {cName}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesIndex;
