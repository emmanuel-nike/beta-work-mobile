import { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AddressIcon from '../../assets/images/address.svg';
import BackIcon from '../../assets/images/back.svg';
import CameraIcon from '../../assets/images/camera.svg';
import EmailIcon from '../../assets/images/email.svg';
import OtpArtwork from '../../assets/images/otp.png';
import PasswordIcon from '../../assets/images/password.svg';
import PhoneIcon from '../../assets/images/phone.svg';
import SuccessArtwork from '../../assets/images/signup-success.png';
import UserIcon from '../../assets/images/user.svg';
import { ActionButton } from '../components/ActionButton';
import { FormField } from '../components/FormField';
import { colors } from '../theme/colors';

type SignupStep = 'details' | 'verification' | 'success';

type SignupFlowProps = Readonly<{
  onDashboard?: () => void;
  onSignIn?: () => void;
}>;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
};

const isValidEmail = (value: string) => {
  const atIndex = value.indexOf('@');
  const dotIndex = value.lastIndexOf('.');

  return (
    !value.includes(' ') &&
    atIndex > 0 &&
    dotIndex > atIndex + 1 &&
    dotIndex < value.length - 1
  );
};

export function SignupFlow({
  onDashboard = () => {},
  onSignIn = () => {},
}: SignupFlowProps) {
  const [step, setStep] = useState<SignupStep>('details');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {step === 'details' ? (
        <SignupDetails
          onContinue={phone => {
            setPhoneNumber(phone);
            setStep('verification');
          }}
          onSignIn={onSignIn}
        />
      ) : null}
      {step === 'verification' ? (
        <VerificationScreen
          onBack={() => setStep('details')}
          onVerified={() => setStep('success')}
          phoneNumber={phoneNumber}
        />
      ) : null}
      {step === 'success' ? <SuccessScreen onDashboard={onDashboard} /> : null}
    </SafeAreaView>
  );
}

function SignupDetails({
  onContinue,
  onSignIn,
}: Readonly<{
  onContinue: (phone: string) => void;
  onSignIn: () => void;
}>) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const updateField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const submit = () => {
    const nextErrors: Partial<FormState> = {};
    const emailIsValid = isValidEmail(form.email);

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name';
    }
    if (!emailIsValid) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Please enter a valid phone number';
    }
    if (form.password.length < 8) {
      nextErrors.password = 'Password must contain at least 8 characters';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onContinue(form.phone);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.signupContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator step={1} />

        <View style={styles.signupHeading}>
          <Text style={styles.pageTitle}>Create your account</Text>
          <Text style={styles.body}>
            Join Beta Work! to connect with trusted professionals near you.
          </Text>
        </View>

        {/* <Pressable
          accessibilityLabel="Upload profile picture"
          accessibilityRole="button"
          style={styles.photoSection}>
          <View style={styles.photoCircle}>
            <CameraIcon height={28} width={28} />
          </View>
          <View style={styles.photoCopy}>
            <Text style={styles.photoTitle}>Upload picture</Text>
            <Text style={styles.photoDescription}>
              Add a clear photo of yourself
            </Text>
          </View>
        </Pressable> */}

        <View style={styles.form}>
          <FormField
            autoCapitalize="words"
            autoComplete="name"
            error={errors.fullName}
            icon={UserIcon}
            label="Full name"
            onChangeText={value => updateField('fullName', value)}
            placeholder="Enter your full name"
            textContentType="name"
            value={form.fullName}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            icon={EmailIcon}
            keyboardType="email-address"
            label="Email address"
            onChangeText={value => updateField('email', value)}
            placeholder="Enter your email"
            textContentType="emailAddress"
            value={form.email}
          />
          <FormField
            autoComplete="tel"
            error={errors.phone}
            icon={PhoneIcon}
            keyboardType="phone-pad"
            label="Phone number"
            onChangeText={value => updateField('phone', value)}
            placeholder="Enter phone number"
            textContentType="telephoneNumber"
            value={form.phone}
          />
          <FormField
            autoComplete="street-address"
            error={errors.address}
            helper="Enter your full address (include nearby landmark, e.g., Opposite Zenith Bank, Wuse 2"
            icon={AddressIcon}
            label="Address (optional)"
            onChangeText={value => updateField('address', value)}
            placeholder="Type in your address"
            textContentType="fullStreetAddress"
            value={form.address}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.password}
            helper="Your password keeps your account safe. Use at least 8 characters (letters or numbers)."
            icon={PasswordIcon}
            isPassword
            label="Password"
            onChangeText={value => updateField('password', value)}
            placeholder="Type your password here"
            textContentType="newPassword"
            value={form.password}
          />
        </View>

        <ActionButton onPress={submit} style={styles.getStartedButton}>
          Get started
        </ActionButton>

        <Text style={styles.terms}>
          By clicking the “Get started” button, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text>
        </Text>
        <Text style={styles.signIn}>
          Already have an account?{' '}
          <Text onPress={onSignIn} style={styles.link}>
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function VerificationScreen({
  phoneNumber,
  onBack,
  onVerified,
}: Readonly<{
  phoneNumber: string;
  onBack: () => void;
  onVerified: () => void;
}>) {
  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const displayPhone = phoneNumber || '0801 234 5678';

  const verify = () => {
    if (code === '123456') {
      onVerified();
      return;
    }
    setHasError(true);
  };

  return (
    <View style={styles.verificationScreen}>
      <View style={styles.verificationTopRow}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
        >
          <BackIcon height={18} width={18} />
        </Pressable>
        <StepIndicator step={2} />
      </View>

      <View style={styles.verificationHeading}>
        <Text style={styles.verificationTitle}>Verify your phone number</Text>
        <Text style={styles.body}>
          Enter the code sent to{' '}
          <Text style={styles.phoneEmphasis}>{displayPhone}</Text>
        </Text>
      </View>

      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={OtpArtwork}
        style={styles.otpArtwork}
      />

      <Pressable
        accessibilityLabel="Enter six-digit verification code"
        onPress={() => inputRef.current?.focus()}
        style={styles.otpArea}
      >
        <View style={styles.otpRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={[styles.otpBox, hasError && styles.otpBoxError]}
            >
              <Text style={styles.otpDigit}>{code[index] ?? ''}</Text>
            </View>
          ))}
        </View>
        <TextInput
          ref={inputRef}
          autoFocus
          caretHidden
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={value => {
            setCode(value.replace(/\D/g, ''));
            setHasError(false);
          }}
          style={styles.hiddenOtpInput}
          value={code}
        />
      </Pressable>

      {hasError ? (
        <Text style={styles.otpError}>
          Verification code is incorrect. Please try again
        </Text>
      ) : null}

      <Text style={styles.expiry}>
        This code will expire in 02:59{' '}
        <Text
          onPress={() => {
            setCode('');
            setHasError(false);
            inputRef.current?.focus();
          }}
          style={styles.link}
        >
          Resend
        </Text>
      </Text>

      <ActionButton
        disabled={code.length !== 6}
        onPress={verify}
        style={styles.verifyButton}
      >
        Verify
      </ActionButton>

      <Text style={styles.incorrectNumber}>
        Incorrect phone number?{' '}
        <Text onPress={onBack} style={styles.link}>
          Go back
        </Text>
      </Text>
    </View>
  );
}

