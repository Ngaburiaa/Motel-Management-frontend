import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};
