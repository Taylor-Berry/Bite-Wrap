import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Animated
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addLog, addRecipe, getRecipes, deleteRecipe, Recipe } from '../utils/database';
import { format } from 'date-fns';
import { MealTypeModal } from '../components/MealTypeModal';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/png';

type Tab = 'search' | 'recipe';

const PopularFoodCard = ({ 
  name, 
  calories,
  icon = 'leaf-outline',
  onPress
}: { 
  name: string; 
  calories: number;
  icon?: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  
  return (
    <Pressable 
      style={[styles.foodCard, { borderRadius: theme.theme.shapes.borderRadius }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={24} color={theme.theme.colors.text} />
      <Text style={[theme.theme.typography.body, styles.foodName]}>{name}</Text>
    </Pressable>
  );
};

const RecentItemCard = ({ 
  name, 
  calories,
  time,
  onPress
}: { 
  name: string; 
  calories: number;
  time: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  
  return (
    <Pressable 
      style={[styles.recentItemCard, { borderRadius: theme.theme.shapes.borderRadius }]}
      onPress={onPress}
    >
      <View style={styles.recentItemInfo}>
        <Text style={[theme.theme.typography.body, styles.recentItemName]}>{name}</Text>
        <Text style={theme.theme.typography.caption}>{time}</Text>
      </View>
    </Pressable>
  );
};

const RestaurantCard = ({ 
  name, 
  image,
  onPress
}: { 
  name: string; 
  image: any;
  onPress: () => void;
}) => {
  const theme = useTheme();
  
  return (
    <Pressable 
      style={styles.restaurantCard}
      onPress={onPress}
    >
      <Image 
        source={image}
        style={[styles.restaurantImage, { borderRadius: theme.theme.shapes.borderRadius }]} 
      />
      <Text style={[theme.theme.typography.body, styles.restaurantName]}>{name}</Text>
    </Pressable>
  );
};

const RecipeCard = ({
  recipe,
  onPress,
  onDelete
}: {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const theme = useTheme();

  return (
    <Pressable 
      style={[styles.recipeCard, { borderRadius: theme.theme.shapes.borderRadius }]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.image }}
          style={styles.recipeImage}
          defaultSource={{ uri: DEFAULT_IMAGE }}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();  // Prevent triggering the parent's onPress
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={[theme.theme.typography.body, styles.recipeName]}>{recipe.name}</Text>
      </View>
    </Pressable>
  );
};

export default function LogScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { date, mealType } = useLocalSearchParams<{ date: string; mealType?: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isMealTypeModalVisible, setIsMealTypeModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{
    name: string;
    image?: any;
    location?: string;
  } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const fetchRecipes = async () => {
    const fetchedRecipes = await getRecipes();
    setRecipes(fetchedRecipes);
    setFilteredRecipes(fetchedRecipes);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (activeTab === 'recipe') {
      const filtered = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const tabs: Tab[] = ['search', 'recipe'];

  const handleAddMeal = (name: string, image?: any, location?: string) => {
    // Convert local image assets to URI
    let finalImage = image;
    
    if (location === 'home') {
      // For recipes, find the original recipe and use its image
      const recipe = recipes.find(r => r.name === name);
      if (recipe) {
        finalImage = recipe.image;
      }
    } else if (typeof image === 'number') {
      // For restaurant images (local assets)
      finalImage = Image.resolveAssetSource(image).uri;
    }

    setSelectedMeal({ 
      name, 
      image: finalImage,
      location 
    });

    if (mealType) {
      handleAddMealWithType(mealType as 'breakfast' | 'lunch' | 'dinner', '');
    } else {
      setIsMealTypeModalVisible(true);
    }
  };

  const handleAddMealWithType = async (mealType: 'breakfast' | 'lunch' | 'dinner', description: string) => {
    if (selectedMeal) {
      const now = new Date();
      const location = selectedMeal.location || 'home';
      const isRecipe = location === 'home';
      
      const newLog = {
        id: now.getTime().toString(),
        date: date,
        meals: [{
          id: now.getTime().toString(),
          name: selectedMeal.name,
          time: format(now, 'HH:mm'),
          mealType,
          location,
          description,
          image: selectedMeal.image, 
          isRecipe,
        }]
      };
      await addLog(newLog);
      Alert.alert('Meal added successfully!');
      setSelectedMeal(null);
      router.back();
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            await deleteRecipe(recipeId);
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderSearchContent = () => (
    <>
      <View style={styles.section}>
        <Text style={theme.theme.typography.title}>Favorite Places to Eat</Text>
        <View style={styles.foodGrid}>
          <PopularFoodCard 
            name="TacoBell" 
            calories={120} 
            onPress={() => handleAddMeal("TacoBell", null, "TacoBell")} 
          />
          <PopularFoodCard 
            name="Zaxby's" 
            calories={30} 
            onPress={() => handleAddMeal("Zaxby's",  null, "Zaxby's")} 
          />
          <PopularFoodCard 
            name="Cook Out" 
            calories={50} 
            onPress={() => handleAddMeal("Cook Out", null, "Cook Out")} 
          />
          <PopularFoodCard 
            name="McDonald's" 
            calories={200} 
            onPress={() => handleAddMeal("McDonald's", null, "McDonald's")} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={theme.theme.typography.title}>Recent Restaurants</Text>
        <View style={styles.recentItemsContainer}>
          <RecentItemCard 
            name="Chicken Sandwich" 
            calories={450} 
            time="2 days ago" 
            onPress={() => handleAddMeal("Chicken Sandwich", 450)} 
          />
          <RecentItemCard 
            name="Greek Yogurt" 
            calories={150} 
            time="3 days ago" 
            onPress={() => handleAddMeal("Greek Yogurt", 150)} 
          />
          <RecentItemCard 
            name="Banana" 
            calories={105} 
            time="4 days ago" 
            onPress={() => handleAddMeal("Banana", 105)} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={theme.theme.typography.title}>Nearby Restaurants</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.restaurantsScroll}
        >
          <RestaurantCard
            name="McDonald's"
            image={require('../assets/images/restaurants/mcdonalds.jpg')}
            onPress={() => handleAddMeal("Big Mac", require('../assets/images/restaurants/mcdonalds.jpg'), "McDonald's")}
          />
          <RestaurantCard
            name="Chipotle"
            image={require('../assets/images/restaurants/chipotle.jpg')}
            onPress={() => handleAddMeal("Burrito Bowl", require('../assets/images/restaurants/chipotle.jpg'), "Chipotle")}
          />
        </ScrollView>
      </View>
    </>
  );

  const renderRecipeContent = () => (
    <View style={styles.section}>
      <Text style={theme.theme.typography.title}>Recipes</Text>
      <View style={styles.recipeList}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={() => handleAddMeal(recipe.name, recipe.image, "home")}
            onDelete={() => handleDeleteRecipe(recipe.id)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={theme.theme.typography.header}>
          {mealType ? `Add ${mealType}` : 'Log a meal'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.theme.colors.textSecondary} />
        <TextInput
          placeholder="Search food items"
          value={searchQuery}
          onChangeText={handleSearch}
          style={[styles.searchInput, { color: theme.theme.colors.text }]}
          placeholderTextColor={theme.theme.colors.textSecondary}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'search' ? renderSearchContent() : renderRecipeContent()}
      </ScrollView>

      {activeTab === 'recipe' && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/add-recipe')}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <MealTypeModal
        isVisible={isMealTypeModalVisible}
        onClose={() => setIsMealTypeModalVisible(false)}
        onSelect={handleAddMealWithType}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  doneButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 12,
  },
  foodCard: {
    width: '45%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    margin: 8,
    alignItems: 'center',
  },
  foodName: {
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  recentItemsContainer: {
    marginTop: 12,
  },
  recentItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginBottom: 8,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    marginBottom: 4,
  },
  recentItemCalories: {
    fontWeight: 'bold',
  },
  restaurantsScroll: {
    marginTop: 12,
    marginLeft: -16,
    paddingLeft: 16,
  },
  restaurantCard: {
    marginRight: 16,
    width: 200,
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  restaurantName: {
    marginBottom: 0,
  },
  recipeList: {
    marginTop: 12,
  },
  recipeCard: {
    marginBottom: 24,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'black',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

