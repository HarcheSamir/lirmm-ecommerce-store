import { useState, useEffect } from 'react';

/**
 * A custom hook that provides smooth navbar scroll behavior
 * @returns {object} Object containing scroll direction and transform value
 */
export function useScrollDirection() {
  const [scrollData, setScrollData] = useState({
    direction: null,
    transform: 0,
    isVisible: true
  });

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let accumulated = 0;
    const NAVBAR_HEIGHT = 200; // Adjust based on your navbar height
    const SCROLL_THRESHOLD = 10; // Minimum scroll to start hiding

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const scrollDiff = scrollY - lastScrollY;

      // Determine scroll direction
      const direction = scrollDiff > 0 ? 'down' : 'up';

      // Only proceed if there's meaningful scroll movement
      if (Math.abs(scrollDiff) < 1) return;

      // Accumulate scroll distance in current direction
      if (direction === 'down') {
        accumulated = Math.min(accumulated + Math.abs(scrollDiff), NAVBAR_HEIGHT);
      } else {
        accumulated = Math.max(accumulated - Math.abs(scrollDiff), 0);
      }

      // Calculate transform value (negative moves navbar up)
      let transform = 0;
      if (scrollY > SCROLL_THRESHOLD) {
        // Only start hiding after threshold scroll
        const hideRatio = accumulated / NAVBAR_HEIGHT;
        transform = -hideRatio * NAVBAR_HEIGHT;
      }

      // Update state
      setScrollData({
        direction,
        transform: Math.round(transform),
        isVisible: transform > -NAVBAR_HEIGHT / 2
      });

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    // Use requestAnimationFrame for smoother performance
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []); // Remove scrollDirection dependency to prevent unnecessary re-renders

  return scrollData;
}