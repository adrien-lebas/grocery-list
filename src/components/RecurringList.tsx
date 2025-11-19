'use client';

import { useStore } from '@/store/useStore';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecurringList() {
    const { recurringItems, toggleRecurringItem } = useStore();

    // Group by category
    const groupedItems = recurringItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof recurringItems>);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Achats Récurrents</h2>
                <span className="text-sm text-slate-400">
                    {recurringItems.filter(i => i.isSelected).length} sélectionnés
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="font-semibold text-lg mb-4 text-blue-400">{category}</h3>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleRecurringItem(item.id)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                                        item.isSelected
                                            ? "bg-blue-900/20 border-blue-500/50 text-blue-100"
                                            : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                            item.isSelected
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-slate-600"
                                        )}>
                                            {item.isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
