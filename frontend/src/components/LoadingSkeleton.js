import React from 'react';

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="card animate-pulse">
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
  </div>
);

export default CardSkeleton;
