'use client';

import { cn } from '@/lib/utils';

interface ComponentNavProps {
  components: Record<string, any[]>;
  selectedComponent: string | null;
  onSelectComponent: (component: string) => void;
}

export function ComponentNav({ 
  components, 
  selectedComponent, 
  onSelectComponent 
}: ComponentNavProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-zinc-100 mb-4">Components</h2>
      <nav className="space-y-6">
        {Object.entries(components).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">{category}</h3>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onSelectComponent(item.name)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm',
                      selectedComponent === item.name
                        ? 'bg-zinc-800/50 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-100'
                    )}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
} 