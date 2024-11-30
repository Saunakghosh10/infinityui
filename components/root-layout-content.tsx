'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex min-h-screen">
      {!isHomePage && <Sidebar />}
      <div className={cn(
        "flex-1",
        !isHomePage && "ml-64"
      )}>
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  );
} 