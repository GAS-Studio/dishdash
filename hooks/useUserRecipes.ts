import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { fetchUserRecipes, saveUserRecipe } from '../lib/db';
import type { Recipe } from '../store/useMealStore';

export function useUserRecipes() {
  const { user } = useAuth();
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCustomRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUserRecipes(user.id)
      .then(setCustomRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const addCustomRecipe = useCallback(
    async (recipe: Recipe) => {
      if (!user) return;
      // Optimistic: prepend immediately
      setCustomRecipes((prev) =>
        prev.some((r) => r.id === recipe.id) ? prev : [recipe, ...prev]
      );
      try {
        await saveUserRecipe(user.id, recipe);
      } catch (e) {
        console.error('Failed to save recipe:', e);
        // Revert on error
        fetchUserRecipes(user.id).then(setCustomRecipes).catch(console.error);
      }
    },
    [user?.id]
  );

  return { customRecipes, loading, addCustomRecipe };
}
