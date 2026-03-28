/**
 * One-time seed script — loads both JSON recipe files into the `recipes` table.
 *
 * Prerequisites:
 *   1. Run the SQL migration in supabase/migrations/001_init.sql first.
 *   2. Get your Service Role key from Supabase Dashboard → Project Settings → API.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed.mjs
 *
 *   (EXPO_PUBLIC_SUPABASE_URL is read from .env automatically if you use
 *    `node --env-file=.env scripts/seed.mjs`)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing env vars.\n' +
    'Set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const breakfast  = JSON.parse(readFileSync(join(__dirname, '../data/recipes_breakfast.json'),  'utf8'));
const lunchDinner = JSON.parse(readFileSync(join(__dirname, '../data/recipes_lunchdinner.json'), 'utf8'));
const all = [...breakfast, ...lunchDinner];

const rows = all.map(r => ({
  id:               r.id,
  name:             r.name,
  meal_type:        r.mealType,
  cuisine_tags:     r.cuisineTag,
  prep_time:        r.prepTime,
  cook_time:        r.cookTime,
  servings:         r.servings,
  difficulty:       r.difficulty,
  chef_inspiration: r.chefInspiration ?? null,
  description:      r.description    ?? null,
  ingredients:      r.ingredients,
  steps:            r.steps,
  macros:           r.macros,
  image_url:        r.imageUrl        ?? null,
}));

const { error } = await supabase
  .from('recipes')
  .upsert(rows, { onConflict: 'id' });

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log(`✓ Seeded ${rows.length} recipes (${breakfast.length} breakfast, ${lunchDinner.length} lunch/dinner).`);
