import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function RootIndex() {
  const { isLoggedIn, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F0' }}>
        <ActivityIndicator size="large" color="#E07A5F" />
      </View>
    );
  }

  // Returning user → go straight to the app
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // New user → show landing page
  return <Redirect href="/landing" />;
}
