import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Recipe } from '../store/useMealStore';
import recipeImages from '../constants/images';
import { colors, fonts, radius } from '../constants/theme';

const { width: RAW_W, height: RAW_H } = Dimensions.get('window');
const SW = Platform.OS === 'web' ? Math.min(RAW_W, 390) : RAW_W;
const SH = Platform.OS === 'web' ? Math.min(RAW_H, 844) : RAW_H;
export const CARD_WIDTH = SW - 40;
export const CARD_HEIGHT = SH * 0.75;
const IMAGE_HEIGHT = CARD_HEIGHT * 0.48;

type Props = {
  recipe: Recipe;
  onSelect?: () => void;
  onSkip?: () => void;
};

export default function RecipeCard({ recipe, onSelect, onSkip }: Props) {
  const image = recipeImages[recipe.id];
  const totalTime = recipe.prepTime + recipe.cookTime;
  const primaryCuisine = recipe.cuisineTag?.[0] ?? '';

  return (
    <View style={styles.card}>

      {/* ── TOP: Food Image ── */}
      <View style={styles.imageWrap}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}

        {/* Scrim — simulates bottom gradient for legibility */}
        <View style={styles.scrim} />

        {/* Swipe feedback overlays */}
        <View style={[styles.overlayBadge, styles.overlaySelect]} pointerEvents="none">
          <Text style={styles.overlaySelectText}>SELECT</Text>
        </View>
        <View style={[styles.overlayBadge, styles.overlaySkip]} pointerEvents="none">
          <Text style={styles.overlaySkipText}>SKIP</Text>
        </View>

        {/* Chips */}
        <View style={styles.chips}>
          <View style={styles.timeChip}>
            <Text style={styles.timeChipText}>⏱ {totalTime} MIN</Text>
          </View>
          {!!primaryCuisine && (
            <View style={styles.cuisineChip}>
              <Text style={styles.cuisineChipText}>{primaryCuisine.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── BOTTOM: Recipe Details ── */}
      <View style={styles.details}>

        {/* Name + description */}
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={2}>{recipe.name}</Text>
          {!!recipe.description && (
            <Text style={styles.desc} numberOfLines={2}>{recipe.description}</Text>
          )}
        </View>

        {/* Macros — 3-col bento matching Stitch design */}
        <View style={styles.macrosRow}>
          <MacroBox label="Calories" value={String(recipe.macros.calories)} />
          <MacroBox label="Protein"  value={`${recipe.macros.protein}g`} />
          <MacroBox label="Carbs"    value={`${recipe.macros.carbs}g`} />
        </View>

        {/* Skip / Select buttons */}
        <View style={styles.actions}>
          {/* Skip */}
          <TouchableOpacity onPress={onSkip} activeOpacity={0.75} style={styles.actionBtn}>
            <View style={styles.skipCircle}>
              <Text style={styles.skipArrow}>↑</Text>
            </View>
            <Text style={styles.skipLabel}>SKIP</Text>
          </TouchableOpacity>

          {/* Progress bar decoration */}
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>

          {/* Select */}
          <TouchableOpacity onPress={onSelect} activeOpacity={0.75} style={styles.actionBtn}>
            <View style={styles.selectCircle}>
              <Text style={styles.selectCheck}>✓</Text>
            </View>
            <Text style={styles.selectLabel}>SELECT</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

function MacroBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroBox}>
      <Text style={styles.macroLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignSelf: 'center',
    // Shadow
    shadowColor: '#522613',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 40,
    elevation: 10,
  },

  // ── Image ──
  imageWrap: {
    height: IMAGE_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  scrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT * 0.55,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  // ── Swipe overlays ──
  overlayBadge: {
    position: 'absolute',
    top: 22,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 3,
    opacity: 0, // shown by the swiper library; set 0 by default
  },
  overlaySelect: {
    left: 20,
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.onSecondaryContainer,
    transform: [{ rotate: '-12deg' }],
  },
  overlaySelectText: {
    color: colors.onSecondaryContainer,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 2,
  },
  overlaySkip: {
    right: 20,
    backgroundColor: colors.error,
    borderColor: colors.error,
    transform: [{ rotate: '12deg' }],
  },
  overlaySkipText: {
    color: colors.onError,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 2,
  },

  // ── Chips ──
  chips: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    backgroundColor: 'rgba(255,248,246,0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  timeChipText: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  cuisineChip: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  cuisineChipText: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.onTertiaryContainer,
    letterSpacing: 0.5,
  },

  // ── Details ──
  details: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  nameBlock: {
    gap: 4,
  },
  name: {
    fontSize: 21,
    fontFamily: fonts.display,
    color: colors.onSurface,
    lineHeight: 26,
  },
  desc: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },

  // ── Macros — 3-col bento matching Stitch ──
  macrosRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroBox: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  macroLabel: {
    fontSize: 9,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  macroValue: {
    fontSize: 16,
    fontFamily: fonts.display,
    color: colors.onSurface,
  },

  // ── Action buttons ──
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  skipCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipArrow: {
    fontSize: 22,
    color: colors.onSurfaceVariant,
    lineHeight: 26,
  },
  skipLabel: {
    fontSize: 9,
    fontFamily: fonts.bodyBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  selectCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
  selectCheck: {
    fontSize: 22,
    color: colors.onPrimary,
    lineHeight: 26,
  },
  selectLabel: {
    fontSize: 9,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  progressBar: {
    height: 4,
    width: 80,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
