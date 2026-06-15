import React, { useState } from 'react';
import { SLIDES } from '../../slidesData';
import SectionLabel from '../ui/SectionLabel';
import Masonry, { MasonryItem } from '../ui/Masonry';

interface ProjectArchiveProps {
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsLightboxOpen: (open: boolean) => void;
  isActive?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: '全部 / All' },
  { id: '3d-print', label: '智能建造 / 3D Print' },
  { id: 'interactive', label: '新媒体艺术 / Interactive' },
  { id: 'sandbox', label: '增强现实 / AR Sandbox' },
  { id: 'digital-life', label: '数字生命 / AIGC' }
];

const CATEGORY_MAP: Record<string, string> = {
  "04": "3d-print",
  "05": "3d-print",
  "07": "3d-print",
  "08": "3d-print",
  "09": "3d-print",
  "12": "sandbox",
  "19": "sandbox",
  "27": "interactive",
  "31": "interactive",
  "32": "interactive",
  "28": "digital-life",
  "30": "digital-life",
  "33": "digital-life",
  "34": "digital-life",
  "35": "digital-life",
  "36": "digital-life",
  "38": "digital-life"
};

const ProjectArchive: React.FC<ProjectArchiveProps> = ({
  setActiveSlideIndex,
  setIsLightboxOpen,
  isActive = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter slides based on the selected category
  const filteredSlides = SLIDES.filter(slide => {
    if (selectedCategory === 'all') return true;
    return CATEGORY_MAP[slide.num] === selectedCategory;
  });

  const masonryItems: MasonryItem[] = filteredSlides.map((slide, idx) => {
    // Generate organic variations in item heights to create a premium masonry flow
    const baseHeight = 180;
    const offsetHeight = (idx % 3) * 60; // 180, 240, 300
    return {
      id: slide.num,
      img: slide.image,
      height: baseHeight + offsetHeight,
      slide: slide
    };
  });

  return (
    <section 
      id="slides" 
      className="h-full w-full overflow-y-auto py-12 md:py-16 px-6 md:px-12 bg-[#0a0a0a]/20 backdrop-blur-md scrollbar-thin text-left"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionLabel num="04" title="Project Archive" className="mb-0" />
          
          {/* Category Filters Tab Menu */}
          <div className="flex flex-wrap gap-2 md:gap-3 text-[10px] font-mono tracking-wider uppercase select-none border-b border-white/5 pb-2 md:pb-0">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 transition-all duration-300 border ${
                    isSelected 
                      ? 'border-[#ff7a17] text-[#ff7a17] bg-[#ff7a17]/5' 
                      : 'border-transparent text-[#7d8187] hover:text-white'
                  } cursor-pointer`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full mt-4">
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.03}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.97}
            blurToFocus={true}
            colorShiftOnHover={true}
            isActive={isActive}
            onItemClick={(slide) => {
              const slideIdx = SLIDES.findIndex(s => s.num === slide.num);
              if (slideIdx !== -1) {
                setActiveSlideIndex(slideIdx);
                setIsLightboxOpen(true);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectArchive;
