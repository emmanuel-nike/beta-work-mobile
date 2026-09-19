import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookingDetailsScreen } from '../screens/bookings/BookingDetailsScreen';
import { LeaveFeedbackScreen } from '../screens/bookings/LeaveFeedbackScreen';
import { RaiseDisputeScreen } from '../screens/bookings/RaiseDisputeScreen';
import { ChatScreen } from '../screens/messaging/ChatScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { bookingColors } from '../theme/bookings';
import { messagingColors } from '../theme/messaging';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        contentStyle: { backgroundColor: 'transparent' },
        headerShown: false,
      }}>
      <Stack.Screen component={DashboardScreen} name="Dashboard" />
      <Stack.Screen
        component={ChatScreen}
        name="Chat"
        options={{
          contentStyle: { backgroundColor: messagingColors.surface },
        }}
      />
      <Stack.Screen
        component={BookingDetailsScreen}
        name="BookingDetails"
        options={{ contentStyle: { backgroundColor: bookingColors.surface } }}
      />
      <Stack.Screen
        component={RaiseDisputeScreen}
        name="RaiseDispute"
        options={{ contentStyle: { backgroundColor: bookingColors.surface } }}
      />
      <Stack.Screen
        component={LeaveFeedbackScreen}
        name="LeaveFeedback"
        options={{ contentStyle: { backgroundColor: bookingColors.surface } }}
      />
    </Stack.Navigator>
  );
}
