import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ShinyText from '../ui/ShinyText';
import AudioPlayer from '../ui/AudioPlayer';

interface NavBarProps {
  scrollToSection: (id: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ scrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: '核心业务', id: 'services' },
    { name: 'SHOWCASE', id: 'slides' },
    { name: '主创介绍', id: 'about' },
    { name: '业务合作', id: 'contact' }
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference bg-transparent select-none">
        <div className="flex items-center gap-4 z-50">
          <div 
            onClick={() => handleItemClick('hero')} 
            className="relative cursor-pointer flex items-center justify-start"
            data-hover="true"
            data-cursor-text="Z-LAB"
          >
            <ShinyText
              text="Z-LAB"
              speed={3}
              delay={0.5}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={true}
              pauseOnHover={false}
              className="text-xl md:text-2xl font-extrabold font-heading tracking-widest uppercase bg-transparent p-0 m-0"
            />
          </div>
          <AudioPlayer />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-[10px] font-mono tracking-[0.2em] uppercase">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleItemClick(item.id)}
              className="hover:text-[#ff7a17] transition-colors text-white cursor-pointer bg-transparent border-none uppercase tracking-[0.2em]"
              data-hover="true"
              data-cursor-text="GO TO"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => handleItemClick('contact')}
          className="hidden md:inline-block border border-white/20 px-6 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
          data-cursor-text="DISCUSS"
        >
          联系预约
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 bg-[#0a0a0a]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="text-xl font-heading font-bold text-white hover:text-[#ff7a17] transition-colors uppercase bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => handleItemClick('contact')}
              className="mt-6 border border-white/20 px-8 py-3 text-xs font-mono tracking-[0.2em] uppercase text-white bg-transparent"
            >
              联系预约
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
