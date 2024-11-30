'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Box, 
  Layers, 
  GripHorizontal,
  Wand2,
  Palette,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const components = [
  {
    title: 'Interactive Elements',
    items: [
      {
        name: '3D Card Effect',
        href: '/components/3d-card',
        description: 'A card with perspective effect on hover.',
        icon: <Box className="h-4 w-4" />
      },
      {
        name: 'Perspective Effect',
        href: '/components/perspective',
        description: 'Interactive 3D perspective transformation.',
        icon: <Layers className="h-4 w-4" />
      },
      {
        name: 'Interactive Element',
        href: '/components/interactive',
        description: 'Multi-effect component with various interactions.',
        icon: <GripHorizontal className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'Animations',
    items: [
      {
        name: 'Advanced Animations',
        href: '/components/advanced-animations',
        description: 'Collection of advanced animations including parallax, reveal, morph effects.',
        icon: <Wand2 className="h-4 w-4" />
      }
    ]
  },
  {
    title: 'Effects',
    items: [
      {
        name: 'Aurora Background',
        href: '/components/aurora',
        description: 'Beautiful animated gradient background effect.',
        icon: <Palette className="h-4 w-4" />
      }
    ]
  }
];

export default function ComponentsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 z-50 flex items-center px-2">
        <Link href="/" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span className="font-medium text-xs">Infinity UI</span>
        </Link>
      </header>

      <div className="pt-10  flex">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-1.5 right-2 z-50 lg:hidden"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
        </Button>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 'auto' : '0px',
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "fixed top-10 left-0 h-[calc(100vh-2.5rem)] bg-zinc-900/50 border-r border-zinc-800 backdrop-blur-xl",
            "lg:sticky lg:block",
            isSidebarOpen ? "w-52" : "w-0"
          )}
        >
          {/* <div className="p-2 h-full overflow-y-auto">
            <nav className="space-y-6">
              {components.map((category) => (
                <div key={category.title} className="space-y-2">
                  <h3 className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{category.title}</h3>
                  <ul className="space-y-0.5">
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] transition-all duration-200",
                            pathname === item.href
                              ? "bg-zinc-800/50 text-zinc-100"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
                          )}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div> */}
        </motion.aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-2.5rem)] transition-all duration-300",
          isSidebarOpen ? "lg:ml-0" : "ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
} 