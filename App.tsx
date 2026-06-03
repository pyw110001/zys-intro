import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Printer, Sparkles, Layers, Cpu, Compass, Menu, X, ChevronLeft, ChevronRight, User, Mail, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import AIChat from './components/AIChat';
import { SLIDES } from './slidesData';

const SERVICES = [
  {
    id: '3d-print',
    title: '机器人3D打印',
    subtitle: 'Robotic 3D Printing',
    icon: Printer,
    color: 'teal',
    description: '利用多轴工业机械臂的增材制造工艺，配合高性能、可循环的塑料复合材料（如ASA、PC等），实现大尺寸异形雕塑、空间构件与建筑表皮的高精度快速建造。',
    details: [
      '大尺寸参数化异形雕塑打印',
      '材料混配（碳纤维增强、阻燃剂等）',
      '基于多轴路径规划的无支撑结构打印',
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

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  // Handle keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle slides
      if (e.key === 'ArrowLeft') {
        setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
      }
      if (e.key === 'ArrowRight') {
        setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
      }
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setSelectedService(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <ThreeBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference">
        <div 
          onClick={() => scrollToSection('hero')} 
          className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-pointer z-50"
        >
          Z-LAB
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-xs font-bold tracking-widest uppercase">
          {[
            { name: '核心业务', id: 'services' },
            { name: '演示文稿', id: 'slides' },
            { name: '主创介绍', id: 'about' },
            { name: '业务合作', id: 'contact' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)}
              className="hover:text-[#a8fbd3] transition-colors text-white cursor-pointer bg-transparent border-none uppercase tracking-[0.2em]"
              data-hover="true"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => scrollToSection('contact')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          联系预约
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#1a1b3b]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {[
              { name: '核心业务', id: 'services' },
              { name: '演示文稿', id: 'slides' },
              { name: '主创介绍', id: 'about' },
              { name: '业务合作', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-3xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none"
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-black"
            >
              联系预约
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header id="hero" className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
          {/* Creator tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-6 bg-black/35 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/5"
          >
            <span>数字艺术与智能建造工作室</span>
            <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>2026</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="Z-LAB" 
              as="h1" 
              className="text-[12vw] md:text-[9vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
            {/* Glowing Orb */}
            <motion.div 
               className="absolute -z-20 w-[45vw] h-[45vw] bg-[#4fb7b3]/10 blur-[80px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mt-6 md:mt-10 mb-6 md:mb-10"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-xl font-light max-w-2xl mx-auto text-gray-200 leading-relaxed drop-shadow-lg px-4"
          >
            融合新媒体艺术、机器人制造与数字孪生，在物理现实与数字生命之间建立美学桥梁，探索未来城市建筑与交互装置的无限可能。
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.35)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(2)].map((_, i) => (
                  <span key={i} className="text-xl md:text-4xl font-heading font-black px-8 flex items-center gap-4">
                    ROBOTIC 3D PRINTING <span className="text-black text-xl md:text-2xl">●</span> 
                    INTERACTIVE MEDIA ART <span className="text-black text-xl md:text-2xl">●</span> 
                    AR & DIGITAL TWINS <span className="text-black text-xl md:text-2xl">●</span> 
                    AIGC DIGITAL LIFE <span className="text-black text-xl md:text-2xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* SERVICES SECTION */}
      <section id="services" className="relative z-10 py-24 md:py-36">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 px-4">
            <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg">
              CORE <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">SERVICES</span>
            </h2>
            <p className="text-[#a8fbd3] font-mono text-xs md:text-sm tracking-widest mt-4 md:mt-0 uppercase">
              四 大 核心 业务 版块
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10 bg-black/15 backdrop-blur-md">
            {SERVICES.map((srv) => (
              <motion.div
                key={srv.id}
                className="group relative p-8 md:p-10 border-r border-b border-white/10 flex flex-col justify-between min-h-[400px] md:min-h-[480px] hover:bg-[#637ab9]/5 transition-colors duration-500 cursor-pointer"
                onClick={() => setSelectedService(srv)}
                whileHover={{ y: -5 }}
                data-hover="true"
              >
                <div>
                  <div className="p-4 w-fit rounded-2xl bg-white/5 border border-white/10 mb-8 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <srv.icon className="w-8 h-8 text-white group-hover:text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-heading tracking-tight text-white">{srv.title}</h3>
                  <p className="text-[#4fb7b3] text-xs font-mono tracking-widest uppercase mb-6">{srv.subtitle}</p>
                  <p className="text-gray-300 text-sm font-light leading-relaxed line-clamp-4">{srv.description}</p>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                  <span className="text-xs text-gray-400 font-mono">了解详情</span>
                  <div className="bg-white/5 group-hover:bg-white text-white group-hover:text-black rounded-full p-2 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE DETAIL MODAL */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#14152e]/95 border border-white/10 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                    <selectedService.icon className="w-7 h-7 text-[#a8fbd3]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-heading">{selectedService.title}</h3>
                    <p className="text-[#4fb7b3] font-mono text-sm uppercase tracking-widest">{selectedService.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed font-light mb-8 text-base">
                  {selectedService.description}
                </p>

                <h4 className="text-sm font-bold font-heading uppercase text-[#a8fbd3] tracking-wider mb-4">技术与应用要点</h4>
                <ul className="space-y-3.5 mb-8 text-sm text-gray-200">
                  {selectedService.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold font-heading uppercase text-gray-400 tracking-wider mb-4">精选案例项目</h4>
                  <div className="space-y-3">
                    {selectedService.cases.map((caseName, idx) => (
                      <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-lg text-sm text-white/90">
                        {caseName}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedService(null); scrollToSection('contact'); }}
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest border border-white/20 hover:bg-white hover:text-black transition-colors mt-8"
                >
                  咨询合作
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDESHOW DECK VIEWERS */}
      <section id="slides" className="relative z-10 py-24 md:py-36 bg-black/15 backdrop-blur-md border-t border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-heading font-bold opacity-20 tracking-widest">PITCH DECK</h2>
            <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-3 md:-mt-6 relative z-10 text-xs md:text-sm">
              业务 介绍 幻灯片 交互 浏览
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[500px]">
            {/* Viewport Frame */}
            <div className="lg:col-span-7 flex flex-col justify-center relative bg-black/40 rounded-3xl p-4 border border-white/10 shadow-2xl">
              <div 
                className="relative aspect-video w-full rounded-2xl overflow-hidden group shadow-lg cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
                data-hover="true"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeSlideIndex}
                    src={SLIDES[activeSlideIndex].image} 
                    alt={SLIDES[activeSlideIndex].title} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain" 
                  />
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end pointer-events-none">
                  <div className="font-heading text-4xl font-bold text-white/40">
                    {SLIDES[activeSlideIndex].num}
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white/80 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#a8fbd3]" />
                    点击放大浏览
                  </div>
                </div>
              </div>

              {/* Slider controls */}
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-colors"
                  aria-label="Previous Slide"
                  data-hover="true"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-xs font-mono text-gray-400">
                  {activeSlideIndex + 1} / {SLIDES.length} (支持键盘左右方向键切换)
                </div>
                <button
                  onClick={() => setActiveSlideIndex(prev => (prev + 1) % SLIDES.length)}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-colors"
                  aria-label="Next Slide"
                  data-hover="true"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Text Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#637ab9]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="flex-1 overflow-y-auto pr-2 max-h-[420px] scrollbar-thin">
                <div className="flex items-center gap-3 text-[#a8fbd3] mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="font-mono text-xs tracking-widest uppercase">SLIDE CONTENT</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase leading-tight mb-6 text-white border-b border-white/10 pb-4">
                  {SLIDES[activeSlideIndex].title}
                </h3>
                
                <div className="text-gray-300 font-light text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                  {SLIDES[activeSlideIndex].content
                    .replace(/^#(.*)$/m, '') // Remove first H1 title from body to avoid repeating
                    .replace(/---$/, '') // Remove dashes
                    .trim()}
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 flex gap-4 overflow-x-auto py-2 scrollbar-none scroll-smooth">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={slide.num}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all relative ${
                      activeSlideIndex === idx ? 'border-[#4fb7b3] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={slide.image} alt={slide.num} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center font-mono text-[10px] text-white">
                      {slide.num}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT LEADER SECTION */}
      <section id="about" className="relative z-10 py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-8 leading-none">
                ABOUT <br/> <GradientText text="FOUNDER" className="text-5xl md:text-8xl" />
              </h2>
              
              <h3 className="text-2xl font-bold font-heading mb-4 text-[#a8fbd3]">朱元双 (Zhu Yuanshuang)</h3>
              <p className="text-sm font-mono tracking-wider text-gray-400 uppercase mb-8">团队负责人 / 数字艺术家 / 智能建造专家</p>
              
              <p className="text-base text-gray-200 mb-8 font-light leading-relaxed">
                曾任同济大学建筑设计研究院数字实验室负责人，长期致力于将前沿科学技术与空间艺术深度融合，探索智慧城市空间下的新型多维交互与建造表现方式。
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: User, title: '专业背景', desc: '同济大学数字实验室背景，深耕 VR/AR、机械臂建造与智能空间交互多年。' },
                  { icon: Sparkles, title: '核心技术领域', desc: '新媒体装置艺术、多轴机械臂三维增材制造、实时人脸与运动追踪、AIGC智能体开发。' },
                  { icon: Compass, title: '主创及设计项目', desc: '主持及参与第46届家博会ADD特展、上海国际光影节、南京颐和路互动景观墙等多项国家及国际性重点项目。' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      <feature.icon className="w-5 h-5 text-[#a8fbd3]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-1 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider image with no crop */}
            <div className="lg:col-span-7 relative w-full aspect-video order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-2 opacity-20 blur-xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl bg-black/40 flex items-center justify-center">
                <img 
                  src="/slides/业务介绍_2026_zhu_02.webp" 
                  alt="Zhu Yuanshuang Digital Studio" 
                  className="w-full h-full object-contain transition-transform duration-[1.5s] group-hover:scale-102 cursor-zoom-in"
                  onClick={() => { setActiveSlideIndex(0); setIsLightboxOpen(true); }}
                  data-hover="true"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 text-left pointer-events-none">
                  <div className="text-2xl md:text-3xl font-heading font-bold text-white/50">
                    Z-LAB
                  </div>
                  <div className="text-sm font-bold tracking-widest uppercase mt-1 text-[#a8fbd3]">
                    Science meets Art. (点击放大阅读)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / BOOKING SECTION */}
      <section id="contact" className="relative z-10 py-24 md:py-36 px-4 md:px-6 bg-black/25 backdrop-blur-md">
        <div className="max-w-4xl mx-auto bg-[#14152e]/80 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#a8fbd3] via-[#4fb7b3] to-[#637ab9]" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2 uppercase">联系合作</h2>
            <p className="text-[#a8fbd3] font-mono uppercase tracking-widest text-xs">BOOK A CONSULTATION</p>
          </div>

          {formSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 flex flex-col items-center justify-center gap-4"
            >
              <div className="p-4 rounded-full bg-[#a8fbd3]/10 border border-[#a8fbd3]/20">
                <Sparkles className="w-12 h-12 text-[#a8fbd3] animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">预约提交成功</h3>
              <p className="text-gray-300 max-w-md mx-auto text-sm font-light leading-relaxed">
                感谢您的关注！我们已收到您的合作咨询，主创团队将在 1 个工作日内通过邮件或电话与您取得联系。
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">您的姓名 Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="例如：朱先生" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4fb7b3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">电子邮箱 Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4fb7b3] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">联系电话 Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="138-xxxx-xxxx" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4fb7b3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">合作方向 Option *</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full bg-[#14152e] border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-[#4fb7b3] transition-colors cursor-pointer"
                    >
                      <option value="" disabled>请选择合作方向</option>
                      <option value="3d-printing">机器人3D打印建造</option>
                      <option value="interactive-art">新媒体多媒体交互装置</option>
                      <option value="sandbox">AR增强现实数字沙盘</option>
                      <option value="digital-life">AIGC与专属数字生命</option>
                      <option value="exhibition-planning">品牌活动/数字特展策划</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">需求描述 Description *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="请详细描述您的项目需求、场地尺寸、预估周期等信息..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4fb7b3] transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-[#a8fbd3] transition-all duration-300 rounded-xl cursor-pointer"
                data-hover="true"
              >
                发送预约咨询
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-2xl md:text-3xl font-bold tracking-tighter mb-4 text-white">Z-LAB</div>
             <p className="text-xs font-mono text-gray-400">
               © 2026 朱元双数字艺术与智能建造工作室. All rights reserved.
             </p>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap font-mono text-xs text-gray-400">
            <span className="text-[#a8fbd3]">Art meets Science. Built with precision.</span>
          </div>
        </div>
      </footer>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <div 
              className="relative max-w-7xl max-h-[85vh] aspect-video w-full bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <img 
                src={SLIDES[activeSlideIndex].image} 
                alt={SLIDES[activeSlideIndex].title} 
                className="w-full h-full object-contain" 
              />
              
              {/* Image metadata overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 pointer-events-none">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[#a8fbd3] font-mono text-xs tracking-wider uppercase mb-1 block">Slide {SLIDES[activeSlideIndex].num}</span>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white uppercase">{SLIDES[activeSlideIndex].title}</h3>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{activeSlideIndex + 1} / {SLIDES.length}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black border border-white/10 backdrop-blur-sm transition-colors"
                data-hover="true"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setActiveSlideIndex(prev => (prev + 1) % SLIDES.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black border border-white/10 backdrop-blur-sm transition-colors"
                data-hover="true"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
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
