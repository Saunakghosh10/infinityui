'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Terminal, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const installCommands = {
  npm: 'npm install infinity-ui',
  yarn: 'yarn add infinity-ui',
  pnpm: 'pnpm add infinity-ui'
};

const cliCommands = {
  create: 'npx create-infinity-ui@latest',
  component: 'npx infinity-ui add button',
  theme: 'npx infinity-ui theme custom',
};

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="props">Props</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            {/* Preview content */}
          </TabsContent>

          <TabsContent value="code" className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            {/* Code content */}
          </TabsContent>

          <TabsContent value="props" className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            {/* Props content */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 