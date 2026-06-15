import React from 'react';
import { SLIDES } from '../../slidesData';
import SectionLabel from '../ui/SectionLabel';
import Masonry, { MasonryItem } from '../ui/Masonry';

interface ProjectArchiveProps {
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsLightboxOpen: (open: boolean) => void;
}

const ProjectArchive: React.FC<ProjectArchiveProps> = ({
  setActiveSlideIndex,
  setIsLightboxOpen,
}) => {
  const masonryItems: MasonryItem[] = SLIDES.map((slide, idx) => {
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
      className="h-full w-full overflow-y-auto py-12 md:py-16 px-6 md:px-12 bg-[#080a09]/20 backdrop-blur-md scrollbar-thin"
    >
      <div className="max-w-7xl mx-auto">
        <SectionLabel num="04" title="Project Archive" className="mb-12" />

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
