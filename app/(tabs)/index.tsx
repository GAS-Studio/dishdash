import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMealStore, Recipe } from '../../store/useMealStore';
import RecipeCard from '../../components/RecipeCard';
import SharedHeader from '../../components/SharedHeader';
import { colors, fonts, radius } from '../../constants/theme';
import recipesLunchDinner from '../../data/recipes_lunchdinner.json';
import recipesBreakfast from '../../data/recipes_breakfast.json';

const recipes: Recipe[] = [...(recipesLunchDinner as Recipe[]), ...(recipesBreakfast as Recipe[])];

// Conditionally import deck swiper (doesn't work on web)
let Swiper: any = null;
if (Platform.OS !== 'web') {
  Swiper = require('react-native-deck-swiper').default;
}

export default function DiscoverScreen() {
  const swiperRef = useRef<any>(null);
  const router = useRouter();
  const { breakfast, lunch, dinner, setBreakfast, setLunch, setDinner } = useMealStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [pendingRecipe, setPendingRecipe] = useState<{ recipe: Recipe; index: number } | null>(null);

  const confirmMealSlot = (slot: 'Breakfast' | 'Lunch' | 'Dinner') => {
    if (!pendingRecipe) return;
    const { recipe, index } = pendingRecipe;

    if (slot === 'Breakfast') {
      setBreakfast(recipe);
    } else if (slot === 'Lunch') {
      setLunch(recipe);
    } else {
      setDinner(recipe);
    }

    if (Platform.OS === 'web') {
      setCurrentIndex(index + 1);
      if (index + 1 >= recipes.length) setAllSwiped(true);
    }

    setShowMealModal(false);
    setPendingRecipe(null);
    router.push({ pathname: '/recipe/[id]', params: { id: recipe.id, slot } });
  };

  const handleSelect = (index: number) => {
    const recipe = recipes[index];
    setPendingRecipe({ recipe, index });
    setShowMealModal(true);
  };

  const handleSkip = (index: number) => {
    const next = index + 1;
    setCurrentIndex(next);
    if (next >= recipes.length) setAllSwiped(true);
  };

  const currentRecipe = recipes[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <SharedHeader />

      {/* ── Deck ── */}
      {allSwiped ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🥘</Text>
          <Text style={styles.emptyTitle}>You've seen them all!</Text>
          <Text style={styles.emptySubtitle}>Check Today's Plan or come back later.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/plan')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyBtnText}>View Today's Plan →</Text>
          </TouchableOpacity>
        </View>
      ) : Platform.OS === 'web' ? (
        /* ── Web: simple card with buttons ── */
        <View style={styles.deckArea}>
          <ScrollView
            contentContainerStyle={styles.webCardContainer}
            showsVerticalScrollIndicator={false}
          >
            {currentRecipe && (
              <RecipeCard
                recipe={currentRecipe}
                onSelect={() => handleSelect(currentIndex)}
                onSkip={() => handleSkip(currentIndex)}
              />
            )}
          </ScrollView>
        </View>
      ) : (
        /* ── Native: deck swiper ── */
        <View style={styles.deckArea}>
          {Swiper && (
            <Swiper
              ref={swiperRef}
              cards={recipes}
              cardIndex={currentIndex}
              renderCard={(recipe: Recipe) => (
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => swiperRef.current?.swipeRight()}
                  onSkip={() => swiperRef.current?.swipeTop()}
                />
              )}
              onSwipedRight={(index: number) => handleSelect(index)}
              onSwipedTop={(index: number) => handleSkip(index)}
              onSwipedAll={() => setAllSwiped(true)}
              onSwiped={(index: number) => setCurrentIndex(index + 1)}
              backgroundColor="transparent"
              cardVerticalMargin={0}
              cardHorizontalMargin={16}
              stackSize={3}
              stackScale={4}
              stackSeparation={12}
              animateCardOpacity
              disableBottomSwipe
              disableLeftSwipe
              overlayLabels={{
                right: {
                  title: 'SELECT',
                  style: {
                    label: {
                      backgroundColor: colors.secondaryContainer,
                      borderColor: colors.onSecondaryContainer,
                      color: colors.onSecondaryContainer,
                      borderWidth: 3,
                      fontSize: 18,
                      fontWeight: '800',
                      borderRadius: 20,
                      padding: 8,
                      letterSpacing: 2,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginLeft: 30,
                      marginTop: 30,
                    },
                  },
                },
                top: {
                  title: 'SKIP',
                  style: {
                    label: {
                      backgroundColor: colors.error,
                      borderColor: colors.error,
                      color: colors.onError,
                      borderWidth: 3,
                      fontSize: 18,
                      fontWeight: '800',
                      borderRadius: 20,
                      padding: 8,
                      letterSpacing: 2,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                    },
                  },
                },
              }}
            />
          )}
        </View>
      )}

      {/* ── Hint ── */}
      {!allSwiped && (
        <Text style={styles.hint}>
          {Platform.OS === 'web'
            ? 'Tap SELECT to cook today · Tap SKIP to pass'
            : 'Swipe right to cook today · Swipe up to skip'}
        </Text>
      )}

      {/* ── Meal Selection Modal ── */}
      <Modal
        visible={showMealModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMealModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to your plan</Text>
            <Text style={styles.modalSubtitle}>
              When would you like to have {pendingRecipe?.recipe.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.breakfastBtn]}
                onPress={() => confirmMealSlot('Breakfast')}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnEmoji}>🌅</Text>
                <Text style={styles.modalBtnText}>Breakfast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.lunchBtn]}
                onPress={() => confirmMealSlot('Lunch')}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnEmoji}>☀️</Text>
                <Text style={styles.modalBtnText}>Lunch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.dinnerBtn]}
                onPress={() => confirmMealSlot('Dinner')}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnEmoji}>🌙</Text>
                <Text style={styles.modalBtnText}>Dinner</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                setShowMealModal(false);
                setPendingRecipe(null);
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  deckArea: {
    flex: 1,
  },
  webCardContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 100,
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingBottom: Platform.OS === 'web' ? 90 : 16,
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  emptyBtnText: {
    color: colors.onPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.onSurface,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  breakfastBtn: {
    backgroundColor: '#E8F5E9',
  },
  lunchBtn: {
    backgroundColor: '#FFF3E0',
  },
  dinnerBtn: {
    backgroundColor: '#E8EAF6',
  },
  modalBtnEmoji: {
    fontSize: 24,
  },
  modalBtnText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalCancelText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
  },
});
