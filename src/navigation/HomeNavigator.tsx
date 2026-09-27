import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserDashboardScreen } from '../screens/UserDashboardScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        contentStyle: { backgroundColor: '#F7F1E6' },
        headerShown: false,
      }}
    >
      <Stack.Screen component={UserDashboardScreen} name="Dashboard" />
    </Stack.Navigator>
  );
}
