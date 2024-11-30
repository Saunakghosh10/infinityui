'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerspectivePreview } from './preview';
import { PerspectiveCode } from './code';
import { ClientWrapper } from '@/components/client-wrapper';

export default function PerspectiveEffectPage() {
  const documentation = {
    installation: {
      title: "Installation",
      content: [
        {
          step: "1. Install the required dependencies:",
          code: "npm install framer-motion",
          language: "bash"
        },
        {
          step: "2. Copy the components:",
          code: `components/
  └── ui/
      └── perspective-grid.tsx`,
          language: "bash"
        },
        {
          step: "3. Import and use:",
          code: `import { PerspectiveGrid } from '@/components/ui/perspective-grid';

export default function MyComponent() {
  return (
    <PerspectiveGrid
      itemCount={16}
      gap={20}
    />
  );
}`,
          language: "tsx"
        }
      ]
    },
    props: {
      title: "Props",
      headers: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["children", "React.ReactNode", "-", "Optional content to render inside grid items"],
        ["className", "string", "-", "Additional CSS classes"],
        ["itemCount", "number", "16", "Number of grid items"],
        ["gap", "number", "20", "Gap between grid items"],
        ["hover", "boolean", "true", "Enable/disable hover effects"]
      ]
    }
  };

  return (
    <ClientWrapper>
      <div className="p-3">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold text-zinc-100 mb-2">Perspective Grid Effect</h1>
          <p className="text-xs text-zinc-400 max-w-2xl mb-4">
            Interactive 3D grid with dynamic perspective transformation. Move your mouse to control the perspective.
          </p>

          {/* Documentation Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="props">Props</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <PerspectivePreview />
              </TabsContent>

              <TabsContent value="installation" className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">{documentation.installation.title}</h3>
                  {documentation.installation.content.map((item, index) => (
                    <div key={index} className="space-y-2 mb-6 last:mb-0">
                      <p className="text-sm text-zinc-400">{item.step}</p>
                      <div className="relative">
                        <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm text-zinc-100">{item.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <PerspectiveCode />
              </TabsContent>

              <TabsContent value="props" className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">{documentation.props.title}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          {documentation.props.headers.map((header, index) => (
                            <th key={index} className="text-left py-2 px-4 text-zinc-100">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {documentation.props.rows.map((row, index) => (
                          <tr key={index} className="border-b border-zinc-800">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="py-2 px-4 text-zinc-400">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-100 mb-2">Interactive Grid</h3>
              <p className="text-xs text-zinc-400">Perfect for product showcases, portfolios, or image galleries.</p>
            </div>

            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-100 mb-2">Dynamic Layout</h3>
              <p className="text-xs text-zinc-400">Responsive grid system with smooth animations and interactions.</p>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
} 