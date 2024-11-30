'use client';

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DropdownItem {
  name: string;
  href: string;
  description?: string;
}

interface DropdownMenuProps {
  trigger: string;
  items: DropdownItem[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button
        className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
      >
        {trigger}
        <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-zinc-800 bg-zinc-900/90 backdrop-blur-lg p-2 z-50"
          >
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md p-2 hover:bg-zinc-800/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-zinc-100 font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-zinc-400 mt-1">{item.description}</div>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
