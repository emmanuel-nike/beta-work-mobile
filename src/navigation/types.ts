import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export type PreAuthStackParamList = {
  Onboarding: undefined;
  Signup: undefined;
  SignIn: undefined;
  ArtisanSignup: undefined;
};

export type AuthStackParamList = {
  Dashboard: undefined;
};

export type PreAuthNavigation = NativeStackNavigationProp<PreAuthStackParamList>;
export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>;

export function usePreAuthNavigation() {
  return useNavigation<PreAuthNavigation>();
}
