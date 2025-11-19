'use client';

import { useStore } from '@/store/useStore';
import IngredientSelector from './IngredientSelector';
import { Menu } from '@/types';

export default function MenuPlanner() {
    const { menus, ingredients, updateMenu } = useStore();

    const handleUpdate = (menuId: string, field: keyof Menu, value: string | null) => {
        const menu = menus.find(m => m.id === menuId);
        if (!menu) return;

        const updates: Partial<Menu> = { [field]: value };
        let newQuantities = { ...menu.quantities };

        // Check if we are updating an ingredient field
        if (field === 'proteinId' || field === 'vegetableId' || field === 'starchId') {
            // 1. Remove old ingredient quantity if it exists
            const oldId = menu[field];
            if (oldId) {
                delete newQuantities[oldId];
            }

            // 2. Add new ingredient quantity if a new one is selected
            if (value) {
                const ingredient = ingredients.find(i => i.id === value);
                if (ingredient?.defaultPortion) {
                    const qty = ingredient.defaultPortion * 3 * 2;
                    newQuantities[value] = qty;
                }
            }

            updates.quantities = newQuantities;
        }

        updateMenu(menuId, updates);
    };



    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Menus de la semaine</h2>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                    5 Repas
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menus.map((menu) => (
                    <div
                        key={menu.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all"
                    >
                        <h3 className="font-semibold text-lg mb-4 text-blue-400">{menu.name}</h3>

                        <div className="space-y-3">
                            <IngredientSelector
                                label="Protéine"
                                category="PROTEIN"
                                selectedId={menu.proteinId}
                                quantity={menu.proteinId ? (menu.quantities[menu.proteinId] || 0) : 0}
                                onSelect={(id) => handleUpdate(menu.id, 'proteinId', id)}
                            />

                            <IngredientSelector
                                label="Légume"
                                category="VEGETABLE"
                                selectedId={menu.vegetableId}
                                quantity={menu.vegetableId ? (menu.quantities[menu.vegetableId] || 0) : 0}
                                onSelect={(id) => handleUpdate(menu.id, 'vegetableId', id)}
                            />

                            <IngredientSelector
                                label="Féculent"
                                category="STARCH"
                                selectedId={menu.starchId}
                                quantity={menu.starchId ? (menu.quantities[menu.starchId] || 0) : 0}
                                onSelect={(id) => handleUpdate(menu.id, 'starchId', id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
