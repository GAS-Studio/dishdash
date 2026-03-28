import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Simple localStorage-based storage (works for web, and RN has localStorage polyfill)
const storage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(name);
  },
};

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

export type FeedbackEntry = {
  id: string;
  rating: number;
  categories: string[];
  text: string;
  timestamp: number;
};

// Note: Auth is now handled by Supabase via useAuth hook
// This store only manages meal plans and local UI state

type MealStore = {
  // Today's Plan (synced to Supabase when logged in)
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  setBreakfast: (recipe: Recipe | null) => void;
  setLunch: (recipe: Recipe | null) => void;
  setDinner: (recipe: Recipe | null) => void;
  clearPlan: () => void;

  // User's saved food database (AI-recognized & manually added recipes)
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;

  // Pantry filter (local UI state, not persisted)
  pantryIngredients: string[];
  togglePantryIngredient: (ingredient: string) => void;
  clearPantry: () => void;

  // Feedback (will be synced to Supabase)
  feedbackHistory: FeedbackEntry[];
  submitFeedback: (rating: number, categories: string[], text: string) => void;
};

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      // Today's Plan
      breakfast: null,
      lunch: null,
      dinner: null,
      setBreakfast: (recipe) => set({ breakfast: recipe }),
      setLunch: (recipe) => set({ lunch: recipe }),
      setDinner: (recipe) => set({ dinner: recipe }),
      clearPlan: () => set({ breakfast: null, lunch: null, dinner: null }),

      // Custom food database
      customRecipes: [],
      addCustomRecipe: (recipe) =>
        set((state) => ({
          customRecipes: state.customRecipes.some((r) => r.id === recipe.id)
            ? state.customRecipes
            : [...state.customRecipes, recipe],
        })),

      // Pantry filter
      pantryIngredients: [],
      togglePantryIngredient: (ingredient) =>
        set((state) => ({
          pantryIngredients: state.pantryIngredients.includes(ingredient)
            ? state.pantryIngredients.filter((i) => i !== ingredient)
            : [...state.pantryIngredients, ingredient],
        })),
      clearPantry: () => set({ pantryIngredients: [] }),

      // Feedback
      feedbackHistory: [],
      submitFeedback: (rating, categories, text) =>
        set((state) => ({
          feedbackHistory: [
            ...state.feedbackHistory,
            {
              id: `fb-${Date.now()}`,
              rating,
              categories,
              text,
              timestamp: Date.now(),
            },
          ],
        })),
    }),
    {
      name: 'dishdash-storage',
      storage: createJSONStorage(() => storage),
      // Persist meal plans and feedback - pantry is transient UI state
      partialize: (state) => ({
        breakfast: state.breakfast,
        lunch: state.lunch,
        dinner: state.dinner,
        customRecipes: state.customRecipes,
        feedbackHistory: state.feedbackHistory,
      }),
    }
  )
);
