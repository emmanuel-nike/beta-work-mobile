import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MessagesListScreen } from '../screens/messaging/MessagesListScreen';
import { messagingColors } from '../theme/messaging';
import type { MessagesStackParamList } from './types';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MessagesList"
      screenOptions={{
        contentStyle: { backgroundColor: messagingColors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen component={MessagesListScreen} name="MessagesList" />
    </Stack.Navigator>
  );
}
