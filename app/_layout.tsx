import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '../constants/theme';

export default function RootLayout() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.phoneFrame}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 390,
    height: '100%',
    maxHeight: 844,
    backgroundColor: colors.background,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
});
