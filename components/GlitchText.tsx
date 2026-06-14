import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  // Split text into words for a clean, stagger reveal effect
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: '30%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <Component className={`inline-block ${className}`}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.25em] select-none"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]">
            <motion.span
              variants={wordVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};

export default GradientText;
