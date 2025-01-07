'use client';

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AddRecipesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleSkip = () => {
    router.push('/setup/favorite-places');
  };

  const handleStartAdding = () => {
    router.push('/setup/favorite-places');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Add your recipes</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/plate-illustration.png')} 
          style={styles.illustration}
        />
        
        <Text style={styles.subtitle}>
          It's time to make cooking fun! Add all your favorite recipes.
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.theme.colors.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a recipe"
            placeholderTextColor={theme.theme.colors.textSecondary}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleStartAdding}
        >
          <Text style={styles.buttonText}>Start adding recipes</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

