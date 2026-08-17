import { useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
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
import ArtisanConnectArtwork from '../../assets/images/artisan-connect.png';
import ArtisanManageArtwork from '../../assets/images/artisan-manage.png';
import ArtisanReputationArtwork from '../../assets/images/artisan-reputation.png';
import BackIcon from '../../assets/images/back.svg';
import CameraIcon from '../../assets/images/camera.svg';
import EmailIcon from '../../assets/images/email.svg';
import OtpArtwork from '../../assets/images/otp.png';
import PasswordIcon from '../../assets/images/password.svg';
import PhoneIcon from '../../assets/images/phone.svg';
import UserIcon from '../../assets/images/user.svg';
import { ActionButton } from '../components/ActionButton';
import { FormField } from '../components/FormField';
import { ProgressBar } from '../components/ProgressBar';
import { colors } from '../theme/colors';
import { DEFAULT_ONBOARDING_SCREEN_DURATION_MS } from '../theme/onboarding';

type SplashPage = {
  artwork: number;
  description: string;
  title: string;
};

const SPLASH_PAGES: SplashPage[] = [
  {
    artwork: ArtisanConnectArtwork,
    title: 'Connect with serious clients',
    description:
      'Our platform is built on trust. We connect you with clients who are serious about their projects, so you can focus on high-quality work.',
  },
  {
    artwork: ArtisanManageArtwork,
    title: 'Manage your business at ease.',
    description:
      'Track your orders, manage your schedule, and communicate with clients, all in one place. Spend less time on admin and more time on your craft.',
  },
  {
    artwork: ArtisanReputationArtwork,
    title: 'Build a reputation that lasts.',
    description:
      "Complete our safety verification to earn your 'Verified' badge. Verified Artisans get up to 5x more job invitations.",
  },
];

const OTP_POSITIONS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'] as const;

const ARTISAN_SKILLS = [
  'Plumber',
  'Electrician',
  'Auto Mechanic',
  'Carpenter',
  'Painter',
  'Welder',
  'Tiler',
  'Mason',
  'Tailor',
  'AC Technician',
  'Generator Technician',
  'Cleaner',
] as const;

type SignupStep =
  | 'details'
  | 'verification'
  | 'identity'
  | 'guarantor'
  | 'success';

type ArtisanFlowProps = Readonly<{
  onDashboard: () => void;
  onSignIn: () => void;
  screenDurationMs?: number;
}>;

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

const firstNameFrom = (fullName: string) => {
  const first = fullName.trim().split(/\s+/)[0];
  return first || 'Artisan';
};

export function ArtisanFlow({
  onDashboard,
  onSignIn,
  screenDurationMs = DEFAULT_ONBOARDING_SCREEN_DURATION_MS,
}: ArtisanFlowProps) {
  const [splashIndex, setSplashIndex] = useState(0);
  const [hasFinishedSplash, setHasFinishedSplash] = useState(false);
  const [step, setStep] = useState<SignupStep>('details');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -45 && splashIndex < SPLASH_PAGES.length - 1) {
            setSplashIndex(current => current + 1);
          }
          if (gesture.dx > 45 && splashIndex > 0) {
            setSplashIndex(current => current - 1);
          }
        },
      }),
    [splashIndex],
  );

  if (!hasFinishedSplash) {
    const page = SPLASH_PAGES[splashIndex];
    return (
      <SafeAreaView style={styles.safeArea} {...panResponder.panHandlers}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        <View style={styles.splashScreen}>
          <ProgressBar
            durationMs={screenDurationMs}
            onStepComplete={() => {
              if (splashIndex < SPLASH_PAGES.length - 1) {
                setSplashIndex(current => current + 1);
              }
            }}
            step={splashIndex + 1}
            total={SPLASH_PAGES.length}
          />
          <Image source={page.artwork} style={styles.splashArtwork} />
          <Text style={styles.splashTitle}>{page.title}</Text>
          <Text style={styles.splashDescription}>{page.description}</Text>
          <ActionButton
            onPress={() => setHasFinishedSplash(true)}
            style={styles.splashButton}>
            Create account
          </ActionButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      {step === 'details' ? (
        <ArtisanDetails
          onContinue={(phone, name) => {
            setPhoneNumber(phone);
            setFullName(name);
            setStep('verification');
          }}
          onSignIn={onSignIn}
        />
      ) : null}
      {step === 'verification' ? (
        <VerificationStep
          onBack={() => setStep('details')}
          onVerified={() => setStep('identity')}
          phoneNumber={phoneNumber}
        />
      ) : null}
      {step === 'identity' ? (
        <IdentityStep
          onBack={() => setStep('verification')}
          onContinue={() => setStep('guarantor')}
        />
      ) : null}
      {step === 'guarantor' ? (
        <GuarantorStep
          onBack={() => setStep('identity')}
          onSubmit={() => setStep('success')}
        />
      ) : null}
      {step === 'success' ? (
        <SuccessStep
          firstName={firstNameFrom(fullName)}
          onDashboard={onDashboard}
        />
      ) : null}
    </SafeAreaView>
  );
}

