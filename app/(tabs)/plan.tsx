import { View, Text, StyleSheet } from 'react-native';

export default function TodaysPlanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Plan</Text>
      <Text style={styles.subtitle}>Your selected meals will appear here</Text>
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
