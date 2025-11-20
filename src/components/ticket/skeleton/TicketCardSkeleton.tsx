// components/ticket/TicketCardSkeleton.tsx

export const TicketCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white border border-[#e5e5e5] shadow-md rounded-2xl overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#14213d] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#fca311]/40 rounded" />
          <div className="h-4 w-16 bg-white/30 rounded" />
        </div>
        <div className="h-4 w-20 bg-white/30 rounded" />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-2">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />

        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="h-3 w-28 bg-gray-100 rounded" />
          <div className="w-3 h-3 bg-gray-300 rounded-full ml-4" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#e5e5e5] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#fca311]/50 rounded-full" />
          <div className="h-4 w-20 bg-[#fca311]/30 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-[#fca311]/20 rounded-full" />
          <div className="h-6 w-20 bg-red-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
