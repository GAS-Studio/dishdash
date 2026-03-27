import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
  TextInput, ActivityIndicator, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts, radius } from '../constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({ visible, onClose }: Props) {
  const router = useRouter();
  const { user, signOut, updatePassword } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose();
      router.replace('/landing');
    } catch (e: any) {
      showAlert('Error', e.message || 'Could not log out.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      showAlert('Success', 'Password updated successfully.');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (e: any) {
      showAlert('Error', e.message || 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() || '?';
  const userName = user?.user_metadata?.full_name || 'DishDash User';
  const userEmail = user?.email || '';

  if (!visible) return null;

  return (
    <>
      {/* Backdrop to catch clicks outside */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Dropdown positioned relative to parent */}
      <View style={styles.dropdown}>
        {/* User info header */}
        <View style={styles.userHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu items */}
        {showChangePassword ? (
          <View style={styles.changePasswordSection}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New password (min 6 chars)"
              placeholderTextColor={colors.outline}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.passwordBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowChangePassword(false);
                  setNewPassword('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, loading && styles.btnDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.onPrimary} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowChangePassword(true)}
          >
            <Ionicons name="key-outline" size={18} color={colors.onSurface} />
            <Text style={styles.menuItemText}>Change Password</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#D32F2F" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 998,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    zIndex: 999,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: fonts.displayBold,
    color: colors.onPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.onBackground,
  },
  userEmail: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurface,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: '#D32F2F',
  },
  changePasswordSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  passwordInput: {
    height: 40,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurface,
    marginBottom: 8,
  },
  passwordBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
  },
  cancelBtnText: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  saveBtnText: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.onPrimary,
  },
  btnDisabled: {
    opacity: 0.7,
  },
});
