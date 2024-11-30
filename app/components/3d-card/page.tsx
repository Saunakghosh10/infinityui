'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PerspectiveEffect } from '@/components/ui/3d-effects';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function ThreeDCardPage() {
  const [variant, setVariant] = useState<'default' | 'glass' | 'minimal'>('default');
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium');
  const [copied, setCopied] = useState(false);

  // Example content for cards
  const cardContents = [
    {
      title: "Default Style",
      description: "Standard dark theme card with subtle border",
      image: "/card-preview-1.jpg"
    },
    {
      title: "Glass Effect",
      description: "Frosted glass effect with blur and transparency",
      image: "/card-preview-2.jpg"
    },
    {
      title: "Minimal Design",
      description: "Clean, borderless design focusing on content",
      image: "/card-preview-3.jpg"
    }
  ];

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">3D Card Effect</h1>
        <p className="text-sm text-zinc-400 max-w-2xl mb-6">
          Interactive cards with realistic 3D perspective transformation. Choose from different styles and intensities to match your design needs.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Style</label>
            <div className="flex gap-1.5">
              {['default', 'glass', 'minimal'].map((v) => (
                <Button
                  key={v}
                  variant={variant === v ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVariant(v as typeof variant)}
                  className="capitalize text-xs px-2.5 py-1"
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Intensity</label>
            <div className="flex gap-1.5">
              {['subtle', 'medium', 'strong'].map((i) => (
                <Button
                  key={i}
                  variant={intensity === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIntensity(i as typeof intensity)}
                  className="capitalize text-xs px-2.5 py-1"
                >
                  {i}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cardContents.map((content, index) => (
            <PerspectiveEffect
              key={index}
              variant={variant}
              intensity={intensity}
              className="h-[300px]"
            >
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">{content.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{content.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <Button size="sm" variant="outline">Learn More</Button>
                  <span className="text-xs text-zinc-500">Hover to interact</span>
                </div>
              </div>
            </PerspectiveEffect>
          ))}
        </div>

        {/* Documentation Tabs */}
        <div className="max-w-5xl mx-auto mt-16">
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="props">Props</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              {/* Current preview content */}
            </TabsContent>

            <TabsContent value="installation">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Installation</h3>
                
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 mb-2">1. Install dependencies:</p>
                  <div className="relative">
                    <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-zinc-100">npm install framer-motion class-variance-authority tailwind-merge</code>
                    </pre>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-2 top-2"
                      onClick={() => {
                        navigator.clipboard.writeText('npm install framer-motion class-variance-authority tailwind-merge');
                        // Add copy feedback
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 mb-2">2. Add the component to your project:</p>
                  <div className="relative">
                    <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm text-zinc-100">{`import { PerspectiveEffect } from '@/components/ui/3d-effects';`}</code>
                    </pre>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-2 top-2"
                      onClick={() => {
                        navigator.clipboard.writeText("import { PerspectiveEffect } from '@/components/ui/3d-effects';");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-100">Usage Example</h3>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(usageExample);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-zinc-100">
{`import { PerspectiveEffect } from '@/components/ui/3d-effects';

export default function MyComponent() {
  return (
    <PerspectiveEffect
      variant="default"    // 'default' | 'glass' | 'minimal'
      intensity="medium"   // 'subtle' | 'medium' | 'strong'
      className="w-full max-w-md"
      glare              // Optional glare effect
      shadow            // Optional shadow effect
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold">Card Title</h3>
        <p>Your content goes here...</p>
      </div>
    </PerspectiveEffect>
  );}`}
                  </code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="props">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Props</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2 px-4 text-zinc-100">Prop</th>
                      <th className="text-left py-2 px-4 text-zinc-100">Type</th>
                      <th className="text-left py-2 px-4 text-zinc-100">Default</th>
                      <th className="text-left py-2 px-4 text-zinc-100">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-4 text-zinc-100">variant</td>
                      <td className="py-2 px-4 text-zinc-400">default | glass | minimal</td>
                      <td className="py-2 px-4 text-zinc-400">default</td>
                      <td className="py-2 px-4 text-zinc-400">Visual style of the card</td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-2 px-4 text-zinc-100">intensity</td>
                      <td className="py-2 px-4 text-zinc-400">subtle | medium | strong</td>
                      <td className="py-2 px-4 text-zinc-400">medium</td>
                      <td className="py-2 px-4 text-zinc-400">Strength of the 3D effect</td>
                    </tr>
                    {/* Add more props... */}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 