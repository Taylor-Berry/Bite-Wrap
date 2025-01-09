import { supabase } from '../lib/supabase';

export interface FavoriteRestaurant {
  id: string;
  restaurant_name: string;
  restaurant_image: string;
  restaurant_location: string;
  created_at: string;
}

export const addFavoriteRestaurant = async (
  restaurantName: string,
  restaurantImage: string,
  restaurantLocation: string
) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('favorite_restaurants')
    .insert({
      user_id: user.user.id,
      restaurant_name: restaurantName,
      restaurant_image: restaurantImage,
      restaurant_location: restaurantLocation
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFavoriteRestaurant = async (restaurantName: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('favorite_restaurants')
    .delete()
    .match({ user_id: user.user.id, restaurant_name: restaurantName });

  if (error) throw error;
};

export const getFavoriteRestaurants = async (): Promise<FavoriteRestaurant[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('favorite_restaurants')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}; 