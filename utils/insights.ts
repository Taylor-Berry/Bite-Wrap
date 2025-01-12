import { supabase } from '../lib/supabase';

export interface InsightData {
  mostVisitedRestaurants: {
    thisMonth: RestaurantData[];
    thisYear: RestaurantData[];
    allTime: RestaurantData[];
  };
  mostCookedDishes: {
    name: string;
    count: number;
    image?: string;
  }[];
  topIngredients: {
    name: string;
    count: number;
  }[];
}

interface RestaurantData {
  name: string;
  count: number;
  image?: string;
}

export const getInsights = async (): Promise<InsightData> => {
  try {
    console.log('Starting insights fetch...');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Single query to get all insights with user filtering
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', user.id);

    console.log('Raw analytics data:', data); // Debug log

    if (error) throw error;

    // Process the data for restaurants
    const allRestaurants = data
      .filter(item => item.item_type === 'restaurant')
      .map(item => ({
        name: item.item_name,
        count: item.count,
        image: item.image,
        year: item.year,
        month: item.month
      }));

    const mostVisitedRestaurants = {
      thisMonth: getTopRestaurants(allRestaurants.filter(r => r.year === currentYear && r.month === currentMonth)),
      thisYear: getTopRestaurants(allRestaurants.filter(r => r.year === currentYear)),
      allTime: getTopRestaurants(allRestaurants)
    };

    const insights = {
      mostVisitedRestaurants,
      mostCookedDishes: data
        .filter(item => item.item_type === 'recipe')
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(item => ({
          name: item.item_name,
          count: item.count,
          image: item.image
        })),
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
      mostVisitedRestaurants: { thisMonth: [], thisYear: [], allTime: [] },
      mostCookedDishes: [],
      topIngredients: []
    };
  }
};

function getTopRestaurants(restaurants: RestaurantData[]): RestaurantData[] {
  return restaurants
    .reduce((acc, curr) => {
      const existing = acc.find(r => r.name === curr.name);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [] as RestaurantData[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);  // Limit to top 5 restaurants
}

