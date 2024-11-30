'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Boxes,
  Layers,
  MousePointerClick,
  Sparkles,
  Palette,
  Infinity as InfinityIcon
} from 'lucide-react';

const menuItems = [
  {
    title: 'INTERACTIVE ELEMENTS',
    items: [
      {
        name: '3D Card Effect',
        href: '/components/3d-card',
        icon: <Boxes className="h-4 w-4" />
      },
      {
        name: 'Perspective Effect',
        href: '/components/perspective',
        icon: <Layers className="h-4 w-4" />
      },
      {
        name: 'Interactive Element',
        href: '/components/interactive',
        icon: <MousePointerClick className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'ANIMATIONS',
    items: [
      {
        name: 'Advanced Animations',
        href: '/components/animations',
        icon: <Sparkles className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'EFFECTS',
    items: [
      {
        name: 'Aurora Background',
        href: '/components/aurora',
        icon: <Palette className="h-4 w-4" />
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800/50 z-50">
      <div className="p-4 border-b border-zinc-800/50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-100 hover:text-white transition-colors"
        >
          <InfinityIcon className="h-5 w-5" />
          <span className="font-semibold">Infinity UI</span>
        </Link>
      </div>
      <nav className="p-4 space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-[11px] font-medium text-zinc-400 tracking-wider">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors relative group",
                        isActive 
                          ? "text-white bg-zinc-800/50" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-zinc-800/50 rounded-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {item.icon}
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
} 