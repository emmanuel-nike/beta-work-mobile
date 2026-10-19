import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

import { portfolioFormFromProfile } from '../../api/artisan';
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadArtisanProfile,
  selectArtisanProfile,
  submitArtisanPortfolio,
} from '../../store/slices/authSlice';
import { appColors } from '../../theme/clientApp';

const TOTAL_STEPS = 3;

export function ArtisanPortfolioScreen({
  navigation,
}: AuthStackScreenProps<'ArtisanPortfolio'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const savedProfile = useAppSelector(selectArtisanProfile);

  const [step, setStep] = useState(0);
  // Seed from whatever profile is already in the store so the form is never
  // blank on open; refresh from the API below to pick up the latest save.
  const [form, setForm] = useState<PortfolioForm>(() =>
    savedProfile
      ? portfolioFormFromProfile(savedProfile)
      : createDefaultPortfolioForm(),
  );
  const [loading, setLoading] = useState(!savedProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    dispatch(loadArtisanProfile())
      .unwrap()
      .then(profile => {
        if (active && profile) {
          setForm(portfolioFormFromProfile(profile));
        }
      })
      .catch(() => {
        // Keep whatever we already have (store seed or defaults).
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [dispatch]);

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

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={appColors.primary} size="large" />
          <Text style={styles.loaderText}>Loading your portfolio…</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 ? (
              <PortfolioServiceStep form={form} update={update} />
            ) : null}
            {step === 1 ? (
              <PortfolioWorkStep form={form} update={update} />
            ) : null}
            {step === 2 ? (
              <PortfolioHoursStep form={form} update={update} />
            ) : null}
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
        </>
      )}
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
  loader: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  loaderText: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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
