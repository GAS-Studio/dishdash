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
  lunch: Recipe | null;
  dinner: Recipe | null;
  setLunch: (recipe: Recipe) => void;
  setDinner: (recipe: Recipe) => void;
  clearPlan: () => void;
};

export const useMealStore = create<MealStore>((set) => ({
  lunch: null,
  dinner: null,
  setLunch: (recipe) => set({ lunch: recipe }),
  setDinner: (recipe) => set({ dinner: recipe }),
  clearPlan: () => set({ lunch: null, dinner: null }),
}));
