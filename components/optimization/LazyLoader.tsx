/**
 * LazyLoader Component
 * Provides optimized lazy loading with intersection observer and loading states
 */

'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { createIntersectionObserver } from '@/lib/performance-utils';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  height?: string | number;
  className?: string;
}

export default function LazyLoader({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32" />,
  rootMargin = '50px',
  threshold = 0.1,
  height = 'auto',
  className = '',
}: LazyLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { rootMargin, threshold }
    );

    if (observer) {
      observer.observe(element);
      return () => observer.unobserve(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsVisible(true);
      setHasLoaded(true);
    }
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ minHeight: height }}
    >
      {isVisible ? children : fallback}
    </div>
  );
}

/**
 * LazyImage Component
 * Optimized lazy loading for images
 */
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  quality?: number;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=',
  quality = 75,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <LazyLoader
      fallback={
        <div
          className={`bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
        />
      }
    >
      <div className="relative">
        {!isLoaded && (
          <Image
            src={placeholder}
            alt=""
            width={width}
            height={height}
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
            style={{ width, height }}
          />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
        {hasError && (
          <div
            className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
            style={{ width, height }}
          >
            Failed to load image
          </div>
        )}
      </div>
    </LazyLoader>
  );
}

/**
 * LazyComponent Wrapper
 * Higher-order component for lazy loading any component
 */
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function LazyLoadedComponent(props: T) {
    return (
      <LazyLoader fallback={fallback}>
        <Component {...props} />
      </LazyLoader>
    );
  };
}
