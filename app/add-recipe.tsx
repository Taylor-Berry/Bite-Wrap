import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Modal, Dimensions, Alert } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { addRecipe } from '../utils/database';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://placehold.co/600x400/png';

export default function AddRecipeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipIconRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [ingredientsList, setIngredientsList] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [canScroll, setCanScroll] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [ingredientsImage, setIngredientsImage] = useState<string | null>(null);

  const addIngredientInput = () => {
    setIngredientsList([...ingredientsList, '']);
  };

  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredientsList];
    newIngredients[index] = text;
    setIngredientsList(newIngredients);
  };

  const handleSave = async () => {
    if (title && ingredientsList.some(ingredient => ingredient.trim() !== '')) {
      const newRecipe = {
        id: Date.now().toString(),
        name: title,
        calories: 0,
        time: '30 min',
        image: ingredientsImage || DEFAULT_IMAGE,
        instructions,
        ingredients: ingredientsList.filter(i => i.trim() !== '').map(ingredient => ({
          id: Date.now().toString() + Math.random(),
          name: ingredient,
          amount: '',
          unit: ''
        }))
      };
      await addRecipe(newRecipe);
      router.back();
    } else {
      Alert.alert('Error', 'Please provide a title and at least one ingredient.');
    }
  };

  const handleShowTooltip = () => {
    if (tooltipIconRef.current) {
      (tooltipIconRef.current as any).measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setTooltipPosition({ x: pageX, y: pageY });
        setShowTooltip(true);
      });
    }
  };

  const pickImage = async (type: 'recipe' | 'ingredients') => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
      if (type === 'recipe') {
        setImage(result.assets[0].uri);
      } else {
        setIngredientsImage(result.assets[0].uri);
      }
    }
  };

  const isCreateButtonEnabled = title.trim() !== '' && ingredientsList.some(ingredient => ingredient.trim() !== '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Recipe</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Recipe</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title (required)"
          placeholderTextColor="#999"
        />


        <View style={styles.urlSection}>
          <Text style={styles.sectionTitle}>Website URL</Text>
          <TouchableOpacity onPress={handleShowTooltip} ref={tooltipIconRef}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.urlInput}
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          placeholder="www.example.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <View style={styles.ingredientsCard}>
          <View style={styles.ingredientsContent}>
            <View style={styles.ingredientsHeader}>
              <Image
                source={
                  ingredientsImage 
                    ? { uri: ingredientsImage }
                    : require('../assets/images/ingredients-placeholder.jpg')
                }
                style={styles.ingredientsImage}
              />
              <Text style={styles.ingredientsPlaceholder}>Add ingredients</Text>
            </View>
            
            <ScrollView 
              style={styles.ingredientsList}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              contentContainerStyle={{ paddingBottom: 8 }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                setCanScroll(contentHeight > 280);
              }}
            >
              {ingredientsList.map((ingredient, index) => (
                <TextInput
                  key={index}
                  style={styles.ingredientInput}
                  value={ingredient}
                  onChangeText={(text) => updateIngredient(text, index)}
                  placeholder={`Ingredient ${index + 1}`}
                  placeholderTextColor="#999"
                />
              ))}
            </ScrollView>
            
            {canScroll && (
              <View style={styles.scrollIndicator}>
                <Text style={styles.scrollIndicatorText}>Scroll for more</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionButton} onPress={addIngredientInput}>
                <Ionicons name="add" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => pickImage('ingredients')}
              >
                <Ionicons name="camera-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.createButton,
            !isCreateButtonEnabled && styles.createButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={!isCreateButtonEnabled}
        >
          <Text style={styles.createButtonText}>Create Recipe</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={showTooltip}
        onRequestClose={() => setShowTooltip(false)}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1} 
          onPress={() => setShowTooltip(false)}
        >
          <View style={[
            styles.tooltipContainer, 
            { 
              top: tooltipPosition.y - 10,
              left: 20,
              right: 20,
            }
          ]}>
            <Text style={styles.tooltipTitle}>Import via Website URL!</Text>
            <Text style={styles.tooltipText}>
              By entering a website URL, you can import the recipe instructions automatically. Make any additional updates as needed.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  titleInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  urlInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  ingredientsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    height: 400,
    justifyContent: 'space-between',
  },
  ingredientsContent: {
    flex: 1,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ingredientsImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  ingredientsPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
  },
  createButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  urlSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tooltipText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ingredientsList: {
    flex: 1,
    marginRight: -16,
    paddingRight: 16,
  },
  ingredientInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    height: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: '#666',
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
});

