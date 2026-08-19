export function toE164Phone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('234') && digits.length >= 13) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length >= 10) {
    return `+234${digits.slice(1)}`;
  }

  if (digits.length >= 10) {
    return `+234${digits}`;
  }

  return phone.trim();
}

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || firstName;

  return { firstName, lastName };
}
