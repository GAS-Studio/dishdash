import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useMealStore, Recipe } from '../../store/useMealStore';
import { colors, fonts, radius } from '../../constants/theme';
import SharedHeader from '../../components/SharedHeader';

export default function TodaysPlanScreen() {
  const { lunch, dinner, clearPlan } = useMealStore();

  const handleClearPlan = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Clear Plan?\n\nThis will remove both your lunch and dinner selections.');
      if (confirmed) clearPlan();
    } else {
      Alert.alert(
        'Clear Plan?',
        'This will remove both your lunch and dinner selections.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearPlan },
        ]
      );
    }
  };

  const isEmpty = !lunch && !dinner;

  return (
    <View style={styles.wrapper}>
      <SharedHeader />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Today's Plan</Text>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>No meals planned yet.</Text>
          <Text style={styles.emptySubtext}>Swipe right on the deck to add meals here.</Text>
        </View>
      ) : (
        <>
          <MealCard label="Lunch" recipe={lunch} />
          <MealCard label="Dinner" recipe={dinner} />

          <TouchableOpacity style={styles.clearButton} onPress={handleClearPlan}>
            <Text style={styles.clearButtonText}>Clear Plan</Text>
          </TouchableOpacity>
        </>
      )}
      </ScrollView>
    </View>
  );
}

function MealCard({ label, recipe }: { label: string; recipe: Recipe | null }) {
  return (
    <View style={styles.card}>
      <Text style={styles.mealLabel}>{label}</Text>
      {recipe ? (
        <>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={styles.tags}>
            {recipe.cuisineTag.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <MetaPill icon="⏱" text={`${recipe.prepTime + recipe.cookTime} min`} />
            <MetaPill icon="👤" text={`${recipe.servings} servings`} />
            <MetaPill icon="📊" text={recipe.difficulty} />
          </View>

          <View style={styles.macrosRow}>
            <MacroItem label="Cal" value={recipe.macros.calories} />
            <MacroItem label="Protein" value={`${recipe.macros.protein}g`} />
            <MacroItem label="Carbs" value={`${recipe.macros.carbs}g`} />
            <MacroItem label="Fats" value={`${recipe.macros.fats}g`} />
          </View>

          {recipe.description && (
            <Text style={styles.description}>{recipe.description}</Text>
          )}
        </>
      ) : (
        <Text style={styles.emptyCardText}>Not set — swipe right to pick a {label.toLowerCase()}.</Text>
      )}
    </View>
  );
}

function MetaPill({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{icon} {text}</Text>
    </View>
  );
}

function MacroItem({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.macroItem}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 72;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
  heading: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.primary,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurface,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mealLabel: {
    fontSize: 12,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  recipeName: {
    fontSize: 20,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  macroLabel: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyCardText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.outlineVariant,
    fontStyle: 'italic',
    marginTop: 4,
  },
  clearButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
});
