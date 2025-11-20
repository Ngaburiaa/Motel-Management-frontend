// components/dashboard/MetricCardSkeleton.tsx
export const MetricCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-full bg-slate-200" />
      <div className="h-4 w-1/3 bg-slate-200 rounded" />
    </div>
    <div className="h-6 w-1/4 bg-slate-300 rounded" />
  </div>
);
