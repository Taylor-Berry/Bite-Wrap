import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Database table interfaces
interface DBMeal {
  id: string;
  user_id: string;
  name: string;
  location: string;
  description: string;
  image?: string;
  thumbnail_image?: string;
}

interface DBLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  meal_id: string;
  meals?: DBMeal;
}

interface DBRecipe {
  id: string;
  user_id: string;
  name: string;
  time: string;
  image: string;
  thumbnail_image?: string;
  recipe_ingredients?: {
    id: string;
    amount: string;
    unit: string;
    ingredients: DBIngredient;
  }[];
}

interface DBIngredient {
  id: string;
  name: string;
}

interface DBRecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  amount: string;
  unit: string;
  ingredients?: DBIngredient;
}

// App interfaces (what we expose to components)
export interface Log {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  meal: {
    id: string;
    name: string;
    location: string;
    description: string;
    image?: string;
    thumbnailImage?: string;
  };
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  image: string;
  thumbnailImage?: string;
  ingredients: {
    id: string;
    name: string;
    amount: string;
    unit: string;
  }[];
}

const getCurrentUser = () => {
  const user = supabase.auth.getSession();
  if (!user) throw new Error('Not authenticated');
  return user;
};

export const getLogs = async (): Promise<Log[]> => {
  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select(`
        id,
        date,
        meal_type,
        meals (
          id,
          name,
          location,
          description,
          image,
          thumbnail_image
        )
      `)
      .returns<DBLog[]>();

    if (error) throw error;
    if (!logs) return [];

    return logs.map(log => ({
      id: log.id,
      date: log.date,
      mealType: log.meal_type,
      meal: {
        id: log.meals!.id,
        name: log.meals!.name,
        location: log.meals!.location,
        description: log.meals!.description,
        image: log.meals!.image,
        thumbnailImage: log.meals!.thumbnail_image,
      }
    }));
  } catch (error) {
    console.error('Error getting logs:', error);
    return [];
  }
};

export const getLogsByDate = async (date: string): Promise<Log[]> => {
  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select(`
        id,
        date,
        meal_type,
        meals (
          id,
          name,
          location,
          description,
          image,
          thumbnail_image
        )
      `)
      .eq('date', date)
      .order('meal_type')
      .returns<DBLog[]>();

    if (error) throw error;
    if (!logs) return [];

    return logs.map(log => ({
      id: log.id,
      date: log.date,
      mealType: log.meal_type,
      meal: {
        id: log.meals!.id,
        name: log.meals!.name,
        location: log.meals!.location,
        description: log.meals!.description,
        image: log.meals!.image,
        thumbnailImage: log.meals!.thumbnail_image,
      }
    }));
  } catch (error) {
    console.error('Error getting logs by date:', error);
    return [];
  }
};

export const getRecentRestaurantLogs = async (limit: number = 3): Promise<Log[]> => {
  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select(`
        id,
        date,
        meal_type,
        meals (
          id,
          name,
          location,
          description,
          image,
          thumbnail_image
        )
      `)
      .not('meals.location', 'eq', 'home')
      .order('date', { ascending: false })
      .limit(limit)
      .returns<DBLog[]>();

    if (error) throw error;
    if (!logs) return [];

    return logs.map(log => ({
      id: log.id,
      date: log.date,
      mealType: log.meal_type,
      meal: {
        id: log.meals!.id,
        name: log.meals!.name,
        location: log.meals!.location,
        description: log.meals!.description,
        image: log.meals!.image,
        thumbnailImage: log.meals!.thumbnail_image,
      }
    }));
  } catch (error) {
    console.error('Error getting recent restaurant logs:', error);
    return [];
  }
};

