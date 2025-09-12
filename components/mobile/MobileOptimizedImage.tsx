/**
 * Mobile Optimized Image Component
 * Responsive image component with mobile-specific optimizations
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DeviceInfo } from '@/lib/mobile/types';
import { detectDevice, getNetworkInfo, isSlowConnection } from '@/lib/mobile/device-detection';

// ============================================================================
// MOBILE OPTIMIZED IMAGE COMPONENT
// ============================================================================

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  lazy?: boolean;
  responsive?: boolean;
}

export function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  className = '',
  style,
  onLoad,
  onError,
  fallbackSrc,
  lazy = true,
  responsive = true,
}: MobileOptimizedImageProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef(quality);

  // Detect device and network on mount
  useEffect(() => {
    setDeviceInfo(detectDevice());
    setNetworkInfo(getNetworkInfo());
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Optimize image source based on device and network
  useEffect(() => {
    if (!deviceInfo || !networkInfo) return;

    let optimizedSrc = src;

    // Adjust quality based on network speed
    if (isSlowConnection()) {
      qualityRef.current = Math.min(qualityRef.current, 50);
    }

    // Adjust quality based on device pixel ratio
    if (deviceInfo.devicePixelRatio > 2) {
      qualityRef.current = Math.min(qualityRef.current + 10, 90);
    }

    // Use WebP format if supported
    if (deviceInfo.browser === 'chrome' || deviceInfo.browser === 'firefox') {
      // In a real implementation, you would modify the src to use WebP
      // optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    setOptimizedSrc(optimizedSrc);
  }, [deviceInfo, networkInfo, src, quality]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && optimizedSrc !== fallbackSrc) {
      setOptimizedSrc(fallbackSrc);
    }
    onError?.();
  };

  const getOptimizedSizes = (): string => {
    if (sizes) return sizes;

    if (responsive && deviceInfo) {
      if (deviceInfo.isMobile) {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      } else if (deviceInfo.isTablet) {
        return '(max-width: 1200px) 50vw, 33vw';
      } else {
        return '(max-width: 1200px) 50vw, 25vw';
      }
    }

    return '100vw';
  };

  const getOptimizedQuality = (): number => {
    if (!deviceInfo || !networkInfo) return qualityRef.current;

    let optimizedQuality = qualityRef.current;

    // Reduce quality for slow connections
    if (isSlowConnection()) {
      optimizedQuality = Math.min(qualityRef.current, 50);
    }

    // Increase quality for high-DPI displays
    if (deviceInfo.devicePixelRatio > 2) {
      optimizedQuality = Math.min(qualityRef.current + 10, 90);
    }

    // Reduce quality for data saver mode
    if (networkInfo.saveData) {
      optimizedQuality = Math.min(qualityRef.current, 60);
    }

    return optimizedQuality;
  };

  if (!isInView && lazy) {
    return (
      <div
        ref={imgRef}
        className={`mobile-image-placeholder ${className}`}
        style={{
          width: width || '100%',
          height: height || '200px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <div className="mobile-image-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`mobile-optimized-image-container ${className}`}
      style={style}
    >
      <Image
        src={hasError && fallbackSrc ? fallbackSrc : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={getOptimizedQuality()}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={getOptimizedSizes()}
        onLoad={handleLoad}
        onError={handleError}
        className={`mobile-optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
        style={{
          width: '100%',
          height: 'auto',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
        }}
      />
      
      {!isLoaded && !hasError && (
        <div className="mobile-image-loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
      
      {hasError && !fallbackSrc && (
        <div className="mobile-image-error">
          <div className="error-icon">📷</div>
          <div className="error-text">Image failed to load</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RESPONSIVE IMAGE GALLERY
// ============================================================================

interface ResponsiveImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
}

export function ResponsiveImageGallery({
  images,
  columns = 2,
  gap = 16,
  className = '',
}: ResponsiveImageGalleryProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  const getResponsiveColumns = (): number => {
    if (!deviceInfo) return columns;

    if (deviceInfo.isMobile) {
      return 1;
    } else if (deviceInfo.isTablet) {
      return 2;
    } else {
      return columns;
    }
  };

  const responsiveColumns = getResponsiveColumns();

  return (
    <div
      className={`responsive-image-gallery ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <MobileOptimizedImage
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            quality={80}
            lazy={true}
            responsive={true}
            className="gallery-image"
          />
          {image.caption && (
            <div className="gallery-caption">
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// LAZY LOADING IMAGE
// ============================================================================

interface LazyLoadingImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyLoadingImage({
  src,
  alt,
  width = 400,
  height = 300,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
}: LazyLoadingImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={imgRef}
      className={`lazy-loading-image ${className}`}
      style={{
        width: width,
        height: height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
      }}
    >
      {isInView ? (
        <MobileOptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className="lazy-image"
        />
      ) : (
        <div
          className="lazy-placeholder"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
}
