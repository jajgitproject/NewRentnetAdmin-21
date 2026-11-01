/**
 * Control Panel Garage Out (Dispatch) may stay editable after Close / Verify / GFB
 * for these two employee mobiles only. Invoice on the duty still locks Save.
 */
const GARAGE_OUT_LOCK_BYPASS_NUMBERS = [
  '9582890377',
  '9560342610',
];

export function canBypassGarageOutLock(employeeMobile: string): boolean {
  if (!employeeMobile) {
    return false;
  }

  const digits = String(employeeMobile).replace(/\D/g, '');
  if (digits.length >= 10) {
    return GARAGE_OUT_LOCK_BYPASS_NUMBERS.includes(digits.slice(-10));
  }

  return GARAGE_OUT_LOCK_BYPASS_NUMBERS.includes(digits);
}
