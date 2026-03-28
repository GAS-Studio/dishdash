import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMealStore } from '../../store/useMealStore';
import { Recipe } from '../../store/useMealStore';
import { useMealPlan } from '../../hooks/useMealPlan';
import { INGREDIENT_CATEGORIES } from '../../constants/ingredientCategories';
import { colors, fonts } from '../../constants/theme';
import SharedHeader from '../../components/SharedHeader';
import recipesBreakfast from '../../data/recipes_breakfast.json';
import recipesLunchDinner from '../../data/recipes_lunchdinner.json';

const ALL_RECIPES: Recipe[] = [...(recipesBreakfast as Recipe[]), ...(recipesLunchDinner as Recipe[])];

function getMatchCount(recipe: Recipe, pantry: string[]): number {
  if (pantry.length === 0) return 0;
  return recipe.ingredients.filter((ing) =>
    pantry.some((p) => ing.name.toLowerCase().includes(p.toLowerCase()))
  ).length;
}

export default function PantryScreen() {
  const { pantryIngredients, togglePantryIngredient, clearPantry } = useMealStore();
  const [showResults, setShowResults] = useState(false);

  const filteredRecipes = ALL_RECIPES
    .map((r) => ({ recipe: r, matches: getMatchCount(r, pantryIngredients) }))
    .filter(({ matches }) => matches > 0)
    .sort((a, b) => b.matches - a.matches);

  return (
    <View style={styles.wrapper}>
      <SharedHeader />
      {!showResults ? (
        <>
          <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>What's in your pantry?</Text>
            <Text style={styles.subheading}>Select ingredients you have on hand</Text>

            {INGREDIENT_CATEGORIES.map((category) => (
              <View key={category.label} style={styles.section}>
                <Text style={styles.sectionTitle}>{category.emoji} {category.label}</Text>
                <View style={styles.chips}>
                  {category.ingredients.map((ing) => {
                    const selected = pantryIngredients.includes(ing);
                    return (
                      <TouchableOpacity
                        key={ing}
                        style={[styles.chip, selected && styles.chipSelected]}
                        onPress={() => togglePantryIngredient(ing)}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                          {ing}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Fixed bottom bar — outside ScrollView so content scrolls freely behind it */}
          <View style={styles.bottomBar}>
            {pantryIngredients.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearPantry}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.findBtn, pantryIngredients.length === 0 && styles.findBtnDisabled]}
              onPress={() => setShowResults(true)}
              disabled={pantryIngredients.length === 0}
            >
              <Text style={styles.findBtnText}>
                Find Recipes ({pantryIngredients.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View style={styles.resultsHeader}>
            <TouchableOpacity onPress={() => setShowResults(false)}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Matching Recipes</Text>
            <Text style={styles.subheading}>
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          {filteredRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🤷</Text>
              <Text style={styles.emptyText}>No matches found.</Text>
              <Text style={styles.emptySubtext}>Try selecting more ingredients.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredRecipes}
              keyExtractor={({ recipe }) => recipe.id}
              contentContainerStyle={styles.resultsList}
              renderItem={({ item: { recipe, matches } }) => (
                <RecipeResultCard recipe={recipe} matches={matches} total={recipe.ingredients.length} />
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

function RecipeResultCard({
  recipe, matches, total,
}: {
  recipe: Recipe;
  matches: number;
  total: number;
}) {
  const router = useRouter();
  const { setBreakfast, setLunch, setDinner, breakfast, lunch, dinner } = useMealPlan();
  const isBreakfast = recipe.mealType === 'breakfast';
  const addedAs = breakfast?.id === recipe.id ? 'breakfast'
    : lunch?.id === recipe.id ? 'lunch'
    : dinner?.id === recipe.id ? 'dinner'
    : null;

  const handleAdd = (slot: 'breakfast' | 'lunch' | 'dinner') => {
    if (slot === 'breakfast') setBreakfast(recipe);
    else if (slot === 'lunch') setLunch(recipe);
    else setDinner(recipe);
    router.push('/(tabs)/plan');
  };

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resultName}>{recipe.name}</Text>
          <Text style={styles.resultMeta}>
            {recipe.cuisineTag[0]} · {recipe.prepTime + recipe.cookTime} min · {recipe.difficulty}
          </Text>
        </View>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>{matches}/{total}</Text>
          <Text style={styles.matchBadgeLabel}>match</Text>
        </View>
      </View>

      <View style={styles.matchBar}>
        <View style={[styles.matchBarFill, { width: `${(matches / total) * 100}%` as any }]} />
      </View>

      {addedAs ? (
        <Text style={styles.addedLabel}>✓ Added as {addedAs}</Text>
      ) : isBreakfast ? (
        <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd('breakfast')}>
          <Text style={styles.addBtnText}>+ Breakfast</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addButtons}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd('lunch')}>
            <Text style={styles.addBtnText}>+ Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addBtn, styles.addBtnDinner]} onPress={() => handleAdd('dinner')}>
            <Text style={styles.addBtnText}>+ Dinner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 72;
const BOTTOM_BAR_HEIGHT = 64;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 16,
    // Enough space to scroll past the fixed bottomBar + tab bar
    paddingBottom: TAB_BAR_HEIGHT + BOTTOM_BAR_HEIGHT + 40,
  },
  heading: {
    fontSize: 26,
    fontFamily: fonts.displayBold,
    color: colors.primary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, fontFamily: fonts.bodyMedium, color: colors.onSurfaceVariant },
  chipTextSelected: { color: colors.onPrimary, fontFamily: fonts.bodySemiBold },
  bottomBar: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  clearBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearBtnText: { color: colors.primary, fontFamily: fonts.bodySemiBold, fontSize: 15 },
  findBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  findBtnDisabled: { backgroundColor: colors.primaryContainer },
  findBtnText: { color: colors.onPrimary, fontFamily: fonts.bodyBold, fontSize: 15 },
  resultsHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backBtn: { color: colors.primary, fontFamily: fonts.bodySemiBold, fontSize: 15, marginBottom: 12 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontFamily: fonts.bodySemiBold, color: colors.onSurface, marginBottom: 6 },
  emptySubtext: { fontSize: 14, fontFamily: fonts.body, color: colors.onSurfaceVariant },
  resultsList: { paddingHorizontal: 20, paddingBottom: TAB_BAR_HEIGHT + 20 },
  resultCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resultCardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  resultName: { fontSize: 16, fontFamily: fonts.bodyBold, color: colors.onSurface, marginBottom: 4 },
  resultMeta: { fontSize: 12, fontFamily: fonts.body, color: colors.onSurfaceVariant },
  matchBadge: { alignItems: 'center', marginLeft: 12 },
  matchBadgeText: { fontSize: 18, fontFamily: fonts.display, color: colors.primary },
  matchBadgeLabel: { fontSize: 10, fontFamily: fonts.body, color: colors.onSurfaceVariant },
  matchBar: {
    height: 4,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  matchBarFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  addButtons: { flexDirection: 'row', gap: 8 },
  addBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnDinner: { backgroundColor: colors.tertiary },
  addBtnText: { color: colors.onPrimary, fontFamily: fonts.bodySemiBold, fontSize: 13 },
  addedLabel: { fontSize: 13, fontFamily: fonts.bodySemiBold, color: colors.secondary },
});
