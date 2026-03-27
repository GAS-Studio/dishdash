import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      showAlert('Missing Info', 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      showAlert('Missing Info', 'Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const message = e.message || 'Login failed. Please try again.';
      setError(message);
      showAlert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showAlert('Email Required', 'Please enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      showAlert('Check Your Email', 'We sent you a password reset link.');
    } catch (e: any) {
      showAlert('Error', e.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    // TODO: Implement Google OAuth
    showAlert('Coming Soon', 'Google sign-in will be available soon!');
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

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your culinary journey</Text>

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
                placeholder="Enter password"
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

          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleSocialLogin} activeOpacity={0.85}>
            <Ionicons name="logo-google" size={20} color={colors.onSurface} />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} onPress={handleSocialLogin} activeOpacity={0.85}>
            <Ionicons name="logo-apple" size={20} color={colors.onSurface} />
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/signup')}>
              <Text style={styles.switchLink}>Sign Up</Text>
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
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 12 },
  forgotText: { fontSize: 13, fontFamily: fonts.bodySemiBold, color: colors.primary },
  errorText: {
    fontSize: 13, fontFamily: fonts.body, color: '#D32F2F',
    textAlign: 'center', marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary, paddingVertical: 16,
    borderRadius: radius.full, alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
    marginBottom: 20,
  },
  primaryBtnText: { fontSize: 16, fontFamily: fonts.bodyBold, color: colors.onPrimary },
  primaryBtnDisabled: { opacity: 0.7 },
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
