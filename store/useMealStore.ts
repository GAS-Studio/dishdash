import { create } from 'zustand';
import { Platform } from 'react-native';

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

// ─── Manual persistence helpers (web only) ───
const STORAGE_KEY = 'dishdash-storage';

function loadPersistedState(): Partial<MealStore> {
  if (Platform.OS !== 'web') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveState(state: MealStore) {
  if (Platform.OS !== 'web') return;
  try {
    const data = {
      user: state.user,
      isLoggedIn: state.isLoggedIn,
      lunch: state.lunch,
      dinner: state.dinner,
      feedbackHistory: state.feedbackHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors
  }
}

const persisted = loadPersistedState();

export const useMealStore = create<MealStore>()((set, get) => ({
  // User auth
  user: (persisted.user as User | null) ?? null,
  isLoggedIn: persisted.isLoggedIn ?? false,
  signUp: (name, email) => {
    set({ user: { name, email }, isLoggedIn: true });
    saveState(get());
  },
  login: (email) => {
    set((state) => ({
      user: { name: state.user?.name || email.split('@')[0], email },
      isLoggedIn: true,
    }));
    saveState(get());
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
    saveState(get());
  },

  // Today's Plan
  lunch: (persisted.lunch as Recipe | null) ?? null,
  dinner: (persisted.dinner as Recipe | null) ?? null,
  setLunch: (recipe) => {
    set({ lunch: recipe });
    saveState(get());
  },
  setDinner: (recipe) => {
    set({ dinner: recipe });
    saveState(get());
  },
  clearPlan: () => {
    set({ lunch: null, dinner: null });
    saveState(get());
  },

  // Pantry filter (not persisted)
  pantryIngredients: [],
  togglePantryIngredient: (ingredient) =>
    set((state) => ({
      pantryIngredients: state.pantryIngredients.includes(ingredient)
        ? state.pantryIngredients.filter((i) => i !== ingredient)
        : [...state.pantryIngredients, ingredient],
    })),
  clearPantry: () => set({ pantryIngredients: [] }),

  // Feedback
  feedbackHistory: (persisted.feedbackHistory as FeedbackEntry[]) ?? [],
  submitFeedback: (rating, categories, text) => {
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
    }));
    saveState(get());
  },
}));