function ArtisanDetails({
  onContinue,
  onSignIn,
}: Readonly<{
  onContinue: (phone: string, fullName: string) => void;
  onSignIn: () => void;
}>) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [skill, setSkill] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (
      !fullName.trim() ||
      phone.replace(/\D/g, '').length < 10 ||
      !isValidEmail(email) ||
      !skill.trim() ||
      password.length < 8
    ) {
      setError('Please complete all required fields to continue.');
      return;
    }
    setError('');
    onContinue(phone, fullName);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled">
        <StepIndicator step={1} />
        <Heading
          title="Start your artisan journey"
          body="Create your account to build your profile and start connecting with clients."
        />
        <View style={styles.form}>
          <FormField
            autoCapitalize="words"
            icon={UserIcon}
            label="Full name"
            onChangeText={setFullName}
            placeholder="Enter your full name"
            value={fullName}
          />
          <FormField
            autoComplete="tel"
            icon={PhoneIcon}
            keyboardType="phone-pad"
            label="Phone number"
            onChangeText={setPhone}
            placeholder="Enter phone number"
            value={phone}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            icon={EmailIcon}
            keyboardType="email-address"
            label="Email address"
            onChangeText={setEmail}
            placeholder="Enter your email"
            value={email}
          />
          <SkillSelect
            onChange={setSkill}
            options={ARTISAN_SKILLS}
            value={skill}
          />
          <FormField
            autoComplete="street-address"
            helper="Enter your full address (include a nearby landmark, e.g., Opposite Zenith Bank, Wuse 2)"
            icon={AddressIcon}
            label="Address (optional)"
            onChangeText={setAddress}
            placeholder="Type in your address"
            value={address}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            helper="Your password keeps your account safe. Use at least 8 characters (letters or numbers)."
            icon={PasswordIcon}
            isPassword
            label="Password"
            onChangeText={setPassword}
            placeholder="Type your password here"
            value={password}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ActionButton onPress={submit} style={styles.submitButton}>
          Continue
        </ActionButton>
        <Text style={styles.terms}>
          By clicking the “Continue” button below, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
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

function VerificationStep({
  onBack,
  onVerified,
  phoneNumber,
}: Readonly<{
  onBack: () => void;
  onVerified: () => void;
  phoneNumber: string;
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
    <View style={styles.stepScreen}>
      <TopRow onBack={onBack} step={2} />
      <Heading
        title="Verify your phone number"
        body="We have sent a 6-digit verification code by text."
      />
      <View style={styles.phoneRow}>
        <Text style={styles.phoneNumber}>{displayPhone}</Text>
        <Pressable accessibilityRole="button" onPress={onBack}>
          <Text style={styles.link}>Edit</Text>
        </Pressable>
      </View>
      <Image source={OtpArtwork} style={styles.otpArtwork} />
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.otpArea}>
        <View style={styles.otpRow}>
          {OTP_POSITIONS.map(position => {
            const positionIndex = OTP_POSITIONS.indexOf(position);
            return (
              <View
                key={position}
                style={[styles.otpBox, hasError && styles.otpBoxError]}>
                <Text style={styles.otpDigit}>
                  {code[positionIndex] ?? ''}
                </Text>
              </View>
            );
          })}
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
          style={styles.hiddenInput}
          value={code}
        />
      </Pressable>
      <Text style={styles.otpHint}>
        Enter the code sent to your phone number. If you don’t see it
        immediately, please wait a few seconds or tap resend.
      </Text>
      <Text style={styles.expiry}>
        This code will expire in 00:59{' '}
        <Text
          onPress={() => {
            setCode('');
            setHasError(false);
            inputRef.current?.focus();
          }}
          style={styles.link}>
          Resend
        </Text>
      </Text>
      {hasError ? (
        <Text style={styles.centerError}>
          Verification code is incorrect. Please try again
        </Text>
      ) : null}
      <ActionButton
        disabled={code.length !== 6}
        onPress={verify}
        style={styles.verifyButton}>
        Verify
      </ActionButton>
      <Text style={styles.bottomLink}>
        Incorrect phone number?{' '}
        <Text onPress={onBack} style={styles.link}>
          Go back
        </Text>
      </Text>
    </View>
  );
}

