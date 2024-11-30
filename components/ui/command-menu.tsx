'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientWrapper } from '@/components/client-wrapper';

interface CommandItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  shortcut?: string[];
  onSelect?: () => void;
}

interface CommandMenuProps {
  items: CommandItem[];
  placeholder?: string;
  shortcut?: string[];
}

export function CommandMenu({ 
  items,
  placeholder = "Type a command or search...",
  shortcut = ["⌘", "K"]
}: CommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        filteredItems[selectedIndex]?.onSelect?.();
        setIsOpen(false);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ClientWrapper>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-400 backdrop-blur-sm transition-colors hover:text-zinc-100"
      >
        <Command className="h-4 w-4" />
        <span className="hidden sm:inline-block">Command Menu</span>
        <div className="hidden sm:flex items-center gap-1">
          {shortcut.map((key, i) => (
            <kbd
              key={i}
              className="rounded border border-zinc-800 bg-zinc-900 px-1.5 text-xs"
            >
              {key}
            </kbd>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-sm z-50"
            >
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Search className="h-5 w-5 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>

              <div className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.onSelect?.();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      index === selectedIndex ? "bg-zinc-800/50 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                    )}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-zinc-500">{item.description}</div>
                      )}
                    </div>
                    {item.shortcut && (
                      <div className="flex items-center gap-1">
                        {item.shortcut.map((key, i) => (
                          <kbd
                            key={i}
                            className="rounded border border-zinc-700 bg-zinc-800 px-1.5 text-xs"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ClientWrapper>
  );
} 