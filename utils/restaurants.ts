import { LocationData } from './location';
import { YELP_API_KEY } from '@env';
import mockYelpData from './Yelp_Response_Data.json';

export interface Restaurant {
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  address?: string;
  category: string;
  rating?: number;
  image?: string;
  hours?: {
    open: Array<{
      is_overnight: boolean;
      start: string;
      end: string;
      day: number;
    }>;
    hours_type: string;
    is_open_now: boolean;
  }[];
  priceLevel?: string;
  cuisineType?: string;
  phone?: string;
  display_phone?: string;
  review_count?: number;
  transactions?: string[];
  url?: string;
}

export const searchNearbyRestaurants = async (location: LocationData): Promise<Restaurant[]> => {
  try {
    console.log('Development mode:', __DEV__);
    
    if (__DEV__ || true) {
      return mockYelpData.businesses.map(business => ({
        name: business.name,
        coordinate: {
          latitude: business.coordinates?.latitude || location.latitude,
          longitude: business.coordinates?.longitude || location.longitude,
        },
        distance: business.distance * 0.000621371, // Convert meters to miles
        address: business.location?.address1 || 'Local restaurant',
        category: business.categories?.[0]?.title || 'Restaurant',
        rating: business.rating,
        image: business.image_url,
        hours: business.business_hours,
        priceLevel: business.price,
        cuisineType: business.categories?.map(c => c.title).join(', ') || 'Various',
        phone: business.phone,
        display_phone: business.display_phone,
        review_count: business.review_count,
        transactions: business.transactions,
        url: business.url
      }));
    }

    // Original Yelp API call for production
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?` +
      `latitude=${location.latitude}&` +
      `longitude=${location.longitude}&` +
      `categories=restaurants&` +
      `radius=40000&` + // 25 miles in meters
      `limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    return data.businesses.map((business: any) => ({
      name: business.name,
      coordinate: {
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
      },
      distance: business.distance * 0.000621371,
      address: business.location.address1,
      category: business.categories[0].title,
      rating: business.rating,
      image: business.image_url,
      hours: business.business_hours,
      priceLevel: business.price,
      cuisineType: business.categories.map((c: any) => c.title).join(', '),
      phone: business.phone,
      display_phone: business.display_phone,
      review_count: business.review_count,
      transactions: business.transactions,
      url: business.url
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}; 