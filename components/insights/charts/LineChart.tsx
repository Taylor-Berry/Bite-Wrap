import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function LineChart({ data }: LineChartProps) {
  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  // Create a smooth line path
  const getPath = () => {
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - ((item.value - minValue) / range) * 100
    }));

    const path = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      
      // Calculate control points for smooth curve
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) * 2 / 3;
      const cp2y = point.y;
      
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, '');

    return path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Path
            d={getPath()}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
        </Svg>
      </View>
      <View style={styles.labels}>
        {data.map((item) => (
          <Text key={item.label} style={styles.label} numberOfLines={1}>
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
  chartContainer: {
    flex: 1,
    marginBottom: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});

