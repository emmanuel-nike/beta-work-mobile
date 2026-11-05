import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coordinates = Readonly<{ latitude: number; longitude: number }>;

/**
 * Request location permission and resolve the device's current coordinates.
 *
 * On Android we request `ACCESS_FINE_LOCATION` at runtime. On iOS the system
 * prompt is shown automatically on first use (requires the
 * `NSLocationWhenInUseUsageDescription` key in Info.plist). Rejects when the
 * permission is denied or the position cannot be read.
 */
export async function getCurrentLocation(): Promise<Coordinates> {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location access',
        message:
          'BetaWork uses your location to set the service address for a booking.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Location permission was denied.');
    }
  }

  return new Promise<Coordinates>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error =>
        reject(new Error(error.message || 'Unable to get your current location.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}
