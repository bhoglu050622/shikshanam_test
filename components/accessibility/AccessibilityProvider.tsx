/**
 * Accessibility Provider Component
 * Provides accessibility context and utilities throughout the app
 */

'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAccessibility } from '@/lib/hooks/useAccessibility';

interface AccessibilityContextType {
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  announce: (text: string, priority?: 'polite' | 'assertive') => void;
  focusManagement: {
    trapFocus: (container: HTMLElement) => () => void;
    releaseFocus: () => void;
    focusFirst: (container: HTMLElement) => void;
    focusLast: (container: HTMLElement) => void;
  };
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation?: 'horizontal' | 'vertical'
  ) => number;
  handleEscapeKey: (event: KeyboardEvent, onEscape: () => void) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const accessibility = useAccessibility();

  // Apply accessibility preferences to document
  useEffect(() => {
    const { preferences } = accessibility;

    // Apply high contrast
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (preferences.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Apply large text
    if (preferences.largeText) {
      document.documentElement.style.fontSize = 'large';
    } else {
      document.documentElement.style.fontSize = '';
    }
  }, [accessibility]);

  // Set up global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      // Alt + 1: Skip to main content
      if (event.altKey && event.key === '1') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          accessibility.announce('Skipped to main content');
        }
      }

      // Alt + 2: Skip to navigation
      if (event.altKey && event.key === '2') {
        event.preventDefault();
        const navigation = document.getElementById('navigation');
        if (navigation) {
          navigation.focus();
          accessibility.announce('Skipped to navigation');
        }
      }

      // Alt + 3: Skip to footer
      if (event.altKey && event.key === '3') {
        event.preventDefault();
        const footer = document.getElementById('footer');
        if (footer) {
          footer.focus();
          accessibility.announce('Skipped to footer');
        }
      }

      // Alt + H: Toggle high contrast
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        accessibility.toggleHighContrast();
        accessibility.announce(
          accessibility.preferences.highContrast 
            ? 'High contrast mode enabled' 
            : 'High contrast mode disabled'
        );
      }

      // Alt + T: Toggle large text
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        accessibility.toggleLargeText();
        accessibility.announce(
          accessibility.preferences.largeText 
            ? 'Large text mode enabled' 
            : 'Large text mode disabled'
        );
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, [accessibility]);

  return (
    <AccessibilityContext.Provider value={accessibility}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
}
