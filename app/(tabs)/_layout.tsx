import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { colors, radius } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused }: { name: IoniconsName; color: string; focused: boolean }) {
  if (focused) {
    return (
      <View style={styles.activeIconWrap}>
        <Ionicons name={name} size={22} color="#fff" />
      </View>
    );
  }
  return <Ionicons name={name} size={22} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: 'rgba(255,248,246,0.96)',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 82 : Platform.OS === 'web' ? 80 : 66,
          paddingBottom: Platform.OS === 'ios' ? 22 : Platform.OS === 'web' ? 16 : 8,
          paddingTop: 8,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: '#522613',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 20,
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 10 : 0,
          left: Platform.OS === 'web' ? 8 : 0,
          right: Platform.OS === 'web' ? 8 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="restaurant-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="list-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="camera-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search-outline" color={color} focused={focused} />
          ),
        }}
      />
      {/* Today's Plan — hidden from tab bar, navigated via router.push */}
      <Tabs.Screen
        name="plan"
        options={{
          href: null,
          title: "Today's Plan",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    width: 44,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
});
