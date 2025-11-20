export const UserCardSkeleton = () => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex flex-col items-center animate-pulse min-h-[320px] text-[#03071E]">
      {/* Profile Image */}
      <div className="w-20 h-20 rounded-full bg-[#E5E5E5] mb-4" />

      {/* Name */}
      <div className="h-4 w-32 bg-[#E5E5E5] rounded mb-2" />

      {/* Bio */}
      <div className="h-3 w-48 bg-[#E5E5E5] rounded mb-4" />

      {/* Email */}
      <div className="w-full space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FCA311]" />
          <div className="h-3 w-40 bg-[#E5E5E5] rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FCA311]" />
          <div className="h-3 w-32 bg-[#E5E5E5] rounded" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Button */}
      <div className="w-full mt-auto pt-4">
        <div className="h-10 bg-[#E5E5E5] rounded-full w-full" />
      </div>
    </div>
  );
};
