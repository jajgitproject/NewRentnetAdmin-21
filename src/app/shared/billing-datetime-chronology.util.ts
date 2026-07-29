import moment from 'moment';

/** Same compose logic as dutySlipForBilling.onTimeSelection — moment-based, tolerant of API ISO strings. */
export function composeBillingDateTime(dateInput: unknown, timeInput: unknown): Date | null {
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return null;
  }
  if (timeInput === null || timeInput === undefined || timeInput === '') {
    return null;
  }

  const dateM = moment(dateInput as moment.MomentInput);
  const timeM = moment(timeInput as moment.MomentInput);
  if (!dateM.isValid() || !timeM.isValid()) {
    return null;
  }

  const combined = `${dateM.format('YYYY-MM-DD')} ${timeM.format('HH:mm')}`;
  const parsed = moment(combined, 'YYYY-MM-DD HH:mm', true);
  if (parsed.isValid()) {
    return parsed.toDate();
  }

  const fallback = new Date(combined);
  return Number.isFinite(fallback.getTime()) ? fallback : null;
}

export function billingDateOnly(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const m = moment(value as moment.MomentInput);
  if (!m.isValid()) {
    return null;
  }
  return new Date(m.year(), m.month(), m.date());
}

export interface BillingTripLeg {
  label: string;
  dateValue: unknown;
  timeValue: unknown;
}

export function getBillingTripLegsFromForm(form: Record<string, unknown>): BillingTripLeg[] {
  return [
    {
      label: 'Location Out',
      dateValue: form.locationOutDateForBilling,
      timeValue: form.locationOutTimeForBilling,
    },
    {
      label: 'Pickup',
      dateValue: form.pickUpDateForBilling,
      timeValue: form.pickUpTimeForBilling,
    },
    {
      label: 'Drop-off',
      dateValue: form.dropOffDateForBilling,
      timeValue: form.dropOffTimeForBilling,
    },
    {
      label: 'Location In',
      dateValue: form.locationInDateForBilling,
      timeValue: form.locationInTimeForBilling,
    },
  ];
}

export function resolveBillingTripLegDateTimes(
  legs: BillingTripLeg[]
): { ok: true; dateTimes: Date[] } | { ok: false; message: string } {
  const dateTimes: Date[] = [];
  for (const leg of legs) {
    const dt = composeBillingDateTime(leg.dateValue, leg.timeValue);
    if (!dt) {
      return {
        ok: false,
        message: `${leg.label}: date or time is missing or invalid. Please re-select both fields.`,
      };
    }
    dateTimes.push(dt);
  }
  return { ok: true, dateTimes };
}
