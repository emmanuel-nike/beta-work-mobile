import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { WHY_BETA_WORK_SLIDES, type PromoSlide } from '../../data/whyBetaWork';
import { dashboardColors } from '../../theme/dashboard';

const AUTOPLAY_INTERVAL_MS = 5000;
const CARD_HEIGHT = 196;

type WhyBetaWorkSectionProps = Readonly<{
  slides?: readonly PromoSlide[];
  subtitle?: string;
}>;

export function WhyBetaWorkSection({
  slides = WHY_BETA_WORK_SLIDES,
  subtitle = 'See how we help you find trusted artisans, book with confidence, and get it done.',
}: WhyBetaWorkSectionProps) {
  const listRef = useRef<FlatList<PromoSlide>>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  // Pauses autoplay briefly while the user is swiping.
  const isInteractingRef = useRef(false);

  const handleLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  useEffect(() => {
    if (width === 0 || slides.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      if (isInteractingRef.current) {
        return;
      }

      setActiveIndex(current => {
        const next = (current + 1) % slides.length;
        listRef.current?.scrollToOffset({
          offset: next * width,
          animated: true,
        });
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slides.length, width]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width > 0) {
        setActiveIndex(
          Math.round(event.nativeEvent.contentOffset.x / width),
        );
      }
      isInteractingRef.current = false;
    },
    [width],
  );

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Why Beta Work</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View onLayout={handleLayout} style={styles.carousel}>
        {width > 0 ? (
          <FlatList
            data={slides}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            horizontal
            keyExtractor={slide => slide.id}
            onMomentumScrollEnd={handleMomentumEnd}
            onScrollBeginDrag={() => {
              isInteractingRef.current = true;
            }}
            pagingEnabled
            ref={listRef}
            renderItem={({ item }) => <PromoCard slide={item} width={width} />}
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
      </View>

      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function PromoCard({
  slide,
  width,
}: Readonly<{ slide: PromoSlide; width: number }>) {
  return (
    <View style={[styles.card, { width }]}>
      <Image source={slide.image} style={styles.image} />

      {/* Scrim keeps the copy legible over the photo. */}
      <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
        <Defs>
          <LinearGradient id="scrim" x1="0" x2="0.04" y1="1" y2="-0.13">
            <Stop offset="0.122" stopColor="#242424" stopOpacity={0.93} />
            <Stop offset="0.755" stopColor="#242424" stopOpacity={0.74} />
            <Stop offset="0.83" stopColor="#1E2320" stopOpacity={0.75} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#scrim)" height="100%" opacity={0.96} width="100%" />
      </Svg>

      <View style={styles.copy}>
        <Text style={styles.headline}>{slide.headline}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 0,
  },
  title: {
    color: '#1F1611',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle: {
    color: '#3D2E22',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  carousel: {
    borderRadius: 12,
    height: CARD_HEIGHT,
    marginTop: 22,
    overflow: 'hidden',
  },
  card: {
    height: CARD_HEIGHT,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: CARD_HEIGHT,
    width: '100%',
  },
  copy: {
    padding: 16,
    paddingBottom: 20,
  },
  headline: {
    color: '#FAF6F2',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  body: {
    color: '#FAF6F2',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
  },
  dot: {
    backgroundColor: dashboardColors.tabInactive,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  dotActive: {
    backgroundColor: dashboardColors.tabBar,
  },
});
