export const BookingCardSkeleton = () => (
  <div className="animate-pulse bg-white border border-slate-200 rounded-2xl w-full max-w-sm md:max-w-[340px] overflow-hidden shadow-sm">
    <div className="h-48 bg-slate-200 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 bg-slate-300 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
      <div className="h-3 w-2/3 bg-slate-200 rounded" />
      <div className="h-3 w-1/3 bg-slate-200 rounded" />
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
      </div>
    </div>
  </div>
);
