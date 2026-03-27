import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../constants/theme';
import ProfileDropdown from './ProfileDropdown';

export default function SharedHeader() {
  const router = useRouter();
  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/landing')} activeOpacity={0.8}>
        <Text style={styles.logoText}>
          <Text style={styles.logoDish}>Dish</Text>
          <Text style={styles.logoDash}>Dash</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.planBtn}
          onPress={() => router.push('/(tabs)/plan')}
          activeOpacity={0.8}
        >
          <Text style={styles.planBtnText}>Today's Plan</Text>
        </TouchableOpacity>

        {/* Profile button container - dropdown positions relative to this */}
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => setProfileVisible(!profileVisible)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>

          <ProfileDropdown
            visible={profileVisible}
            onClose={() => setProfileVisible(false)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    zIndex: 1000,
  },
  logoText: {
    fontSize: 26,
  },
  logoDish: {
    fontFamily: fonts.displayBold,
    color: colors.primary,
  },
  logoDash: {
    fontFamily: fonts.displayBold,
    color: colors.secondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
  },
  planBtnText: {
    fontSize: 12,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
  },
  profileContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  profileBtn: {
    padding: 4,
  },
});
