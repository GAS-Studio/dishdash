import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
  TextInput, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts, radius } from '../constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileModal({ visible, onClose }: Props) {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Avatar */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>

          {/* User info */}
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          {/* Change password section */}
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
              <Ionicons name="key-outline" size={20} color={colors.onSurface} />
              <Text style={styles.menuItemText}>Change Password</Text>
            </TouchableOpacity>
          )}

          {/* Logout button */}
          <TouchableOpacity
            style={[styles.logoutBtn, loading && styles.btnDisabled]}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#D32F2F" size="small" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
                <Text style={styles.logoutText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.onPrimary,
  },
  userName: {
    fontSize: 20,
    fontFamily: fonts.displayBold,
    color: colors.onBackground,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurface,
  },
  changePasswordSection: {
    width: '100%',
    marginBottom: 12,
  },
  passwordInput: {
    width: '100%',
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurface,
    marginBottom: 12,
  },
  passwordBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.onPrimary,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: radius.full,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: fonts.bodySemiBold,
    color: '#D32F2F',
  },
});
