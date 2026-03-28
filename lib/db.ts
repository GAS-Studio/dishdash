import { supabase } from './supabase';
import type { Recipe } from '../store/useMealStore';

// ─── Row ↔ Recipe mapping ────────────────────────────────────────────────────

function rowToRecipe(row: any): Recipe {
  return {
    id:               row.id,
    name:             row.name,
    mealType:         row.meal_type,
    cuisineTag:       row.cuisine_tags  ?? [],
    prepTime:         row.prep_time     ?? 0,
    cookTime:         row.cook_time     ?? 0,
    servings:         row.servings      ?? 4,
    difficulty:       row.difficulty    ?? 'medium',
    chefInspiration:  row.chef_inspiration ?? '',
    description:      row.description   ?? '',
    ingredients:      row.ingredients   ?? [],
    steps:            row.steps         ?? [],
    macros:           row.macros        ?? { calories: 0, protein: 0, carbs: 0, fats: 0, fibre: 0 },
    imageUrl:         row.image_url     ?? '',
  };
}

function recipeToRow(recipe: Recipe, userId?: string) {
  return {
    id:               recipe.id,
    ...(userId ? { user_id: userId } : {}),
    name:             recipe.name,
    meal_type:        recipe.mealType,
    cuisine_tags:     recipe.cuisineTag,
    prep_time:        recipe.prepTime,
    cook_time:        recipe.cookTime,
    servings:         recipe.servings,
    difficulty:       recipe.difficulty,
    chef_inspiration: recipe.chefInspiration || null,
    description:      recipe.description     || null,
    ingredients:      recipe.ingredients,
    steps:            recipe.steps,
    macros:           recipe.macros,
    image_url:        recipe.imageUrl         || null,
  };
}

// ─── Recipes (public) ────────────────────────────────────────────────────────

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.from('recipes').select('*');
  if (error) throw error;
  return (data ?? []).map(rowToRecipe);
}

/** Checks recipes table first, then user_recipes as a fallback. */
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const { data: r } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (r) return rowToRecipe(r);

  const { data: ur } = await supabase
    .from('user_recipes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return ur ? rowToRecipe(ur) : null;
}

// ─── User Recipes ────────────────────────────────────────────────────────────

export async function fetchUserRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('user_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToRecipe);
}

export async function saveUserRecipe(userId: string, recipe: Recipe): Promise<void> {
  const { error } = await supabase
    .from('user_recipes')
    .upsert(recipeToRow(recipe, userId), { onConflict: 'id' });
  if (error) throw error;
}

// ─── Meal Plans ──────────────────────────────────────────────────────────────

export type MealPlan = {
  breakfast: Recipe | null;
  lunch:     Recipe | null;
  dinner:    Recipe | null;
};

export async function fetchTodaysMealPlan(userId: string): Promise<MealPlan> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('meal_plans')
    .select('breakfast, lunch, dinner')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();
  if (error) throw error;
  return {
    breakfast: data?.breakfast ?? null,
    lunch:     data?.lunch     ?? null,
    dinner:    data?.dinner    ?? null,
  };
}

export async function upsertMealSlot(
  userId: string,
  slot: 'breakfast' | 'lunch' | 'dinner',
  recipe: Recipe | null
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('meal_plans')
    .upsert(
      { user_id: userId, date: today, [slot]: recipe },
      { onConflict: 'user_id,date' }
    );
  if (error) throw error;
}

export async function clearTodaysMealPlan(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('meal_plans')
    .update({ breakfast: null, lunch: null, dinner: null })
    .eq('user_id', userId)
    .eq('date', today);
  if (error) throw error;
}
