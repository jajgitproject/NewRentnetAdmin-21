/**
 * Central login OTP decision mirrored from backend LoginOtpPolicy.
 * Priority: Global bypass → Role.CanBypassOTP → legacy mobile list.
 */
export function isLoginOtpRequired(
  bypassOTPForAll: boolean,
  roleCanBypassOTP: boolean,
  employeeMobile: string,
  loginIdentifier: string
): boolean {
  if (bypassOTPForAll) {
    return false;
  }

  if (roleCanBypassOTP) {
    return false;
  }

  // OLD OTP BYPASS LOGIC
  // This logic is temporarily retained for backward compatibility.
  // Employees covered by this logic should be migrated to
  // Role.CanBypassOTP = 1.
  // TODO: Remove this legacy bypass logic after migration.
  if (
    isLegacyLoginOtpBypassMobile(employeeMobile) ||
    isLegacyLoginOtpBypassMobile(loginIdentifier)
  ) {
    return false;
  }

  return true;
}

// OLD OTP BYPASS LOGIC
// This logic is temporarily retained for backward compatibility.
// Employees covered by this logic should be migrated to
// Role.CanBypassOTP = 1.
// TODO: Remove this legacy bypass logic after migration.
const LEGACY_OTP_BYPASS_NUMBERS = [
  '9560342610',
  '9582890377',
  '9599227103',
  '9811051222',
  '8527057487',
  '9990788001',
  '8273089744',
  '8447685514',
  '9891785921',
  '7080004819',
  '9721486346',
];

function isLegacyLoginOtpBypassMobile(mobileOrLogin: string): boolean {
  if (!mobileOrLogin) {
    return false;
  }

  const digits = String(mobileOrLogin).replace(/\D/g, '');
  if (digits.length >= 10) {
    return LEGACY_OTP_BYPASS_NUMBERS.includes(digits.slice(-10));
  }

  return LEGACY_OTP_BYPASS_NUMBERS.includes(digits);
}
