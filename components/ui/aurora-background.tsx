'use client';

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuroraBackground({ className, children, ...props }: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(24, 24, 27, 0.2), rgba(39, 39, 42, 0.2)), linear-gradient(to bottom right, rgba(24, 24, 27, 0.2), rgba(39, 39, 42, 0.2))",
          backgroundSize: "200% 200%, 200% 200%",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute -inset-x-1/2 -top-1/2 h-[200%] w-[200%] animate-aurora" />
      </div>
      {children}
    </div>
  );
}