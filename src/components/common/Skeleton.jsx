const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

// Course Card Skeleton
export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};

// Course Details Skeleton
export const CourseDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-20 w-full mb-6" />
          <div className="flex gap-6 mb-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
};

// My Learning Card Skeleton
export const MyLearningCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="md:w-64 h-48" />
        <div className="flex-1 p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-2 w-full mb-2" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Stats Skeleton
export const StatsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default Skeleton;