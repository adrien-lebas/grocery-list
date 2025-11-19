export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'unit' | 'tbsp' | 'tsp';

export type Category = 'PROTEIN' | 'VEGETABLE' | 'STARCH' | 'OTHER';

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  defaultUnit: Unit;
  defaultPortion?: number; // Quantity per person per meal
}

export interface Menu {
  id: string;
  name: string; // e.g., "Menu 1"
  proteinId: string | null;
  vegetableId: string | null;
  starchId: string | null;
  quantities: Record<string, number>; // ingredientId -> quantity
}

export interface RecurringItem {
  id: string;
  name: string;
  category: string; // e.g., "Dairy", "Fruits"
  isSelected: boolean; // If true, added to shopping list
}

export interface StockItem {
  id: string;
  name: string;
  category: string; // e.g., "Cleaning", "Hygiene"
  status: 'IN_STOCK' | 'TO_BUY';
}

export interface SurplusItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface ArchivedItem {
  id: string;
  listId: string;
  name: string;
  category: string;
  quantity: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  created_at: string;
  items?: ArchivedItem[];
}
