/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Background/quit-state data messages wake the app. The visible notification is
// shown by the OS; the data refresh runs when the app is next foregrounded
// (see src/services/notifications/push.ts). Must be registered at module top
// level, outside any component.
messaging().setBackgroundMessageHandler(async () => {
  // No work needed here beyond acknowledging the message.
});

AppRegistry.registerComponent(appName, () => App);
