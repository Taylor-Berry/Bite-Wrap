import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Svg, { Text as SvgText } from 'react-native-svg';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function CustomPieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const screenWidth = Dimensions.get("window").width;

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const pieData = data.map((item) => ({
    name: `${item.label} (${Math.round((item.value / totalValue) * 100)}%)`,
    population: item.value,
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  }));

  console.log(pieData);

  const radius = (screenWidth - 60) / 4;
  const centerX = screenWidth / 2 - 30;
  const centerY = 110;

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 10]}
        absolute
      />
      <View style={styles.container}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

