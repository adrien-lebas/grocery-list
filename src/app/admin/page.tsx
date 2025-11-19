'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category, Unit } from '@/types';
import EditModal from '@/components/EditModal';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'ingredients' | 'recurring' | 'stock'>('ingredients');

    return (
        <div className="space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Administration</h2>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800">
                <button
                    onClick={() => setActiveTab('ingredients')}
                    className={cn(
                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === 'ingredients'
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    )}
                >
                    Ingrédients
                </button>
                <button
                    onClick={() => setActiveTab('recurring')}
                    className={cn(
                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === 'recurring'
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    )}
                >
                    Récurrents
                </button>
                <button
                    onClick={() => setActiveTab('stock')}
                    className={cn(
                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                        activeTab === 'stock'
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    )}
                >
                    Stock
                </button>
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                {activeTab === 'ingredients' && <IngredientsManager />}
                {activeTab === 'recurring' && <RecurringManager />}
                {activeTab === 'stock' && <StockManager />}
            </div>
        </div>
    );
}

function IngredientsManager() {
    const { ingredients, removeIngredient, addIngredient, updateIngredient } = useStore();
    const [newIngredient, setNewIngredient] = useState({ name: '', category: 'PROTEIN' as Category, defaultUnit: 'g' as Unit, defaultPortion: 100 });
    const [editingItem, setEditingItem] = useState<any>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addIngredient({
            id: crypto.randomUUID(),
            ...newIngredient
        });
        setNewIngredient({ name: '', category: 'PROTEIN', defaultUnit: 'g', defaultPortion: 100 });
    };

    // Group by category
    const groupedIngredients = ingredients.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof ingredients>);

    return (
        <div className="space-y-8">
            {/* Add Form */}
            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-5 items-end bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nom</label>
                    <input
                        type="text"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                        placeholder="Ex: Poulet"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Catégorie</label>
                    <select
                        value={newIngredient.category}
                        onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value as Category })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                        <option value="PROTEIN">Protéine</option>
                        <option value="VEGETABLE">Légume</option>
                        <option value="STARCH">Féculent</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Portion (pers)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={newIngredient.defaultPortion}
                            onChange={(e) => setNewIngredient({ ...newIngredient, defaultPortion: parseFloat(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors h-[38px]"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Ajouter</span>
                </button>
            </form>

            {/* List */}
            <div className="space-y-6">
                {Object.entries(groupedIngredients).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">{category}</h3>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                                    <div>
                                        <div className="font-medium text-slate-200">{item.name}</div>
                                        <div className="text-xs text-slate-500">
                                            {item.defaultPortion} {item.defaultUnit}/pers
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeIngredient(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <EditModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSave={(data) => updateIngredient(editingItem.id, data)}
                initialData={editingItem}
                type="INGREDIENT"
            />
        </div>
    );
}

function RecurringManager() {
    const { recurringItems, addRecurringItem, removeRecurringItem, updateRecurringItem } = useStore();
    const [newItem, setNewItem] = useState({ name: '', category: 'Frais' });
    const [editingItem, setEditingItem] = useState<any>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addRecurringItem(newItem);
        setNewItem({ name: '', category: 'Frais' });
    };

    const groupedItems = recurringItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof recurringItems>);

    return (
        <div className="space-y-8">
            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-4 items-end bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nom</label>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Catégorie</label>
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                        <option value="Frais">Frais</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Boulangerie">Boulangerie</option>
                        <option value="Charcuterie">Charcuterie</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors h-[38px]"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Ajouter</span>
                </button>
            </form>

            <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">{category}</h3>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                                    <span className="font-medium text-slate-200">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeRecurringItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <EditModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSave={(data) => updateRecurringItem(editingItem.id, data)}
                initialData={editingItem}
                type="RECURRING"
            />
        </div>
    );
}

function StockManager() {
    const { stockItems, addStockItem, removeStockItem, updateStockItem } = useStore();
    const [newItem, setNewItem] = useState({ name: '', category: 'Entretien' });
    const [editingItem, setEditingItem] = useState<any>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addStockItem(newItem);
        setNewItem({ name: '', category: 'Entretien' });
    };

    const groupedItems = stockItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof stockItems>);

    return (
        <div className="space-y-8">
            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-4 items-end bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nom</label>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Catégorie</label>
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                        <option value="Entretien">Entretien</option>
                        <option value="Hygiène">Hygiène</option>
                        <option value="Épices/Condiments">Épices/Condiments</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors h-[38px]"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Ajouter</span>
                </button>
            </form>

            <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">{category}</h3>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                                    <span className="font-medium text-slate-200">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeStockItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <EditModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSave={(data) => updateStockItem(editingItem.id, data)}
                initialData={editingItem}
                type="STOCK"
            />
        </div>
    );
}
