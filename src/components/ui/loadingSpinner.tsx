// components/ui/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export const LoadingSpinner = ({
  size = 18,
  color = "text-white",
  className = "",
  ariaLabel = "Loading...",
}: LoadingSpinnerProps) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`flex items-center justify-center ${className}`}
    >
      <Loader2
        className={`animate-spin ${color}`}
        size={size}
        strokeWidth={2}
      />
    </div>
  );
};
