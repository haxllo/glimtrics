import * as React from "react";
import { cn } from "@/lib/utils";

export interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
  ({ className, hover = false, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg",
          hover && "hover:border-green-500/50 transition-colors",
          glow && "shadow-lg shadow-green-500/20",
          className
        )}
        {...props}
      />
    );
  }
);
DarkCard.displayName = "DarkCard";
