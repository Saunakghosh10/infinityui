'use client';

import { PerspectiveGrid } from '@/components/ui/perspective-grid';

export function PerspectiveExamples() {
  return (
    <div className="space-y-8">
      {/* Basic Grid */}
      <PerspectiveGrid 
        intensity="medium"
        itemCount={16}
        gap={20}
        className="w-full max-w-2xl mx-auto"
      />

      {/* Dense Grid */}
      <PerspectiveGrid 
        intensity="subtle"
        itemCount={25}
        gap={15}
        className="w-full max-w-2xl mx-auto"
      />

      {/* Intense Grid */}
      <PerspectiveGrid 
        intensity="strong"
        itemCount={9}
        gap={25}
        className="w-full max-w-2xl mx-auto"
      />
    </div>
  );
} 