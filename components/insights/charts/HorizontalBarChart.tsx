import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HorizontalBarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar,
                { width: `${(item.value / maxValue) * 100}%` }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    width: 80,
    fontSize: 13,
    color: '#6B7280',
  },
  barContainer: {
    flex: 1,
    height: 24,
  },
  bar: {
    height: '100%',
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
});

