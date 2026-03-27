import React, { useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function LandingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpBtn} onPress={() => router.push('/signup')} activeOpacity={0.85}>
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Section ─── */}
        <View style={styles.hero}>
          {/* Badge */}
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={13} color={colors.onTertiaryContainer} />
            <Text style={styles.badgeText}>AI-POWERED COOKING</Text>
          </View>

          <Text style={styles.heroTitle}>
            Your Pantry,{'\n'}
            <Text style={styles.heroTitleAccent}>Perfected.</Text>
          </Text>

          <Text style={styles.heroDesc}>
            Dish Dash is your AI-powered companion that turns pantry ingredients into
            delicious meals in minutes. Skip the decision fatigue and rediscover the
            joy of household cooking.
          </Text>

          {/* CTA Buttons */}
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
            <Text style={styles.ctaPrimaryText}>Start Cooking Free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaOutline}
            onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            activeOpacity={0.85}
          >
            <Ionicons name="play-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.ctaOutlineText}>See How It Works</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Hero Image ─── */}
        <View style={styles.heroImageWrap}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJyLjLQ54346oEQe3qB3Fleyt7Rerp9bxYQX32cK2jTHHsSbUblyDiMZIr87mQVj8ziYfWIQChsjnqbQIbisyxxjlv7U4MWhrPS9URzjv5D_6Bfbtl4Sqvmq7NLx6zc7iFzUUt3cSvSxDWbyfqrT53LxpUQ5O5HZXvjoGkjEz-kv_8o-onClX1Od362xd5dZQC8JvxhFTzS6_9MBv-3T3aoc2AmEKZR3cjEhTAnJYk7Owwq_ls469jjXwiW8VWHSgB0Vp0MQ5tvba',
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroGradient} />

          {/* Pantry Scan overlay card */}
          <View style={styles.scanCard}>
            <View style={styles.scanRow}>
              <View style={styles.scanIconWrap}>
                <Ionicons name="cube-outline" size={18} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.scanLabel}>Pantry Scan</Text>
                <Text style={styles.scanValue}>32 Items Found</Text>
              </View>
            </View>
            <View style={styles.scanBar}>
              <View style={styles.scanBarFill} />
            </View>
            <Text style={styles.scanHint}>Suggested: Roasted Tomato Gnocchi</Text>
          </View>
        </View>

        {/* ─── Feature Bento Section ─── */}
        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Master your kitchen.</Text>
          <Text style={styles.sectionSubtitle}>
            No more "What's for dinner?" stress. Just simple, artisanal results every single time.
          </Text>

          {/* Card 1 — Smart Pantry Inventory */}
          <View style={styles.card}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMTUuX-ztkksp16s42nvWE9E_AGvy61O_12OQHy3X89LM0pM7e6CkFD6thjucMOZJrEWyC3mef31lzQWwJx3Pl1W5upcKGGQ11KEZXNxTw3yMybtZOSHNqlUb1-CUYMjdgm3mjBLxV48i225kSCV4oE9p8kc-s-N8kxq5ZHKQvNrZzt_ZdcSFqCndiX5B1eseu6O5fufvmRXqY27ybS_ShSq1z6kAdw4qagLZkJMUbdxPElS7bSdA5awidmYHh2DlpmQTehlprwDYS',
              }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>Smart Pantry Inventory</Text>
            <Text style={styles.cardDesc}>
              Scan your receipts or speak your ingredients. Our AI tracks what you have and warns you before they expire.
            </Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: colors.tertiaryContainer }]}>
                <Text style={[styles.tagText, { color: colors.onTertiaryContainer }]}>Auto-tracking</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colors.secondaryContainer }]}>
                <Text style={[styles.tagText, { color: '#516027' }]}>Expiry Alerts</Text>
              </View>
            </View>
          </View>

          {/* Card 2 — Zero-Waste Mode */}
          <View style={[styles.card, styles.cardPrimary]}>
            <Ionicons name="flash" size={32} color={colors.onPrimary} style={{ marginBottom: 12 }} />
            <Text style={[styles.cardTitle, { color: colors.onPrimary }]}>Zero-Waste Mode</Text>
            <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.8)' }]}>
              Create recipes specifically designed to use up the ingredients that are about to go bad.
            </Text>
            <TouchableOpacity style={styles.cardInvertedBtn} activeOpacity={0.85}>
              <Text style={styles.cardInvertedBtnText}>Try Now</Text>
            </TouchableOpacity>
          </View>

          {/* Card 3 — Weekly Planner */}
          <View style={[styles.card, { backgroundColor: colors.surfaceContainerHighest }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainerLowest }]}>
              <Ionicons name="calendar-outline" size={22} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Weekly Planner</Text>
            <Text style={styles.cardDesc}>
              Sync your meals with your family calendar. Automatically generate grocery lists for missing items.
            </Text>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfTlQy6sSgGfzaUhB_Dh9sFVsPQhFISSaORgm_E9DrhlxD9H6oraVMy8VphbvTSLbGKhuDlfMuYZNHnqo4ax5RPIF1Twjv0r_-ipnuln7ZIsRXi6gosrjN-xsUd7re2TjWOF_D3-CGHw9hVAWxTx7DCP3k_eczQS8lUfs-UJ8qincNxrCA0RY-SceF2bm1qhlyLnwHzy-tXYGgQaY_tDGHicKE9_vFxrbwI3q-kXa3PWQQiYn5Jip91Hika9pA_XXOKA9BM1n5Ugqv',
              }}
              style={styles.cardSmallImage}
            />
          </View>

          {/* Card 4 — AI Sous-Chef */}
          <View style={[styles.card, { backgroundColor: colors.secondaryContainer }]}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJLNPcE-AbJqf1vu5dJ8SeSmdrVQQtLxoy5mt68UhUpPXX3aF5DH-PbPoTDNH4j_mL3030LWUZbwR81fVW35Q80ubLxjA2ciZVFixdGfs2VopBJpBqZHBTy1lwHEvvpsKckOCWCVJm6nshu3ilUwN_Nz45kQHJi5Cgn5Bj5T82jElCM0pMwnLwo1PGVYhOGPeMY_Cb0TDaAMq9TgZTWLv9EoUnJiVwCXGKh4zRyJBRYY9PkAT3AhtaLXy0SYaj-s5fn91Vh17Fj77H',
              }}
              style={styles.cardImage}
            />
            <Text style={[styles.cardTitle, { color: '#516027' }]}>AI Sous-Chef</Text>
            <Text style={[styles.cardDesc, { color: '#516027', opacity: 0.9 }]}>
              Real-time voice guidance as you cook. Ask questions and get instant artisanal alternatives.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────── Styles ─────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerLogo: { height: 52, width: 220 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  loginBtnText: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  signUpBtnText: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },

  /* ScrollView */
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  /* Hero */
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    color: colors.onTertiaryContainer,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 38,
    fontFamily: fonts.display,
    color: colors.onBackground,
    lineHeight: 44,
    marginBottom: 12,
  },
  heroTitleAccent: {
    fontStyle: 'italic',
    color: colors.primary,
  },
  heroDesc: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 23,
    marginBottom: 24,
  },
  ctaPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onPrimary,
  },
  ctaOutline: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  ctaOutlineText: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },

  /* Hero Image */
  heroImageWrap: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 280,
    backgroundColor: colors.surfaceContainer,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(61,26,10,0.35)',
  },
  scanCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: 14,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  scanRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  scanIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    fontSize: 10,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
  },
  scanValue: {
    fontSize: 13,
    fontFamily: fonts.display,
    color: colors.onSurface,
  },
  scanBar: {
    height: 5,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  scanBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  scanHint: {
    fontSize: 9,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  /* Feature Section */
  featureSection: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.onBackground,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: 24,
  },

  /* Feature Cards */
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#522613',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: colors.primary,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    marginBottom: 14,
    backgroundColor: colors.surfaceContainer,
  },
  cardSmallImage: {
    width: '100%',
    height: 100,
    borderRadius: radius.sm,
    marginTop: 12,
    opacity: 0.5,
    backgroundColor: colors.surfaceContainer,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: 12,
  },
  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  tagText: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardInvertedBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.onPrimary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  cardInvertedBtnText: {
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },
});
