'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { ShoppingList } from '@/types';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function HistoryPage() {
    const { fetchArchivedLists } = useStore();
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedList, setExpandedList] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchArchivedLists();
            setLists(data);
            setLoading(false);
        };
        load();
    }, [fetchArchivedLists]);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 pb-24">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Historique des Courses</h1>

            <div className="space-y-4">
                {lists.map((list) => (
                    <div key={list.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <div className="text-left">
                                    <div className="font-medium text-slate-200">{list.name}</div>
                                    <div className="text-sm text-slate-500">
                                        {new Date(list.created_at).toLocaleDateString()} • {list.items?.length || 0} articles
                                    </div>
                                </div>
                            </div>
                            {expandedList === list.id ? (
                                <ChevronUp className="w-5 h-5 text-slate-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-500" />
                            )}
                        </button>

                        {expandedList === list.id && (
                            <div className="p-4 pt-0 border-t border-slate-800/50">
                                <div className="mt-4 space-y-2">
                                    {list.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-slate-300">{item.name}</span>
                                            <span className="text-slate-500">{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {lists.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        Aucune liste archivée.
                    </div>
                )}
            </div>
        </div>
    );
}
