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

import BackIcon from '../../assets/images/back.svg';
import EmailIcon from '../../assets/images/email.svg';
import OtpArtwork from '../../assets/images/otp.png';
import PasswordIcon from '../../assets/images/password.svg';
import ResetEmailArtwork from '../../assets/images/reset-email.png';
import SuccessArtwork from '../../assets/images/signup-success.png';
import { ActionButton } from '../components/ActionButton';
import { FormField } from '../components/FormField';
import { useOtpResendCountdown } from '../hooks/useOtpResendCountdown';
import { usePreAuthNavigation } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthStatus,
} from '../store/slices/authSlice';
import { colors } from '../theme/colors';

type SignInStep =
  | 'login'
  | 'resetEmail'
  | 'resetVerify'
  | 'resetPassword'
  | 'resetSuccess';

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

export function SignInFlow() {
  const navigation = usePreAuthNavigation();
  const [step, setStep] = useState<SignInStep>('login');
  const [resetPhone, setResetPhone] = useState('0801 234 5678');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      {step === 'login' ? (
        <LoginScreen
          onForgotPassword={() => setStep('resetEmail')}
          onSignUp={() => navigation.navigate('Signup')}
        />
      ) : null}
      {step === 'resetEmail' ? (
        <ResetEmailScreen
          onBack={() => setStep('login')}
          onContinue={() => setStep('resetVerify')}
        />
      ) : null}
      {step === 'resetVerify' ? (
        <ResetVerifyScreen
          onBack={() => setStep('resetEmail')}
          onVerified={() => setStep('resetPassword')}
          phoneNumber={resetPhone}
          setPhoneNumber={setResetPhone}
        />
      ) : null}
      {step === 'resetPassword' ? (
        <CreatePasswordScreen
          onSaved={() => setStep('resetSuccess')}
        />
      ) : null}
      {step === 'resetSuccess' ? (
        <ResetSuccessScreen onGoToLogin={() => setStep('login')} />
      ) : null}
    </SafeAreaView>
  );
}

