import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PromoSlide, NavSectionId } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoSliderProps {
  slides: PromoSlide[];
  onNavigate: (section: NavSectionId) => void;
  autoPlayInterval?: number; // ms, default 5500
}

export const PromoSlider: React.FC<PromoSliderProps> = ({
  slides,
  onNavigate,
  autoPlayInterval = 5500
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Ref for reduced motion check
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto advance timer (pauses on hover or if prefers reduced motion)
  useEffect(() => {
    if (isHovered || prefersReducedMotion.current || slides.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, autoPlayInterval, handleNext, slides.length]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Touch Swipe Handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handleBannerClick = () => {
    if (currentSlide.ctaLink) {
      onNavigate(currentSlide.ctaLink as NavSectionId);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Department Promotional Banners Slider"
      className="relative w-full max-w-full overflow-hidden bg-[#001B40] border-b border-[#003366] text-white focus:outline-none"
    >
      {/* Clean Banner Image Container (No Text Overlays Popping on Top) */}
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onClick={handleBannerClick}
            className={`absolute inset-0 w-full h-full ${currentSlide.ctaLink ? 'cursor-pointer' : ''}`}
          >
            {/* Banner Image - Rendered Full Clean Graphic */}
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title || "Department Promotional Banner"}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Minimal Left / Right Chevron Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#001B40]/80 hover:bg-[#001B40] text-white border border-slate-700/60 shadow-lg transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#001B40]/80 hover:bg-[#001B40] text-white border border-slate-700/60 shadow-lg transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Dot Index Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-[#001B40]/60 px-3 py-1.5 rounded-full border border-slate-700/40">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Jump to slide ${index + 1}`}
                className={`transition-all ${
                  isActive
                    ? 'w-6 h-2 rounded-full bg-[#F2B705]'
                    : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white'
                }`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};
