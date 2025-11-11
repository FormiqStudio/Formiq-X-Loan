import React from 'react'

const ApplicationSkeleton = () => {
return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-9 w-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-9 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-3 w-10 bg-gray-100 rounded"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
        <div className="flex justify-between text-xs text-gray-400">
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
          <div className="h-3 w-16 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-100 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationSkeleton
