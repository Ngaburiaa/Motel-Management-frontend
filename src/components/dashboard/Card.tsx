import type { ReactNode, FC } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ className, children }) => (
  <div
    className={cn(
      "bg-white text-base-content border border-base-content/10 rounded-2xl px-6 py-5 shadow-sm transition hover:shadow-md",
      className
    )}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export const CardHeader: FC<CardHeaderProps> = ({ className, children }) => (
  <div className={cn("mb-4 flex items-center justify-between", className)}>
    {children}
  </div>
);

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export const CardTitle: FC<CardTitleProps> = ({ className, children }) => (
  <h4
    className={cn(
      "text-sm font-semibold tracking-wider uppercase text-primary",
      className
    )}
  >
    {children}
  </h4>
);

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent: FC<CardContentProps> = ({ className, children }) => (
  <div
    className={cn("text-sm text-muted leading-relaxed space-y-1", className)}
  >
    {children}
  </div>
);


