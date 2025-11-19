'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShoppingCart, Calendar, Repeat, Archive, History } from "lucide-react";
import { usePathname } from "next/navigation";

import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { fetchInitialData } = useStore();

  useEffect(() => {
    fetchInitialData();

    const channels = [
      supabase.channel('ingredients-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ingredients' }, () => fetchInitialData())
        .subscribe(),
      supabase.channel('menus-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menus' }, () => fetchInitialData())
        .subscribe(),
      supabase.channel('recurring-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'recurring_items' }, () => fetchInitialData())
        .subscribe(),
      supabase.channel('stock-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_items' }, () => fetchInitialData())
        .subscribe(),
      supabase.channel('surplus-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'surplus_items' }, () => fetchInitialData())
        .subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [fetchInitialData]);

  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}>
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-blue-400 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>GroceryMgr</span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link href="/" className={`hover:text-blue-400 transition-colors flex items-center gap-2 ${pathname === '/' ? 'text-blue-400' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Menus</span>
              </Link>
              <Link href="/recurring" className={`hover:text-blue-400 transition-colors flex items-center gap-2 ${pathname === '/recurring' ? 'text-blue-400' : ''}`}>
                <Repeat className="w-4 h-4" />
                <span className="hidden sm:inline">Récurrent</span>
              </Link>
              <Link href="/stock" className={`hover:text-blue-400 transition-colors flex items-center gap-2 ${pathname === '/stock' ? 'text-blue-400' : ''}`}>
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">Stock</span>
              </Link>
              <Link href="/list" className={`hover:text-blue-400 transition-colors flex items-center gap-2 ${pathname === '/list' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : ''} px-3 py-1.5 rounded-full border border-transparent`}>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Liste</span>
              </Link>
              <Link href="/history" className={`hover:text-blue-400 transition-colors flex items-center gap-2 ${pathname === '/history' ? 'text-blue-400' : ''}`}>
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Historique</span>
              </Link>
              <Link href="/admin" className={`hover:text-blue-400 transition-colors ml-4 ${pathname === '/admin' ? 'text-blue-400' : ''}`}>
                Admin
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
