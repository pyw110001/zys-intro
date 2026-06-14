import React from 'react';
import { motion } from 'framer-motion';

interface SectionLabelProps {
  num: string;
  title: string;
  className?: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ num, title, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] text-[#8d928d] uppercase select-none ${className}`}
    >
      <span className="text-white">{num}</span>
      <span className="w-6 h-px bg-white/10" />
      <span>{title}</span>
    </motion.div>
  );
};

export default SectionLabel;
