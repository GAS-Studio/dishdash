import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

const storage: StateStorage = {
  getItem:    (name) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(name)),
  setItem:    (name, value) => { if (typeof localStorage !== 'undefined') localStorage.setItem(name, value); },
  removeItem: (name) => { if (typeof localStorage !== 'undefined') localStorage.removeItem(name); },
};

// ─── Shared types ────────────────────────────────────────────────────────────

export type Ingredient = {
  name:     string;
  quantity: string;
  unit:     string;
};

export type Recipe = {
  id:              string;
  name:            string;
  mealType:        string;
  cuisineTag:      string[];
  prepTime:        number;
  cookTime:        number;
  servings:        number;
  difficulty:      string;
  chefInspiration: string;
  description?:    string;
  ingredients:     Ingredient[];
  steps:           string[];
  macros: {
    calories: number;
    protein:  number;
    carbs:    number;
    fats:     number;
    fibre:    number;
  };
  imageUrl: string;
};

export type FeedbackEntry = {
  id:         string;
  rating:     number;
  categories: string[];
  text:       string;
  timestamp:  number;
};

// ─── Store  (pantry + feedback only — meal plan & recipes live in Supabase) ──

type MealStore = {
  // Pantry filter (transient UI state)
  pantryIngredients:      string[];
  togglePantryIngredient: (ingredient: string) => void;
  clearPantry:            () => void;

  // Feedback
  feedbackHistory: FeedbackEntry[];
  submitFeedback:  (rating: number, categories: string[], text: string) => void;
};

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      pantryIngredients: [],
      togglePantryIngredient: (ingredient) =>
        set((state) => ({
          pantryIngredients: state.pantryIngredients.includes(ingredient)
            ? state.pantryIngredients.filter((i) => i !== ingredient)
            : [...state.pantryIngredients, ingredient],
        })),
      clearPantry: () => set({ pantryIngredients: [] }),

      feedbackHistory: [],
      submitFeedback: (rating, categories, text) =>
        set((state) => ({
          feedbackHistory: [
            ...state.feedbackHistory,
            { id: `fb-${Date.now()}`, rating, categories, text, timestamp: Date.now() },
          ],
        })),
    }),
    {
      name:       'dishdash-storage',
      storage:    createJSONStorage(() => storage),
      partialize: (state) => ({ feedbackHistory: state.feedbackHistory }),
    }
  )
);
