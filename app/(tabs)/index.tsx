import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useRouter } from 'expo-router';
import { useMealStore, Recipe } from '../../store/useMealStore';
import RecipeCard from '../../components/RecipeCard';
import { colors, radius } from '../../constants/theme';
import recipesRaw from '../../data/recipes_lunchdinner.json';

const recipes = recipesRaw as Recipe[];

export default function DiscoverScreen() {
  const swiperRef = useRef<any>(null);
  const router = useRouter();
  const { lunch, dinner, setLunch, setDinner } = useMealStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);

  // Decide which meal slot to fill based on time & what's already set
  const pickMealSlot = (recipe: Recipe): string => {
    const hour = new Date().getHours();
    if (hour < 15 && !lunch) {
      setLunch(recipe);
      return 'Lunch';
    } else if (!dinner) {
      setDinner(recipe);
      return 'Dinner';
    } else {
      setLunch(recipe);
      return 'Lunch';
    }
  };

  const handleSwipeRight = (index: number) => {
    const recipe = recipes[index];
    const slot = pickMealSlot(recipe);
    Alert.alert(
      `Added to ${slot}! 🎉`,
      recipe.name,
      [
        { text: "View Today's Plan", onPress: () => router.push('/(tabs)/plan') },
        { text: 'Keep Swiping', style: 'cancel' },
      ]
    );
  };

  const handleSwipeTop = (_index: number) => {
    // Skip — just advance the deck
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🍽</Text>
          </View>
          <Text style={styles.headerTitle}>The Culinary Editorial</Text>
        </View>
        <TouchableOpacity
          style={styles.planBtn}
          onPress={() => router.push('/(tabs)/plan')}
          activeOpacity={0.8}
        >
          <Text style={styles.planBtnText}>Today's Plan</Text>
        </TouchableOpacity>
      </View>

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
      ) : (
        <View style={styles.deckArea}>
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
            onSwipedRight={handleSwipeRight}
            onSwipedTop={handleSwipeTop}
            onSwipedAll={() => setAllSwiped(true)}
            onSwiped={(index) => setCurrentIndex(index + 1)}
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
        </View>
      )}

      {/* ── Hint ── */}
      {!allSwiped && (
        <Text style={styles.hint}>Swipe right to cook today · Swipe up to skip</Text>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,248,246,0.95)',
    shadowColor: '#522613',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  planBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
  },
  planBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  deckArea: {
    flex: 1,
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingBottom: 16,
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
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
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
    fontWeight: '700',
    fontSize: 15,
  },
});
