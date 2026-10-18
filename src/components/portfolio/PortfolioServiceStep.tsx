import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MAX_BIO_LENGTH,
  SKILL_OPTIONS,
} from '../../data/artisanPortfolio';
import { appColors } from '../../theme/clientApp';
import { captureImage, pickImageFromLibrary } from '../../utils/pickImage';
import { AvatarPickerSheet } from '../profile/AvatarPickerSheet';
import {
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  UploadIcon,
} from '../icons';
import {
  FieldLabel,
  PortfolioField,
  StepIntro,
} from './PortfolioPrimitives';
import { SelectSheet } from './SelectSheet';
import type { PortfolioStepProps } from './types';

/** Step 1 — "Tell us about your service". */
export function PortfolioServiceStep({ form, update }: PortfolioStepProps) {
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);
  const [skillSheetOpen, setSkillSheetOpen] = useState(false);

  const toggleService = (service: string) => {
    const next = form.otherServices.includes(service)
      ? form.otherServices.filter(item => item !== service)
      : [...form.otherServices, service];
    update({ otherServices: next });
  };

  const handleTakePhoto = async () => {
    setAvatarSheetOpen(false);
    const uri = await captureImage();
    if (uri) {
      update({ photoUri: uri });
    }
  };

  const handleChoosePhoto = async () => {
    setAvatarSheetOpen(false);
    const uri = await pickImageFromLibrary();
    if (uri) {
      update({ photoUri: uri });
    }
  };

  const handlePickCertificate = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      update({ certificateUri: uri });
    }
  };

  // Other services exclude whatever is already chosen as the primary skill.
  const otherServiceOptions = SKILL_OPTIONS.filter(
    option => option !== form.primarySkill,
  ).sort((a, b) => a.localeCompare(b));

  return (
    <View style={styles.container}>
      <StepIntro
        subtitle="This helps clients find and understand your services"
        title="Tell us about your service"
      />

      <View style={styles.avatarBlock}>
        <Pressable
          accessibilityLabel="Upload profile picture"
          accessibilityRole="button"
          onPress={() => setAvatarSheetOpen(true)}
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          {form.photoUri ? (
            <Image source={{ uri: form.photoUri }} style={styles.avatarImage} />
          ) : (
            <CameraIcon color={appColors.textPrimary} size={26} />
          )}
        </Pressable>
        <Text style={styles.avatarTitle}>Upload picture</Text>
        <Text style={styles.avatarHint}>Add a clear photo of yourself</Text>
      </View>

      <View style={styles.field}>
        <FieldLabel>Primary skill</FieldLabel>
        <Pressable
          accessibilityRole="button"
          onPress={() => setSkillSheetOpen(true)}
          style={({ pressed }) => [styles.select, pressed && styles.pressed]}
        >
          <Text
            style={[
              styles.selectValue,
              !form.primarySkill && styles.selectPlaceholder,
            ]}
          >
            {form.primarySkill || 'Select an option ...'}
          </Text>
          <ChevronDownIcon color={appColors.textLabel} size={18} />
        </Pressable>
      </View>

      <View style={styles.field}>
        <FieldLabel>Other services you offer (optional)</FieldLabel>
        <View style={styles.checklist}>
          {otherServiceOptions.map(service => {
            const checked = form.otherServices.includes(service);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                key={service}
                onPress={() => toggleService(service)}
                style={({ pressed }) => [
                  styles.checkRow,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked ? <CheckIcon color={appColors.white} size={12} /> : null}
                </View>
                <Text style={styles.checkLabel}>{service}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <PortfolioField
        label="Years of experience"
        numeric
        onChangeText={value => update({ yearsOfExperience: value })}
        placeholder="e.g., 3 years"
        value={form.yearsOfExperience}
      />

      <View style={styles.field}>
        <FieldLabel>Certificate (Optional)</FieldLabel>
        <Pressable
          accessibilityRole="button"
          onPress={handlePickCertificate}
          style={({ pressed }) => [styles.dropzone, pressed && styles.pressed]}
        >
          {form.certificateUri ? (
            <>
              <Image
                source={{ uri: form.certificateUri }}
                style={styles.certificatePreview}
              />
              <Pressable
                accessibilityLabel="Remove certificate"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => update({ certificateUri: null })}
                style={styles.certificateRemove}
              >
                <CloseIcon color={appColors.white} size={12} />
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.dropIcon}>
                <UploadIcon color={appColors.textPrimary} size={22} />
              </View>
              <Text style={styles.dropTitle}>
                Drag and drop or tap to upload photos
              </Text>
              <Text style={styles.dropHint}>JPG, PNG up to 5MB</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.field}>
        <PortfolioField
          label="Short bio (helpful for customers)"
          maxLength={MAX_BIO_LENGTH}
          multiline
          onChangeText={value => update({ bio: value })}
          placeholder="e.g., Skilled plumber specialising in bathroom fittings."
          value={form.bio}
        />
        <Text style={styles.counter}>
          {form.bio.length}/{MAX_BIO_LENGTH} characters
        </Text>
      </View>

      <AvatarPickerSheet
        hasPhoto={Boolean(form.photoUri)}
        onChooseFromGallery={handleChoosePhoto}
        onClose={() => setAvatarSheetOpen(false)}
        onRemovePhoto={() => {
          setAvatarSheetOpen(false);
          update({ photoUri: null });
        }}
        onTakePhoto={handleTakePhoto}
        visible={avatarSheetOpen}
      />

      <SelectSheet
        onClose={() => setSkillSheetOpen(false)}
        onSelect={value => {
          const [first, ...rest] = form.servicePricing;
          const keepCustomTitle =
            first &&
            first.service.trim().length > 0 &&
            first.service !== form.primarySkill;
          update({
            primarySkill: value,
            servicePricing: first
              ? [
                  keepCustomTitle ? first : { ...first, service: value },
                  ...rest,
                ]
              : form.servicePricing,
          });
        }}
        options={SKILL_OPTIONS}
        selected={form.primarySkill}
        title="Select your primary skill"
        visible={skillSheetOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 100,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarTitle: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  avatarHint: {
    color: appColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  field: {
    gap: 8,
  },
  select: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderColor: '#C5B294',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  selectValue: {
    color: appColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  selectPlaceholder: {
    color: appColors.placeholder,
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
    gap: 8,
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
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  dropzone: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderColor: '#C5B294',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 28,
  },
  dropIcon: {
    alignItems: 'center',
    backgroundColor: '#E7DAC5',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  dropTitle: {
    color: appColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  dropHint: {
    color: appColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  certificatePreview: {
    borderRadius: 8,
    height: 140,
    width: '100%',
  },
  certificateRemove: {
    alignItems: 'center',
    backgroundColor: appColors.danger,
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 22,
  },
  counter: {
    color: appColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
