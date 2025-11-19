import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Ingredient, Menu, RecurringItem, StockItem, SurplusItem, ShoppingList } from '@/types';

interface AppState {
    ingredients: Ingredient[];
    menus: Menu[];
    recurringItems: RecurringItem[];
    stockItems: StockItem[];
    surplusItems: SurplusItem[];
    isLoading: boolean;

    // Actions
    fetchInitialData: () => Promise<void>;

    updateMenu: (menuId: string, updates: Partial<Menu>) => Promise<void>;

    toggleRecurringItem: (itemId: string) => Promise<void>;

    toggleStockStatus: (itemId: string) => Promise<void>;

    addSurplusItem: (name: string) => Promise<void>;
    toggleSurplusItem: (id: string) => Promise<void>;
    removeSurplusItem: (id: string) => Promise<void>;

    // Admin Actions
    addRecurringItem: (item: Omit<RecurringItem, 'id' | 'isSelected'>) => Promise<void>;
    updateRecurringItem: (id: string, updates: Partial<RecurringItem>) => Promise<void>;
    removeRecurringItem: (id: string) => Promise<void>;

    addStockItem: (item: Omit<StockItem, 'id' | 'status'>) => Promise<void>;
    updateStockItem: (id: string, updates: Partial<StockItem>) => Promise<void>;
    removeStockItem: (id: string) => Promise<void>;

    addIngredient: (ingredient: Ingredient) => Promise<void>;
    updateIngredient: (id: string, updates: Partial<Ingredient>) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>;

    resetList: () => Promise<void>;

    // History Actions
    archiveCurrentList: (name: string, items: { name: string; category: string; quantity: string; checked: boolean }[]) => Promise<void>;
    fetchArchivedLists: () => Promise<ShoppingList[]>;
}

