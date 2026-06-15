import React from 'react';

interface EditorialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  cursorText?: string;
  variant?: 'outline' | 'solid';
  className?: string;
}

const EditorialButton: React.FC<EditorialButtonProps> = ({
  children,
  cursorText = 'EXPLORE',
  variant = 'outline',
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      data-hover="true"
      data-cursor-text={cursorText}
      className={`group relative overflow-hidden font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 py-4 px-8 cursor-pointer select-none ${
        variant === 'solid'
          ? 'bg-white text-[#0a0a0a] hover:bg-[#ff7a17] hover:text-[#0a0a0a]'
          : 'bg-transparent text-white border border-white/10 hover:border-white/40'
      } ${className}`}
    >
      <span className="relative z-10 block overflow-hidden h-3.5">
        <span className="block transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute inset-0 block transition-transform duration-500 ease-[0.16,1,0.3,1] translate-y-full group-hover:translate-y-0 text-current">
          {children}
        </span>
      </span>
    </button>
  );
};

export default EditorialButton;
