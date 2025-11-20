// components/loaders/SkeletonLoader.tsx
export const SkeletonLoader = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex justify-between items-center p-4 bg-slate-100 rounded-lg shadow"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-300 rounded w-3/4"></div>
            <div className="h-3 bg-slate-300 rounded w-1/2"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-slate-300 rounded"></div>
            <div className="w-8 h-8 bg-slate-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
