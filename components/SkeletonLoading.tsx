import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonProps {
  width: number | string;
  height: number | string;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F5F5F5'],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius: 4,
        },
        style,
      ]}
    />
  );
};

export const SkeletonMealCard = () => (
  <View style={styles.mealCard}>
    <Skeleton width="100%" height={200} />
    <View style={styles.mealInfo}>
      <Skeleton width="70%" height={20} style={styles.mealTitle} />
      <Skeleton width="50%" height={16} style={styles.mealDescription} />
    </View>
  </View>
);

export const SkeletonRestaurantCard = () => (
  <View style={styles.restaurantCard}>
    <Skeleton width="100%" height={120} />
    <Skeleton width="80%" height={16} style={styles.restaurantName} />
  </View>
);

export const SkeletonRecipeCard = () => (
  <View style={styles.recipeCard}>
    <Skeleton width="100%" height={120} />
    <View style={styles.recipeInfo}>
      <Skeleton width="70%" height={16} style={styles.recipeName} />
      <Skeleton width="40%" height={14} style={styles.recipeTime} />
    </View>
  </View>
);

export const SkeletonSettingItem = () => (
  <View style={styles.settingItem}>
    <Skeleton width={40} height={40} style={styles.settingIcon} />
    <View style={styles.settingContent}>
      <Skeleton width="60%" height={18} style={styles.settingTitle} />
      <Skeleton width="40%" height={14} style={styles.settingSubtitle} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  mealCard: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mealInfo: {
    padding: 16,
  },
  mealTitle: {
    marginBottom: 8,
  },
  mealDescription: {
    marginBottom: 4,
  },
  restaurantCard: {
    marginRight: 16,
    width: 200,
  },
  restaurantName: {
    marginTop: 8,
  },
  recipeCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeInfo: {
    padding: 8,
  },
  recipeName: {
    marginBottom: 4,
  },
  recipeTime: {
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    borderRadius: 8,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    marginBottom: 4,
  },
  settingSubtitle: {
    marginTop: 2,
  },
});

