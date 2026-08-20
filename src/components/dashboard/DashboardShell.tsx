import type { ComponentType, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardHeaderPattern from '../../../assets/images/dashboard_header_pattern.svg';
import {
  BellIcon,
  ChevronDownIcon,
  HomeIcon,
  JobsIcon,
  LocationIcon,
  MessagesIcon,
  ProfileIcon,
  SearchIcon,
  type IconColorProps,
} from '../icons';
import { dashboardColors, getTimeGreeting } from '../../theme/dashboard';

export type DashboardTab = 'home' | 'jobs' | 'messages' | 'profile';

type DashboardShellProps = Readonly<{
  backgroundColor?: string;
  children: ReactNode;
  header?: ReactNode;
  scrollHeader?: ReactNode;
  activeTab?: DashboardTab;
  tabsDisabled?: boolean;
  onTabPress?: (tab: DashboardTab) => void;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function DashboardShell({
  backgroundColor = dashboardColors.surface,
  children,
  header,
  scrollHeader,
  activeTab = 'home',
  tabsDisabled = false,
  onTabPress,
  contentStyle,
}: DashboardShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <StatusBar
        backgroundColor={dashboardColors.headerGreen}
        barStyle="light-content"
      />
      {scrollHeader != null ? (
        <ScrollView
          contentContainerStyle={[
            styles.collapsibleScrollContent,
            { paddingBottom: 24 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          {scrollHeader}
          <View style={[styles.contentWrapper, contentStyle]}>{children}</View>
        </ScrollView>
      ) : (
        <>
          {header ? <View style={styles.headerSlot}>{header}</View> : null}
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: 24 + insets.bottom },
              contentStyle,
            ]}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            {children}
          </ScrollView>
        </>
      )}
      <DashboardTabBar
        activeTab={activeTab}
        bottomInset={insets.bottom}
        disabled={tabsDisabled}
        onTabPress={onTabPress}
      />
    </View>
  );
}

function DashboardHeaderBackground() {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.headerBackground,
        { backgroundColor: dashboardColors.headerGreen },
      ]}
    >
      <DashboardHeaderPattern
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={styles.headerPatternImage}
        width="100%"
      />
      <View style={styles.headerOverlay} />
    </View>
  );
}

type DashboardHeaderProps = Readonly<{
  firstName: string;
  location?: string;
  subtitle?: string;
  height?: number;
  footer?: ReactNode;
}>;

export function DashboardHeader({
  firstName,
  location = 'Maitaima, Abuja',
  subtitle,
  height = 220,
  footer,
}: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();
  const greeting = getTimeGreeting();

  return (
    <View style={[styles.header, { minHeight: height + insets.top }]}>
      <DashboardHeaderBackground />
      <View
        style={[
          styles.headerForeground,
          footer ? styles.headerForegroundWithFooter : null,
          { paddingTop: insets.top + 8 },
        ]}
      >
        <View style={styles.headerTopRow}>
          <Pressable accessibilityRole="button" style={styles.locationButton}>
            <LocationIcon />
            <Text style={styles.locationText}>{location}</Text>
            <ChevronDownIcon />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.notificationButton}
          >
            <BellIcon />
          </Pressable>
        </View>
        <View
          style={[
            styles.headerCopy,
            footer ? styles.headerCopyWithFooter : null,
          ]}
        >
          <Text style={styles.greeting}>
            {greeting}, {firstName} 👋
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {footer ? <View style={styles.headerFooter}>{footer}</View> : null}
      </View>
    </View>
  );
}

type DashboardTabBarProps = Readonly<{
  activeTab: DashboardTab;
  bottomInset: number;
  disabled?: boolean;
  onTabPress?: (tab: DashboardTab) => void;
}>;

const TAB_ITEMS: ReadonlyArray<{
  id: DashboardTab;
  label: string;
  Icon: ComponentType<IconColorProps>;
}> = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'jobs', label: 'Jobs', Icon: JobsIcon },
  { id: 'messages', label: 'Messages', Icon: MessagesIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
];

function DashboardTabBar({
  activeTab,
  bottomInset,
  disabled = false,
  onTabPress,
}: DashboardTabBarProps) {
  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(bottomInset, 8) }]}>
      {TAB_ITEMS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        const color =
          disabled && !isActive
            ? dashboardColors.tabInactive
            : dashboardColors.white;

        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityState={{ disabled, selected: isActive }}
            disabled={disabled && !isActive}
            onPress={() => onTabPress?.(id)}
            style={styles.tabItem}
          >
            {isActive ? <View style={styles.tabIndicator} /> : null}
            <Icon color={color} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SearchBarProps = Readonly<{
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
}>;

export function SearchBar({
  placeholder = 'Search for artisans or services',
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.searchBar}>
      <SearchIcon />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.65)"
        returnKeyType="search"
        style={styles.searchInput}
        value={value}
      />
    </View>
  );
}

type SectionHeaderProps = Readonly<{
  title: string;
  actionLabel?: string;
}>;

export function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      ) : null}
    </View>
  );
}

type DashboardCardProps = Readonly<{
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}>;

export function DashboardCard({ children, style }: DashboardCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerSlot: {
    elevation: 4,
    zIndex: 2,
  },
  scroll: {
    flex: 1,
    zIndex: 0,
  },
  collapsibleScrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    backgroundColor: dashboardColors.headerGreen,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  headerPatternImage: {
    ...StyleSheet.absoluteFillObject,
  },
  headerForeground: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  headerForegroundWithFooter: {
    paddingBottom: 20,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: dashboardColors.headerGreenOverlay,
  },
  headerTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  locationText: {
    color: dashboardColors.textOnDark,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.headerOverlay,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  headerCopy: {
    gap: 4,
    marginBottom: 40,
    marginTop: 12,
  },
  headerCopyWithFooter: {
    marginBottom: 16,
  },
  headerFooter: {
    marginTop: 4,
  },
  greeting: {
    color: dashboardColors.textOnDark,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  subtitle: {
    color: dashboardColors.headerSubtitle,
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    flexGrow: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tabBar: {
    backgroundColor: dashboardColors.tabBar,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    minHeight: 54,
    paddingTop: 6,
  },
  tabIndicator: {
    backgroundColor: dashboardColors.accent,
    borderRadius: 2,
    height: 2,
    position: 'absolute',
    top: 0,
    width: 40,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: dashboardColors.headerOverlay,
    borderColor: dashboardColors.headerBorder,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 10,
    height: 56,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: dashboardColors.white,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  sectionAction: {
    color: dashboardColors.textLabel,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderRadius: 8,
    padding: 16,
  },
});
