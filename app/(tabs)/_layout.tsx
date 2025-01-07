import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  console.log('Current pathname:', pathname);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'index') {
              iconName = 'home';
            } else if (route.name === 'insights') {
              iconName = 'bar-chart';
            } else if (route.name === 'profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName as any} size={24} color={color} />;
          },
          tabBarActiveTintColor: theme.theme.colors.primary,
          tabBarInactiveTintColor: theme.theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.theme.colors.background,
            borderTopWidth: 0,
            height: 85,
            paddingBottom: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>

    </View>
  );
}

const styles = StyleSheet.create({
});

