// @ts-nocheck
import * as XLSX from 'xlsx';

export interface CloseDutyCompareSide {
  garagePickup: string;
  pickupDrop: string;
  dropGarage: string;
  mainFare: string;
  taxAmount: string;
  discountAmount: string;
}

export interface CloseDutyCompare {
  eco: CloseDutyCompareSide;
  myf: CloseDutyCompareSide;
}

export const CLOSE_DUTY_COMPARE_FIELDS = [
  { key: 'garagePickup', label: 'Garage-Pickup Kms', request: 'garage_pickup_distance', metres: true },
  { key: 'pickupDrop', label: 'Pickup-Drop Kms', request: 'pickup_drop_distance', metres: true },
  { key: 'dropGarage', label: 'Drop-Garage Kms', request: 'drop_garage_distance', metres: true },
  { key: 'mainFare', label: 'Main Fare', request: 'main_fare', metres: false },
  { key: 'taxAmount', label: 'Tax Amount', request: 'tax_amount', metres: false },
  { key: 'discountAmount', label: 'Discount Amount', request: 'discount_amount', metres: false }
];

export function downloadCloseDutyCompare(compare: CloseDutyCompare, dutySlipId?: number | string): void {
  const headers = CLOSE_DUTY_COMPARE_FIELDS.map((field) => field.label);
  const values = (side) => CLOSE_DUTY_COMPARE_FIELDS.map((field) => side?.[field.key] || '');
  const rows = [
    ['ECO Closing Data'],
    headers,
    values(compare?.eco),
    [],
    ['MYF Closing Data'],
    headers,
    values(compare?.myf)
  ];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'CloseDuty');
  const name = dutySlipId ? 'Duty-' + dutySlipId + '-ECO-vs-MYF' : 'CloseDuty-ECO-vs-MYF';
  XLSX.writeFile(book, name + '.xlsx');
}

export function amountsDiffer(left: string, right: string): boolean {
  const eco = parseAmount(left);
  const myf = parseAmount(right);
  if (eco != null && myf != null) {
    return eco !== myf;
  }
  return String(left || '').trim().toLowerCase() !== String(right || '').trim().toLowerCase();
}

export function compareFromApi(body: any): CloseDutyCompare | null {
  const eco = body?.eco || body?.Eco;
  const myf = body?.myf || body?.Myf;
  if (!eco && !myf) {
    return null;
  }
  return { eco: mapSide(eco), myf: mapSide(myf) };
}

export function compareFromStoredPayload(requestText: string, responseText: string): CloseDutyCompare | null {
  const request = firstJsonObject(requestText);
  const response = firstJsonObject(responseText);
  if (!request && !response) {
    return null;
  }
  const data = response?.data || response?.Data || {};
  const eco = emptySide();
  const myf = emptySide();
  CLOSE_DUTY_COMPARE_FIELDS.forEach((field) => {
    eco[field.key] = field.metres ? kilometres(request?.[field.request]) : text(request?.[field.request]);
    const myfValue = field.key === 'taxAmount'
      ? (data?.total_tax ?? data?.tax_amount)
      : data?.[field.request];
    myf[field.key] = text(myfValue);
  });
  const hasValue = CLOSE_DUTY_COMPARE_FIELDS.some((field) => eco[field.key] || myf[field.key]);
  return hasValue ? { eco, myf } : null;
}

function mapSide(source: any): CloseDutyCompareSide {
  const side = emptySide();
  if (!source) {
    return side;
  }
  CLOSE_DUTY_COMPARE_FIELDS.forEach((field) => {
    const pascal = field.key.charAt(0).toUpperCase() + field.key.slice(1);
    side[field.key] = text(source[field.key] ?? source[pascal]);
  });
  return side;
}

function emptySide(): CloseDutyCompareSide {
  return {
    garagePickup: '',
    pickupDrop: '',
    dropGarage: '',
    mainFare: '',
    taxAmount: '',
    discountAmount: ''
  };
}

function kilometres(value: any): string {
  const metres = parseAmount(text(value));
  if (metres == null) {
    return text(value);
  }
  const km = metres / 1000;
  return Number.isInteger(km) ? String(km) : String(km);
}

function text(value: any): string {
  if (value == null) {
    return '';
  }
  return String(value);
}

function parseAmount(value: string): number | null {
  const cleaned = String(value || '').replace(/,/g, '').trim();
  if (!cleaned) {
    return null;
  }
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

function firstJsonObject(value: string): any {
  const textValue = String(value || '').trim();
  if (!textValue) {
    return null;
  }
  const start = textValue.indexOf('{');
  const end = textValue.lastIndexOf('}');
  if (start < 0 || end <= start) {
    return null;
  }
  try {
    return JSON.parse(textValue.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}
