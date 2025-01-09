'use client';

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert 
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentLocation } from '../../utils/location';
import { searchNearbyRestaurants, Restaurant } from '../../utils/restaurants';
import { addFavoriteRestaurant } from '../../utils/favorites';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/png';

const RestaurantCard = ({ 
  restaurant, 
  selected, 
  onPress 
}: { 
  restaurant: Restaurant; 
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity 
    style={[styles.card, selected && styles.cardSelected]} 
    onPress={onPress}
  >
    <Image 
      source={{ uri: restaurant.image || DEFAULT_IMAGE }} 
      style={styles.cardImage}
      defaultSource={{ uri: DEFAULT_IMAGE }}
    />
    <Text style={styles.cardTitle}>{restaurant.name}</Text>
    <Text style={styles.cardSubtitle}>{restaurant.category}</Text>
    <View style={styles.selectedIcon}>
      <Ionicons 
        name={selected ? "checkmark-circle" : "checkmark-circle-outline"} 
        size={24} 
        color={selected ? "#007AFF" : "#666"} 
      />
    </View>
  </TouchableOpacity>
);

export default function FavoritePlacesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const locationData = await getCurrentLocation();
        if (locationData) {
          const restaurants = await searchNearbyRestaurants(locationData);
          setNearbyRestaurants(restaurants);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Alert.alert('Error', 'Failed to load nearby restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const togglePlace = (restaurant: Restaurant) => {
    const newSelected = new Set(selectedPlaces);
    if (newSelected.has(restaurant.name)) {
      newSelected.delete(restaurant.name);
    } else {
      newSelected.add(restaurant.name);
    }
    setSelectedPlaces(newSelected);
  };

  const handleDone = async () => {
    try {
      // Add selected restaurants to favorites
      const promises = Array.from(selectedPlaces).map(name => {
        const restaurant = nearbyRestaurants.find(r => r.name === name);
        if (restaurant) {
          return addFavoriteRestaurant(
            restaurant.name,
            restaurant.image || DEFAULT_IMAGE,
            restaurant.address || ''
          );
        }
      });

      await Promise.all(promises);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving favorites:', error);
      Alert.alert('Error', 'Failed to save favorite restaurants');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your favorite places</Text>
        <Text style={styles.subtitle}>Select at least 5 places to get started.</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading nearby restaurants...</Text>
        ) : (
          <View style={styles.grid}>
            {nearbyRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.name}
                restaurant={restaurant}
                selected={selectedPlaces.has(restaurant.name)}
                onPress={() => togglePlace(restaurant)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.doneButton,
            selectedPlaces.size < 5 && styles.doneButtonDisabled
          ]} 
          onPress={handleDone}
          disabled={selectedPlaces.size < 5}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardSelected: {
    backgroundColor: '#E0E0E0',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#000',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  selectedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
});

