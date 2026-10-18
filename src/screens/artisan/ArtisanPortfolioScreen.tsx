import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { PortfolioHoursStep } from '../../components/portfolio/PortfolioHoursStep';
import { PortfolioServiceStep } from '../../components/portfolio/PortfolioServiceStep';
import { PortfolioWorkStep } from '../../components/portfolio/PortfolioWorkStep';
import {
  createDefaultPortfolioForm,
  getPortfolioStepError,
  type PortfolioForm,
} from '../../data/artisanPortfolio';
import type { AuthStackScreenProps } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { submitArtisanPortfolio } from '../../store/slices/authSlice';
import { appColors } from '../../theme/clientApp';

const TOTAL_STEPS = 3;

export function ArtisanPortfolioScreen({
  navigation,
}: AuthStackScreenProps<'ArtisanPortfolio'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PortfolioForm>(createDefaultPortfolioForm);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<PortfolioForm>) =>
    setForm(current => ({ ...current, ...patch }));

  const isLastStep = step === TOTAL_STEPS - 1;

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep(current => current - 1);
  };

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    const hoursError = getPortfolioStepError(form, 2);
    if (hoursError) {
      Alert.alert('Complete this step', hoursError);
      return;
    }

    setSaving(true);
    try {
      await dispatch(submitArtisanPortfolio(form)).unwrap();
      Alert.alert(
        'Portfolio updated',
        'Your portfolio has been saved successfully.',
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
    } catch (rejected) {
      Alert.alert(
        'Could not save',
        typeof rejected === 'string'
          ? rejected
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    const stepError = getPortfolioStepError(form, step);
    if (stepError) {
      Alert.alert('Complete this step', stepError);
      return;
    }

    if (isLastStep) {
      handleSubmit();
      return;
    }

    if (step === 0) {
      const [first, ...rest] = form.servicePricing;
      if (first && !first.service.trim() && form.primarySkill.trim()) {
        update({
          servicePricing: [{ ...first, service: form.primarySkill }, ...rest],
        });
      }
    }
    setStep(current => current + 1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <BookingsHeader
        onBack={handleBack}
        title="Update your portfolio"
        variant="detail"
      />

      <View style={styles.progress}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={[styles.progressDot, index <= step && styles.progressDotOn]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 ? <PortfolioServiceStep form={form} update={update} /> : null}
        {step === 1 ? <PortfolioWorkStep form={form} update={update} /> : null}
        {step === 2 ? <PortfolioHoursStep form={form} update={update} /> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            (pressed || saving) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonLabel}>
            {isLastStep ? (saving ? 'Submitting…' : 'Submit') : 'Next'}
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: appColors.surface,
    flex: 1,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 16,
  },
  progressDot: {
    backgroundColor: '#CBBBA1',
    borderRadius: 3,
    height: 6,
    width: 24,
  },
  progressDotOn: {
    backgroundColor: appColors.primary,
  },
  content: {
    gap: 20,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  footer: {
    backgroundColor: appColors.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: appColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  buttonArrow: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
