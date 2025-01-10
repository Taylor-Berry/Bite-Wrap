import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { InsightData } from '../../utils/insights';
import { BarChart } from './charts/BarChart';
import { HorizontalBarChart } from './charts/HorizontalBarChart';
import { LineChart } from './charts/LineChart';
import { Ionicons } from '@expo/vector-icons';

interface DashboardViewProps {
  data: InsightData;
}

interface InsightCardProps {
  title: string;
  count: number;
  changePercentage: number;
  children: React.ReactNode;
  hasData: boolean;
  defaultExpanded?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  count, 
  changePercentage, 
  children,
  hasData,
  defaultExpanded = false
}) => {
  const theme = useTheme();
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
            <>
              <View style={styles.changeRow}>
                <Text style={styles.thisMonthText}>This month</Text>

              </View>
              {children}
            </>
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

export function DashboardView({ data }: DashboardViewProps) {
  const theme = useTheme();
  
  // Calculate mock percentage changes (replace with real data later)
  const restaurantChange = 12;
  const dishesChange = 8;
  const ingredientsChange = 15;

  const restaurantData = data.favoriteRestaurants.slice(0, 3).map(r => ({
    label: r.name,
    value: r.count
  }));

  const dishData = data.mostCookedDishes.slice(0, 3).map(d => ({
    label: d.name,
    value: d.count
  }));

  const ingredientData = data.topIngredients.slice(0, 3).map(i => ({
    label: i.name,
    value: i.count
  }));

  const hasRestaurantData = data.favoriteRestaurants.length > 0;
  const hasDishData = data.mostCookedDishes.length > 0;
  const hasIngredientData = data.topIngredients.length > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <InsightCard 
        title="Most visited restaurants" 
        count={hasRestaurantData ? data.favoriteRestaurants.length : 0}
        changePercentage={restaurantChange}
        hasData={hasRestaurantData}
        defaultExpanded={true}
      >
        <BarChart data={restaurantData} />
      </InsightCard>

      <InsightCard 
        title="Most cooked dishes" 
        count={hasDishData ? data.mostCookedDishes.length : 0}
        changePercentage={dishesChange}
        hasData={hasDishData}
      >
        <HorizontalBarChart data={dishData} />
      </InsightCard>

      <InsightCard 
        title="Top ingredients used" 
        count={hasIngredientData ? data.topIngredients.length : 0}
        changePercentage={ingredientsChange}
        hasData={hasIngredientData}
      >
        <LineChart data={ingredientData} />
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
  countText: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  thisMonthText: {
    fontSize: 15,
    color: '#6B7280',
    marginRight: 8,
    marginBottom: 12,
  },
  percentageText: {
    fontSize: 15,
    fontWeight: '500',
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
});

