import Swal from 'sweetalert2';

export function getDutyNightEntryBlockedMessage(
  verifyDuty: boolean,
  goodForBilling: boolean
): string | null {
  if (verifyDuty && goodForBilling) {
    return "Duty Nights Can't Be Edited As Duty Is Already Verified And GoodForBilling";
  }
  if (verifyDuty) {
    return "Duty Nights Can't Be Edited As Duty Is Already Verified";
  }
  return null;
}

export function showDutyNightEntryBlockedDialog(message: string | null | undefined): void {
  if (!message) {
    return;
  }
  Swal.fire({
    icon: 'warning',
    title: message,
    confirmButtonText: 'OK',
  });
}