export const addLog = async (newLog: Log) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    
    // First, create the meal
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        name: newLog.meal.name,
        location: newLog.meal.location,
        description: newLog.meal.description,
        image: newLog.meal.image,
        thumbnail_image: newLog.meal.thumbnailImage,
        user_id: session.user.id
      })
      .select()
      .single();

    if (mealError) throw mealError;
    if (!meal) throw new Error('Failed to create meal');

    // Then create the log with the meal reference
    const { error: logError } = await supabase
      .from('logs')
      .insert({
        date: newLog.date,
        meal_type: newLog.mealType,
        meal_id: meal.id,
        user_id: session.user.id
      });

    if (logError) throw logError;
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
};

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          amount,
          unit,
          ingredients (
            id,
            name
          )
        )
      `)
      .returns<DBRecipe[]>();

    if (error) throw error;
    if (!recipes) return [];

    return recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      time: recipe.time,
      image: recipe.image,
      thumbnailImage: recipe.thumbnail_image,
      ingredients: recipe.recipe_ingredients?.map((ri: any) => ({
        id: ri.ingredients.id,
        name: ri.ingredients.name,
        amount: ri.amount,
        unit: ri.unit,
      })) || []
    }));
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

export const addRecipe = async (recipe: Recipe) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    // First create the recipe
    const { data: newRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        name: recipe.name,
        time: recipe.time,
        image: recipe.image,
        thumbnail_image: recipe.thumbnailImage,
        user_id: session.user.id
      })
      .select()
      .single();

    if (recipeError) throw recipeError;
    if (!newRecipe) throw new Error('Failed to create recipe');

    // Then add ingredients
    if (recipe.ingredients?.length > 0) {
      for (const ingredient of recipe.ingredients) {
        // Create or get ingredient
        const { data: existingIngredient, error: ingredientError } = await supabase
          .from('ingredients')
          .select()
          .eq('name', ingredient.name)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (ingredientError) throw ingredientError;

        let ingredientId = existingIngredient?.id;

        if (!existingIngredient) {
          const { data: newIngredient, error: createError } = await supabase
            .from('ingredients')
            .insert({ 
              name: ingredient.name,
              user_id: session.user.id 
            })
            .select()
            .single();

          if (createError) throw createError;
          ingredientId = newIngredient.id;
        }

        // Create recipe_ingredients entry
        const { error: riError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: newRecipe.id,
            ingredient_id: ingredientId,
            amount: ingredient.amount,
            unit: ingredient.unit,
          });

        if (riError) throw riError;
      }
    }

    return newRecipe;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

export const deleteLogMeal = async (date: string, mealType: string) => {
  try {
    // First get the log to find the meal_id
    const { data: log } = await supabase
      .from('logs')
      .select('meal_id')
      .match({ date, meal_type: mealType })
      .single();

    if (log) {
      // Delete the log first
      const { error: logError } = await supabase
        .from('logs')
        .delete()
        .match({ date, meal_type: mealType });

      if (logError) throw logError;

      // Then delete the associated meal
      const { error: mealError } = await supabase
        .from('meals')
        .delete()
        .match({ id: log.meal_id });

      if (mealError) throw mealError;
    }
  } catch (error) {
    console.error('Error deleting log and meal:', error);
    throw error;
  }
};

export const deleteRecipe = async (recipeId: string) => {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .match({ id: recipeId });

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const getRecipeWithIngredients = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select(`
        id,
        name,
        time,
        image,
        thumbnail_image,
        recipe_ingredients (
          id,
          amount,
          unit,
          ingredients (
            id,
            name
          )
        )
      `)
      .eq('id', recipeId)
      .single();

    if (recipeError) throw recipeError;
    if (!recipe) return null;

    return {
      id: recipe.id,
      name: recipe.name,
      time: recipe.time,
      image: recipe.image,
      thumbnailImage: recipe.thumbnail_image,
      ingredients: recipe.recipe_ingredients.map((ri: any) => ({
        id: ri.ingredients.id,
        name: ri.ingredients.name,
        amount: ri.amount,
        unit: ri.unit,
      })),
    };
  } catch (error) {
    console.error('Error getting recipe:', error);
    return null;
  }
};

