import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, Alert, Image, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import SharedHeader from '../../components/SharedHeader';
import { useMealStore } from '../../store/useMealStore';

const CATEGORIES = ['UI/UX', 'AI Suggestions', 'Pantry Scanner', 'Other'] as const;

export default function FeedbackScreen() {
  const { submitFeedback, feedbackHistory } = useMealStore();
  const [rating, setRating] = useState(0);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const hasPreviousFeedback = feedbackHistory.length > 0;
  const lastFeedback = hasPreviousFeedback ? feedbackHistory[feedbackHistory.length - 1] : null;

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      if (Platform.OS === 'web') {
        window.alert('Please give us a star rating before submitting.');
      } else {
        Alert.alert('Hold on!', 'Please give us a star rating before submitting.');
      }
      return;
    }
    // Store feedback in Zustand
    submitFeedback(rating, [...selectedCats], feedbackText);
    setSubmitted(true);

    if (Platform.OS === 'web') {
      window.alert('Thank you! 🎉\n\nYour feedback has been submitted. We appreciate your help improving DishDash!');
      resetForm();
    } else {
      Alert.alert(
        'Thank you! 🎉',
        'Your feedback has been submitted. We appreciate your help improving DishDash!',
        [{ text: 'OK', onPress: resetForm }]
      );
    }
  };

  const resetForm = () => {
    setRating(0);
    setSelectedCats([]);
    setFeedbackText('');
    setSubmitted(false);
    setShowNewForm(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SharedHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Already Submitted Banner ─── */}
        {hasPreviousFeedback && !showNewForm ? (
          <View style={styles.thankYouSection}>
            <View style={styles.thankYouCard}>
              <Text style={styles.thankYouEmoji}>🎉</Text>
              <Text style={styles.thankYouTitle}>Thanks for your feedback!</Text>
              <Text style={styles.thankYouSubtitle}>
                You've shared {feedbackHistory.length} {feedbackHistory.length === 1 ? 'review' : 'reviews'} with us. Your input helps make DishDash better for everyone.
              </Text>

              {/* Last feedback summary */}
              {lastFeedback && (
                <View style={styles.lastFeedbackCard}>
                  <Text style={styles.lastFeedbackLabel}>YOUR LATEST REVIEW</Text>
                  <View style={styles.lastStarsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= lastFeedback.rating ? 'star' : 'star-outline'}
                        size={20}
                        color={star <= lastFeedback.rating ? '#FCCC38' : colors.outlineVariant}
                      />
                    ))}
                  </View>
                  {lastFeedback.text ? (
                    <Text style={styles.lastFeedbackText} numberOfLines={2}>
                      "{lastFeedback.text}"
                    </Text>
                  ) : null}
                </View>
              )}

              <TouchableOpacity
                style={styles.newFeedbackBtn}
                onPress={() => setShowNewForm(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="create-outline" size={18} color={colors.onPrimary} />
                <Text style={styles.newFeedbackBtnText}>Share More Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* ─── Title Section ─── */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                {showNewForm ? 'Share More\nFeedback' : "We'd Love Your\nFeedback"}
              </Text>
              <Text style={styles.subtitle}>
                {showNewForm
                  ? 'We love hearing from you again! Tell us what else is on your mind.'
                  : 'Help us refine the artisan experience. Your insights are the secret ingredients to our recipe for success.'}
              </Text>
            </View>

            {/* ─── Star Rating ─── */}
            <View style={styles.ratingCard}>
              <Text style={styles.ratingPrompt}>How would you rate your culinary journey?</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    style={styles.starBtn}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={36}
                      color={star <= rating ? '#FCCC38' : colors.outlineVariant}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text style={styles.ratingLabel}>
                  {rating === 5 ? 'Amazing!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Could be better' : 'Needs work'}
                </Text>
              )}
            </View>

            {/* ─── Category Chips ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>WHAT CAUGHT YOUR ATTENTION?</Text>
              <View style={styles.chipsRow}>
                {CATEGORIES.map((cat) => {
                  const selected = selectedCats.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => toggleCategory(cat)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── Text Input ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SHARE YOUR THOUGHTS</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tell us about your experience or report an issue..."
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
            </View>

            {/* ─── Photo Upload Placeholder ─── */}
            <View style={styles.uploadCard}>
              <View style={styles.uploadThumb}>
                <Ionicons name="image-outline" size={28} color={colors.onSurfaceVariant} />
              </View>
              <View style={styles.uploadInfo}>
                <Text style={styles.uploadTitle}>Add a screenshot?</Text>
                <Text style={styles.uploadHint}>A picture helps us understand better.</Text>
              </View>
              <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8}>
                <Ionicons name="camera-outline" size={22} color={colors.onTertiaryContainer} />
              </TouchableOpacity>
            </View>

            {/* ─── Submit Button ─── */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Submit Feedback</Text>
              <Ionicons name="send" size={18} color={colors.onPrimary} />
            </TouchableOpacity>

            <Text style={styles.finePrint}>
              By submitting, you agree to our Community Guidelines.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────── Styles ─────────── */
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 72;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: TAB_BAR_HEIGHT + 30,
  },

  /* Title */
  titleSection: { marginBottom: 28 },
  title: {
    fontSize: 30,
    fontFamily: fonts.display,
    color: colors.onBackground,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
  },

  /* Star Rating */
  ratingCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  ratingPrompt: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  starBtn: {
    padding: 2,
  },
  ratingLabel: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },

  /* Section */
  section: { marginBottom: 28 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 2,
  },

  /* Chips */
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  chipSelected: {
    backgroundColor: colors.secondaryContainer,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
  },
  chipTextSelected: {
    color: '#516027',
  },

  /* Text Input */
  textInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 18,
    minHeight: 130,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurface,
    lineHeight: 21,
  },

  /* Upload */
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 28,
    shadowColor: '#522613',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadInfo: { flex: 1 },
  uploadTitle: {
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    marginBottom: 2,
  },
  uploadHint: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
  },
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Submit */
  submitBtn: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },
  finePrint: {
    fontSize: 11,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.6,
    paddingBottom: 16,
  },

  /* Thank You / Already Submitted */
  thankYouSection: {
    flex: 1,
    paddingTop: 20,
  },
  thankYouCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: 28,
    alignItems: 'center',
  },
  thankYouEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  thankYouTitle: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: 8,
  },
  thankYouSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  lastFeedbackCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  lastFeedbackLabel: {
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  lastStarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  lastFeedbackText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurface,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 19,
  },
  newFeedbackBtn: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  newFeedbackBtnText: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },
});
