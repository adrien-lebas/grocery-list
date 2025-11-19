'use client';

import { useStore } from '@/store/useStore';
import { Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StockList() {
    const { stockItems, toggleStockStatus } = useStore();

    const groupedItems = stockItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof stockItems>);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Gestion du Stock</h2>
                <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-2 text-emerald-400">
                        <Package className="w-4 h-4" /> En stock
                    </span>
                    <span className="flex items-center gap-2 text-amber-400">
                        <ShoppingCart className="w-4 h-4" /> À acheter
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="font-semibold text-lg mb-4 text-blue-400">{category}</h3>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => toggleStockStatus(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-lg border transition-all group",
                                        item.status === 'IN_STOCK'
                                            ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-100 hover:border-emerald-800"
                                            : "bg-amber-950/30 border-amber-900/50 text-amber-100 hover:border-amber-800"
                                    )}
                                >
                                    <span className="font-medium">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                                            item.status === 'IN_STOCK'
                                                ? "bg-emerald-900/50 text-emerald-400"
                                                : "bg-amber-900/50 text-amber-400"
                                        )}>
                                            {item.status === 'IN_STOCK' ? 'En Stock' : 'À Acheter'}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
