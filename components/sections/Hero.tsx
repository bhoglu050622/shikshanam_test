'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Flower, Users, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import MotionWrapper, { StaggerContainer, StaggerItem } from '../motion/MotionWrapper'
import { useScrollAnimations, useStaggeredAnimations } from '@/lib/hooks/useProgressiveAnimations'
import { useCMSContent } from '@/lib/cms-content'
// CMS components removed - using regular elements instead


// const quickStats = [
//   { icon: Users, label: 'Active Students', value: '2,500+' },
//   { icon: Award, label: 'Certified Gurus', value: '50+' },
//   { icon: BookOpen, label: 'Courses', value: '100+' },
// ]

export default function Hero() {
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Fetch CMS content
  const { content: cmsContent, loading: cmsLoading } = useCMSContent('components/sections/Hero.tsx')
  
  // Progressive animations
  const titleRef = useScrollAnimations('fadeIn', { delay: 200 })
  const subtitleRef = useScrollAnimations('slideUp', { delay: 400 })
  const statsRef = useStaggeredAnimations('fadeIn', 150, { delay: 600 })
  const ctaRef = useStaggeredAnimations('scaleIn', 200, { delay: 800 })

  useEffect(() => {
    setIsClient(true)
    setMounted(true)
  }, [])

  return (
    <section id="home" className="section-padding relative min-h-screen flex items-center bg-background transition-colors duration-300">
      <div className="container-custom text-center relative z-20">
        <StaggerContainer className="space-y-readable">
          <StaggerItem>
            <div className="flex justify-center mb-8">
              {mounted ? (
                <motion.div 
                  className="flex items-center space-x-4 text-golden-olive"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-6 h-6 animate-glow" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [-5, 5, -5],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Flower className="w-8 h-8 animate-pulse-slow" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: [0, -360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <Sparkles className="w-6 h-6 animate-glow" />
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex items-center space-x-4 text-golden-olive">
                  <Sparkles className="w-6 h-6 animate-glow" />
                  <Flower className="w-8 h-8 animate-pulse-slow" />
                  <Sparkles className="w-6 h-6 animate-glow" />
                </div>
              )}
            </div>
          </StaggerItem>

          <StaggerItem>
            {mounted ? (
              <motion.h1 
                ref={titleRef} 
                className="text-mobile-hero text-high-contrast mb-6 sm:mb-8 text-shadow-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="inline">Welcome to</span>
                {' '}
                <motion.span 
                  className="bg-gradient-to-r from-[#8B5CF6] via-secondary to-accent bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <span className="inline">{cmsContent.mainTitle || 'Welcome to Ancient Wisdom'}</span>
                </motion.span>
              </motion.h1>
            ) : (
              <h1 
                ref={titleRef} 
                className="text-mobile-hero text-high-contrast mb-6 sm:mb-8 text-shadow-sm"
              >
                <span className="inline">Welcome to</span>
                {' '}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-secondary to-accent bg-clip-text text-transparent">
                  <span className="inline">{cmsContent.mainTitle || 'Welcome to Ancient Wisdom'}</span>
                </span>
              </h1>
            )}
          </StaggerItem>

          <StaggerItem>
            {mounted ? (
              <motion.p 
                ref={subtitleRef} 
                className="text-mobile-subheading text-high-contrast mb-12 sm:mb-16 max-w-4xl sm:max-w-5xl mx-auto devanagari-separator text-readable"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="inline">{cmsContent.subtitle || 'Where Technology meets Tradition'}</span>
                </motion.span>
              </motion.p>
            ) : (
              <p 
                ref={subtitleRef} 
                className="text-mobile-subheading text-high-contrast mb-12 sm:mb-16 max-w-4xl sm:max-w-5xl mx-auto devanagari-separator text-readable"
              >
                <span className="inline">{cmsContent.subtitle || 'Where Technology meets Tradition'}</span>
              </p>
            )}
          </StaggerItem>

          {/* Quick Stats - Removed */}
          {/* <StaggerItem>
            <div ref={statsRef} className="flex justify-center mb-8 sm:mb-12">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={`quick-stat-${stat.label}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex items-center space-x-2 sm:space-x-3 text-high-contrast cursor-pointer"
                  >
                    <motion.div 
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/90 rounded-lg sm:rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                    </motion.div>
                    <div>
                      <motion.div 
                        className="text-base sm:text-lg font-bold text-high-contrast"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs sm:text-sm text-high-contrast opacity-80">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </StaggerItem> */}

          <StaggerItem>
            <motion.h2 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-high-contrast mb-12 sm:mb-16 text-shadow-sm"
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(218, 165, 32, 0)',
                    '0 0 20px rgba(218, 165, 32, 0.3)',
                    '0 0 0px rgba(218, 165, 32, 0)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="inline">{cmsContent.question || 'What are you looking for?'}</span>
              </motion.span>
            </motion.h2>
          </StaggerItem>

          <StaggerItem>
            <div ref={ctaRef} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-16 md:mb-20 w-full max-w-sm md:max-w-none mx-auto px-4 md:px-0">
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(218, 165, 32, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const schoolCard = document.getElementById('school-school-of-sanskrit');
                  if (schoolCard) {
                    schoolCard.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest'
                    });
                    // Add temporary highlight effect
                    schoolCard.style.transition = 'box-shadow 0.3s ease';
                    schoolCard.style.boxShadow = '0 0 30px rgba(218, 165, 32, 0.6)';
                    setTimeout(() => {
                      schoolCard.style.boxShadow = '';
                    }, 2000);
                  } else {
                    console.warn('School of Sanskrit card not found');
                  }
                }}
                className="group bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6]/90 hover:from-[#8B5CF6]/90 hover:to-[#8B5CF6]/80 text-primary-foreground px-6 md:px-8 py-4 rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 relative overflow-hidden cursor-pointer no-underline w-full md:w-auto"
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="inline">{cmsContent.buttonText || 'Explore Now'}</span>
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(139, 69, 19, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const schoolCard = document.getElementById('school-school-of-darshana');
                  if (schoolCard) {
                    schoolCard.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest'
                    });
                    // Add temporary highlight effect
                    schoolCard.style.transition = 'box-shadow 0.3s ease';
                    schoolCard.style.boxShadow = '0 0 30px rgba(139, 69, 19, 0.6)';
                    setTimeout(() => {
                      schoolCard.style.boxShadow = '';
                    }, 2000);
                  } else {
                    console.warn('School of Darshan card not found');
                  }
                }}
                className="group bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 text-secondary-foreground px-6 md:px-8 py-4 rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/20 hover:border-secondary/40 relative overflow-hidden cursor-pointer no-underline w-full md:w-auto"
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <span className="inline">School of Darshan</span>
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(255, 140, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const schoolCard = document.getElementById('school-school-of-life-skills');
                  if (schoolCard) {
                    schoolCard.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest'
                    });
                    // Add temporary highlight effect
                    schoolCard.style.transition = 'box-shadow 0.3s ease';
                    schoolCard.style.boxShadow = '0 0 30px rgba(255, 140, 0, 0.6)';
                    setTimeout(() => {
                      schoolCard.style.boxShadow = '';
                    }, 2000);
                  } else {
                    console.warn('School of Life Skills card not found');
                  }
                }}
                className="group bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 text-accent-foreground px-6 md:px-8 py-4 rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20 hover:border-accent/40 relative overflow-hidden cursor-pointer no-underline w-full md:w-auto"
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="inline">School of Life Skills</span>
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </StaggerItem>


        </StaggerContainer>
      </div>
    </section>
  )
}
