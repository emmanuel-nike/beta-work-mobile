import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  LANGUAGE_OPTIONS,
  MAX_PORTFOLIO_IMAGES,
  createServiceRow,
  type ServicePrice,
} from '../../data/artisanPortfolio';
import { appColors } from '../../theme/clientApp';
import { pickImagesFromLibrary } from '../../utils/pickImage';
import { CheckIcon, CloseIcon, PlusIcon, TrashIcon } from '../icons';
import { FieldLabel, PortfolioField, StepIntro } from './PortfolioPrimitives';
import type { PortfolioStepProps } from './types';

/** Step 2 — "Showcase your best work". */
export function PortfolioWorkStep({ form, update }: PortfolioStepProps) {
  const [gridWidth, setGridWidth] = useState(0);
  const remaining = MAX_PORTFOLIO_IMAGES - form.portfolioImages.length;
  const tileSize =
    gridWidth > 0
      ? (gridWidth - TILE_GAP * (TILE_COLUMNS - 1)) / TILE_COLUMNS
      : 0;
  const tileStyle = [
    styles.tile,
    tileSize > 0 ? { height: tileSize, width: tileSize } : null,
  ];

  const handleAddImages = async () => {
    if (remaining <= 0) {
      return;
    }
    const picked = await pickImagesFromLibrary(remaining);
    if (picked.length > 0) {
      update({
        portfolioImages: [...form.portfolioImages, ...picked].slice(
          0,
          MAX_PORTFOLIO_IMAGES,
        ),
      });
    }
  };

  const removeImage = (uri: string) => {
    update({
      portfolioImages: form.portfolioImages.filter(item => item !== uri),
    });
  };

  const updateService = (id: string, patch: Partial<ServicePrice>) => {
    update({
      servicePricing: form.servicePricing.map(row =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    });
  };

  const removeService = (id: string) => {
    update({
      servicePricing: form.servicePricing.filter(row => row.id !== id),
    });
  };

  const addService = () => {
    update({ servicePricing: [...form.servicePricing, createServiceRow()] });
  };

  const toggleLanguage = (language: string) => {
    const next = form.languages.includes(language)
      ? form.languages.filter(item => item !== language)
      : [...form.languages, language];
    update({ languages: next });
  };

  // One trailing "add" tile while there is still room for more photos.
  const slots: Array<{ key: string; uri?: string }> = [
    ...form.portfolioImages.map(uri => ({ key: uri, uri })),
  ];
  if (remaining > 0) {
    slots.push({ key: 'add-tile' });
  }

  return (
    <View style={styles.container}>
      <StepIntro
        subtitle="Photos help clients trust your skills. Upload high-quality images of your completed projects."
        title="Showcase your best work"
      />

      <View style={styles.field}>
        <FieldLabel>Languages</FieldLabel>
        <View style={styles.checklist}>
          {LANGUAGE_OPTIONS.map(language => {
            const checked = form.languages.includes(language);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                key={language}
                onPress={() => toggleLanguage(language)}
                style={({ pressed }) => [
                  styles.checkRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked ? (
                    <CheckIcon color={appColors.white} size={12} />
                  ) : null}
                </View>
                <Text style={styles.checkLabel}>{language}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <FieldLabel>Upload portfolio images</FieldLabel>
        <View
          onLayout={event => setGridWidth(event.nativeEvent.layout.width)}
          style={styles.grid}
        >
          {slots.map(slot =>
            slot.uri ? (
              <View key={slot.key} style={tileStyle}>
                <Image source={{ uri: slot.uri }} style={styles.tileImage} />
                <Pressable
                  accessibilityLabel="Remove image"
                  accessibilityRole="button"
                  hitSlop={6}
                  onPress={() => removeImage(slot.uri!)}
                  style={styles.tileRemove}
                >
                  <CloseIcon color={appColors.white} size={12} />
                </Pressable>
              </View>
            ) : (
              <View key={slot.key} style={tileStyle}>
                <Pressable
                  accessibilityLabel="Add portfolio image"
                  accessibilityRole="button"
                  onPress={handleAddImages}
                  style={({ pressed }) => [
                    styles.addTile,
                    pressed && styles.pressed,
                  ]}
                >
                  <PlusIcon color={appColors.textFaint} size={26} />
                </Pressable>
              </View>
            ),
          )}
        </View>
        <Text style={styles.gridHint}>
          Show recent, clear photos (max 3MB each).{' '}
          {form.portfolioImages.length}/{MAX_PORTFOLIO_IMAGES} uploaded.
        </Text>
      </View>

      <View style={styles.field}>
        <FieldLabel>Services &amp; sample prices</FieldLabel>
        <Text style={styles.sectionHint}>
          Adding price ranges helps clients choose quickly.
        </Text>

        {form.servicePricing.map((row, index) => (
          <View key={row.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceLabel}>Service</Text>
              {form.servicePricing.length > 1 ? (
                <Pressable
                  accessibilityLabel={`Remove service ${index + 1}`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => removeService(row.id)}
                >
                  <TrashIcon color={appColors.danger} size={18} />
                </Pressable>
              ) : null}
            </View>

            <PortfolioField
              onChangeText={value => updateService(row.id, { service: value })}
              placeholder="Fittings"
              value={row.service}
            />

            <View style={styles.priceRow}>
              <View style={styles.priceCol}>
                <PortfolioField
                  label="Min price"
                  numeric
                  onChangeText={value =>
                    updateService(row.id, { minPrice: value })
                  }
                  placeholder="3000"
                  value={row.minPrice}
                />
              </View>
              <View style={styles.priceCol}>
                <PortfolioField
                  label="Max price"
                  numeric
                  onChangeText={value =>
                    updateService(row.id, { maxPrice: value })
                  }
                  placeholder="120000"
                  value={row.maxPrice}
                />
              </View>
            </View>
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          onPress={addService}
          style={({ pressed }) => [
            styles.addService,
            pressed && styles.pressed,
          ]}
        >
          <PlusIcon color={appColors.primary} size={18} />
          <Text style={styles.addServiceLabel}>Add another service</Text>
        </Pressable>
      </View>
    </View>
  );
}

const TILE_GAP = 10;
const TILE_COLUMNS = 3;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  field: {
    marginBottom: 10,
    gap: 8,
  },
  checklist: {
    backgroundColor: appColors.field,
    borderColor: '#C5B294',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    rowGap: 4,
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
    width: '48%',
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: appColors.white,
    borderColor: '#B7A078',
    borderRadius: 4,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxOn: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  checkLabel: {
    color: appColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
  tile: {
    backgroundColor: appColors.field,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tileImage: {
    height: '100%',
    width: '100%',
  },
  tileRemove: {
    alignItems: 'center',
    backgroundColor: appColors.danger,
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 6,
    top: 6,
    width: 22,
  },
  addTile: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    borderColor: '#C5B294',
    borderStyle: 'dashed',
    borderWidth: 1,
    justifyContent: 'center',
  },
  gridHint: {
    color: appColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHint: {
    color: appColors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  serviceCard: {
    backgroundColor: 'rgba(245, 237, 226, 0.5)',
    borderColor: '#D3C1A4',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  serviceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceLabel: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceCol: {
    flex: 1,
  },
  addService: {
    alignItems: 'center',
    borderColor: appColors.primary,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
  },
  addServiceLabel: {
    color: appColors.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});
