import { create } from 'zustand';

export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  mealType: string;
  cuisineTag: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  chefInspiration: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fibre: number;
  };
  imageUrl: string;
};

type MealStore = {
  // Today's Plan
  lunch: Recipe | null;
  dinner: Recipe | null;
  setLunch: (recipe: Recipe) => void;
  setDinner: (recipe: Recipe) => void;
  clearPlan: () => void;

  // Pantry filter
  pantryIngredients: string[];
  togglePantryIngredient: (ingredient: string) => void;
  clearPantry: () => void;
};

export const useMealStore = create<MealStore>((set) => ({
  lunch: null,
  dinner: null,
  setLunch: (recipe) => set({ lunch: recipe }),
  setDinner: (recipe) => set({ dinner: recipe }),
  clearPlan: () => set({ lunch: null, dinner: null }),

  pantryIngredients: [],
  togglePantryIngredient: (ingredient) =>
    set((state) => ({
      pantryIngredients: state.pantryIngredients.includes(ingredient)
        ? state.pantryIngredients.filter((i) => i !== ingredient)
        : [...state.pantryIngredients, ingredient],
    })),
  clearPantry: () => set({ pantryIngredients: [] }),
}));
