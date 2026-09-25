// @ts-nocheck
import Swal from 'sweetalert2';

export interface ComplianceDocumentCheck {
  label?: string;
  status?: string;
  reason?: string;
  expiryDate?: string;
}

export interface CarDriverComplianceResult {
  overallStatus?: string;
  driverDl?: ComplianceDocumentCheck;
  driverPcc?: ComplianceDocumentCheck;
  driverBgv?: ComplianceDocumentCheck;
  carPuc?: ComplianceDocumentCheck;
}

function normalizeCheck(raw: any, fallbackLabel: string): ComplianceDocumentCheck {
  if (!raw) {
    return { label: fallbackLabel, status: 'Missing', reason: 'No data returned.' };
  }
  return {
    label: raw.label ?? raw.Label ?? fallbackLabel,
    status: raw.status ?? raw.Status ?? '',
    reason: raw.reason ?? raw.Reason ?? '',
    expiryDate: raw.expiryDate ?? raw.ExpiryDate ?? null
  };
}

export function normalizeCarDriverCompliance(raw: any): CarDriverComplianceResult | null {
  if (!raw) {
    return null;
  }
  const overall = raw.overallStatus ?? raw.OverallStatus;
  if (!overall) {
    return null;
  }
  return {
    overallStatus: overall,
    driverDl: normalizeCheck(raw.driverDl ?? raw.DriverDl, 'Driver DL'),
    driverPcc: normalizeCheck(raw.driverPcc ?? raw.DriverPcc, 'Driver PCC'),
    driverBgv: normalizeCheck(raw.driverBgv ?? raw.DriverBgv, 'Driver BGV'),
    carPuc: normalizeCheck(raw.carPuc ?? raw.CarPuc, 'Car PUC')
  };
}

function simpleFailurePhrase(check: ComplianceDocumentCheck): string | null {
  const label = (check.label || '').trim();
  const status = (check.status || '').trim().toLowerCase();
  if (!label || status === 'valid') {
    return null;
  }
  if (status === 'missing') {
    return `${label} is missing`;
  }
  if (status === 'expired') {
    return `${label} is expired`;
  }
  if (status.includes('expiry') || status.includes('invalid')) {
    return `${label} expiry is invalid`;
  }
  return `${label} is invalid`;
}

export function showCarDriverCompliancePopup(compliance: CarDriverComplianceResult): Promise<void> {
  const isCompliant = (compliance.overallStatus || '').toLowerCase() === 'compliant';
  if (isCompliant) {
    return Promise.resolve();
  }

  const failures = [
    compliance.driverDl,
    compliance.driverPcc,
    compliance.driverBgv,
    compliance.carPuc
  ]
    .map((c) => simpleFailurePhrase(c))
    .filter((phrase) => !!phrase);
  const detail = failures.length > 0 ? failures.join(', ') : 'compliance check failed';
  const body = `Non-Compliant ${detail}`;

  return Swal.fire({
    title: '',
    text: body,
    icon: 'warning'
  }).then(() => undefined);
}

export function extractComplianceFromAllotmentResponse(data: any): CarDriverComplianceResult | null {
  if (!data) {
    return null;
  }
  return normalizeCarDriverCompliance(
    data.carDriverCompliance ?? data.CarDriverCompliance
  );
}

export function extractComplianceFromSoftToHardResponse(data: any): CarDriverComplianceResult | null {
  if (!data) {
    return null;
  }
  return normalizeCarDriverCompliance(
    data.carDriverCompliance ?? data.CarDriverCompliance
  );
}
