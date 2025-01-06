import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Log {
  id: string;
  date: string;
  meals: {
    id: string;
    name: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    location: string;
    description: string;
    image?: string;
  }[];
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  image: string;
}

const LOGS_KEY = 'logs';
const RECIPES_KEY = 'recipes';

export const saveLogs = async (logs: Log[]) => {
  try {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving logs:', error);
  }
};

export const getLogs = async (): Promise<Log[]> => {
  try {
    const logsString = await AsyncStorage.getItem(LOGS_KEY);
    return logsString ? JSON.parse(logsString) : [];
  } catch (error) {
    console.error('Error getting logs:', error);
    return [];
  }
};

export const saveRecipes = async (recipes: Recipe[]) => {
  try {
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
};

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipesString = await AsyncStorage.getItem(RECIPES_KEY);
    return recipesString ? JSON.parse(recipesString) : [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

export const addLog = async (newLog: Log) => {
  const logs = await getLogs();
  const existingLogIndex = logs.findIndex(log => log.date === newLog.date);
  if (existingLogIndex !== -1) {
    logs[existingLogIndex].meals.push(...newLog.meals);
  } else {
    logs.push(newLog);
  }
  await saveLogs(logs);
};

export const getLogsByDate = async (date: string): Promise<Log | undefined> => {
  const logs = await getLogs();
  return logs.find(log => log.date === date);
};

export const addRecipe = async (recipe: Recipe) => {
  try {
    const existingRecipes = await getRecipes();
    const updatedRecipes = [...existingRecipes, recipe];
    await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    console.log('Recipe saved:', recipe);
  } catch (e) {
    console.error('Error adding recipe:', e);
  }
};

export const deleteLogMeal = async (date: string, mealId: string) => {
  const logs = await getLogs();
  const logIndex = logs.findIndex(log => log.date === date);
  if (logIndex !== -1) {
    logs[logIndex].meals = logs[logIndex].meals.filter(meal => meal.id !== mealId);
    if (logs[logIndex].meals.length === 0) {
      // If no meals left for this date, remove the entire log
      logs.splice(logIndex, 1);
    }
    await saveLogs(logs);
  }
};

export const deleteRecipe = async (recipeId: string) => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
    await saveRecipes(updatedRecipes);
    console.log('Recipe deleted:', recipeId);
  } catch (e) {
    console.error('Error deleting recipe:', e);
  }
};