function LoginScreen({
  onForgotPassword,
  onSignUp,
}: Readonly<{
  onForgotPassword: () => void;
  onSignUp: () => void;
}>) {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const isSubmitting = authStatus === 'loading';

  const submit = () => {
    if (!isValidEmail(email)) {
      setEmailError('Email address is invalid, please try again');
      return;
    }
    if (!password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Welcome back</Text>
          <Text style={styles.body}>Sign in to continue to Beta Work!</Text>
        </View>

        <View style={styles.form}>
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            error={emailError}
            icon={EmailIcon}
            keyboardType="email-address"
            label="Email address"
            onChangeText={value => {
              setEmail(value);
              setEmailError(undefined);
              dispatch(clearAuthError());
            }}
            placeholder="Enter your email"
            textContentType="emailAddress"
            value={email}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="password"
            icon={PasswordIcon}
            isPassword
            label="Password"
            onChangeText={value => {
              setPassword(value);
              dispatch(clearAuthError());
            }}
            placeholder="Type your password here"
            textContentType="password"
            value={password}
          />
        </View>

        {authError ? <Text style={styles.otpError}>{authError}</Text> : null}

        <View style={styles.loginActions}>
          <ActionButton disabled={isSubmitting} onPress={submit}>
            {isSubmitting ? 'Please wait...' : 'Login'}
          </ActionButton>
          <ActionButton onPress={onForgotPassword} variant="outlined">
            Forgot password?
          </ActionButton>
        </View>

        <Text style={styles.footer}>
          Don’t have an account yet?{' '}
          <Text onPress={onSignUp} style={styles.link}>
            Sign up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ResetEmailScreen({
  onBack,
  onContinue,
}: Readonly<{ onBack: () => void; onContinue: () => void }>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const submit = () => {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address and try again');
      return;
    }
    onContinue();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.resetContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.verifyTopRow}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={onBack}
            style={styles.backButton}>
            <BackIcon height={18} width={18} />
          </Pressable>
          <StepIndicator step={1} total={3} />
        </View>

        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Reset your password</Text>
          <Text style={styles.body}>
            Enter your registered email address. We’ll send you a reset code.
          </Text>
        </View>

        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={ResetEmailArtwork}
          style={styles.resetArtwork}
        />

        <View style={styles.resetForm}>
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            error={error}
            icon={EmailIcon}
            keyboardType="email-address"
            label="Email address"
            onChangeText={value => {
              setEmail(value);
              setError(undefined);
            }}
            placeholder="Enter your email"
            textContentType="emailAddress"
            value={email}
          />
          <ActionButton onPress={submit}>Send reset code</ActionButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const RESET_OTP_EXPIRY_SECONDS = 300;

function ResetVerifyScreen({
  phoneNumber,
  setPhoneNumber,
  onBack,
  onVerified,
}: Readonly<{
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onBack: () => void;
  onVerified: () => void;
}>) {
  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { canResend, formattedTime, resetCountdown } = useOtpResendCountdown(
    RESET_OTP_EXPIRY_SECONDS,
  );

  const resend = () => {
    if (!canResend || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setCode('');
    setHasError(false);
    inputRef.current?.focus();
    resetCountdown();
    setIsSubmitting(false);
  };

  const verify = () => {
    if (code === '123456') {
      onVerified();
      return;
    }
    setHasError(true);
  };

  return (
    <View style={styles.verifyScreen}>
      <View style={styles.verifyTopRow}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}>
          <BackIcon height={18} width={18} />
        </Pressable>
        <StepIndicator step={2} total={3} />
      </View>

      <View style={styles.heading}>
        <Text style={styles.verifyTitle}>Verify your phone number</Text>
        <Text style={styles.body}>
          We have sent a 6-digit verification code by text.
        </Text>
      </View>

      <View style={styles.phoneRow}>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setPhoneNumber(phoneNumber)}
          style={styles.editButton}>
          <Text style={styles.editLabel}>Edit</Text>
        </Pressable>
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
        style={styles.otpArea}>
        <View style={styles.otpRow}>
          {Array.from({ length: 6 }).map((_, index) => {
            const focused = code.length === index;
            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  focused && styles.otpBoxFocused,
                  hasError && styles.otpBoxError,
                ]}>
                <Text style={styles.otpDigit}>{code[index] ?? ''}</Text>
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
          style={styles.hiddenOtpInput}
          value={code}
        />
      </Pressable>

      {hasError ? (
        <Text style={styles.otpError}>
          Verification code is incorrect. Please try again
        </Text>
      ) : (
        <Text style={styles.otpHint}>
          Enter the code sent to your phone number. If you don’t see it
          immediately, please wait a few seconds or tap resend.
        </Text>
      )}

      <Text style={styles.expiry}>
        This code will expire in {formattedTime}{' '}
        <Text
          onPress={canResend && !isSubmitting ? resend : undefined}
          style={[styles.link, !canResend && styles.linkDisabled]}>
          Resend
        </Text>
      </Text>

      <ActionButton
        disabled={code.length !== 6}
        onPress={verify}
        style={styles.verifyButton}>
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

function CreatePasswordScreen({
  onSaved,
}: Readonly<{ onSaved: () => void }>) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState<string>();

  const submit = () => {
    if (password.length < 8) {
      setConfirmError(
        'Your new password should be at least 8 characters with a mix of numbers and letters.',
      );
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError("Password doesn’t match, make sure both passwords are the same.");
      return;
    }
    onSaved();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.resetContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <StepIndicator step={3} total={3} />

        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Create new password</Text>
          <Text style={styles.body}>
            Your new password should be at least 8 characters with a mix of
            numbers and letters.
          </Text>
        </View>

        <View style={styles.createPasswordForm}>
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            icon={PasswordIcon}
            isPassword
            label="Password"
            onChangeText={value => {
              setPassword(value);
              setConfirmError(undefined);
            }}
            placeholder="Type your password here"
            textContentType="newPassword"
            value={password}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            error={confirmError}
            icon={PasswordIcon}
            isPassword
            label="Confirm password"
            onChangeText={value => {
              setConfirmPassword(value);
              setConfirmError(undefined);
            }}
            placeholder="Type your password here"
            textContentType="newPassword"
            value={confirmPassword}
          />
          <ActionButton onPress={submit} style={styles.saveButton}>
            Save password
          </ActionButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ResetSuccessScreen({
  onGoToLogin,
}: Readonly<{ onGoToLogin: () => void }>) {
  return (
    <View style={styles.successScreen}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={SuccessArtwork}
        style={styles.successArtwork}
      />
      <View style={styles.successCopy}>
        <Text style={styles.verifyTitle}>Password reset successful</Text>
        <Text style={styles.successBody}>
          Your password has been updated successfully. You can now log in with
          your new password to access your account.
        </Text>
      </View>
      <ActionButton onPress={onGoToLogin}>Go to login</ActionButton>
    </View>
  );
}

function StepIndicator({
  step,
  total,
}: Readonly<{ step: number; total: number }>) {
  const fillRatio = step / total;

  return (
    <View
      accessibilityLabel={`Step ${step} of ${total}`}
      style={styles.stepIndicator}>
      <View style={styles.stepTrack}>
        <View style={[styles.stepFill, { width: `${fillRatio * 100}%` }]} />
      </View>
      <Text style={styles.stepText}>
        {step} of {total}
      </Text>
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
  loginContent: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  resetContent: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heading: {
    alignItems: 'center',
    gap: 8,
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
  form: {
    gap: 20,
    marginTop: 48,
  },
  loginActions: {
    gap: 16,
    marginTop: 48,
  },
  footer: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 'auto',
    paddingTop: 48,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
  linkDisabled: {
    color: colors.placeholder,
  },
  stepIndicator: {
    alignSelf: 'flex-end',
    gap: 8,
    marginBottom: 16,
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
  stepText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 12,
  },
  resetArtwork: {
    alignSelf: 'center',
    height: 180,
    marginTop: 32,
    width: 280,
  },
  resetForm: {
    gap: 48,
    marginTop: 32,
  },
  verifyScreen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
  },
  verifyTopRow: {
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
  verifyTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  phoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 24,
  },
  phoneNumber: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  editButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  editLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  otpArtwork: {
    alignSelf: 'center',
    height: 145,
    marginTop: 28,
    width: 145,
  },
  otpArea: {
    marginTop: 36,
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
  otpBoxFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
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
    textAlign: 'center',
  },
  otpHint: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
    textAlign: 'center',
  },
  expiry: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 24,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 32,
  },
  incorrectNumber: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 'auto',
    paddingBottom: 27,
    textAlign: 'center',
  },
  createPasswordForm: {
    gap: 20,
    marginTop: 40,
  },
  saveButton: {
    marginTop: 28,
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
    marginTop: 8,
  },
  successBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
