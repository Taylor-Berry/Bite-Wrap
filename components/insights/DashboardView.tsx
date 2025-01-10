import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../ThemeProvider';
import { InsightData } from '../../utils/insights';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const CHART_COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
];

interface DashboardViewProps {
  data: InsightData;
}

interface ChartSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, children, isExpanded, onToggle }) => {
  const theme = useTheme();
  const heightAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <View style={styles.chartSection}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[theme.theme.typography.title, styles.sectionTitle]}>
          {title}
        </Text>
        <Animated.View style={{
          transform: [{
            rotate: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg']
            })
          }]
        }}>
          <Ionicons name="chevron-down" size={24} color={theme.theme.colors.text} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={{
        maxHeight: heightAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 500]
        }),
        opacity: heightAnim,
        overflow: 'hidden'
      }}>
        {children}
      </Animated.View>
    </View>
  );
};

const BubbleChart: React.FC<{ data: { name: string; count: number }[] }> = ({ data }) => {
  const theme = useTheme();
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <View style={styles.bubbleContainer}>
      {data.map((item, index) => {
        const size = 40 + (item.count / maxCount) * 60;
        return (
          <View
            key={item.name}
            style={[
              styles.bubble,
              {
                width: size,
                height: size,
                backgroundColor: `rgba(0, 0, 0, ${0.1 + (item.count / maxCount) * 0.2})`,
              }
            ]}
          >
            <Text style={[styles.bubbleText, { fontSize: 12 + (item.count / maxCount) * 4 }]}>
              {item.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export function DashboardView({ data }: DashboardViewProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const [expandedSection, setExpandedSection] = useState('restaurants');

  const chartConfig = {
    backgroundGradientFrom: theme.theme.colors.background,
    backgroundGradientTo: theme.theme.colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const restaurantData = {
    labels: data.favoriteRestaurants.map(() => ''),
    datasets: [{
      data: data.favoriteRestaurants.map(r => r.count),
      colors: CHART_COLORS.map(color => () => color)
    }]
  };

  const recipeData = {
    labels: data.mostCookedDishes.map(r => r.name.slice(0, 10)),
    datasets: [{
      data: data.mostCookedDishes.map(r => r.count)
    }]
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ChartSection 
        title="Restaurant Visits" 
        isExpanded={expandedSection === 'restaurants'}
        onToggle={() => setExpandedSection(expandedSection === 'restaurants' ? '' : 'restaurants')}
      >
        {data.favoriteRestaurants.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={restaurantData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1, index?: number) => 
                  CHART_COLORS[index || 0] || CHART_COLORS[0],
                count: Math.max(...data.favoriteRestaurants.map(r => r.count)),
              }}
              verticalLabelRotation={0}
              showValuesOnTopOfBars
              yAxisLabel={''}
              yAxisSuffix={''}
              fromZero
              segments={Math.max(...data.favoriteRestaurants.map(r => r.count))}
              style={styles.chart}
            />
            <View style={styles.legend}>
              {data.favoriteRestaurants.map((restaurant, index) => (
                <View key={restaurant.name} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: CHART_COLORS[index] }]} />
                  <Text style={styles.legendText}>{restaurant.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={[theme.theme.typography.body, styles.emptyText]}>
            Not enough data to show restaurant visits yet.
          </Text>
        )}
      </ChartSection>

      <ChartSection 
        title="Most Cooked Recipes" 
        isExpanded={expandedSection === 'recipes'}
        onToggle={() => setExpandedSection(expandedSection === 'recipes' ? '' : 'recipes')}
      >
        {data.mostCookedDishes.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={recipeData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(71, 130, 218, ${opacity})`,
              }}
              verticalLabelRotation={30}
              showValuesOnTopOfBars
              yAxisLabel={''}
              yAxisSuffix={''}
              fromZero
              style={styles.chart}
            />
          </View>
        ) : (
          <Text style={[theme.theme.typography.body, styles.emptyText]}>
            Not enough data to show recipes yet.
          </Text>
        )}
      </ChartSection>

      <ChartSection 
        title="Top Ingredients" 
        isExpanded={expandedSection === 'ingredients'}
        onToggle={() => setExpandedSection(expandedSection === 'ingredients' ? '' : 'ingredients')}
      >
        {data.topIngredients.length > 0 ? (
          <View style={styles.chartContainer}>
            <BubbleChart data={data.topIngredients} />
          </View>
        ) : (
          <Text style={[theme.theme.typography.body, styles.emptyText]}>
            Not enough data to show ingredients yet.
          </Text>
        )}
      </ChartSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chartSection: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    marginBottom: 0,
  },
  chartContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  bubble: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  bubbleText: {
    color: '#000',
    textAlign: 'center',
  },
  legend: {
    marginTop: 16,
    flexDirection: 'column',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

