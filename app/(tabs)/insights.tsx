import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InsightsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={theme.theme.typography.header}>Insights</Text>
      </View>
      <View style={styles.content}>
        <Text style={theme.theme.typography.body}>Your meal insights and statistics will appear here.</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

