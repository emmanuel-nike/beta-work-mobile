import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DashboardTabBar,
  type DashboardTab,
} from '../components/dashboard/DashboardShell';
import { ClientProfileScreen } from '../screens/ClientProfileScreen';
import { BookingsNavigator } from './BookingsNavigator';
import { HomeNavigator } from './HomeNavigator';
import { MessagesNavigator } from './MessagesNavigator';
import type { ClientTabParamList } from './types';

const Tab = createBottomTabNavigator<ClientTabParamList>();

function ClientTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index];
  const activeName = activeRoute?.name;
  const activeTab: DashboardTab =
    activeName === 'home' ||
    activeName === 'bookings' ||
    activeName === 'messages' ||
    activeName === 'profile'
      ? activeName
      : 'home';

  return (
    <DashboardTabBar
      activeTab={activeTab}
      bottomInset={insets.bottom}
      onTabPress={tab => {
        if (
          tab !== 'home' &&
          tab !== 'bookings' &&
          tab !== 'messages' &&
          tab !== 'profile'
        ) {
          return;
        }

        const event = navigation.emit({
          type: 'tabPress',
          target: state.routes.find(route => route.name === tab)?.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
          navigation.navigate(tab);
        }
      }}
    />
  );
}

function renderClientTabBar(props: BottomTabBarProps) {
  return <ClientTabBar {...props} />;
}

export function ClientTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={renderClientTabBar}
    >
      <Tab.Screen component={HomeNavigator} name="home" />
      <Tab.Screen component={BookingsNavigator} name="bookings" />
      <Tab.Screen component={MessagesNavigator} name="messages" />
      <Tab.Screen component={ClientProfileScreen} name="profile" />
    </Tab.Navigator>
  );
}
