import { useState, useEffect } from 'react';

/**
 * A custom hook that detects the vertical scroll direction.
 * @returns {'up' | 'down' | null} The current scroll direction.
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Only update state if the direction changes and user has scrolled a minimum distance
      if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    // Add event listener
    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [scrollDirection]); // Re-run effect if direction changes

  return scrollDirection;
}