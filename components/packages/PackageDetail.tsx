'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageDetailProps } from '@/lib/types/packages';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  Star,
  Sparkles,
  Heart,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import Image from 'next/image';

export function PackageDetail({ 
  package: pkg, 
  sessions = [], 
  onBuy, 
  onClaimSeat 
}: PackageDetailProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);

  const savings = pkg.originalPriceInr ? pkg.originalPriceInr - pkg.priceInr : 0;
  const savingsPercent = pkg.originalPriceInr ? Math.round((savings / pkg.originalPriceInr) * 100) : 0;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleTestimonials = () => {
    setExpandedTestimonials(!expandedTestimonials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-ivory via-white to-saffron-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
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
            className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-saffron-200/30 to-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl"
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
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-saffron-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          />
        </div>

        <div className="bg-gradient-to-br from-saffron-50 via-amber-50 to-yellow-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Package Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-saffron-200 rounded-full px-4 py-2 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-saffron-600" />
                  <span className="text-sm font-medium text-saffron-700">Premium Learning Package</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight"
                >
                  {pkg.name}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-slate-600 mb-8 leading-relaxed"
                >
                  {pkg.shortDescription}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center gap-6 mb-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-saffron-600">
                      ₹{pkg.priceInr.toLocaleString()}
                    </span>
                    {pkg.originalPriceInr && pkg.originalPriceInr > pkg.priceInr && (
                      <span className="text-2xl text-slate-400 line-through">
                        ₹{pkg.originalPriceInr.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-4 py-2 text-sm">
                      Save ₹{savings.toLocaleString()} ({savingsPercent}%)
                    </Badge>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => onBuy(pkg.sku)}
                      aria-label={`Buy ${pkg.name} for ₹${pkg.priceInr.toLocaleString()}`}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Enroll Now
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-saffron-300 text-saffron-700 hover:bg-saffron-50 px-8 py-4 text-lg font-semibold"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Add to Wishlist
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex items-center gap-6 mt-8 text-sm text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Lifetime access</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                {pkg.thumbnailUrl ? (
                  <div className="relative">
                    <motion.div 
                      className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={pkg.thumbnailUrl}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                    
                    {/* Floating elements */}
                    <motion.div
                      animate={{ 
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-saffron-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Star className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [10, -10, 10],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                      className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Award className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-saffron-100 to-amber-100 flex items-center justify-center">
                    <div className="text-center text-saffron-600">
                      <BookOpen className="w-24 h-24 mx-auto mb-4" />
                      <p className="text-xl font-semibold">{pkg.name}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    About This Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    {pkg.longDescription.split('\n').map((paragraph, index) => (
                      <motion.p 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="mb-6 text-slate-700 leading-relaxed text-lg"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Included Courses */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Included Courses ({pkg.includedCourses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pkg.includedCourses.map((course, index) => (
                      <motion.div 
                        key={course.id} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="group flex items-center justify-between p-6 border border-slate-200 rounded-2xl hover:border-saffron-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-slate-50/50"
                      >
                        <div className="flex items-center gap-6">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-saffron-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="text-lg font-bold text-white">{index + 1}</span>
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h4>
                            <p className="text-slate-500 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-saffron-400 text-saffron-600 hover:bg-saffron-50 font-semibold"
                            onClick={() => window.open(course.link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Course
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Sessions */}
            {sessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-saffron-600" />
                    Upcoming Live Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-saffron-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-saffron-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{session.title}</h4>
                            <p className="text-sm text-slate-500">
                              {new Date(session.date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-sm text-slate-500">
                              {session.seatRemaining} of {session.maxSeats} seats remaining
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-saffron-600 hover:bg-saffron-700 text-white"
                          onClick={() => onClaimSeat?.(session.id)}
                          disabled={session.seatRemaining === 0}
                        >
                          {session.seatRemaining === 0 ? 'Seats Full' : 'Claim Seat'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {pkg.faq && pkg.faq.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pkg.faq.map((item, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                          onClick={() => toggleFaq(index)}
                        >
                          <span className="font-medium text-slate-800">{item.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-4">
                            <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials */}
            {pkg.testimonials && pkg.testimonials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What Students Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pkg.testimonials.slice(0, expandedTestimonials ? undefined : 2).map((testimonial) => (
                      <div key={testimonial.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          {testimonial.avatarUrl && (
                            <Image
                              src={testimonial.avatarUrl}
                              alt={testimonial.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < testimonial.rating ? "text-yellow-400" : "text-slate-300"
                                  )}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 italic">"{testimonial.content}"</p>
                      </div>
                    ))}
                    {pkg.testimonials.length > 2 && (
                      <Button
                        variant="outline"
                        onClick={toggleTestimonials}
                        className="w-full"
                      >
                        {expandedTestimonials ? 'Show Less' : `Show ${pkg.testimonials.length - 2} More`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Package Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Package Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pkg.livePassCount && pkg.livePassCount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{pkg.livePassCount} Live Sessions</p>
                        <p className="text-sm text-slate-600">Interactive learning with experts</p>
                      </div>
                    </motion.div>
                  )}

                  {pkg.mentorHours && pkg.mentorHours > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{pkg.mentorHours} Hours Mentoring</p>
                        <p className="text-sm text-slate-600">One-on-one guidance</p>
                      </div>
                    </motion.div>
                  )}

                  {pkg.certificateIncluded && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">Certificate Included</p>
                        <p className="text-sm text-slate-600">Verified completion certificate</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-saffron-50 to-amber-100/50 border border-saffron-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{pkg.includedCourses.length} Courses</p>
                      <p className="text-sm text-slate-600">Comprehensive curriculum</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prerequisites */}
            {pkg.prerequisites && pkg.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Buy Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-saffron-50 to-amber-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="mb-6"
                    >
                      <span className="text-4xl font-bold text-saffron-600">
                        ₹{pkg.priceInr.toLocaleString()}
                      </span>
                      {pkg.originalPriceInr && pkg.originalPriceInr > pkg.priceInr && (
                        <span className="text-xl text-slate-400 line-through ml-3">
                          ₹{pkg.originalPriceInr.toLocaleString()}
                        </span>
                      )}
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => onBuy(pkg.sku)}
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Enroll Now
                      </Button>
                    </motion.div>
                    
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
