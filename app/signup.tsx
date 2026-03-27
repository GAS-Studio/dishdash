import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../constants/theme';
import { useMealStore } from '../store/useMealStore';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useMealStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSignUp = () => {
    if (!name.trim() || !email.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please fill in your name and email.');
      } else {
        Alert.alert('Missing Info', 'Please fill in your name and email.');
      }
      return;
    }
    signUp(name.trim(), email.trim());
    router.replace('/(tabs)');
  };

  const handleSocialSignUp = () => {
    signUp('DishDash User', 'user@dishdash.app');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
          </TouchableOpacity>

          {/* Logo */}
          <Text style={styles.logoText}>
            <Text style={styles.logoDish}>Dish</Text>
            <Text style={styles.logoDash}>Dash</Text>
          </Text>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the DishDash community and start cooking smarter</Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={colors.outline}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={colors.outline}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleSocialSignUp} activeOpacity={0.85}>
            <Ionicons name="logo-google" size={20} color={colors.onSurface} />
            <Text style={styles.socialBtnText}>Sign up with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} onPress={handleSocialSignUp} activeOpacity={0.85}>
            <Ionicons name="logo-apple" size={20} color={colors.onSurface} />
            <Text style={styles.socialBtnText}>Sign up with Apple</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.switchLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: { fontSize: 30, alignSelf: 'center', marginBottom: 24 },
  logoDish: { fontFamily: fonts.displayBold, color: colors.primary },
  logoDash: { fontFamily: fonts.displayBold, color: colors.secondary },
  title: {
    fontSize: 28, fontFamily: fonts.display,
    color: colors.onBackground, textAlign: 'center', marginBottom: 6,
  },
  subtitle: {
    fontSize: 14, fontFamily: fonts.body,
    color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 32,
  },
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 13, fontFamily: fonts.bodySemiBold,
    color: colors.onSurface, marginBottom: 8, marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1, borderColor: colors.outlineVariant,
    borderRadius: radius.md, paddingHorizontal: 14, height: 50,
  },
  input: {
    flex: 1, fontSize: 14, fontFamily: fonts.body, color: colors.onSurface,
  },
  primaryBtn: {
    backgroundColor: colors.primary, paddingVertical: 16,
    borderRadius: radius.full, alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
    marginTop: 8, marginBottom: 20,
  },
  primaryBtnText: { fontSize: 16, fontFamily: fonts.bodyBold, color: colors.onPrimary },
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.outlineVariant },
  dividerText: { fontSize: 12, fontFamily: fonts.body, color: colors.onSurfaceVariant },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.surfaceContainerLowest, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: radius.full,
    paddingVertical: 14, marginBottom: 12,
  },
  socialBtnText: { fontSize: 14, fontFamily: fonts.bodySemiBold, color: colors.onSurface },
  switchRow: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 20,
  },
  switchText: { fontSize: 14, fontFamily: fonts.body, color: colors.onSurfaceVariant },
  switchLink: { fontSize: 14, fontFamily: fonts.bodyBold, color: colors.primary },
});
