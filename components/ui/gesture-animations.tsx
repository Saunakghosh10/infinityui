'use client';

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { gestureVariants } from '@/lib/animation-provider';

interface GestureAnimationProps {
  children: React.ReactNode;
  className?: string;
  dragConstraints?: boolean;
  dragElastic?: number;
  whileHover?: boolean;
  whileTap?: boolean;
  whileDrag?: boolean;
}

export function GestureAnimation({
  children,
  className,
  dragConstraints = true,
  dragElastic = 0.1,
  whileHover = true,
  whileTap = true,
  whileDrag = true,
}: GestureAnimationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-100, 100], [30, -30]);
  const rotateY = useTransform(dragX, [-100, 100], [-30, 30]);

  return (
    <motion.div
      className={cn("relative touch-none", className)}
      drag={dragConstraints}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={dragElastic}
      whileHover={whileHover ? gestureVariants.hover : undefined}
      whileTap={whileTap ? gestureVariants.tap : undefined}
      whileDrag={whileDrag ? gestureVariants.drag : undefined}
      style={{
        x: dragX,
        y: dragY,
        rotateX,
        rotateY,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {children}
    </motion.div>
  );
} 