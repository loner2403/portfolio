import React, { useState, useRef, useEffect } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'neon' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'link';
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  download?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'neon',
  size = 'md',
  as = 'button',
  href,
  target,
  rel,
  disabled = false,
  icon,
  iconPosition = 'right',
  animated = true,
  download = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  
  // Track mouse position for glow effect
  useEffect(() => {
    if (!animated || !isHovered || !buttonRef.current || !glowRef.current) return;
    
    const onMouseMove = (e: Event) => {
      if (!buttonRef.current) return;
      const mouseEvent = e as MouseEvent;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      setMousePosition({ x, y });
      
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${
          variant === 'neon' 
            ? 'rgba(34, 211, 238, 0.6)' 
            : variant === 'gradient' 
              ? 'rgba(255, 255, 255, 0.4)' 
              : 'rgba(34, 211, 238, 0.3)'
        } 0%, transparent 60%)`;
      }
    };
    
    const currentRef = buttonRef.current;
    currentRef.addEventListener('mousemove', onMouseMove);
    
    return () => {
      currentRef.removeEventListener('mousemove', onMouseMove);
    };
  }, [isHovered, animated, variant]);
  
  // Size classes
  const sizeClasses = {
    sm: 'px-5 py-2 text-sm min-h-[36px]',
    md: 'px-7 py-3 text-base min-h-[46px]',
    lg: 'px-9 py-4 text-lg min-h-[56px]',
  }[size];
  
  // Main variant classes
  const variantMainClasses = {
    neon: `
      bg-transparent 
      border-2 
      ${!disabled && 'border-cyan-400 text-cyan-400 hover:text-black dark:hover:text-white'}
      ${disabled ? 'border-gray-600 text-gray-600' : ''}
      shadow-[0_0_10px_0px_rgba(34,211,238,0.2)]
      ${!disabled && 'hover:shadow-[0_0_15px_2px_rgba(34,211,238,0.4)]'}
      ${!disabled && 'hover:bg-cyan-400'}
    `,
    gradient: `
      text-white
      border-0
      bg-gradient-to-r 
      from-cyan-500 
      via-blue-500 
      to-purple-600
      ${!disabled && 'hover:shadow-[0_5px_15px_rgba(8,145,178,0.6)]'}
      ${disabled ? 'opacity-60 grayscale' : ''}
    `,
    ghost: `
      bg-transparent 
      border 
      ${!disabled && 'border-white/20 text-white hover:border-cyan-400/70'}
      ${disabled ? 'border-gray-700 text-gray-600' : ''}
      backdrop-blur-sm
      ${!disabled && 'hover:bg-white/5'}
    `,
  }[variant];
  
  // Combined classes
  const buttonClasses = `
    relative
    inline-flex
    items-center
    justify-center
    rounded-full
    gap-2
    ${sizeClasses}
    font-medium
    transition-all
    duration-300
    overflow-hidden
    ${variantMainClasses}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
  
  // Event handlers
  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => {
    !disabled && setIsHovered(false);
    !disabled && setIsActive(false);
  };
  const handleMouseDown = () => !disabled && setIsActive(true);
  const handleMouseUp = () => !disabled && setIsActive(false);
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || !onClick) return;
    
    // Trigger click animation
    if (animated && buttonRef.current) {
      const button = buttonRef.current;
      const circle = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      circle.style.cssText = `
        position: absolute;
        background: ${variant === 'neon' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'};
        border-radius: 50%;
        pointer-events: none;
        width: 10px;
        height: 10px;
        top: ${y}px;
        left: ${x}px;
      `;
      
      button.appendChild(circle);
      
      gsap.to(circle, {
        width: button.offsetWidth * 2.5,
        height: button.offsetWidth * 2.5,
        opacity: 0,
        top: y - button.offsetWidth * 1.25,
        left: x - button.offsetWidth * 1.25,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          button.removeChild(circle);
        }
      });
    }
    
    onClick();
  };
  
  // Mouse events object
  const mouseEvents = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  };
  
  // Button content with animations
  const content = (
    <>
      {/* Hover glow effect */}
      {animated && !disabled && (
        <span 
          ref={glowRef}
          className={`
            absolute 
            inset-0 
            opacity-0
            transition-opacity 
            duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
      
      {/* Text and icon container */}
      <span className={`
        relative 
        z-10 
        flex 
        items-center 
        gap-2 
        transition-transform 
        duration-300
        ${isActive ? 'scale-95' : 'scale-100'}
      `}>
        {icon && iconPosition === 'left' && (
          <span className={`
            transition-all 
            duration-300 
            ${isHovered ? 'translate-x-[-1px]' : ''}
          `}>
            {icon}
          </span>
        )}
        
        <span className="transition-all duration-300 relative">
          {children}
          
          {/* Underline animation for ghost variant */}
          {animated && !disabled && variant === 'ghost' && (
            <span className={`
              absolute 
              bottom-[-2px] 
              left-0 
              h-[1px] 
              bg-cyan-400 
              transition-all 
              duration-300
              ${isHovered ? 'w-full' : 'w-0'}
            `}/>
          )}
        </span>
        
        {icon && iconPosition === 'right' && (
          <span className={`
            transition-all 
            duration-300 
            ${isHovered ? 'translate-x-[3px]' : ''}
          `}>
            {icon}
          </span>
        )}
      </span>
      
      {/* Background shift animation for gradient variant */}
      {animated && !disabled && variant === 'gradient' && (
        <span className={`
          absolute 
          inset-0 
          bg-gradient-to-r 
          from-cyan-400 
          via-blue-400 
          to-purple-500
          opacity-0
          transition-opacity 
          duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}/>
      )}
      
      {/* Edges glow for neon variant */}
      {animated && !disabled && variant === 'neon' && (
        <>
          <span className={`
            absolute 
            top-0 
            left-[10%] 
            w-[80%] 
            h-[1px] 
            bg-cyan-400 
            shadow-[0_0_5px_2px_rgba(34,211,238,0.7)]
            transition-all 
            duration-500 
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}/>
          <span className={`
            absolute 
            bottom-0 
            left-[10%] 
            w-[80%] 
            h-[1px] 
            bg-cyan-400 
            shadow-[0_0_5px_2px_rgba(34,211,238,0.7)]
            transition-all 
            duration-500 
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}/>
        </>
      )}
    </>
  );
  
  // Render as link or button
  if (as === 'link' && href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={`group ${buttonClasses}`}
        {...mouseEvents}
        onClick={handleClick as any}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        download={download}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      className={`group ${buttonClasses}`}
      onClick={handleClick}
      {...mouseEvents}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {content}
    </button>
  );
};

// Add GSAP for animations if it's not available globally
const gsap = {
  to: (element: HTMLElement, props: any) => {
    const { duration = 1, opacity, width, height, top, left, ease = 'linear', onComplete } = props;
    
    // Simple animation function as fallback if GSAP isn't available
    element.style.transition = `all ${duration}s ${ease === 'power2.out' ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'linear'}`;
    
    if (opacity !== undefined) element.style.opacity = opacity;
    if (width !== undefined) element.style.width = `${width}px`;
    if (height !== undefined) element.style.height = `${height}px`;
    if (top !== undefined) element.style.top = `${top}px`;
    if (left !== undefined) element.style.left = `${left}px`;
    
    setTimeout(() => {
      if (onComplete) onComplete();
    }, duration * 1000);
  }
};

export default Button;
