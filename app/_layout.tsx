import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

export default function AppLayout() {
  return (
    <ThemeProvider>
      <TabsNavigator />
    </ThemeProvider>
  );
}

function TabsNavigator() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = 'home';
          } else if (route.name === 'log') {
            iconName = 'search';
          } else if (route.name === 'meals') {
            iconName = 'pricetag';
          } else if (route.name === 'progress') {
            iconName = 'stats-chart';
          } else if (route.name === 'profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
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
        name="log"
        options={{
          title: 'Log',
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

