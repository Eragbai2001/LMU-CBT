export default function TheoryTestSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-4"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress skeleton */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gray-300 rounded-full w-1/3"></div>
            </div>
          </div>

          {/* Question skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>

          {/* Answer editor skeleton */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            <div className="p-6">
              <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
