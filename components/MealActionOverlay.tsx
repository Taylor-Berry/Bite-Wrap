import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Log } from '../utils/database';

interface MealActionOverlayProps {
  visible: boolean;
  onSelectMealType: (type: 'breakfast' | 'lunch' | 'dinner') => void;
  onClose: () => void;
  existingLogs: Log[];
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function MealActionOverlay({ visible, onSelectMealType, onClose, existingLogs }: MealActionOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const mealTypes: Array<{ type: 'breakfast' | 'lunch' | 'dinner'; icon: string; label: string }> = [
    { type: 'breakfast', icon: 'sunny-outline', label: 'Breakfast' },
    { type: 'lunch', icon: 'restaurant-outline', label: 'Lunch' },
    { type: 'dinner', icon: 'moon-outline', label: 'Dinner' },
  ];

  const isLoggedMealType = (type: 'breakfast' | 'lunch' | 'dinner') => {
    return existingLogs.some(log => log.mealType === type);
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.backdrop} />
        <Animated.View 
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {mealTypes.map((meal) => (
            <TouchableWithoutFeedback 
              key={meal.type} 
              onPress={() => !isLoggedMealType(meal.type) && onSelectMealType(meal.type)}
            >
              <View style={[
                styles.mealTypeButton,
                isLoggedMealType(meal.type) && styles.disabledMealTypeButton
              ]}>
                <Ionicons 
                  name={meal.icon as any} 
                  size={24} 
                  color={isLoggedMealType(meal.type) ? "gray" : "white"} 
                  style={styles.mealTypeIcon} 
                />
                <Text style={[
                  styles.mealTypeText,
                  isLoggedMealType(meal.type) && styles.disabledMealTypeText
                ]}>{meal.label}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 30,
    left: SCREEN_WIDTH / 2 - 140,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 280,
  },
  mealTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  mealTypeIcon: {
    marginBottom: 5,
  },
  mealTypeText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  disabledMealTypeButton: {
    opacity: 0.5,
  },
  disabledMealTypeText: {
    color: 'gray',
  },
});

