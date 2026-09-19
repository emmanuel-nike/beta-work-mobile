import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useNavigation, type NavigatorScreenParams } from '@react-navigation/native'

export type PreAuthStackParamList = {
  Onboarding: undefined
  Signup: undefined
  SignIn: undefined
  ArtisanSignup: undefined
}

export type BookingsStackParamList = {
  BookingsList: undefined
}

export type MessagesStackParamList = {
  MessagesList: undefined
}

export type ClientTabParamList = {
  home: undefined
  bookings: NavigatorScreenParams<BookingsStackParamList> | undefined
  messages: NavigatorScreenParams<MessagesStackParamList> | undefined
  profile: undefined
}

export type AuthStackParamList = {
  Dashboard: undefined
  Chat: { conversationId: string }
  BookingDetails: { bookingId: string }
  RaiseDispute: { bookingId: string }
  LeaveFeedback: { bookingId: string }
}

export type PreAuthNavigation = NativeStackNavigationProp<PreAuthStackParamList>
export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>
export type ClientTabNavigation = BottomTabNavigationProp<ClientTabParamList>
export type BookingsNavigation = NativeStackNavigationProp<BookingsStackParamList>
export type MessagesNavigation = NativeStackNavigationProp<MessagesStackParamList>

export type BookingsStackScreenProps<T extends keyof BookingsStackParamList> =
  NativeStackScreenProps<BookingsStackParamList, T>

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>

export type MessagesStackScreenProps<T extends keyof MessagesStackParamList> =
  NativeStackScreenProps<MessagesStackParamList, T>

export function usePreAuthNavigation() {
  return useNavigation<PreAuthNavigation>()
}

export function useClientTabNavigation() {
  return useNavigation<ClientTabNavigation>()
}

export function useAuthNavigation() {
  return useNavigation<AuthNavigation>()
}

export function useBookingsNavigation() {
  return useNavigation<BookingsNavigation>()
}

export function useMessagesNavigation() {
  return useNavigation<MessagesNavigation>()
}
