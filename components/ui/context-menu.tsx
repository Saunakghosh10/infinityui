'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientWrapper } from '@/components/client-wrapper';

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  items?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate position, ensuring menu stays within viewport
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 200);

    setPosition({ x, y });
    setIsOpen(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isOpen]);

  const MenuItem = ({ item, depth = 0 }: { item: ContextMenuItem; depth?: number }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const hasSubmenu = item.items && item.items.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => {
          setActiveSubmenu(item.label);
          setIsSubMenuOpen(true);
        }}
        onMouseLeave={() => {
          setActiveSubmenu(null);
          setIsSubMenuOpen(false);
        }}
      >
        <button
          onClick={() => {
            if (!hasSubmenu && item.onClick) {
              item.onClick();
              setIsOpen(false);
            }
          }}
          disabled={item.disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm",
            "hover:bg-zinc-800/50 hover:text-zinc-100",
            "focus:bg-zinc-800/50 focus:outline-none",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            <span>{item.label}</span>
          </span>
          <span className="flex items-center gap-2">
            {item.shortcut && (
              <span className="text-xs text-zinc-500">{item.shortcut}</span>
            )}
            {hasSubmenu && <ChevronRight className="h-4 w-4" />}
          </span>
        </button>

        <AnimatePresence>
          {hasSubmenu && isSubMenuOpen && activeSubmenu === item.label && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-full top-0 ml-1"
            >
              <div className="rounded-md border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-sm">
                {item.items.map((subItem) => (
                  <MenuItem key={subItem.label} item={subItem} depth={depth + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <ClientWrapper>
      <div ref={containerRef} onContextMenu={handleContextMenu} className={className}>
        {children}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                zIndex: 1000,
              }}
              className="w-56 rounded-md border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-sm shadow-lg"
            >
              {items.map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClientWrapper>
  );
}
