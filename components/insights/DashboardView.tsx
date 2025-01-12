import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { InsightData } from '../../utils/insights';
import { BarChart } from './charts/BarChart';
import { HorizontalBarChart } from './charts/HorizontalBarChart';
import { CustomPieChart } from './charts/PieChart';
import { Ionicons } from '@expo/vector-icons';

interface DashboardViewProps {
  data: InsightData;
}

interface InsightCardProps {
  title: string;
  children: React.ReactNode;
  hasData: boolean;
  defaultExpanded?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  children,
  hasData,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.card, !isExpanded && styles.collapsedCard]}>
      <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#6B7280" 
        />
      </TouchableOpacity>
      {isExpanded && (
        <>
          {hasData ? (
            children
          ) : (
            <Text style={styles.noDataText}>
              Not enough data to show insights yet. Keep logging your meals!
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export function DashboardView({ data }: DashboardViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const restaurantPeriods = ['This Month', 'This Year', 'All Time'];
  const restaurantData = [
    data.mostVisitedRestaurants.thisMonth.slice(0, 5),
    data.mostVisitedRestaurants.thisYear.slice(0, 5),
    data.mostVisitedRestaurants.allTime.slice(0, 5)
  ];

  const dishData = data.mostCookedDishes.slice(0, 3).map(d => ({
    label: d.name,
    value: d.count
  }));

  const ingredientData = data.topIngredients.slice(0, 5).map((i, index) => ({
    label: i.name,
    value: i.count,
    color: colors[index % colors.length]
  }));

  console.log(ingredientData);

  const hasRestaurantData = restaurantData.some(period => period.length > 0);
  const hasDishData = data.mostCookedDishes.length > 0;
  const hasIngredientData = data.topIngredients.length > 0;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const page = Math.round(contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <InsightCard 
        title="Top 5 Most visited restaurants" 
        hasData={hasRestaurantData}
        defaultExpanded={true}
      >
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {restaurantData.map((periodData, index) => (
              <View key={index} style={styles.chartContainer}>
                <BarChart data={periodData.map(r => ({ label: r.name, value: r.count }))} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {restaurantPeriods.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentPage === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
          <Text style={styles.periodText}>{restaurantPeriods[currentPage]}</Text>
        </View>
      </InsightCard>

      <InsightCard 
        title="Most cooked dishes" 
        hasData={hasDishData}
      >
        <HorizontalBarChart data={dishData} />
      </InsightCard>

      <InsightCard 
        title="Top ingredients used" 
        hasData={hasIngredientData}
      >
        <CustomPieChart data={ingredientData} />
      </InsightCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  collapsedCard: { 
    paddingBottom: 20,
  },
  chartContainer: {
    width: SCREEN_WIDTH - 72,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6B7280',
  },
  periodText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
});

