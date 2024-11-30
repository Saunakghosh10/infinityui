import { Inter, Outfit } from 'next/font/google';
import { RootLayoutContent } from '@/components/root-layout-content';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-cal'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${outfit.variable} bg-black antialiased`}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
} 