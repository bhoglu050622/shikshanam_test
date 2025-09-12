'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PackageCardProps } from '@/lib/types/packages';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PackageCard({ package: pkg, onViewDetails, onBuy }: PackageCardProps) {
  const savings = pkg.originalPriceInr ? pkg.originalPriceInr - pkg.priceInr : 0;
  const savingsPercent = pkg.originalPriceInr ? Math.round((savings / pkg.originalPriceInr) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-saffron-400 bg-white">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-saffron-100 to-amber-100">
          {pkg.thumbnailUrl ? (
            <Image
              src={pkg.thumbnailUrl}
              alt={pkg.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-saffron-600">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-sm font-medium">{pkg.name}</div>
              </div>
            </div>
          )}
          {savings > 0 && (
            <Badge 
              className="absolute top-3 right-3 bg-emerald-600 text-white font-semibold"
              variant="default"
            >
              You save ₹{savings.toLocaleString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CardTitle className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
          {pkg.name}
        </CardTitle>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {pkg.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-saffron-600">
            ₹{pkg.priceInr.toLocaleString()}
          </span>
          {pkg.originalPriceInr && pkg.originalPriceInr > pkg.priceInr && (
            <span className="text-lg text-slate-400 line-through">
              ₹{pkg.originalPriceInr.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Package features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.livePassCount && pkg.livePassCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {pkg.livePassCount} Live Sessions
            </Badge>
          )}
          {pkg.mentorHours && pkg.mentorHours > 0 && (
            <Badge variant="outline" className="text-xs">
              {pkg.mentorHours}h Mentoring
            </Badge>
          )}
          {pkg.certificateIncluded && (
            <Badge variant="outline" className="text-xs">
              Certificate
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 border-saffron-400 text-saffron-600 hover:bg-saffron-50"
          onClick={() => onViewDetails(pkg.sku)}
          aria-label={`View details for ${pkg.name}`}
        >
          View details
        </Button>
        <Button
          className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white"
          onClick={() => onBuy(pkg.sku)}
          aria-label={`Buy ${pkg.name} for ₹${pkg.priceInr.toLocaleString()}`}
        >
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
}

// Skeleton loader for PackageCard
export function PackageCardSkeleton() {
  return (
    <Card className="border-2 bg-white">
      <CardHeader className="p-0">
        <div className="w-full h-48 bg-slate-200 animate-pulse rounded-t-xl" />
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="h-6 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-slate-200 rounded animate-pulse mb-1" />
        <div className="h-4 bg-slate-200 rounded animate-pulse mb-1 w-3/4" />
        <div className="h-4 bg-slate-200 rounded animate-pulse mb-4 w-1/2" />
        
        <div className="h-8 bg-slate-200 rounded animate-pulse mb-4 w-1/3" />
        
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
          <div className="h-6 bg-slate-200 rounded animate-pulse w-16" />
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-3">
        <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse" />
        <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
