import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export type User = {
  name: string;
  email: string;
};

type MealStore = {
  // User auth
  user: User | null;
  isLoggedIn: boolean;
  signUp: (name: string, email: string) => void;
  login: (email: string) => void;
  logout: () => void;

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

  // Feedback
  feedbackHistory: FeedbackEntry[];
  submitFeedback: (rating: number, categories: string[], text: string) => void;
};

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      // User auth
      user: null,
      isLoggedIn: false,
      signUp: (name, email) =>
        set({ user: { name, email }, isLoggedIn: true }),
      login: (email) =>
        set((state) => ({
          user: { name: state.user?.name || email.split('@')[0], email },
          isLoggedIn: true,
        })),
      logout: () => set({ user: null, isLoggedIn: false }),

      // Today's Plan
      lunch: null,
      dinner: null,
      setLunch: (recipe) => set({ lunch: recipe }),
      setDinner: (recipe) => set({ dinner: recipe }),
      clearPlan: () => set({ lunch: null, dinner: null }),

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
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user auth and feedback — not transient UI state like pantry selections
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        lunch: state.lunch,
        dinner: state.dinner,
        feedbackHistory: state.feedbackHistory,
      }),
    }
  )
);