export const useStore = create<AppState>((set, get) => ({
    ingredients: [],
    menus: [],
    recurringItems: [],
    stockItems: [],
    surplusItems: [],
    isLoading: true,

    fetchInitialData: async () => {
        set({ isLoading: true });

        const [
            { data: ingredients },
            { data: menus },
            { data: recurringItems },
            { data: stockItems },
            { data: surplusItems }
        ] = await Promise.all([
            supabase.from('ingredients').select('*'),
            supabase.from('menus').select('*'),
            supabase.from('recurring_items').select('*'),
            supabase.from('stock_items').select('*'),
            supabase.from('surplus_items').select('*')
        ]);

        set({
            ingredients: ingredients || [],
            menus: menus || [],
            recurringItems: recurringItems || [],
            stockItems: stockItems || [],
            surplusItems: surplusItems || [],
            isLoading: false
        });
    },

    addIngredient: async (ingredient) => {
        // Optimistic update
        set((state) => ({ ingredients: [...state.ingredients, ingredient] }));
        await supabase.from('ingredients').insert(ingredient);
    },

    updateMenu: async (id, updates) => {
        set((state) => ({
            menus: state.menus.map((menu) =>
                menu.id === id ? { ...menu, ...updates } : menu
            )
        }));
        await supabase.from('menus').update(updates).eq('id', id);
    },

    toggleRecurringItem: async (id) => {
        const item = get().recurringItems.find(i => i.id === id);
        if (!item) return;

        const newValue = !item.isSelected;
        set((state) => ({
            recurringItems: state.recurringItems.map((i) =>
                i.id === id ? { ...i, isSelected: newValue } : i
            )
        }));
        await supabase.from('recurring_items').update({ isSelected: newValue }).eq('id', id);
    },

    toggleStockStatus: async (id) => {
        const item = get().stockItems.find(i => i.id === id);
        if (!item) return;

        const newStatus = item.status === 'IN_STOCK' ? 'TO_BUY' : 'IN_STOCK';
        set((state) => ({
            stockItems: state.stockItems.map((i) =>
                i.id === id ? { ...i, status: newStatus } : i
            )
        }));
        await supabase.from('stock_items').update({ status: newStatus }).eq('id', id);
    },

    addSurplusItem: async (name) => {
        const newItem = { id: crypto.randomUUID(), name, checked: false };
        set((state) => ({
            surplusItems: [...state.surplusItems, newItem]
        }));
        await supabase.from('surplus_items').insert(newItem);
    },

    toggleSurplusItem: async (id) => {
        const item = get().surplusItems.find(i => i.id === id);
        if (!item) return;

        const newValue = !item.checked;
        set((state) => ({
            surplusItems: state.surplusItems.map((i) =>
                i.id === id ? { ...i, checked: newValue } : i
            )
        }));
        await supabase.from('surplus_items').update({ checked: newValue }).eq('id', id);
    },

    removeSurplusItem: async (id) => {
        set((state) => ({
            surplusItems: state.surplusItems.filter((i) => i.id !== id)
        }));
        await supabase.from('surplus_items').delete().eq('id', id);
    },

    addRecurringItem: async (item) => {
        const newItem = { ...item, id: crypto.randomUUID(), isSelected: false };
        set((state) => ({
            recurringItems: [...state.recurringItems, newItem]
        }));
        await supabase.from('recurring_items').insert(newItem);
    },

    updateRecurringItem: async (id, updates) => {
        set((state) => ({
            recurringItems: state.recurringItems.map((i) =>
                i.id === id ? { ...i, ...updates } : i
            )
        }));
        await supabase.from('recurring_items').update(updates).eq('id', id);
    },

    removeRecurringItem: async (id) => {
        set((state) => ({
            recurringItems: state.recurringItems.filter((i) => i.id !== id)
        }));
        await supabase.from('recurring_items').delete().eq('id', id);
    },

    addStockItem: async (item) => {
        const newItem = { ...item, id: crypto.randomUUID(), status: 'IN_STOCK' as const };
        set((state) => ({
            stockItems: [...state.stockItems, newItem]
        }));
        await supabase.from('stock_items').insert(newItem);
    },

    updateStockItem: async (id, updates) => {
        set((state) => ({
            stockItems: state.stockItems.map((i) =>
                i.id === id ? { ...i, ...updates } : i
            )
        }));
        await supabase.from('stock_items').update(updates).eq('id', id);
    },

    removeStockItem: async (id) => {
        set((state) => ({
            stockItems: state.stockItems.filter((i) => i.id !== id)
        }));
        await supabase.from('stock_items').delete().eq('id', id);
    },

    updateIngredient: async (id, updates) => {
        set((state) => ({
            ingredients: state.ingredients.map((i) =>
                i.id === id ? { ...i, ...updates } : i
            )
        }));
        await supabase.from('ingredients').update(updates).eq('id', id);
    },

    removeIngredient: async (id) => {
        set((state) => ({
            ingredients: state.ingredients.filter((i) => i.id !== id)
        }));
        await supabase.from('ingredients').delete().eq('id', id);
    },

    resetList: async () => {
        set((state) => ({
            recurringItems: state.recurringItems.map((i) => ({ ...i, isSelected: false })),
            stockItems: state.stockItems.map((i) => ({ ...i, status: 'IN_STOCK' })),
            surplusItems: [],
        }));

        // Batch updates would be better, but for now simple implementation
        await Promise.all([
            supabase.from('recurring_items').update({ isSelected: false }).neq('isSelected', false),
            supabase.from('stock_items').update({ status: 'IN_STOCK' }).neq('status', 'IN_STOCK'),
            supabase.from('surplus_items').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
        ]);
    },

    archiveCurrentList: async (name, items) => {
        // 1. Create List
        const { data: list, error } = await supabase
            .from('shopping_lists')
            .insert({ name })
            .select()
            .single();

        if (error || !list) throw error;

        // 2. Insert Items
        const itemsToInsert = items.map(item => ({
            listId: list.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            checked: item.checked
        }));

        if (itemsToInsert.length > 0) {
            await supabase.from('archived_items').insert(itemsToInsert);
        }

        // 3. Reset List
        await get().resetList();
    },

    fetchArchivedLists: async () => {
        const { data } = await supabase
            .from('shopping_lists')
            .select('*, items:archived_items(*)')
            .order('created_at', { ascending: false });
        return data || [];
    }
}));
