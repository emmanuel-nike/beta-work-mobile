import { apiRequest } from './client';
import { splitFullName, toE164Phone } from './phone';

export type ValidateUserPayload = Readonly<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city?: string;
  state?: string;
  address?: string;
}>;

// NOTE: OTP verification moved from phone number to email. The phone-based
// response shapes are kept (commented out) for reference during the migration.
// export type SendOtpResponse = Readonly<{
//   message: string;
//   phoneNumber: string;
//   otp: string;
// }>;
//
// export type VerifyOtpResponse = Readonly<{
//   message: string;
//   phoneNumber: string;
//   verified: boolean;
// }>;

export type SendOtpResponse = Readonly<{
  message: string;
  email: string;
  /** Present only in non-production backends to ease local testing. */
  otp?: string;
}>;

export type VerifyOtpResponse = Readonly<{
  message: string;
  email: string;
  verified: boolean;
}>;

export type ForgotPasswordResponse = Readonly<{
  message: string;
  /** Present only in non-production backends when the email matches a user. */
  otp?: string;
}>;

export type VerifyPasswordOtpResponse = Readonly<{
  message: string;
  verified: boolean;
}>;

export type ResetPasswordResponse = Readonly<{
  message: string;
}>;

export type ArtisanVerificationStatus = 'pending' | 'approved' | 'rejected';

export type AuthTokenResponse = Readonly<{
  type: string;
  value: string;
  expiresAt?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    role: string;
    /** Present for artisan accounts; carries their verification status. */
    artisanProfile?: {
      verificationStatus: ArtisanVerificationStatus;
    } | null;
  };
}>;

export type ArtisanStatusResponse = Readonly<{
  verificationStatus: ArtisanVerificationStatus;
  isVerified: boolean;
  verifiedAt: string | null;
}>;

export type RegisterUserPayload = Readonly<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  city?: string;
  state?: string;
  address?: string;
  role?: 'user' | 'artisan';
}>;

export type UpdateProfilePayload = Readonly<{
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}>;

export async function validateUser(payload: ValidateUserPayload) {
  return apiRequest<{ message: string; data: ValidateUserPayload }>(
    '/auth/validate',
    {
      method: 'POST',
      body: {
        ...payload,
        phoneNumber: toE164Phone(payload.phoneNumber),
      },
    },
  );
}

// --- Phone-number OTP (replaced by email OTP; kept for reference) ----------
// export async function sendOtp(phoneNumber: string) {
//   return apiRequest<SendOtpResponse>('/auth/otp/send', {
//     method: 'POST',
//     body: { phoneNumber: toE164Phone(phoneNumber) },
//   });
// }
//
// export async function verifyOtp(phoneNumber: string, otp: string) {
//   return apiRequest<VerifyOtpResponse>('/auth/otp/verify', {
//     method: 'POST',
//     body: {
//       phoneNumber: toE164Phone(phoneNumber),
//       otp,
//     },
//   });
// }
// ---------------------------------------------------------------------------

/**
 * Send a verification OTP to an email address (signup + artisan onboarding).
 */
export async function sendOtp(email: string) {
  return apiRequest<SendOtpResponse>('/auth/otp/send', {
    method: 'POST',
    body: { email: email.trim() },
  });
}

/**
 * Verify an email OTP issued by {@link sendOtp}.
 */
export async function verifyOtp(email: string, otp: string) {
  return apiRequest<VerifyOtpResponse>('/auth/otp/verify', {
    method: 'POST',
    body: {
      email: email.trim(),
      otp,
    },
  });
}

/**
 * Begin a password reset by emailing a one-time code to the given address.
 * The backend always responds success (it does not reveal whether the email
 * belongs to an account); a dev backend echoes the code back in `otp`.
 */
export async function forgotPassword(email: string) {
  return apiRequest<ForgotPasswordResponse>('/auth/password/forgot', {
    method: 'POST',
    body: { email: email.trim() },
  });
}

/**
 * Check a password-reset code without consuming it.
 */
export async function verifyPasswordOtp(email: string, otp: string) {
  return apiRequest<VerifyPasswordOtpResponse>('/auth/password/verify-otp', {
    method: 'POST',
    body: { email: email.trim(), otp },
  });
}

/**
 * Complete a password reset using the emailed code and a new password.
 */
export async function resetPassword(
  email: string,
  otp: string,
  password: string,
) {
  return apiRequest<ResetPasswordResponse>('/auth/password/reset', {
    method: 'POST',
    body: { email: email.trim(), otp, password },
  });
}

export async function registerUser(payload: RegisterUserPayload) {
  return apiRequest<AuthTokenResponse>('/auth/register', {
    method: 'POST',
    body: {
      ...payload,
      phoneNumber: toE164Phone(payload.phoneNumber),
      role: payload.role ?? 'user',
    },
  });
}

export async function login(email: string, password: string) {
  return apiRequest<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function fetchCurrentUser() {
  return apiRequest<{ user: AuthTokenResponse['user'] }>('/auth/me', {
    method: 'GET',
  });
}

export async function fetchArtisanStatus() {
  return apiRequest<ArtisanStatusResponse>('/artisan/status', {
    method: 'GET',
  });
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return apiRequest<{ user: AuthTokenResponse['user'] }>('/auth/me', {
    method: 'PUT',
    body: {
      ...payload,
      phoneNumber: payload.phoneNumber
        ? toE164Phone(payload.phoneNumber)
        : undefined,
    },
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  return apiRequest<{ message?: string }>('/auth/password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  });
}

export async function logout() {
  return apiRequest<{ message?: string }>('/auth/logout', {
    method: 'POST',
  });
}

export function buildValidatePayloadFromForm(input: {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
}): ValidateUserPayload {
  const { firstName, lastName } = splitFullName(input.fullName);

  return {
    firstName,
    lastName,
    email: input.email.trim(),
    phoneNumber: input.phone,
    address: input.address?.trim() || undefined,
  };
}
