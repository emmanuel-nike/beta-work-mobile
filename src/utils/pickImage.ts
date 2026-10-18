import { Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

const BASE_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1600,
  maxHeight: 1600,
};

/** Launch the gallery and return the first picked image uri, or null. */
export async function pickImageFromLibrary(): Promise<string | null> {
  const result = await launchImageLibrary({
    ...BASE_OPTIONS,
    selectionLimit: 1,
  });

  if (result.errorCode) {
    Alert.alert('Could not open gallery', result.errorMessage ?? 'Please try again.');
    return null;
  }

  return result.assets?.[0]?.uri ?? null;
}

/** Launch the camera and return the captured image uri, or null. */
export async function captureImage(): Promise<string | null> {
  const result = await launchCamera({ ...BASE_OPTIONS, saveToPhotos: false });

  if (result.errorCode === 'camera_unavailable') {
    Alert.alert('Camera unavailable', 'This device has no usable camera.');
    return null;
  }
  if (result.errorCode) {
    Alert.alert('Could not open camera', result.errorMessage ?? 'Please try again.');
    return null;
  }

  return result.assets?.[0]?.uri ?? null;
}

/** Launch the gallery allowing multiple selection (up to `limit`). */
export async function pickImagesFromLibrary(limit: number): Promise<string[]> {
  const result = await launchImageLibrary({
    ...BASE_OPTIONS,
    selectionLimit: Math.max(limit, 1),
  });

  if (result.errorCode) {
    Alert.alert('Could not open gallery', result.errorMessage ?? 'Please try again.');
    return [];
  }

  return (result.assets ?? [])
    .map(asset => asset.uri)
    .filter((uri): uri is string => Boolean(uri));
}
