'use client';

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface GestureInteractionProps {
  children: React.ReactNode;
  type: 'drag' | 'swipe' | 'pinch' | 'rotate' | 'hover3d' | 'magnetic';
  constraints?: boolean;
  onGesture?: (info: any) => void;
  className?: string;
}

export function GestureInteraction({
  children,
  type,
  constraints = true,
  onGesture,
  className,
}: GestureInteractionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  const getGestureProps = () => {
    switch (type) {
      case 'drag':
        return {
          drag: true,
          dragConstraints: constraints ? { left: 0, right: 0, top: 0, bottom: 0 } : false,
          dragElastic: 0.1,
          whileDrag: { scale: 1.1 },
          onDragStart: () => setIsDragging(true),
          onDragEnd: (_, info) => {
            setIsDragging(false);
            onGesture?.(info);
          },
        };
      case 'swipe':
        return {
          drag: "x",
          dragConstraints: { left: 0, right: 0 },
          dragElastic: 0.2,
          onDragEnd: (_, info) => {
            const threshold = 50;
            if (Math.abs(info.offset.x) > threshold) {
              onGesture?.(info);
            }
            controls.start({ x: 0 });
          },
        };
      case 'pinch':
        return {
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        };
      case 'rotate':
        return {
          whileHover: { rotate: 180 },
          transition: { type: "spring", stiffness: 200, damping: 30 },
        };
      case 'hover3d':
        return {
          onMouseMove: (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotateX = (e.clientY - centerY) / 20;
            const rotateY = (e.clientX - centerX) / 20;
            controls.start({ rotateX, rotateY });
          },
          onMouseLeave: () => controls.start({ rotateX: 0, rotateY: 0 }),
        };
      case 'magnetic':
        return {
          onMouseMove: (e: React.MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 5;
            const moveY = (e.clientY - centerY) / 5;
            controls.start({ x: moveX, y: moveY });
          },
          onMouseLeave: () => controls.start({ x: 0, y: 0 }),
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative",
        isDragging && "cursor-grabbing",
        className
      )}
      animate={controls}
      style={{ x, y, scale, rotate }}
      {...getGestureProps()}
    >
      {children}
    </motion.div>
  );
} 