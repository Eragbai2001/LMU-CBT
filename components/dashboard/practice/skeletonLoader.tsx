"use client";

export default function SkeletonLoader(){
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between">
          <div className="flex space-x-8">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main question area */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-4/5 mb-6"></div>

              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6 text-center">
              <div className="h-10 bg-gray-200 rounded-lg w-24 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mx-auto"></div>
            </div>

            <div className="h-1 bg-gray-100 rounded my-6"></div>

            <div className="mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="h-1 bg-gray-100 rounded my-6"></div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-10 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            </div>

            <div className="h-1 bg-gray-100 rounded my-6"></div>

            <div className="mt-4">
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
