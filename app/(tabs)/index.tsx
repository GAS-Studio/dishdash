import { View, Text, StyleSheet } from 'react-native';

export default function SwipeDeckScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipe Deck</Text>
      <Text style={styles.subtitle}>Swipe right to add to plan · Swipe up to skip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});
