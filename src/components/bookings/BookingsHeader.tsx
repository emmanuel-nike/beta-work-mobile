import type { ReactNode } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon, BellIcon, MoreVerticalIcon, SearchIcon } from '../icons';
import { bookingColors } from '../../theme/bookings';

const ACTION_SIZE = 40;

type HeaderActionProps = Readonly<{
  accessibilityLabel: string;
  children: ReactNode;
  onPress?: () => void;
}>;

function HeaderAction({
  accessibilityLabel,
  children,
  onPress,
}: HeaderActionProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

type BookingsHeaderProps = Readonly<{
  title: string;
  /** Root of the tab: title sits left with search + notifications. */
  variant?: 'root' | 'detail';
  onBack?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  onMenu?: () => void;
}>;

export function BookingsHeader({
  title,
  variant = 'root',
  onBack,
  onSearch,
  onNotifications,
  onMenu,
}: BookingsHeaderProps) {
  const insets = useSafeAreaInsets();
  const isRoot = variant === 'root';

  return (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <StatusBar backgroundColor={bookingColors.header} barStyle="light-content" />
      <View style={styles.row}>
        {isRoot ? (
          <Text style={styles.rootTitle}>{title}</Text>
        ) : (
          <>
            <HeaderAction accessibilityLabel="Go back" onPress={onBack}>
              <ArrowLeftIcon />
            </HeaderAction>
            <Text numberOfLines={1} style={styles.detailTitle}>
              {title}
            </Text>
          </>
        )}

        <View style={styles.actions}>
          {isRoot ? (
            <>
              <HeaderAction accessibilityLabel="Search bookings" onPress={onSearch}>
                <SearchIcon />
              </HeaderAction>
              <HeaderAction
                accessibilityLabel="Notifications"
                onPress={onNotifications}
              >
                <BellIcon />
              </HeaderAction>
            </>
          ) : onMenu ? (
            <HeaderAction accessibilityLabel="More options" onPress={onMenu}>
              <MoreVerticalIcon />
            </HeaderAction>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: bookingColors.header,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: ACTION_SIZE,
  },
  rootTitle: {
    color: bookingColors.white,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  detailTitle: {
    color: bookingColors.white,
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    alignItems: 'center',
    backgroundColor: bookingColors.headerButton,
    borderRadius: ACTION_SIZE / 2,
    height: ACTION_SIZE,
    justifyContent: 'center',
    width: ACTION_SIZE,
  },
  spacer: {
    width: ACTION_SIZE,
  },
  pressed: {
    opacity: 0.7,
  },
});
