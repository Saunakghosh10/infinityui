'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Combobox } from '@/components/ui/combobox';
import { MultiSelect } from '@/components/ui/multi-select';
import { InteractiveElement } from '@/components/ui/interactive-element';
import { AdvancedAnimation } from '@/components/ui/advanced-animations';
import { GestureInteraction } from '@/components/ui/gesture-interactions';

interface ComponentPreviewProps {
  component: string | null;
  components: Record<string, any[]>;
}

export function ComponentPreview({ component, components }: ComponentPreviewProps) {
  if (!component) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Select a component from the sidebar to view its details
      </div>
    );
  }

  // Find the component details
  const componentDetails = Object.values(components)
    .flat()
    .find(item => item.name === component);

  if (!componentDetails) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">{componentDetails.name}</h1>
        <p className="text-zinc-400">{componentDetails.description}</p>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <RenderComponentPreview name={componentDetails.preview} />
        </TabsContent>

        <TabsContent value="code" className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <pre className="text-sm text-zinc-100">
            <code>
              {`// Example usage
import { ${componentDetails.name} } from '@/components/ui/${componentDetails.preview}';

export function Example() {
  return (
    <${componentDetails.name} />
  );
}`}
            </code>
          </pre>
        </TabsContent>

        <TabsContent value="props" className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-100">Properties</h3>
            {/* Add component props documentation here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RenderComponentPreview({ name }: { name: string }) {
  // Add preview renders for each component
  const previews: Record<string, JSX.Element> = {
    button: <Button>Click me</Button>,
    card: <Card className="p-4">Card Content</Card>,
    'interactive-card': (
      <InteractiveElement effects={['tilt', 'magnetic', 'glow']}>
        <div className="p-4">Interactive Card</div>
      </InteractiveElement>
    ),
    // Add more component previews here
  };

  return previews[name] || <div>Preview not available</div>;
} 