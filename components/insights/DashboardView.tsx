import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, PanResponder, PanResponderGestureState, Easing } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../ThemeProvider';
import { InsightData } from '../../utils/insights';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Select } from "../../components/ui/select";
import ContributionGraph from './ContributionGraph';
import { SelectNative } from "../ui/select-native";

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

type Restaurant = {
  name: string;
  count: number;
  image?: string;
  visits?: { date: string; count: number; }[];
  color?: string;
};

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
  const [restaurantGraphType, setRestaurantGraphType] = useState<'bar' | 'pie'>('bar');
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
        },
        onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
          if (gestureState.dx > 50) {
            // Swipe right
            setCurrentChartIndex((prevIndex) => (prevIndex - 1 + 2) % 2);
          } else if (gestureState.dx < -50) {
            // Swipe left
            setCurrentChartIndex((prevIndex) => (prevIndex + 1) % 2);
          }
        },
      }),
    []
  );

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -currentChartIndex * screenWidth,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [currentChartIndex, screenWidth]);

  useEffect(() => {
    if (data.favoriteRestaurants.length > 0 && !selectedRestaurant) {
      setSelectedRestaurant(data.favoriteRestaurants[0]);
    }
  }, [data.favoriteRestaurants]);

  const RestaurantPieChart = () => (
    <PieChart
      data={data.favoriteRestaurants.map((restaurant, index) => ({
        name: restaurant.name,
        count: restaurant.count,
        color: CHART_COLORS[index],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      }))}
      width={screenWidth - 32}
      height={220}
      chartConfig={chartConfig}
      accessor="count"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  );

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
      colors: [
        (opacity = 1) => CHART_COLORS[0],
        (opacity = 1) => CHART_COLORS[1],
        (opacity = 1) => CHART_COLORS[2],
        (opacity = 1) => CHART_COLORS[3],
        (opacity = 1) => CHART_COLORS[4],
      ],
    }]
  };

  const recipeData = {
    labels: data.mostCookedDishes.map(r => r.name.slice(0, 10)),
    datasets: [{
      data: data.mostCookedDishes.map(r => r.count)
    }]
  };

  const renderCharts = () => {
    return (
      <Animated.View
        style={[
          styles.chartsContainer,
          {
            width: screenWidth * 2,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={{ width: screenWidth }}>
          <BarChart
            data={restaurantData}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              ...chartConfig,
              barPercentage: 1, 
              color: (opacity = 1, index = 0) => {
                return CHART_COLORS[index] || CHART_COLORS[0]; 
              },
              count: Math.max(...data.favoriteRestaurants.map(r => r.count)),
            }}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
            yAxisLabel={''}
            yAxisSuffix={''}
            fromZero
            segments={Math.max(...data.favoriteRestaurants.map(r => r.count))}
            style={styles.chart}
            withCustomBarColorFromData
            flatColor
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
        <View style={{ width: screenWidth }}>
          <View style={styles.contributionSection}>
            <View style={styles.selectContainer}>
              <SelectNative
                value={selectedRestaurant?.name || null}
                onValueChange={(value: string) => {
                  const selected = data.favoriteRestaurants.find(r => r.name === value);
                  setSelectedRestaurant(selected || null);
                }}
                placeholder="Select a restaurant"
                items={data.favoriteRestaurants.map(r => ({
                  label: r.name,
                  value: r.name
                }))}
              />
            </View>
            {selectedRestaurant?.visits && (
              <ContributionGraph visits={selectedRestaurant.visits} />
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ChartSection 
        title="Restaurant Visits" 
        isExpanded={expandedSection === 'restaurants'}
        onToggle={() => setExpandedSection(expandedSection === 'restaurants' ? '' : 'restaurants')}
      >
        {data.favoriteRestaurants.length > 0 ? (
          <View style={styles.chartContainer} {...panResponder.panHandlers}>
            {renderCharts()}
            <View style={styles.graphIndicator}>
              {[0, 1].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    currentChartIndex === index && styles.activeIndicatorDot,
                  ]}
                />
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
    marginBottom: 10,
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
    marginTop: 0,
    flexDirection: 'column',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 16,
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
  graphIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicatorDot: {
    backgroundColor: '#333',
  },
  chartsContainer: {
    flexDirection: 'row',
  },
  contributionSection: {
    gap: 16,
  },
  selectContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 8,
    paddingRight: 40
  },
  selectWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

