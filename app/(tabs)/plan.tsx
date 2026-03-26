import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useMealStore, Recipe } from '../../store/useMealStore';

export default function TodaysPlanScreen() {
  const { lunch, dinner, clearPlan } = useMealStore();

  const isEmpty = !lunch && !dinner;

  return (
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

          <TouchableOpacity style={styles.clearButton} onPress={clearPlan}>
            <Text style={styles.clearButtonText}>Clear Plan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
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
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
    fontWeight: '700',
    color: '#FF6B6B',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FFF0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    color: '#555',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  macroLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyCardText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
    marginTop: 4,
  },
  clearButton: {
    marginTop: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
