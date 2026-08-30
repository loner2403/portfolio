import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface CursorState {
  size: number;
  text: string;
  backgroundColor: string;
  mixBlendMode: string;
  border: string;
}

const MagneticCursor = () => {
  const location = useLocation();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    size: 16,
    text: '',
    backgroundColor: 'rgba(34, 211, 238, 0.8)',
    mixBlendMode: 'normal',
    border: 'none'
  });
  const [isVisible, setIsVisible] = useState(false);
  const activeElementRef = useRef<Element | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animation for smooth following
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Reset cursor state on route change
  useEffect(() => {
    const resetCursorState = () => {
      setCursorState({
        size: 16,
        text: '',
        backgroundColor: 'rgba(34, 211, 238, 0.8)',
        mixBlendMode: 'normal',
        border: 'none'
      });
      activeElementRef.current = null;
    };

    resetCursorState();
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX);
      cursorY.set(clientY);
      setIsVisible(true);

      // More comprehensive check for special elements
      const target = e.target as Element;
      const specialSelectors = [
        'button',
        '.cursor-button',
        'a',
        '.cursor-link',
        '.cursor-project',
        'img',
        '.cursor-image',
        '[role="button"]',
        'input[type="button"]',
        'input[type="submit"]'
      ];

      let isOverSpecialElement = false;
      for (const selector of specialSelectors) {
        if (target.closest(selector)) {
          isOverSpecialElement = true;
          break;
        }
      }

      // If not over special element and cursor has special state, reset it
      if (!isOverSpecialElement && (cursorState.text !== '' || cursorState.size !== 16)) {
        handleDefaultHover();
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      forceResetCursor();
    };

    // Cursor state handlers for different elements
    const handleButtonHover = (element: Element) => {
      activeElementRef.current = element;
      setCursorState({
        size: 60,
        text: 'CLICK',
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        mixBlendMode: 'normal',
        border: '2px solid rgba(34, 211, 238, 0.8)'
      });
    };

    const handleLinkHover = (element: Element) => {
      activeElementRef.current = element;
      setCursorState({
        size: 50,
        text: 'VIEW',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        mixBlendMode: 'difference',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      });
    };

    const handleProjectHover = (element: Element) => {
      activeElementRef.current = element;
      setCursorState({
        size: 80,
        text: 'EXPLORE',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        mixBlendMode: 'normal',
        border: '2px solid rgba(34, 211, 238, 0.6)'
      });
    };

    const handleImageHover = (element: Element) => {
      activeElementRef.current = element;
      setCursorState({
        size: 100,
        text: '👁️',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        mixBlendMode: 'normal',
        border: '2px solid rgba(34, 211, 238, 1)'
      });
    };

    const forceResetCursor = () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      activeElementRef.current = null;
      setCursorState({
        size: 16,
        text: '',
        backgroundColor: 'rgba(34, 211, 238, 0.8)',
        mixBlendMode: 'normal',
        border: 'none'
      });
    };

    const handleDefaultHover = () => {
      // Clear any existing timeout
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      // Set a timeout to force reset if needed
      resetTimeoutRef.current = setTimeout(() => {
        forceResetCursor();
      }, 100);
    };

    // Global click handler to reset cursor
    const handleDocumentClick = () => {
      // Force reset cursor on any click
      setTimeout(() => {
        forceResetCursor();
      }, 50);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleDocumentClick, true);

    // Add magnetic effect to interactive elements
    const addMagneticEffect = (selector: string, hoverHandler: (element: Element) => void) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const elementEnterHandler = () => hoverHandler(element);
        const elementLeaveHandler = () => {
          // Force reset when leaving any special element
          activeElementRef.current = null;
          forceResetCursor();
        };

        element.addEventListener('mouseenter', elementEnterHandler);
        element.addEventListener('mouseleave', elementLeaveHandler);

        // Magnetic pull effect
        element.addEventListener('mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (element as HTMLElement).getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = (mouseEvent.clientX - centerX) * 0.3;
          const deltaY = (mouseEvent.clientY - centerY) * 0.3;

          (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        element.addEventListener('mouseleave', () => {
          (element as HTMLElement).style.transform = 'translate(0px, 0px)';
        });

        // Store references for cleanup
        (element as any)._magneticEnterHandler = elementEnterHandler;
        (element as any)._magneticLeaveHandler = elementLeaveHandler;
      });
    };

    // Apply magnetic effects to different element types
    const setupMagneticElements = () => {
      addMagneticEffect('button, .cursor-button', handleButtonHover);
      addMagneticEffect('a, .cursor-link', handleLinkHover);
      addMagneticEffect('.cursor-project', handleProjectHover);
      addMagneticEffect('img, .cursor-image', handleImageHover);
    };

    // Setup with delay to ensure DOM is ready
    setTimeout(setupMagneticElements, 100);

    // Periodic check to reset stuck cursor states
    const checkInterval = setInterval(() => {
      if (cursorState.text !== '' || cursorState.size !== 16) {
        // Check if mouse is still over a special element
        const mouseX = cursorX.get();
        const mouseY = cursorY.get();
        const elementAtCursor = document.elementFromPoint(mouseX, mouseY);

        if (elementAtCursor) {
          const isOverSpecial = elementAtCursor.closest('button, .cursor-button, a, .cursor-link, .cursor-project, img, .cursor-image');
          if (!isOverSpecial) {
            forceResetCursor();
          }
        }
      }
    }, 500);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleDocumentClick, true);

      // Clear any pending timeouts and intervals
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      clearInterval(checkInterval);

      // Clean up magnetic effects
      const selectors = [
        'button, .cursor-button',
        'a, .cursor-link',
        '.cursor-project',
        'img, .cursor-image'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const enterHandler = (element as any)._magneticEnterHandler;
          const leaveHandler = (element as any)._magneticLeaveHandler;

          if (enterHandler) {
            element.removeEventListener('mouseenter', enterHandler);
          }
          if (leaveHandler) {
            element.removeEventListener('mouseleave', leaveHandler);
          }

          // Reset transform
          (element as HTMLElement).style.transform = 'translate(0px, 0px)';
        });
      });

      // Reset cursor state
      activeElementRef.current = null;
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        button, a, input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-mode-difference rounded-full flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorState.size,
          height: cursorState.size,
          backgroundColor: cursorState.backgroundColor,
          border: cursorState.border,
          mixBlendMode: cursorState.mixBlendMode as any,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          width: cursorState.size,
          height: cursorState.size,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 400,
          mass: 0.5,
        }}
      >
        {cursorState.text && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-center leading-none"
          >
            {cursorState.text}
          </motion.span>
        )}
      </motion.div>

      {/* Cursor trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="w-2 h-2 bg-cyan-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </>
  );
};

export default MagneticCursor;