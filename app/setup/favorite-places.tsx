'use client';

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  image: any;
}

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'McDonald\'s',
    category: 'Fast Food',
    image: require('../../assets/images/restaurants/mcdonalds.jpg'),
  },
  {
    id: '2',
    name: 'Taco Bell',
    category: 'Fast Food',
    image: require('../../assets/images/restaurants/taco-bell.jpg'),
  },
  {
    id: '3',
    name: 'Chick-fil-A',
    category: 'Fast Food',
    image: require('../../assets/images/restaurants/chick-fil-a.jpg'),
  },
  {
    id: '4',
    name: 'Shake Shack',
    category: 'Fast Food',
    image: require('../../assets/images/restaurants/shake-shack.jpg'),
  },
  {
    id: '5',
    name: 'Chipotle',
    category: 'Fast Food',
    image: require('../../assets/images/restaurants/chipotle.jpg'),
  },
];

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
    <Image source={restaurant.image} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{restaurant.name}</Text>
    <Text style={styles.cardSubtitle}>{restaurant.category}</Text>
  </TouchableOpacity>
);

export default function FavoritePlacesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  const togglePlace = (id: string) => {
    const newSelected = new Set(selectedPlaces);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPlaces(newSelected);
  };

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
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
        <View style={styles.grid}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              selected={selectedPlaces.has(restaurant.id)}
              onPress={() => togglePlace(restaurant.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
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
});

