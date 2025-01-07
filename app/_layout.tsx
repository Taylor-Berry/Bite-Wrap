import { Stack } from 'expo-router';
import { ThemeProvider } from '../components/ThemeProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="login"
          />
          <Stack.Screen
            name="signup"
          />
          <Stack.Screen
            name="forgot-password"
          />
          <Stack.Screen
            name="(tabs)"
          />
          <Stack.Screen
            name="log"
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="add-recipe"
            options={{
              presentation: 'modal',
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

