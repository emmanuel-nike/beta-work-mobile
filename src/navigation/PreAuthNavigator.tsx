import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArtisanFlow } from '../screens/ArtisanFlow';
import { OnboardingFlow } from '../screens/OnboardingFlow';
import { SignInFlow } from '../screens/SignInFlow';
import { SignupFlow } from '../screens/SignupFlow';
import type { PreAuthStackParamList } from './types';

const Stack = createNativeStackNavigator<PreAuthStackParamList>();

export function PreAuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
        headerShown: false,
      }}>
      <Stack.Screen component={OnboardingFlow} name="Onboarding" />
      <Stack.Screen component={SignupFlow} name="Signup" />
      <Stack.Screen component={SignInFlow} name="SignIn" />
      <Stack.Screen component={ArtisanFlow} name="ArtisanSignup" />
    </Stack.Navigator>
  );
}
