import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card animate-pulse">
      <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
      <div className="mt-4">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
          <span className="text-gray-500">•</span>
          <div className="h-4 bg-gray-300 rounded w-10"></div>
          <span className="text-gray-500">•</span>
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-20 mt-3"></div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
