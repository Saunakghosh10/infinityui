'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const particleVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/50",
        glow: "bg-gradient-to-r from-zinc-900/50 to-zinc-800/50",
        minimal: "bg-transparent",
      },
      density: {
        low: "",
        medium: "",
        high: "",
      }
    },
    defaultVariants: {
      variant: "default",
      density: "medium",
    }
  }
);

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface ParticleEffectsProps extends VariantProps<typeof particleVariants> {
  className?: string;
  particleCount?: number;
  speed?: number;
  interactive?: boolean;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  lifetime?: number;
  children?: React.ReactNode;
}

export function ParticleEffects({
  variant,
  density,
  className,
  particleCount = 50,
  speed = 1,
  interactive = true,
  colors = ['#ffffff', '#a1a1aa', '#71717a'],
  minSize = 2,
  maxSize = 4,
  lifetime = 3000,
  children,
}: ParticleEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const densityMultiplier = {
    low: 0.5,
    medium: 1,
    high: 2,
  }[density || "medium"];

  const createParticle = (x?: number, y?: number): Particle => ({
    id: Math.random(),
    x: x ?? Math.random() * (containerRef.current?.clientWidth || 0),
    y: y ?? Math.random() * (containerRef.current?.clientHeight || 0),
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    size: minSize + Math.random() * (maxSize - minSize),
    color: colors[Math.floor(Math.random() * colors.length)],
    life: Date.now() + lifetime + Math.random() * 1000,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const actualParticleCount = Math.floor(particleCount * densityMultiplier);
    particlesRef.current = Array.from({ length: actualParticleCount }, () => createParticle());

    const animate = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      const now = Date.now();

      particlesRef.current = particlesRef.current
        .filter(p => p.life > now)
        .map(p => {
          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off walls
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Interactive behavior
          if (interactive) {
            const dx = p.x - mouseX.get();
            const dy = p.y - mouseY.get();
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              p.vx += (dx / distance) * 0.2;
              p.vy += (dy / distance) * 0.2;
            }
          }

          return p;
        });

      // Add new particles to replace expired ones
      while (particlesRef.current.length < actualParticleCount) {
        particlesRef.current.push(createParticle());
      }

      containerRef.current.style.setProperty(
        '--particles',
        particlesRef.current
          .map(p => `${p.x}px ${p.y}px 0 ${p.size}px ${p.color}`)
          .join(',')
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [particleCount, speed, interactive, colors, minSize, maxSize, lifetime, densityMultiplier]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        particleVariants({ variant, density }),
        "before:fixed before:inset-0 before:content-[''] before:shadow-[var(--particles)]",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
} 