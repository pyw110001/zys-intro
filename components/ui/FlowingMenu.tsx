import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface FlowingMenuItem {
  text: string;
  image: string;
  link?: string;
  num: string;
  title: string;
  rawItem: any;
}

export interface FlowingMenuProps {
  items: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  activeIndex: number;
  onItemHover: (idx: number) => void;
  onItemClick: (rawItem: any) => void;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = 'transparent',
  marqueeBgColor = '#ffffff',
  marqueeTextColor = '#0a0a0a',
  borderColor = 'rgba(255, 255, 255, 0.1)',
  activeIndex,
  onItemHover,
  onItemClick
}) => {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            item={item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
            isActive={activeIndex === idx}
            onHover={() => onItemHover(idx)}
            onClick={() => onItemClick(item.rawItem)}
          />
        ))}
      </nav>
    </div>
  );
};

interface MenuItemProps {
  item: FlowingMenuItem;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
  isActive,
  onHover,
  onClick
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.5, ease: 'power2.out' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part');
      if (!marqueeContent) return;
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth;
      if (contentWidth === 0) return;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [item.text, item.image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part');
      if (!marqueeContent) return;
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [item.text, item.image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent) => {
    onHover();
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      className="relative overflow-hidden cursor-pointer select-none"
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-hover="true"
      data-cursor-text="DETAILS"
    >
      {/* Static Label Container */}
      <div className="flex items-center justify-between py-8 w-full h-full px-2">
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-[#7d8187]">{item.num}</span>
          <h3 className={`text-xl md:text-2xl font-bold font-sans tracking-tight transition-all duration-300 ${
            isActive ? 'text-white translate-x-2' : 'text-white/40'
          }`}>
            {item.title}
          </h3>
        </div>
        
        {/* Right Arrow Icon */}
        <div className={`transition-all duration-300 pr-2 ${
          isActive ? 'text-[#ff7a17] translate-x-0 opacity-100' : 'text-white/20 translate-x-4 opacity-0'
        }`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>

      {/* Marquee Slide-In Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="h-full w-fit flex" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center flex-shrink-0" key={idx} style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap uppercase font-bold font-sans text-xl md:text-2xl leading-[1] px-[1vw]">
                {item.title}
              </span>
              <div
                className="w-[100px] h-[40px] my-2 mx-4 rounded-lg bg-cover bg-center border border-black/10"
                style={{ backgroundImage: `url(${item.image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
