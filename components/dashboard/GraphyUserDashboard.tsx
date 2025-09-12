'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Calendar,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useGraphyPackages, useGraphyDeviceManagement } from '@/lib/hooks/useGraphyIntegration';
import { useAuth } from '@/lib/auth-context';
import { UserPackage } from '@/lib/types/packages';
import Image from 'next/image';
import Link from 'next/link';

export function GraphyUserDashboard() {
  const { user } = useAuth();
  const { packages, isLoading, error, fetchPackages, isReady } = useGraphyPackages();
  const { resetDevice, resetIOSScreenshot, isLoading: deviceLoading, error: deviceError, success: deviceSuccess } = useGraphyDeviceManagement();
  
  const [activeTab, setActiveTab] = useState<'packages' | 'progress' | 'sessions' | 'settings'>('packages');

  const totalProgress = packages.length > 0 
    ? Math.round(packages.reduce((sum, pkg) => sum + pkg.progress, 0) / packages.length)
    : 0;

  const totalStudyTime = packages.reduce((sum, pkg) => {
    // This would come from Graphy usage data
    return sum + (pkg.progress * 10); // Mock calculation
  }, 0);

  const completedCourses = packages.filter(pkg => pkg.progress === 100).length;
  const activeCourses = packages.filter(pkg => pkg.progress > 0 && pkg.progress < 100).length;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-parchment-ivory via-white to-saffron-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-saffron-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-ivory via-white to-saffron-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Continue your journey of spiritual learning and growth.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-saffron-200 bg-gradient-to-br from-saffron-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Progress</p>
                  <p className="text-2xl font-bold text-saffron-600">{totalProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-saffron-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-blue-600">{activeCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCourses}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Time</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(totalStudyTime / 60)}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'packages', label: 'My Packages', icon: BookOpen },
                { id: 'progress', label: 'Progress', icon: BarChart3 },
                { id: 'sessions', label: 'Live Sessions', icon: Calendar },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-saffron-500 text-saffron-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-saffron-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your packages...</p>
              </div>
            ) : error ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                  <Button 
                    onClick={fetchPackages} 
                    className="mt-4 bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : packages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start your spiritual journey by enrolling in one of our comprehensive packages.
                  </p>
                  <Link href="/packages">
                    <Button className="bg-saffron-600 hover:bg-saffron-700">
                      Browse Packages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.sku} package={pkg} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-saffron-600" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {packages.map((pkg) => (
                    <div key={pkg.sku} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                        <Badge 
                          className={
                            pkg.progress === 100 
                              ? 'bg-green-100 text-green-800' 
                              : pkg.progress > 0 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {pkg.progress}%
                        </Badge>
                      </div>
                      <Progress value={pkg.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{pkg.includedCourses.length} courses</span>
                        <span>{pkg.availableMentorHours} mentor hours left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-saffron-600" />
                  <span>Upcoming Live Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600">
                    Check back later for live session schedules.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-saffron-600" />
                  <span>Device Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reset Device Registration</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      If you're having trouble accessing content on a new device, you can reset your device registrations.
                    </p>
                    <Button 
                      onClick={resetDevice}
                      disabled={deviceLoading}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {deviceLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        'Reset Device Registration'
                      )}
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reset iOS Screenshot Restriction</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Reset screenshot restrictions for iOS devices if you're having issues.
                    </p>
                    <Button 
                      onClick={resetIOSScreenshot}
                      disabled={deviceLoading}
                      variant="outline"
                    >
                      {deviceLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        'Reset iOS Screenshot Restriction'
                      )}
                    </Button>
                  </div>

                  {deviceError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{deviceError}</span>
                      </div>
                    </div>
                  )}

                  {deviceSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">{deviceSuccess}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Package Card Component
function PackageCard({ package: pkg }: { package: UserPackage }) {
  return (
    <Card className="border-saffron-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-orange-200 rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-saffron-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {pkg.name}
              </h3>
              <Badge 
                className={
                  pkg.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {pkg.status}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{pkg.progress}%</span>
              </div>
              <Progress value={pkg.progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{pkg.includedCourses.length} courses</span>
              <span>{pkg.availableMentorHours} mentor hours</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href={`/packages/${pkg.sku}`}>
                <Button size="sm" className="bg-saffron-600 hover:bg-saffron-700">
                  Continue Learning
                </Button>
              </Link>
              {pkg.certificateStatus === 'issued' && (
                <Button size="sm" variant="outline">
                  <Award className="w-4 h-4 mr-1" />
                  Certificate
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
