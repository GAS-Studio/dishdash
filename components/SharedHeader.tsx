import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius } from '../constants/theme';

export default function SharedHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/landing')} activeOpacity={0.8}>
        <Text style={styles.logoText}>
          <Text style={styles.logoDish}>Dish</Text>
          <Text style={styles.logoDash}>Dash</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.planBtn}
        onPress={() => router.push('/(tabs)/plan')}
        activeOpacity={0.8}
      >
        <Text style={styles.planBtnText}>Today's Plan</Text>
      </TouchableOpacity>
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
});
