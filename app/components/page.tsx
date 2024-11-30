'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Box, Layers, GripHorizontal, Wand2, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const components = [
    {
      name: '3D Card Effect',
      href: '/components/3d-card',
      description: 'A card perspective effect, hover over the card to elevate card elements.',
      icon: <Box className="h-5 w-5" />
    },
    {
      name: 'Perspective Effect',
      href: '/components/perspective',
      description: 'Interactive 3D perspective transformation on hover.',
      icon: <Layers className="h-5 w-5" />
    },
    {
      name: 'Interactive Element',
      href: '/components/interactive',
      description: 'Multi-effect component with tilt, magnetic, glow, and ripple effects.',
      icon: <GripHorizontal className="h-5 w-5" />
    },
    {
      name: 'Advanced Animations',
      href: '/components/advanced-animations',
      description: 'Collection of advanced animations including parallax, reveal, morph effects.',
      icon: <Wand2 className="h-5 w-5" />
    },
    {
      name: 'Aurora Background',
      href: '/components/aurora',
      description: 'Beautiful animated gradient background effect.',
      icon: <Palette className="h-5 w-5" />
    }
  ];

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8 max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-100 font-[var(--font-cal)] mb-2">Components</h1>
            <p className="text-zinc-400 text-lg">Explore our collection of interactive UI components</p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search components..."
              className="w-64 bg-zinc-900/50 border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <motion.div
              key={component.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={component.href}>
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/5 to-zinc-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        {component.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-zinc-100 font-[var(--font-cal)]">{component.name}</h2>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{component.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 