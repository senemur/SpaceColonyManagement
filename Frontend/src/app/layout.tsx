import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/shared/providers/QueryProvider';
import Navbar from '@/shared/components/Navbar';

export const metadata: Metadata = {
  title: 'Mars Colony Management',
  description: 'Manage your Mars colony, crew, buildings, and exploration in full 3D.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-rose-500 selection:text-white flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1 pt-14 relative flex flex-col">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
