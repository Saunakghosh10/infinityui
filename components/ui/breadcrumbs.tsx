'use client';

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      <Link
        href="/"
        className="flex items-center text-zinc-500 hover:text-zinc-100 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <motion.div
          key={item.href}
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ChevronRight className="h-4 w-4 text-zinc-500" />
          <Link
            href={item.href}
            className={cn(
              "ml-1 hover:text-zinc-100 transition-colors",
              index === items.length - 1
                ? "text-zinc-100 pointer-events-none"
                : "text-zinc-500"
            )}
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
} 