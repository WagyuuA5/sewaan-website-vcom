import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SkeletonLoader from '../ui/SkeletonLoader';

const PageTransition = ({ children, delay = 400 }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // When the location changes, trigger the transitioning state
    setIsTransitioning(true);

    // After the delay, turn off the transitioning state
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, delay);

    // Cleanup timer on unmount or if location changes rapidly
    return () => clearTimeout(timer);
  }, [location.pathname]); // Only trigger on path change, not query params or hash (optional, but path is safer)

  return (
    <>
      {isTransitioning ? (
        <div className="absolute inset-0 z-10 bg-slate-50 dark:bg-transparent overflow-hidden">
          <SkeletonLoader path={location.pathname} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300 h-full">
          {children}
        </div>
      )}
    </>
  );
};

export default PageTransition;
