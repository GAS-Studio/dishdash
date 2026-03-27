import { Redirect } from 'expo-router';
import { useMealStore } from '../store/useMealStore';

export default function RootIndex() {
  const { isLoggedIn } = useMealStore();

  // Returning user → go straight to the app
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // New user → show landing page
  return <Redirect href="/landing" />;
}
