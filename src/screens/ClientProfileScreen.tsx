import { useEffect, useState, type ComponentType } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingsHeader } from '../components/bookings/BookingsHeader';
import { AvatarPickerSheet } from '../components/profile/AvatarPickerSheet';
import {
  AvatarPlaceholderIcon,
  BellIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  DocumentIcon,
  LockIcon,
  LogoutIcon,
  PlusIcon,
  ProfileIcon,
  ShieldIcon,
  TrashIcon,
  type SizedIconProps,
} from '../components/icons';
import { toAbsoluteMediaUrl } from '../config/env';
import { useAuthNavigation } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadArtisanProfile,
  selectAppMode,
  selectArtisanProfile,
  selectAuthUser,
  selectPendingAppMode,
  requestAppModeSwitch,
  logoutUser,
} from '../store/slices/authSlice';
import { appColors } from '../theme/clientApp';

const PICKER_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1024,
  maxHeight: 1024,
  selectionLimit: 1,
};

export function ClientProfileScreen() {
  const dispatch = useAppDispatch();
  const navigation = useAuthNavigation();
  const user = useAppSelector(selectAuthUser);
  const artisanProfile = useAppSelector(selectArtisanProfile);
  const appMode = useAppSelector(selectAppMode);
  const pendingAppMode = useAppSelector(selectPendingAppMode);
  const insets = useSafeAreaInsets();
  const isArtisan = user?.role === 'artisan';

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSheetVisible, setSheetVisible] = useState(false);
  // A locally picked photo overrides the saved one; otherwise show the saved
  // profile picture from the artisan's portfolio.
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const savedPhoto = toAbsoluteMediaUrl(artisanProfile?.photoUrl);
  const displayedAvatar = avatarUri ?? savedPhoto;

  // Ensure the saved photo is available even if the home tab wasn't opened yet.
  useEffect(() => {
    if (user?.role === 'artisan' && !artisanProfile) {
      dispatch(loadArtisanProfile());
    }
  }, [dispatch, user?.role, artisanProfile]);
  const [pushEnabled, setPushEnabled] = useState(false);

  // Label and behaviour of the mode button depend on whether the signed-in
  // account is an artisan and, if so, which experience is currently active.
  const appModeLabel = !isArtisan
    ? 'Become an Artisan'
    : appMode === 'artisan'
      ? 'Switch to Client Mode'
      : 'Switch to Artisan Mode';

  const handleAppModePress = () => {
    if (!isArtisan) {
      Alert.alert(
        'Coming soon',
        'Becoming an artisan is not yet available. Please check back later.',
      );
      return;
    }

    dispatch(requestAppModeSwitch(appMode === 'artisan' ? 'client' : 'artisan'));
  };

  const fullName = [user?.firstName, user?.lastName]
    .filter(part => part && part.trim().length > 0)
    .join(' ')
    .trim();

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const applyPickerAsset = (assets: readonly Asset[] | undefined) => {
    const uri = assets?.[0]?.uri;
    if (uri) {
      setAvatarUri(uri);
    }
  };

  const handleTakePhoto = async () => {
    setSheetVisible(false);
    const result = await launchCamera({ ...PICKER_OPTIONS, saveToPhotos: false });

    if (result.errorCode === 'camera_unavailable') {
      Alert.alert('Camera unavailable', 'This device has no usable camera.');
      return;
    }
    if (result.errorCode) {
      Alert.alert('Could not open camera', result.errorMessage ?? 'Please try again.');
      return;
    }

    applyPickerAsset(result.assets);
  };

  const handleChooseFromGallery = async () => {
    setSheetVisible(false);
    const result = await launchImageLibrary(PICKER_OPTIONS);

    if (result.errorCode) {
      Alert.alert('Could not open gallery', result.errorMessage ?? 'Please try again.');
      return;
    }

    applyPickerAsset(result.assets);
  };

  return (
    <View style={styles.root}>
      <BookingsHeader title="Profile" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Pressable
            accessibilityHint="Opens options to take or choose a profile photo"
            accessibilityLabel="Change profile photo"
            accessibilityRole="button"
            onPress={() => setSheetVisible(true)}
            style={({ pressed }) => [styles.avatarWrapper, pressed && styles.pressed]}
          >
            {displayedAvatar ? (
              <Image source={{ uri: displayedAvatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <AvatarPlaceholderIcon />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <PlusIcon color={appColors.white} size={12} />
            </View>
          </Pressable>

          <Text style={styles.name}>{fullName || 'Your profile'}</Text>
          {user?.phoneNumber ? (
            <Text style={styles.phone}>{user.phoneNumber}</Text>
          ) : null}
        </View>

        <View style={styles.sections}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: pendingAppMode !== null }}
            disabled={pendingAppMode !== null}
            onPress={handleAppModePress}
            style={({ pressed }) => [
              styles.modeButton,
              pressed && styles.modeButtonPressed,
            ]}
          >
            <Text style={styles.modeButtonLabel}>{appModeLabel}</Text>
          </Pressable>

          <Section title="Account">
            <ProfileRow
              Icon={ProfileIcon}
              onPress={() => navigation.navigate('EditProfile')}
              subtitle="Update your personal details"
              title="Personal details"
            />
            {appMode === 'artisan' ? (
              <ProfileRow
                Icon={BriefcaseIcon}
                onPress={() => navigation.navigate('ArtisanPortfolio')}
                subtitle="Update your work profile"
                title="Job Profile"
              />
            ) : null}
            <ProfileRow
              Icon={LockIcon}
              onPress={() => navigation.navigate('ChangePassword')}
              subtitle="Change your password"
              title="Change Password"
            />
            <ProfileRow
              Icon={BellIcon}
              control={
                <Switch
                  onValueChange={setPushEnabled}
                  thumbColor={appColors.white}
                  trackColor={{
                    false: appColors.chipInactive,
                    true: appColors.primary,
                  }}
                  value={pushEnabled}
                />
              }
              subtitle="Enable/disable notifications"
              title="Push Notifications"
            />
          </Section>

          <Section title="Help and support">
            <ProfileRow
              Icon={DocumentIcon}
              subtitle="Read our customer policy"
              title="Customer Policy"
            />
            <ProfileRow
              Icon={ShieldIcon}
              subtitle="Find answers or chat with our team."
              title="Help & Support"
            />
          </Section>

          <Section title="Other">
            <ProfileRow
              Icon={LogoutIcon}
              control={
                isLoggingOut ? (
                  <ActivityIndicator color={appColors.primary} size="small" />
                ) : null
              }
              destructive
              onPress={handleLogout}
              title="Log Out"
            />
            <ProfileRow Icon={TrashIcon} destructive title="Delete Account" />
          </Section>
        </View>
      </ScrollView>

      <AvatarPickerSheet
        hasPhoto={displayedAvatar !== null}
        onChooseFromGallery={handleChooseFromGallery}
        onClose={() => setSheetVisible(false)}
        onRemovePhoto={() => {
          setAvatarUri(null);
          setSheetVisible(false);
        }}
        onTakePhoto={handleTakePhoto}
        visible={isSheetVisible}
      />
    </View>
  );
}

function Section({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionRows}>{children}</View>
    </View>
  );
}

