import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { useTheme } from '../ThemeProvider';

interface Visit {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  visits: Visit[];
}

export default function ContributionGraphWrapper({ visits }: ContributionGraphProps) {
  const theme = useTheme();
  const today = new Date();
  const currentYear = today.getFullYear();
  const startDate = new Date(currentYear, 0, 1); // January 1st of current year

  // Filter visits to only include current year
  const currentYearVisits = visits.filter(visit => {
    const visitDate = new Date(visit.date);
    return visitDate >= startDate && visitDate <= today;
  });

  // Format data for ContributionGraph
  const formattedData = currentYearVisits.map(visit => ({
    date: visit.date.split('T')[0],
    count: visit.count,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(63, 143, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const screenWidth = Dimensions.get('window').width;
  const graphWidth = screenWidth * 3.7; // Make the graph twice as wide as the screen

  return (
    <View style={styles.container}>
      <Text style={[theme.theme.typography.caption, styles.title]}>
        Visit History
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ContributionGraph
          values={formattedData}
          endDate={new Date(currentYear, 11, 31)} // December 31st of the current year
          numDays={366} // Account for leap years
          width={graphWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.graph}
          squareSize={20}
          gutterSize={5}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    paddingLeft: 16,
  },
  scrollViewContent: {
    paddingRight: 16, // Add some padding to the right for better appearance
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

