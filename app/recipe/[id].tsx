import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Recipe, useMealStore } from '../../store/useMealStore';
import recipeImages from '../../constants/images';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import lunchDinnerData from '../../data/recipes_lunchdinner.json';
import breakfastData from '../../data/recipes_breakfast.json';

const ALL_RECIPES = [...(lunchDinnerData as Recipe[]), ...(breakfastData as Recipe[])];

export default function RecipeDetailScreen() {
  const { id, slot } = useLocalSearchParams<{ id: string; slot?: string }>();
  const router = useRouter();
  const { setLunch, setDinner } = useMealStore();

  const recipe = useMemo(
    () => ALL_RECIPES.find((r) => r.id === id) ?? null,
    [id]
  );

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const image = recipeImages[recipe.id];
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleAddToPlan = () => {
    const hour = new Date().getHours();
    let mealSlot = slot;
    if (!mealSlot) {
      mealSlot = hour < 15 ? 'Lunch' : 'Dinner';
    }
    if (mealSlot === 'Lunch') {
      setLunch(recipe);
    } else {
      setDinner(recipe);
    }
    Alert.alert(
      `Added to ${mealSlot}! 🎉`,
      recipe.name,
      [
        { text: "View Today's Plan", onPress: () => router.push('/(tabs)/plan') },
        { text: 'Keep Browsing', style: 'cancel', onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Image ── */}
        <View style={styles.imageWrap}>
          {image ? (
            <Image source={image} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imageFallback]} />
          )}

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
          </TouchableOpacity>

          {/* Chips over image */}
          <View style={styles.imageChips}>
            <View style={styles.timeChip}>
              <Text style={styles.chipText}>⏱ {totalTime} min</Text>
            </View>
            <View style={styles.diffChip}>
              <Text style={styles.chipText}>{recipe.difficulty}</Text>
            </View>
            {recipe.cuisineTag.slice(0, 1).map((tag) => (
              <View key={tag} style={styles.cuisineChip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* Name + chef inspiration */}
          <Text style={styles.name}>{recipe.name}</Text>
          {!!recipe.chefInspiration && (
            <Text style={styles.chef}>Inspired by {recipe.chefInspiration}</Text>
          )}
          {!!recipe.description && (
            <Text style={styles.desc}>{recipe.description}</Text>
          )}

          {/* ── Macros ── */}
          <View style={styles.macrosCard}>
            <Text style={styles.sectionLabel}>Nutrition per serving</Text>
            <View style={styles.macrosRow}>
              <MacroItem label="Calories" value={String(recipe.macros.calories)} color={colors.primary} />
              <MacroItem label="Protein"  value={`${recipe.macros.protein}g`}    color={colors.secondary} />
              <MacroItem label="Carbs"    value={`${recipe.macros.carbs}g`}      color={colors.tertiary} />
              <MacroItem label="Fats"     value={`${recipe.macros.fats}g`}       color={colors.primary} />
              <MacroItem label="Fibre"    value={`${recipe.macros.fibre}g`}      color={colors.neutral} />
            </View>
          </View>

          {/* ── Ingredients ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.servingNote}>Serves {recipe.servings}</Text>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientQty}>{ing.quantity} {ing.unit} </Text>
                  {ing.name}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Steps ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Cook</Text>
            {recipe.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Bottom padding for fixed button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── Fixed Add to Plan button ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToPlan} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
          <Text style={styles.addBtnText}>Add to Today's Plan</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

function MacroItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.macroItem}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  notFound: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
  },

  // ── Image ──
  imageWrap: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,248,246,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  imageChips: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeChip: {
    backgroundColor: 'rgba(255,248,246,0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  diffChip: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  cuisineChip: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  chipText: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    textTransform: 'capitalize',
  },

  // ── Body ──
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  name: {
    fontSize: 26,
    fontFamily: fonts.display,
    color: colors.onSurface,
    lineHeight: 32,
    marginBottom: 4,
  },
  chef: {
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: spacing.md,
  },

  // ── Macros ──
  macrosCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  macroLabel: {
    fontSize: 10,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.2,
  },

  // ── Section ──
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.display,
    color: colors.onSurface,
    marginBottom: 4,
  },
  servingNote: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },

  // ── Ingredients ──
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
    flexShrink: 0,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurface,
    lineHeight: 20,
  },
  ingredientQty: {
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },

  // ── Steps ──
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurface,
    lineHeight: 21,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 12,
    backgroundColor: 'rgba(253,240,235,0.97)',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  addBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },
});
