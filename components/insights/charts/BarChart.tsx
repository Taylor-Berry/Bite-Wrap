import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function BarChart({ data }: BarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <View key={item.label} style={styles.barWrapper}>
            <Text style={styles.barCount}>{item.value}</Text>
            <View 
              style={[
                styles.bar,
                { 
                  height: `${(item.value / maxValue) * 100}%`,
                }
              ]} 
            />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {data.map((item) => (
          <Text key={item.label} style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  barWrapper: {
    flex: 1,
    marginHorizontal: 12,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: '#000000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  barCount: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
});

