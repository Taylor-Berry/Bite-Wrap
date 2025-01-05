import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MealsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={theme.typography.header}>Meals</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

