import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  fetchTodaysMealPlan,
  upsertMealSlot,
  clearTodaysMealPlan,
  type MealPlan,
} from '../lib/db';
import type { Recipe } from '../store/useMealStore';

export function useMealPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<MealPlan>({ breakfast: null, lunch: null, dinner: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan({ breakfast: null, lunch: null, dinner: null });
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTodaysMealPlan(user.id)
      .then(setPlan)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const setSlot = useCallback(
    async (slot: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe | null) => {
      if (!user) return;
      setPlan((prev) => ({ ...prev, [slot]: recipe })); // optimistic update
      try {
        await upsertMealSlot(user.id, slot, recipe);
      } catch (e) {
        console.error('Failed to save meal slot:', e);
        // revert on error
        fetchTodaysMealPlan(user.id).then(setPlan).catch(console.error);
      }
    },
    [user?.id]
  );

  const clearPlan = useCallback(async () => {
    if (!user) return;
    setPlan({ breakfast: null, lunch: null, dinner: null }); // optimistic
    try {
      await clearTodaysMealPlan(user.id);
    } catch (e) {
      console.error('Failed to clear meal plan:', e);
      fetchTodaysMealPlan(user.id).then(setPlan).catch(console.error);
    }
  }, [user?.id]);

  return {
    breakfast:    plan.breakfast,
    lunch:        plan.lunch,
    dinner:       plan.dinner,
    loading,
    setBreakfast: (r: Recipe | null) => setSlot('breakfast', r),
    setLunch:     (r: Recipe | null) => setSlot('lunch', r),
    setDinner:    (r: Recipe | null) => setSlot('dinner', r),
    clearPlan,
  };
}
