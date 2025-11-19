'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Check, Plus, Trash2, ShoppingCart, RefreshCw, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShoppingList() {
    const {
        menus,
        ingredients,
        recurringItems,
        stockItems,
        surplusItems,
        addSurplusItem,
        toggleSurplusItem,
        removeSurplusItem,
        resetList,
        archiveCurrentList
    } = useStore();

    const [newSurplus, setNewSurplus] = useState('');

    // 1. Calculate Menu Ingredients
    const menuIngredients = menus.reduce((acc, menu) => {
        Object.entries(menu.quantities).forEach(([ingId, qty]) => {
            if (qty > 0) {
                const ingredient = ingredients.find(i => i.id === ingId);
                if (ingredient) {
                    if (!acc[ingredient.name]) {
                        acc[ingredient.name] = { ...ingredient, totalQty: 0 };
                    }
                    acc[ingredient.name].totalQty += qty;
                }
            }
        });
        return acc;
    }, {} as Record<string, { id: string; name: string; category: string; defaultUnit: string; totalQty: number }>);

    // 2. Get Recurring Items (Selected)
    const selectedRecurring = recurringItems.filter(i => i.isSelected);

    // 3. Get Stock Items (To Buy)
    const stockToBuy = stockItems.filter(i => i.status === 'TO_BUY');

    const handleAddSurplus = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSurplus.trim()) {
            addSurplusItem(newSurplus.trim());
            setNewSurplus('');
        }
    };

    const handleArchive = async () => {
        const name = prompt('Nom de la liste (ex: Courses du 19/11) :', `Courses du ${new Date().toLocaleDateString()}`);
        if (!name) return;

        // Calculate all items to save
        const itemsToSave = [
            ...Object.values(menuIngredients).map(i => ({ name: i.name, category: i.category, quantity: `${i.totalQty} ${i.defaultUnit}`, checked: false })),
            ...selectedRecurring.map(i => ({ name: i.name, category: i.category, quantity: '1', checked: false })),
            ...stockToBuy.map(i => ({ name: i.name, category: i.category, quantity: '1', checked: false })),
            ...surplusItems.map(i => ({ name: i.name, category: 'Autre', quantity: '1', checked: i.checked }))
        ];

        try {
            await archiveCurrentList(name, itemsToSave);
            alert('Liste sauvegardée et archivée !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la sauvegarde.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Liste de Courses</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleArchive}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors"
                        title="Sauvegarder et Nouvelle Liste"
                    >
                        <Save className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Voulez-vous vraiment réinitialiser la liste de courses ? (Les menus seront conservés)')) {
                                resetList();
                            }
                        }}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors"
                        title="Tout effacer"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className="bg-blue-900/30 text-blue-300 px-4 py-2 rounded-lg border border-blue-800 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-bold">
                            {Object.keys(menuIngredients).length + selectedRecurring.length + stockToBuy.length + surplusItems.length} articles
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Generated Lists */}
                <div className="space-y-6">

                    {/* Menu Ingredients */}
                    {Object.keys(menuIngredients).length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <h3 className="font-semibold text-lg mb-4 text-blue-400 border-b border-slate-800 pb-2">
                                Ingrédients Menus
                            </h3>
                            <ul className="space-y-2">
                                {Object.values(menuIngredients).map((item) => (
                                    <li key={item.id} className="flex justify-between text-slate-300">
                                        <span>{item.name}</span>
                                        <span className="text-slate-500 font-mono">
                                            {item.totalQty} {item.defaultUnit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recurring Items */}
                    {selectedRecurring.length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <h3 className="font-semibold text-lg mb-4 text-purple-400 border-b border-slate-800 pb-2">
                                Récurrents
                            </h3>
                            <ul className="space-y-2">
                                {selectedRecurring.map((item) => (
                                    <li key={item.id} className="text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Stock Items */}
                    {stockToBuy.length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <h3 className="font-semibold text-lg mb-4 text-amber-400 border-b border-slate-800 pb-2">
                                Stock à racheter
                            </h3>
                            <ul className="space-y-2">
                                {stockToBuy.map((item) => (
                                    <li key={item.id} className="text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column: Surplus & Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="font-semibold text-lg mb-4 text-emerald-400 border-b border-slate-800 pb-2">
                            Surplus / Autres
                        </h3>

                        <form onSubmit={handleAddSurplus} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSurplus}
                                onChange={(e) => setNewSurplus(e.target.value)}
                                placeholder="Ajouter un article..."
                                className="flex-1 bg-slate-800 border-slate-700 rounded-md text-sm p-2 outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-md"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <ul className="space-y-2">
                            {surplusItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between group">
                                    <button
                                        onClick={() => toggleSurplusItem(item.id)}
                                        className={cn(
                                            "flex items-center gap-3 text-left flex-1 transition-all",
                                            item.checked ? "text-slate-600 line-through" : "text-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border flex items-center justify-center",
                                            item.checked ? "bg-emerald-900 border-emerald-800" : "border-slate-600"
                                        )}>
                                            {item.checked && <Check className="w-3 h-3 text-emerald-500" />}
                                        </div>
                                        {item.name}
                                    </button>
                                    <button
                                        onClick={() => removeSurplusItem(item.id)}
                                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                            {surplusItems.length === 0 && (
                                <li className="text-slate-600 italic text-sm text-center py-4">
                                    Aucun surplus pour le moment
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
