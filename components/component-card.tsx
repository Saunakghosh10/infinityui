'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ComponentCardProps {
  name: string;
  description: string;
  href: string;
}

export function ComponentCard({ name, description, href }: ComponentCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="p-6 h-full bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2 text-zinc-100">{name}</h3>
            <p className="text-sm text-zinc-400 flex-grow">{description}</p>
            <div className="flex items-center mt-4 text-zinc-500 text-sm">
              <span>View component</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
} 