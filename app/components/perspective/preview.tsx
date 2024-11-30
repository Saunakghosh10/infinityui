'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerspectiveGrid } from '@/components/ui/perspective-grid';

export function PerspectivePreview() {
  const [activeTab, setActiveTab] = useState('basic');

  const examples = {
    basic: {
      title: "Basic Grid",
      description: "Simple perspective grid with hover effects",
      props: {
        itemCount: 16,
        gap: 20,
      }
    },
    gallery: {
      title: "Gallery Grid",
      description: "Dense layout for image galleries",
      props: {
        itemCount: 25,
        gap: 15,
      }
    },
    feature: {
      title: "Feature Grid",
      description: "Strong perspective for highlighting features",
      props: {
        itemCount: 9,
        gap: 25,
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(examples).map(([key, { title }]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(examples).map(([key, example]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-zinc-100">{example.title}</h3>
                <p className="text-xs text-zinc-400">{example.description}</p>
              </div>
              <PerspectiveGrid 
                {...example.props}
                className="w-full aspect-[16/9]"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 