import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import { useState } from 'react';
import { useMealStore, Recipe } from '../../store/useMealStore';
import { INGREDIENT_CATEGORIES } from '../../constants/ingredientCategories';
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
      {!showResults ? (
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
        </ScrollView>
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
  const { setLunch, setDinner, lunch, dinner } = useMealStore();
  const addedAs = lunch?.id === recipe.id ? 'lunch' : dinner?.id === recipe.id ? 'dinner' : null;

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
      ) : (
        <View style={styles.addButtons}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setLunch(recipe)}>
            <Text style={styles.addBtnText}>+ Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addBtn, styles.addBtnDinner]} onPress={() => setDinner(recipe)}>
            <Text style={styles.addBtnText}>+ Dinner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 120 },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  chipText: { fontSize: 13, color: '#555' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#FFF8F0',
    borderTopWidth: 1,
    borderTopColor: '#F0E8E0',
  },
  clearBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  clearBtnText: { color: '#FF6B6B', fontWeight: '600', fontSize: 15 },
  findBtn: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  findBtnDisabled: { backgroundColor: '#FFBBBB' },
  findBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultsHeader: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { color: '#FF6B6B', fontWeight: '600', fontSize: 15, marginBottom: 12 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#444', marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: '#888' },
  resultsList: { paddingHorizontal: 20, paddingBottom: 40 },
  resultCard: {
    backgroundColor: '#fff',
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
  resultName: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 4 },
  resultMeta: { fontSize: 12, color: '#888' },
  matchBadge: { alignItems: 'center', marginLeft: 12 },
  matchBadgeText: { fontSize: 18, fontWeight: '800', color: '#FF6B6B' },
  matchBadgeLabel: { fontSize: 10, color: '#888' },
  matchBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  matchBarFill: { height: 4, backgroundColor: '#FF6B6B', borderRadius: 2 },
  addButtons: { flexDirection: 'row', gap: 8 },
  addBtn: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnDinner: { backgroundColor: '#FF9A3C' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  addedLabel: { fontSize: 13, color: '#4CAF50', fontWeight: '600' },
});
