'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ name: string; href: string; }>;
}

export function MobileNav({ isOpen, onClose, items }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-[300px] bg-zinc-900/90 border-l border-zinc-800 backdrop-blur-lg z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <span className="text-zinc-100 font-semibold">Menu</span>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="p-4">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-zinc-400 hover:text-zinc-100 transition-colors"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 