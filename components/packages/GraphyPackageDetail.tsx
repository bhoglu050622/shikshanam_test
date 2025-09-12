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
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { useGraphyPackage, useGraphyEnrollment } from '@/lib/hooks/useGraphyIntegration';
import { useAuth } from '@/lib/auth-context';

export function GraphyPackageDetail({ 
  package: pkg, 
  sessions = [], 
  onBuy, 
  onClaimSeat 
}: PackageDetailProps) {
  const { user, isLoggedIn } = useAuth();
  const { progress, usage, liveSessions, isLoading: packageLoading, error: packageError } = useGraphyPackage(pkg.sku);
  const { enroll, getEnrollmentStatus, getEnrollmentError, isLoading: enrollmentLoading } = useGraphyEnrollment();
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);

  const savings = pkg.originalPriceInr ? pkg.originalPriceInr - pkg.priceInr : 0;
  const savingsPercent = pkg.originalPriceInr ? Math.round((savings / pkg.originalPriceInr) * 100) : 0;

  const enrollmentStatus = getEnrollmentStatus(pkg.sku);
  const enrollmentError = getEnrollmentError(pkg.sku);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleTestimonials = () => {
    setExpandedTestimonials(!expandedTestimonials);
  };

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      // Redirect to login or show login modal
      return;
    }

    await enroll(pkg.sku);
  };

  const isEnrolled = progress?.learner?.courseInfo?.enrolledCourses?.some(
    (course: any) => course.id && pkg.includedCourses.some(inc => inc.id === course.id)
  );

  const getEnrollmentButton = () => {
    if (!isLoggedIn) {
      return (
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {/* Handle login */}}
        >
          <Shield className="w-5 h-5 mr-2" />
          Login to Enroll
        </Button>
      );
    }

    if (isEnrolled) {
      return (
        <Button 
          size="lg" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Already Enrolled
        </Button>
      );
    }

    if (enrollmentStatus === 'enrolling' || enrollmentLoading) {
      return (
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
          disabled
        >
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Enrolling...
        </Button>
      );
    }

    if (enrollmentStatus === 'success') {
      return (
        <Button 
          size="lg" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Successfully Enrolled!
        </Button>
      );
    }

    return (
      <Button 
        size="lg" 
        className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleEnroll}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Enroll Now
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-ivory via-white to-saffron-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Package Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-saffron-100 to-orange-200">
              {pkg.thumbnailUrl ? (
                <Image
                  src={pkg.thumbnailUrl}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-saffron-600" />
                </div>
              )}
            </div>
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-saffron-600">
                    ₹{pkg.priceInr.toLocaleString()}
                  </div>
                  {pkg.originalPriceInr && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{pkg.originalPriceInr.toLocaleString()}
                    </div>
                  )}
                  {savingsPercent > 0 && (
                    <Badge className="mt-1 bg-green-100 text-green-800">
                      Save {savingsPercent}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pkg.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {pkg.shortDescription}
              </p>
            </div>

            {/* Progress Display (if enrolled) */}
            {isEnrolled && progress && (
              <Card className="border-saffron-200 bg-gradient-to-r from-saffron-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                    <Badge className="bg-saffron-100 text-saffron-800">
                      {progress.usage?.usage?.totalTime ? `${Math.round(progress.usage.usage.totalTime / 60)}h` : '0h'} studied
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Overall Progress</span>
                      <span>{progress.usage?.usage?.sessions || 0} sessions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-saffron-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (progress.usage?.usage?.sessions || 0) * 10)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {packageError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{packageError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {enrollmentError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{enrollmentError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enrollment Button */}
            <div className="space-y-4">
              {getEnrollmentButton()}
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Secure enrollment • Lifetime access • Mobile & desktop
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Sessions Section */}
        {liveSessions && liveSessions.length > 0 && (
          <Card className="mb-8 border-saffron-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-saffron-600" />
                <span>Upcoming Live Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveSessions.map((session) => (
                  <div key={session.id} className="border border-saffron-200 rounded-lg p-4 bg-gradient-to-br from-saffron-50 to-orange-50">
                    <h4 className="font-semibold text-gray-900 mb-2">{session.title}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{session.seatRemaining} seats remaining</span>
                      </div>
                    </div>
                    {session.seatRemaining > 0 && (
                      <Button 
                        size="sm" 
                        className="w-full mt-3 bg-saffron-600 hover:bg-saffron-700"
                        onClick={() => onClaimSeat?.(session.id)}
                      >
                        Claim Seat
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Package Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-saffron-600" />
                  <span>About This Package</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {pkg.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Included Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-saffron-600" />
                  <span>Included Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.includedCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center space-x-3 p-3 border border-saffron-200 rounded-lg bg-gradient-to-r from-saffron-50 to-orange-50">
                      <div className="flex-shrink-0 w-8 h-8 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.duration}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-saffron-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            {pkg.faq && pkg.faq.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-saffron-600" />
                    <span>Frequently Asked Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pkg.faq.map((faq, index) => (
                      <div key={index} className="border border-saffron-200 rounded-lg">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-saffron-50 transition-colors"
                          onClick={() => toggleFaq(index)}
                        >
                          <span className="font-semibold text-gray-900">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-saffron-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-saffron-600" />
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-gray-700">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Lifetime access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Mobile & desktop access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Certificate of completion</span>
                </div>
                {pkg.livePassCount && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{pkg.livePassCount} live sessions</span>
                  </div>
                )}
                {pkg.mentorHours && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{pkg.mentorHours} mentor hours</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {pkg.prerequisites && pkg.prerequisites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Star className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
