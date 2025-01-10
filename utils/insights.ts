import { supabase } from '../lib/supabase';

export interface InsightData {
  mostCookedDishes: {
    name: string;
    count: number;
    image?: string;
  }[];
  favoriteRestaurants: {
    name: string;
    count: number;
    image?: string;
    visits: {
      date: string;
      count: number;
    }[];
  }[];
  topIngredients: {
    name: string;
    count: number;
  }[];
}

export const getInsights = async (): Promise<InsightData> => {
  try {
    console.log('Starting insights fetch...');
    const currentYear = new Date().getFullYear();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Single query to get all insights with user filtering
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('year', currentYear)
      .eq('user_id', user.id)
      .in('item_type', ['restaurant', 'recipe', 'ingredient']);

    console.log('Raw analytics data:', data); // Debug log

    if (error) throw error;

    // Process the data with more logging
    const restaurants = data
      .filter(item => item.item_type === 'restaurant')
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        name: item.item_name,
        count: item.count,
        image: item.image,
        visits: []
      }));

    console.log('Processed restaurants:', restaurants); // Debug log

    const recipes = data
      .filter(item => item.item_type === 'recipe')
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        name: item.item_name,
        count: item.count,
        image: item.image
      }));

    console.log('Processed recipes:', recipes); // Debug log

    const insights = {
      mostCookedDishes: recipes,
      favoriteRestaurants: restaurants,
      topIngredients: data
        .filter(item => item.item_type === 'ingredient')
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => ({
          name: item.item_name,
          count: item.count
        }))
    };

    console.log('Final insights data:', insights); // Debug log
    return insights;

  } catch (error) {
    console.error('Error details:', error);
    return {
      mostCookedDishes: [],
      favoriteRestaurants: [],
      topIngredients: []
    };
  }
};

