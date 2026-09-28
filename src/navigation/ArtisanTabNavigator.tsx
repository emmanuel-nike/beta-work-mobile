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
import { ArtisanJobsScreen } from '../screens/artisan/ArtisanJobsScreen';
import { ArtisanHomeScreen } from '../screens/artisan/ArtisanHomeScreen';
import { MessagesNavigator } from './MessagesNavigator';
import type { ArtisanTabParamList } from './types';

const Tab = createBottomTabNavigator<ArtisanTabParamList>();

function ArtisanTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;
  const activeTab: DashboardTab =
    activeName === 'home' ||
    activeName === 'jobs' ||
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
          tab !== 'jobs' &&
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

function renderArtisanTabBar(props: BottomTabBarProps) {
  return <ArtisanTabBar {...props} />;
}

export function ArtisanTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={renderArtisanTabBar}
    >
      <Tab.Screen component={ArtisanHomeScreen} name="home" />
      <Tab.Screen component={ArtisanJobsScreen} name="jobs" />
      <Tab.Screen component={MessagesNavigator} name="messages" />
      <Tab.Screen component={ClientProfileScreen} name="profile" />
    </Tab.Navigator>
  );
}
