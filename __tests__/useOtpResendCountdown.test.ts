import { formatCountdown } from '../src/hooks/useOtpResendCountdown';

describe('formatCountdown', () => {
  test('formats minutes and seconds', () => {
    expect(formatCountdown(600)).toBe('10:00');
    expect(formatCountdown(299)).toBe('04:59');
    expect(formatCountdown(0)).toBe('00:00');
  });
});
