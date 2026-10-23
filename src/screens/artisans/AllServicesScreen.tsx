import { memo, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  SearchIcon,
} from '../../components/icons';
import { ARTISAN_SERVICES } from '../../data/artisanServices';
import type { AuthStackScreenProps } from '../../navigation/types';

const SURFACE = '#F7F1E6';
const NAME = '#1F1611';
const BODY = '#3D2E22';
const MUTED = '#736051';
const TILE_GAP = 11;
const H_PADDING = 24;
/** Card height (69) plus the row gap below it — used for FlatList virtualization. */
const CARD_ROW_HEIGHT = 69 + TILE_GAP;

type Service = (typeof ARTISAN_SERVICES)[number];

export function AllServicesScreen({
  navigation,
}: AuthStackScreenProps<'AllServices'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const tileWidth = (width - H_PADDING * 2 - TILE_GAP) / 2;

  const services = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return ARTISAN_SERVICES;
    }
    return ARTISAN_SERVICES.filter(
      service =>
        service.label.toLowerCase().includes(needle) ||
        service.subtitle.toLowerCase().includes(needle),
    );
  }, [query]);

  const openService = (serviceId: string) =>
    navigation.navigate('ServiceArtisans', { serviceId });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={navigation.goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ArrowLeftIcon color={BODY} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>All services</Text>
          <Text style={styles.subtitle}>
            Find the right services for your needs
          </Text>
        </View>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.searchField}>
        <SearchIcon color={BODY} size={18} />
        <TextInput
          autoCorrect={false}
          onChangeText={setQuery}
          placeholder="Search for a service"
          placeholderTextColor={MUTED}
          returnKeyType="search"
          style={styles.searchInput}
          value={query}
        />
        {query.length > 0 ? (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setQuery('')}
            style={styles.clear}
          >
            <CloseIcon color={BODY} size={10} />
          </Pressable>
        ) : null}
      </View>

      {services.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyBadge}>
            <SearchIcon color="#C4A574" size={56} />
          </View>
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptyBody}>
            Try a different name, like plumber or carpenter.
          </Text>
        </View>
      ) : (
        <FlatList
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 24 },
          ]}
          data={services}
          getItemLayout={(_, index) => ({
            index,
            length: CARD_ROW_HEIGHT,
            offset: CARD_ROW_HEIGHT * Math.floor(index / 2),
          })}
          initialNumToRender={6}
          keyExtractor={service => service.id}
          maxToRenderPerBatch={4}
          numColumns={2}
          removeClippedSubviews
          renderItem={({ item }) => (
            <ServiceCard
              onPress={() => openService(item.id)}
              service={item}
              width={tileWidth}
            />
          )}
          showsVerticalScrollIndicator={false}
          windowSize={5}
        />
      )}
    </View>
  );
}

const ServiceCard = memo(function ServiceCard({
  service,
  width,
  onPress,
}: Readonly<{
  service: Service;
  width: number;
  onPress: () => void;
}>) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.artwork}>
        <Image resizeMode="contain" source={service.artwork} style={styles.artworkImage} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.label}>
          {service.label}
        </Text>
        <Text numberOfLines={2} style={styles.cardSubtitle}>
          {service.subtitle}
        </Text>
      </View>
      <ChevronRightIcon color={MUTED} size={16} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#DDD0BC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: H_PADDING,
  },
  back: {
    alignItems: 'center',
    backgroundColor: '#EDE4D5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backSpacer: {
    width: 40,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: NAME,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  searchField: {
    alignItems: 'center',
    backgroundColor: '#F5EDE2',
    borderColor: '#A99F8E',
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 10,
    height: 48,
    marginHorizontal: H_PADDING,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: NAME,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  clear: {
    alignItems: 'center',
    backgroundColor: '#EDE1CC',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  list: {
    paddingHorizontal: H_PADDING,
    paddingTop: 24,
  },
  row: {
    gap: TILE_GAP,
    marginBottom: TILE_GAP,
  },
  card: {
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderColor: '#DDD0BC',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    height: 69,
    paddingHorizontal: 7,
  },
  artwork: {
    backgroundColor: '#DAD3C7',
    borderRadius: 6,
    height: 56,
    overflow: 'hidden',
    width: 56,
  },
  artworkImage: {
    height: '100%',
    width: '100%',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: NAME,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 18,
  },
  cardSubtitle: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyBadge: {
    alignItems: 'center',
    backgroundColor: '#F4E9DA',
    borderRadius: 78,
    height: 156,
    justifyContent: 'center',
    width: 156,
  },
  emptyTitle: {
    color: NAME,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 24,
  },
  emptyBody: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
