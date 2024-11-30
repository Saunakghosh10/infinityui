'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from '@/components/ui/copy-button';

const codeExamples = {
  component: `import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function PerspectiveGrid({
  intensity = 'medium',
  itemCount = 16,
  gap = 20,
  hover = true,
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  return (
    <motion.div
      className="perspective-grid"
      onMouseMove={(e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - (left + width / 2));
        mouseY.set(e.clientY - (top + height / 2));
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Grid items */}
    </motion.div>
  );
}`,
  
  usage: `import { PerspectiveGrid } from '@/components/ui/perspective-grid';

export default function MyComponent() {
  return (
    <PerspectiveGrid
      intensity="medium"
      itemCount={16}
      gap={20}
      hover={true}
    />
  );
}`,

  styles: `// Tailwind CSS classes
const styles = {
  container: "relative h-[500px] bg-zinc-900/50 rounded-lg overflow-hidden",
  grid: "grid auto-rows-fr gap-4",
  item: "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg",
  hover: "hover:scale-110 hover:rotate-3 hover:bg-white/10",
};`
};

export function PerspectiveCode() {
  const [activeTab, setActiveTab] = useState('component');

  return (
    <div className="relative">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="component">Component</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        {Object.entries(codeExamples).map(([key, code]) => (
          <TabsContent key={key} value={key} className="relative mt-4">
            <div className="relative">
              <CopyButton 
                value={code}
                className="absolute right-4 top-4"
              />
              <pre className="p-4 rounded-lg bg-zinc-900 overflow-x-auto">
                <code className="text-sm text-zinc-100">{code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 