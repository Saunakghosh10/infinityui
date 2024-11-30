'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Github } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { Button } from './button';

const navItems = [
  { name: 'Components', href: '/components' },
  { name: 'Templates', href: '/templates' },
  { name: 'Documentation', href: '/docs' },
  { name: 'Examples', href: '/examples' },
];

export function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-zinc-100">∞ Infinity UI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        items={navItems}
      />
    </header>
  );
} 