function SuccessScreen({ onDashboard }: Readonly<{ onDashboard: () => void }>) {
  return (
    <View style={styles.successScreen}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={SuccessArtwork}
        style={styles.successArtwork}
      />
      <View style={styles.successCopy}>
        <Text style={styles.verificationTitle}>Welcome to Beta Work!</Text>
        <Text style={styles.successBody}>
          You’re all set. Start exploring trusted artisans near you.
        </Text>
      </View>
      <ActionButton onPress={onDashboard}>Go to Dashboard</ActionButton>
    </View>
  );
}

function StepIndicator({ step }: Readonly<{ step: 1 | 2 }>) {
  return (
    <View
      accessibilityLabel={`Signup step ${step} of 2`}
      style={styles.stepIndicator}
    >
      <View style={styles.stepTrack}>
        <View
          style={[
            styles.stepFill,
            step === 1 ? styles.firstStepFill : styles.secondStepFill,
          ]}
        />
      </View>
      <Text style={styles.stepText}>{step} of 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  signupContent: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepIndicator: {
    alignSelf: 'flex-end',
    gap: 8,
    width: 50,
  },
  stepTrack: {
    backgroundColor: colors.progressTrack,
    borderRadius: 6,
    height: 8,
    overflow: 'hidden',
  },
  stepFill: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 8,
  },
  firstStepFill: {
    width: 29,
  },
  secondStepFill: {
    width: 50,
  },
  stepText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 12,
  },
  signupHeading: {
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  photoSection: {
    alignItems: 'center',
    gap: 8,
    marginTop: 39,
  },
  photoCircle: {
    alignItems: 'center',
    borderColor: colors.formBorder,
    borderRadius: 50,
    borderWidth: 1.25,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  photoCopy: {
    alignItems: 'center',
    gap: 4,
  },
  photoTitle: {
    color: colors.formLabel,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  photoDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 13,
  },
  form: {
    gap: 20,
    marginTop: 20,
  },
  getStartedButton: {
    marginTop: 48,
  },
  terms: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 37,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
  signIn: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 115,
    textAlign: 'center',
  },
  verificationScreen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
  },
  verificationTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.disabled,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  verificationHeading: {
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  verificationTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  phoneEmphasis: {
    fontWeight: '500',
  },
  otpArtwork: {
    alignSelf: 'center',
    height: 145,
    marginTop: 52,
    width: 145,
  },
  otpArea: {
    marginTop: 48,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  otpBox: {
    alignItems: 'center',
    borderColor: colors.formBorder,
    borderRadius: 8,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 48,
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  otpDigit: {
    color: colors.textPrimary,
    fontSize: 20,
  },
  hiddenOtpInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  otpError: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 15,
    marginTop: 12,
  },
  expiry: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 47,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 48,
  },
  incorrectNumber: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 'auto',
    paddingBottom: 27,
    textAlign: 'center',
  },
  successScreen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 156,
  },
  successArtwork: {
    height: 219,
    width: 289,
  },
  successCopy: {
    gap: 8,
    marginBottom: 48,
  },
  successBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