type ProfileRowProps = Readonly<{
  Icon: ComponentType<SizedIconProps>;
  title: string;
  subtitle?: string;
  destructive?: boolean;
  control?: React.ReactNode;
  onPress?: () => void;
}>;

function ProfileRow({
  Icon,
  title,
  subtitle,
  destructive = false,
  control,
  onPress,
}: ProfileRowProps) {
  const showChevron = control == null && !destructive;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={onPress == null}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={[styles.rowIcon, destructive && styles.rowIconDanger]}>
        <Icon color={destructive ? appColors.danger : '#4A3A2C'} size={22} />
      </View>

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>

      {control}
      {showChevron ? <ChevronRightIcon /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: appColors.surface,
    flex: 1,
  },
  identity: {
    alignItems: 'center',
    backgroundColor: appColors.divider,
    paddingBottom: 28,
    paddingTop: 48,
  },
  avatarWrapper: {
    height: 100,
    width: 100,
  },
  avatar: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  avatarEmpty: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    justifyContent: 'center',
  },
  avatarBadge: {
    alignItems: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 10,
    bottom: 4,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    width: 20,
  },
  name: {
    color: appColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 16,
  },
  phone: {
    color: appColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sections: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    marginBottom: 28,
  },
  modeButtonPressed: {
    opacity: 0.85,
  },
  modeButtonLabel: {
    color: appColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: appColors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionRows: {
    gap: 16,
  },
  row: {
    alignItems: 'center',
    backgroundColor: appColors.card,
    borderColor: appColors.cardBorder,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowIconDanger: {
    backgroundColor: '#FFF2F1',
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: '#4A3A2C',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  rowSubtitle: {
    color: appColors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  pressed: {
    opacity: 0.75,
  },
});
