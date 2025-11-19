'use client';

import { useState } from 'react';
import { Category, Unit } from '@/types';
import { useStore } from '@/store/useStore';
import { Check } from 'lucide-react';

interface IngredientSelectorProps {
    category: Category;
    selectedId: string | null;
    quantity: number;
    onSelect: (id: string) => void;
    label: string;
}

export default function IngredientSelector({
    category,
    selectedId,
    quantity,
    onSelect,
    label,
}: IngredientSelectorProps) {
    const { ingredients, addIngredient } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientUnit, setNewIngredientUnit] = useState<Unit>('g');

    const categoryIngredients = ingredients.filter((i) => i.category === category);
    const selectedIngredient = ingredients.find((i) => i.id === selectedId);

    const handleCreate = () => {
        if (!newIngredientName.trim()) return;
        const newId = crypto.randomUUID();
        addIngredient({
            id: newId,
            name: newIngredientName,
            category,
            defaultUnit: newIngredientUnit,
        });
        onSelect(newId);
        setIsCreating(false);
        setNewIngredientName('');
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>

            {!isCreating ? (
                <div className="flex gap-2">
                    <select
                        className="flex-1 bg-slate-800 border-slate-700 text-slate-200 rounded-md text-sm p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedId || ''}
                        onChange={(e) => {
                            if (e.target.value === 'NEW') {
                                setIsCreating(true);
                            } else {
                                const id = e.target.value;
                                onSelect(id);
                            }
                        }}
                    >
                        <option value="">Choisir...</option>
                        {categoryIngredients.map((i) => (
                            <option key={i.id} value={i.id}>
                                {i.name}
                            </option>
                        ))}
                        <option value="NEW" className="font-bold text-blue-400">+ Nouveau...</option>
                    </select>

                    {selectedId && (
                        <div className="flex items-center gap-1 bg-slate-800/50 rounded-md border border-slate-700/50 px-3 py-2 min-w-[80px] justify-end">
                            <span className="font-mono font-medium text-slate-300">{quantity}</span>
                            <span className="text-xs text-slate-500">{selectedIngredient?.defaultUnit}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-800 border-slate-700 rounded-md text-sm p-2 outline-none focus:border-blue-500"
                            placeholder="Nom de l'ingrédient"
                            value={newIngredientName}
                            onChange={(e) => setNewIngredientName(e.target.value)}
                            autoFocus
                        />
                        <select
                            className="w-20 bg-slate-800 border-slate-700 rounded-md text-sm p-2 outline-none"
                            value={newIngredientUnit}
                            onChange={(e) => setNewIngredientUnit(e.target.value as Unit)}
                        >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="unit">unit</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded-md flex items-center justify-center gap-1"
                        >
                            <Check className="w-3 h-3" /> Créer
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs py-1.5 rounded-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
