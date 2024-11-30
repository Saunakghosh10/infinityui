import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<{ 
    top: string; 
    left: string; 
    delay: string;
    size: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const styles = [...Array(number)].map(() => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      delay: Math.random() * 1 + "s",
      size: Math.random() * 1.5 + 0.5, // Random size between 0.5 and 2
      speed: Math.random() * 2 + 3, // Random speed between 3 and 5 seconds
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "absolute rotate-[215deg] animate-meteor rounded-[9999px] bg-zinc-300 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            width: `${style.size}px`,
            height: `${style.size}px`,
            animationDuration: `${style.speed}s`,
          }}
        />
      ))}
    </>
  );
};