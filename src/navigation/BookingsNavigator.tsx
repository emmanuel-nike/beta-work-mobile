import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookingsListScreen } from '../screens/bookings/BookingsListScreen';
import { bookingColors } from '../theme/bookings';
import type { BookingsStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export function BookingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BookingsList"
      screenOptions={{
        contentStyle: { backgroundColor: bookingColors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen component={BookingsListScreen} name="BookingsList" />
    </Stack.Navigator>
  );
}
