import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

// Allowed variant types
export type ButtonVariant = "default" | "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

// Full Button component with variants and sizes
export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses: Record<ButtonVariant, string> = {
    default:
      "bg-base-300 text-base-content hover:bg-base-200 focus-visible:ring-base-content",
    primary:
      "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary shadow-sm",
    outline:
      "border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-primary",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
