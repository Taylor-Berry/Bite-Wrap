import { Stack } from 'expo-router';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../components/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function RootLayout() {
  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="log" options={{ presentation: 'modal' }} />
              <Stack.Screen name="add-recipe" options={{ presentation: 'modal' }} />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
}

