import { useState } from 'react';
import { X } from 'lucide-react';
import { Ingredient, RecurringItem, StockItem, Category, Unit } from '@/types';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Ingredient & RecurringItem & StockItem>) => void;
    initialData: Partial<Ingredient & RecurringItem & StockItem>;
    type: 'INGREDIENT' | 'RECURRING' | 'STOCK';
}

export default function EditModal({ isOpen, onClose, onSave, initialData, type }: EditModalProps) {
    const [formData, setFormData] = useState(initialData || {});



    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-100">Modifier l&apos;élément</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nom</label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Catégorie</label>
                        <select
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                            required
                        >
                            {type === 'INGREDIENT' && (
                                <>
                                    <option value="PROTEIN">Protéine</option>
                                    <option value="VEGETABLE">Légume</option>
                                    <option value="STARCH">Féculent</option>
                                </>
                            )}
                            {type === 'RECURRING' && (
                                <>
                                    <option value="Frais">Frais</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Boulangerie">Boulangerie</option>
                                    <option value="Charcuterie">Charcuterie</option>
                                    <option value="Autre">Autre</option>
                                </>
                            )}
                            {type === 'STOCK' && (
                                <>
                                    <option value="Entretien">Entretien</option>
                                    <option value="Hygiène">Hygiène</option>
                                    <option value="Épices/Condiments">Épices/Condiments</option>
                                    <option value="Autre">Autre</option>
                                </>
                            )}
                        </select>
                    </div>

                    {type === 'INGREDIENT' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Portion par pers.</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.defaultPortion || ''}
                                    onChange={(e) => setFormData({ ...formData, defaultPortion: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Unité</label>
                                <select
                                    value={formData.defaultUnit || 'unit'}
                                    onChange={(e) => setFormData({ ...formData, defaultUnit: e.target.value as Unit })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="g">Grammes (g)</option>
                                    <option value="ml">Millilitres (ml)</option>
                                    <option value="unit">Unité</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
