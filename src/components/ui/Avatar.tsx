import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm", 
  lg: "h-12 w-12 text-base",
} as const;

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const shouldShowImage = src && !imageError;
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600 select-none overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="uppercase">
          {fallback || alt.charAt(0) || "U"}
        </span>
      )}
    </div>
  );
};