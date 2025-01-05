import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AppLayout() {
  return (
    <ThemeProvider>
      <TabsNavigator />
    </ThemeProvider>
  );
}

function TabsNavigator() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'index') {
              iconName = 'home';
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
            height: 85,
            paddingBottom: 20,
          },
          tabBarItemStyle: {
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 8,
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
          name="meals"
          options={{
            title: 'Meals',
          }}
        />
        <Tabs.Screen
          name="log"
          options={{
            title: '',
            tabBarButton: () => null,
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/log')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'black',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});