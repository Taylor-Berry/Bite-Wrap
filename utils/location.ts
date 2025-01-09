import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    let { status } = await Location.getForegroundPermissionsAsync();
    
    if (status === 'undetermined') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      return newStatus === 'granted';
    }

    if (status === 'denied') {
      // You could show a dialog here explaining how to enable in settings
      Alert.alert(
        'Location Permission Required',
        'Please enable location services in your settings to find nearby restaurants.',
        [
          { text: 'OK', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return false;
    }

    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Get the address details
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    return {
      latitude,
      longitude,
      city: address?.city || undefined,
      region: address?.region || undefined
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}; 