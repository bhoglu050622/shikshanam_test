'use client'

import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Heart, ArrowRight, Users, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const schools = [
  {
    title: 'School of Sanskrit',
    subtitle: 'Ancient Manuscript',
    description: 'Master the ancient language that holds the key to Vedic wisdom, classical literature, and spiritual texts.',
    icon: BookOpen,
    emoji: '📜',
    color: 'from-primary to-primary/90',
    hoverColor: 'from-primary/90 to-primary/80',
    href: '/schools/sanskrit',
    whatYoullLearn: 'Grammar, Communication, Shloka-Path, Live Q&A',
    features: [
      'Grammar & Literature',
      'Vedic Texts',
      'Classical Poetry',
      'Scripture Study'
    ],
    cta: 'Join Sanskrit School'
  },
  {
    title: 'School of Darshana',
    subtitle: 'Temple Meditation',
    description: 'Explore the six classical schools of Indian philosophy and discover the nature of reality, consciousness, and existence.',
    icon: Lightbulb,
    emoji: '🕉',
    color: 'from-secondary to-secondary/90',
    hoverColor: 'from-secondary/90 to-secondary/80',
    href: '/schools/darshana',
    whatYoullLearn: 'Nyaya and Vaisheshika, Samkhya and Yoga, Mimamsa and Vedanta',
    features: [
      'Vedanta',
      'Yoga Philosophy',
      'Nyaya & Vaisheshika',
      'Samkhya & Mimamsa'
    ],
    cta: 'Join Darshan School'
  },
  {
    title: 'School of Life Skills',
    subtitle: 'Lotus & Sunrise',
    description: 'Discover practical wisdom from ancient texts to transform your life, relationships, and personal growth.',
    icon: Heart,
    emoji: '🌱',
    color: 'from-accent to-accent/90',
    hoverColor: 'from-accent/90 to-accent/80',
    href: '/schools/self-help',
    whatYoullLearn: 'Entrepreneurship, Emotional Intelligence, Stress-Management, Purpose and Meaning',
    features: [
      'Life Management',
      'Relationship Wisdom',
      'Stress & Anxiety',
      'Purpose & Meaning'
    ],
    cta: 'Join Life Skills School'
  }
]

export default function Schools() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="schools" className="py-8 sm:py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            animate={isInView ? {
              textShadow: [
                '0 0 0px rgba(218, 165, 32, 0)',
                '0 0 20px rgba(218, 165, 32, 0.3)',
                '0 0 0px rgba(218, 165, 32, 0)'
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Choose Your{' '}
            <motion.span 
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              animate={isInView ? {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              } : {}}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              School!
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.span
              animate={isInView ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              From Language to Philosophy to Life, Begin your Quest!
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Schools Vertical Layout */}
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {schools.map((school, index) => (
            <Link 
              key={school.title}
              href={school.href} 
              className="no-underline block h-full"
              onClick={(e) => {
                console.log('Navigating to:', school.href);
                // Ensure the navigation happens
                e.stopPropagation();
              }}
            >
              <motion.div
                id={`school-${school.title.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                className="group relative overflow-hidden h-full"
              >
                <div className={`bg-gradient-to-br ${school.color} hover:${school.hoverColor} rounded-3xl p-8 text-white transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden h-full`}>
                  {/* Enhanced Background Pattern */}
                  <motion.div 
                    className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, -180, -360]
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start space-x-4 mb-6">
                      <motion.div 
                        className="w-16 h-16 bg-card/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          boxShadow: "0 10px 30px rgba(255,255,255,0.3)"
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div 
                          className="text-3xl"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                        >
                          {school.emoji}
                        </motion.div>
                      </motion.div>
                      <div className="flex-1">
                        <motion.h3 
                          className="text-xl font-bold mb-2 text-white"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {school.title}
                        </motion.h3>
                        <motion.span 
                          className="text-primary-foreground/80 text-sm font-medium bg-primary/20 px-3 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {school.subtitle}
                        </motion.span>
                      </div>
                    </div>
                    
                    <p className="text-primary-foreground/90 mb-6 group-hover:text-primary-foreground transition-colors duration-300 leading-relaxed flex-grow">
                      {school.description}
                    </p>
                    
                    {/* What You'll Learn */}
                    <div className="mb-6">
                      <h4 className="text-primary-foreground font-semibold mb-3">What You'll Learn:</h4>
                      <p className="text-primary-foreground/90 text-sm leading-relaxed">
                        {school.whatYoullLearn}
                      </p>
                    </div>
                    
                    
                    {/* CTA */}
                    <motion.div 
                      className="flex items-center justify-between mt-auto"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span 
                        className="text-primary-foreground/90 font-medium"
                        animate={{ opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {school.cta}
                      </motion.span>
                      <motion.div
                        whileHover={{ x: 5, scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5 text-primary-foreground/80" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}