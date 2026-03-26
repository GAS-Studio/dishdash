import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, radius } from '../../constants/theme';

export default function BrowseScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Culinary Editorial</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔍</Text>
          <Text style={styles.title}>Refine Your Palate</Text>
          <Text style={styles.subtitle}>
            Filter by cuisine, nutrition goals & meal type.{'\n'}
            Person D will wire this up!
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#522613',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  icon: { fontSize: 52 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  badge: {
    marginTop: 8,
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.onTertiaryContainer,
    letterSpacing: 1.5,
  },
});
