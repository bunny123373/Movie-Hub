import React from 'react'

const MovieSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-responsive">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card overflow-hidden">
          {/* Poster Skeleton */}
          <div className="aspect-[2/3] skeleton-shimmer" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-5 skeleton-shimmer rounded w-3/4" />
            <div className="flex items-center space-x-2">
              <div className="h-5 skeleton-shimmer rounded w-16" />
              <div className="h-5 skeleton-shimmer rounded w-12" />
            </div>
            <div className="flex space-x-1.5">
              <div className="h-5 skeleton-shimmer rounded w-10" />
              <div className="h-5 skeleton-shimmer rounded w-10" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 skeleton-shimmer rounded w-16" />
              <div className="h-4 skeleton-shimmer rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MovieSkeleton