function IdentityStep({
  onBack,
  onContinue,
}: Readonly<{ onBack: () => void; onContinue: () => void }>) {
  const [nin, setNin] = useState('');
  const [bvn, setBvn] = useState('');
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    if (!nin.trim() || !bvn.trim() || !captured) {
      setError('Add your NIN, BVN, and a face photo to continue.');
      return;
    }
    onContinue();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled">
        <TopRow onBack={onBack} step={3} />
        <Heading
          title="Confirm your identity"
          body="Identification helps clients trust you more and brings more jobs."
        />
        <View style={styles.form}>
          <FormField
            icon={UserIcon}
            keyboardType="number-pad"
            label="NIN (National Identification Number)"
            onChangeText={setNin}
            placeholder="Enter your NIN"
            value={nin}
          />
          <Text style={styles.helper}>
            {nin.trim()
              ? 'We verify this against official records. It will not be public.'
              : 'Dial *346*0# from your registered phone to check your NIN.'}
          </Text>
          <FormField
            icon={UserIcon}
            keyboardType="number-pad"
            label="BVN (Bank Verification Number)"
            onChangeText={setBvn}
            placeholder="Enter your BVN"
            value={bvn}
          />
          <Text style={styles.helper}>
            {bvn.trim()
              ? 'Used for identity verification and payouts in later phases.'
              : 'Dial *565*0# from your registered phone to check your BVN.'}
          </Text>
        </View>
        <Text style={styles.fieldLabel}>Face capture</Text>
        <View style={styles.captureCard}>
          <Text style={styles.captureCopy}>
            Take a clear selfie (no hat/sunglasses). This is used only for
            verification.
          </Text>
          <View style={[styles.facePreview, captured && styles.faceCaptured]}>
            <CameraIcon height={35} width={35} />
          </View>
          <ActionButton
            onPress={() => setCaptured(true)}
            style={captured ? styles.retakeButton : undefined}>
            {captured ? 'Retake Photo' : 'Capture face'}
          </ActionButton>
        </View>
        <Text style={styles.helper}>
          Good lighting improves match accuracy. Allow camera permissions.
        </Text>
        <Text style={styles.notice}>
          This information is used for verification only. Your details are safe
          with us and will not be shared.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ActionButton onPress={submit} style={styles.submitButton}>
          Continue
        </ActionButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function GuarantorStep({
  onBack,
  onSubmit,
}: Readonly<{ onBack: () => void; onSubmit: () => void }>) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (
      !name.trim() ||
      phone.replace(/\D/g, '').length < 10 ||
      !isValidEmail(email) ||
      !relationship.trim() ||
      !address.trim()
    ) {
      setError('Please complete every guarantor field to submit.');
      return;
    }
    onSubmit();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled">
        <TopRow onBack={onBack} step={4} />
        <Heading
          title="Add a guarantor"
          body="Your guarantor is your trusted reference who will help you get verified."
        />
        <View style={styles.form}>
          <FormField
            autoCapitalize="words"
            icon={UserIcon}
            label="Guarantor full name"
            onChangeText={setName}
            placeholder="Enter full name"
            value={name}
          />
          <FormField
            autoComplete="tel"
            icon={PhoneIcon}
            keyboardType="phone-pad"
            label="Guarantor phone number"
            onChangeText={setPhone}
            placeholder="Enter phone number"
            value={phone}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            icon={EmailIcon}
            keyboardType="email-address"
            label="Email address"
            onChangeText={setEmail}
            placeholder="Enter your email"
            value={email}
          />
          <FormField
            icon={UserIcon}
            label="Relationship to you"
            onChangeText={setRelationship}
            placeholder="Select an option..."
            value={relationship}
          />
          <FormField
            autoComplete="street-address"
            helper="Include nearby landmark, e.g., Opposite Zenith Bank, Wuse"
            icon={AddressIcon}
            label="Address"
            onChangeText={setAddress}
            placeholder="Type in your address"
            value={address}
          />
        </View>
        <Text style={styles.notice}>
          Guarantor info is stored securely and is never shown to clients.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ActionButton onPress={submit} style={styles.submitButton}>
          Submit
        </ActionButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SuccessStep({
  firstName,
  onDashboard,
}: Readonly<{ firstName: string; onDashboard: () => void }>) {
  return (
    <View style={styles.successScreen}>
      <View style={styles.successBadge}>
        <Text style={styles.successCheck}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Submitted!</Text>
      <Text style={styles.successBody}>
        Thanks, {firstName}. Your details have been submitted successfully.
      </Text>
      <Text style={styles.successNote}>
        Verification in progress (takes up to 24-48 hours)
        {'\n'}
        Once approved, you’ll be able to publish your services and start
        receiving clients.
      </Text>
      <ActionButton onPress={onDashboard} style={styles.successButton}>
        Go to Dashboard
      </ActionButton>
    </View>
  );
}

function Heading({
  title,
  body,
}: Readonly<{ title: string; body: string }>) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function SkillSelect({
  options,
  value,
  onChange,
}: Readonly<{
  options: readonly string[];
  value: string;
  onChange: (skill: string) => void;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.skillField}>
      <Text style={styles.skillLabel}>Primary skill</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={styles.skillTrigger}>
        <Text
          style={[
            styles.skillValue,
            !value && styles.skillPlaceholder,
          ]}>
          {value || 'Select an option ...'}
        </Text>
        <Text style={styles.skillChevron}>▼</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(false)}
          style={styles.skillOverlay}>
          <Pressable onPress={() => {}} style={styles.skillSheet}>
            <Text style={styles.skillSheetTitle}>Select primary skill</Text>
            <ScrollView>
              {options.map(option => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  style={[
                    styles.skillOption,
                    value === option && styles.skillOptionSelected,
                  ]}>
                  <Text
                    style={[
                      styles.skillOptionText,
                      value === option && styles.skillOptionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function TopRow({
  onBack,
  step,
}: Readonly<{ onBack: () => void; step: 2 | 3 | 4 }>) {
  return (
    <View style={styles.topRow}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.backButton}>
        <BackIcon height={18} width={18} />
      </Pressable>
      <StepIndicator step={step} />
    </View>
  );
}

function StepIndicator({ step }: Readonly<{ step: 1 | 2 | 3 | 4 }>) {
  return (
    <View style={styles.stepIndicator}>
      <View style={styles.stepTrack}>
        <View style={[styles.stepFill, { width: `${step * 25}%` }]} />
      </View>
      <Text style={styles.stepText}>{step} of 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  splashScreen: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 42,
  },
  splashArtwork: {
    height: 316,
    marginTop: 45,
    resizeMode: 'contain',
    width: '100%',
  },
  splashTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 31,
    marginTop: 30,
    textAlign: 'center',
  },
  splashDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    textAlign: 'center',
  },
  splashButton: {
    marginBottom: 58,
    marginTop: 'auto',
  },
  formContent: {
    paddingBottom: 32,
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  stepIndicator: {
    alignSelf: 'flex-end',
    gap: 6,
    width: 46,
  },
  stepTrack: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 7,
    overflow: 'hidden',
  },
  stepFill: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 7,
  },
  stepText: {
    color: colors.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
  heading: {
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  form: {
    gap: 14,
    marginTop: 28,
  },
  skillField: {
    gap: 8,
  },
  skillLabel: {
    color: colors.formLabel,
    fontSize: 14,
    lineHeight: 21,
  },
  skillTrigger: {
    alignItems: 'center',
    borderColor: colors.formBorder,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  skillValue: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
  },
  skillPlaceholder: {
    color: colors.placeholder,
  },
  skillChevron: {
    color: colors.formLabel,
    fontSize: 10,
    marginLeft: 8,
  },
  skillOverlay: {
    backgroundColor: 'rgba(58, 40, 26, 0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  skillSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  skillSheetTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  skillOption: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  skillOptionSelected: {
    backgroundColor: '#E4EFE8',
  },
  skillOptionText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  skillOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  helper: {
    color: colors.helperText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: -7,
  },
  submitButton: {
    marginTop: 36,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  terms: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 38,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  signIn: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
  stepScreen: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.disabled,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  phoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 23,
  },
  phoneNumber: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  otpArtwork: {
    alignSelf: 'center',
    height: 135,
    marginTop: 23,
    resizeMode: 'contain',
    width: 135,
  },
  otpArea: {
    marginTop: 30,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
  },
  otpBox: {
    alignItems: 'center',
    backgroundColor: '#FBF7F0',
    borderColor: colors.formBorder,
    borderRadius: 7,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 45,
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  otpDigit: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  otpHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 24,
    textAlign: 'center',
  },
  expiry: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  centerError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 34,
  },
  bottomLink: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 23,
    textAlign: 'center',
  },
  fieldLabel: {
    color: colors.formLabel,
    fontSize: 14,
    marginTop: 25,
  },
  captureCard: {
    backgroundColor: '#FBF7F0',
    borderColor: colors.formBorder,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 9,
    padding: 14,
  },
  captureCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  facePreview: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD2A2',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    marginVertical: 14,
    width: 88,
  },
  faceCaptured: {
    backgroundColor: '#D7E7DC',
  },
  retakeButton: {
    backgroundColor: '#E57D1F',
  },
  notice: {
    backgroundColor: '#EDE9DD',
    color: colors.primary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 24,
    padding: 14,
    textAlign: 'center',
  },
  successScreen: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 205,
  },
  successBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: '#9FC7A9',
    borderRadius: 64,
    borderWidth: 10,
    height: 128,
    justifyContent: 'center',
    width: 128,
  },
  successCheck: {
    color: colors.white,
    fontSize: 75,
    fontWeight: '700',
    lineHeight: 82,
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 40,
  },
  successBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  successNote: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: 25,
    textAlign: 'center',
  },
  successButton: {
    marginTop: 46,
  },
});
