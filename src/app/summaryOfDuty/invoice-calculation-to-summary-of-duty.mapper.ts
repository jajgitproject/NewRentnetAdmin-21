import { SummaryOfDutyData, SummaryOfDutyRow } from './summary-of-duty.model';

/**
 * Map from one **InvoiceCalculation** aggregate (e.g. `calculate/{dutySlipID}` response).
 * Root: `dutySlipID`, `invoiceCalculationID`, totals; nested `invoiceGSTModel`, `invoicePackageModel`,
 * `invoicePackageValuesModel`, `invoiceAddtionalKmsAndHoursModel` (`addtionalKms` / `addtionalMinutes`),
 * `invoiceTollParkingModel`.
 *
 * Tax rows use **`invoiceGSTModel`** from the same payload (API: `GetInvoiceCalculationByDutySlipID` → `GetInvoiceGSTByID`).
 */

/** Read first defined property (camelCase / PascalCase from API). */
function pick<T = unknown>(obj: Record<string, unknown> | null | undefined, ...keys: string[]): T | undefined {
  if (obj == null || typeof obj !== 'object') {
    return undefined;
  }
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined && obj[k] !== null) {
      return obj[k] as T;
    }
  }
  return undefined;
}

function toNum(v: unknown): number | null {
  if (v == null || v === '') {
    return null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** API may return a single model object or a one-element array for nested invoice fragments. */
function recordFromModelNode(v: unknown): Record<string, unknown> | undefined {
  if (v == null || typeof v !== 'object') {
    return undefined;
  }
  if (Array.isArray(v)) {
    const el = v[0];
    if (el != null && typeof el === 'object' && !Array.isArray(el)) {
      return el as Record<string, unknown>;
    }
    return undefined;
  }
  return v as Record<string, unknown>;
}

/** Total night charges from invoiceNightModel (persisted total, or nights x per-night). */
function nightChargeTotal(night: Record<string, unknown> | undefined): number | null {
  if (night == null) {
    return null;
  }
  const direct = toNum(
    pick(
      night,
      'totalNightChargesAmount',
      'TotalNightChargesAmount',
      'totalNightCharge',
      'TotalNightCharge'
    )
  );
  if (direct != null) {
    return direct;
  }
  const per = toNum(pick(night, 'nightChargesPerNight', 'NightChargesPerNight'));
  const tn = toNum(pick(night, 'totalNights', 'TotalNights'));
  if (per != null && tn != null) {
    return per * tn;
  }
  return null;
}

export function formatInr(value: unknown): string {
  const n = toNum(value);
  if (n == null) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(n);
}

/** Currency for optional lines: missing value → em dash; zero prints as ₹0.00. */
function formatInrOptionalZeroDash(value: unknown): string {
  const n = toNum(value);
  if (n == null) {
    return '—';
  }
  return formatInr(n);
}

function fmtQty(value: unknown, unit: string): string {
  const n = toNum(value);
  if (n == null) {
    return '—';
  }
  return `${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
}

/**
 * Duty time from API is in whole minutes. Display as H.MM where H = full hours
 * and MM = remaining minutes (e.g. 134 → "2.14"), not decimal hours (2.23).
 */
function hoursMinutesCompactStr(raw: unknown): string | null {
  const minutes = toNum(raw);
  if (minutes == null || minutes < 0) {
    return null;
  }
  const intMin = Math.round(minutes);
  const h = Math.floor(intMin / 60);
  const mm = intMin % 60;
  return `${h}.${String(mm).padStart(2, '0')}`;
}

/** Same compact H.MM encoding with a unit suffix for summary tables. */
function fmtDutyDurationFromMinutes(raw: unknown): string {
  const s = hoursMinutesCompactStr(raw);
  return s == null ? '—' : `${s} Hrs`;
}

/** Percent fields on `InvoiceGST` / `invoiceGSTModel` (camelCase, PascalCase, legacy). */
function gstIgstPct(gst: Record<string, unknown>): number | null {
  return toNum(
    pick(
      gst,
      'igstPercentage',
      'IgstPercentage',
      'iGSTPercentage',
      'IGSTPercentage',
      'IGSTPERCENTAGE'
    )
  );
}

function gstCgstPct(gst: Record<string, unknown>): number | null {
  return toNum(
    pick(
      gst,
      'cgstPercentage',
      'CgstPercentage',
      'cGSTPercentage',
      'CGSTPercentage',
      'CGSTPERCENTAGE'
    )
  );
}

function gstSgstPct(gst: Record<string, unknown>): number | null {
  return toNum(
    pick(
      gst,
      'sgstPercentage',
      'SgstPercentage',
      'sGSTPercentage',
      'SGSTPercentage',
      'SGSTPERCENTAGE'
    )
  );
}

/**
 * Chargeable GST % = `IGSTPercentage + CGSTPercentage + SGSTPercentage` (InvoiceGST),
 * same rule as finance (combined headline rate).
 */
function gstChargeableExpensesPercentLabel(gst: Record<string, unknown> | undefined): string | null {
  if (!gst) {
    return null;
  }
  const igst = gstIgstPct(gst) ?? 0;
  const cgst = gstCgstPct(gst) ?? 0;
  const sgst = gstSgstPct(gst) ?? 0;
  const sum = igst + cgst + sgst;
  if (sum > 0.0001) {
    return `${sum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }
  return null;
}

function gstPercentFromModel(gst: Record<string, unknown> | undefined): string | null {
  if (!gst) {
    return null;
  }
  const flatRate = toNum(
    pick(
      gst,
      'gSTRate',
      'GSTRate',
      'gstRate',
      'GstRate',
      'GSTPercentage',
      'GstPercentage',
      'gstPercentage'
    )
  );
  if (flatRate != null && flatRate > 0) {
    return `${flatRate}%`;
  }
  const igst = gstIgstPct(gst);
  const cgst = gstCgstPct(gst);
  const sgst = gstSgstPct(gst);
  if (igst != null && igst > 0) {
    return `${igst}%`;
  }
  if (cgst != null && sgst != null && cgst > 0 && sgst > 0) {
    return `${cgst + sgst}%`;
  }
  if (cgst != null && cgst > 0) {
    return `${cgst * 2}%`;
  }
  return null;
}

function gstPercentLabel(gst: Record<string, unknown> | undefined, root: Record<string, unknown>): string {
  const fromInvoiceGstSum = gstChargeableExpensesPercentLabel(gst);
  if (fromInvoiceGstSum) {
    return fromInvoiceGstSum;
  }
  const direct = gstPercentFromModel(gst);
  if (direct) {
    return direct;
  }
  const base = toNum(pick(root, 'sendToGSTAmount', 'SendToGSTAmount'));
  const tax = gstTotalAmount(gst);
  if (gst && base != null && base > 0 && tax != null && tax > 0) {
    const pct = (tax / base) * 100;
    return `${pct.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }
  return '—';
}

function gstTypeLabel(gst: Record<string, unknown> | undefined): string {
  if (!gst) {
    return '—';
  }
  const raw = pick<string>(
    gst,
    'applicableGST',
    'ApplicableGST',
    'applicableGst',
    'ApplicableGst',
    'APPLICABLEGST'
  );
  if (raw && String(raw).trim()) {
    const t = String(raw).trim();
    if (t.toUpperCase() === 'CGSTSGST') {
      return 'CGST + SGST';
    }
    return t;
  }
  const igst = gstIgstAmt(gst);
  if (igst > 0) {
    return 'IGST';
  }
  const cgst = gstCgstAmt(gst);
  const sgst = gstSgstAmt(gst);
  if (cgst + sgst > 0) {
    return 'CGST + SGST';
  }
  return '—';
}

function gstIgstAmt(gst: Record<string, unknown>): number {
  return (
    toNum(
      pick(gst, 'igstAmount', 'IgstAmount', 'iGSTAmount', 'IGSTAmount', 'IGSTAMOUNT')
    ) ?? 0
  );
}

function gstCgstAmt(gst: Record<string, unknown>): number {
  return (
    toNum(
      pick(gst, 'cgstAmount', 'CgstAmount', 'cGSTAmount', 'CGSTAmount', 'CGSTAMOUNT')
    ) ?? 0
  );
}

function gstSgstAmt(gst: Record<string, unknown>): number {
  return (
    toNum(
      pick(gst, 'sgstAmount', 'SgstAmount', 'sGSTAmount', 'SGSTAmount', 'SGSTAMOUNT')
    ) ?? 0
  );
}

/** `IGSTAmount + CGSTAmount + SGSTAmount` on InvoiceGST. */
function gstTotalAmount(gst: Record<string, unknown> | undefined): number | null {
  if (!gst) {
    return null;
  }
  const sum = gstIgstAmt(gst) + gstCgstAmt(gst) + gstSgstAmt(gst);
  return sum > 0 ? sum : null;
}

/**
 * GST amount from invoiceGSTModel lines; if model exists but component amounts are zero,
 * infer tax once from root: totalAmountAfterGST − totalAmountAfterExpences (pre-GST total).
 * Do not infer when gst is missing (unknown tax structure).
 */
function gstAmountDisplay(gst: Record<string, unknown> | undefined, root: Record<string, unknown>): string {
  const fromModel = gstTotalAmount(gst);
  if (fromModel != null) {
    return formatInr(fromModel);
  }
  if (!gst) {
    return '—';
  }
  const afterGst = toNum(pick(root, 'totalAmountAfterGST', 'TotalAmountAfterGST'));
  const afterExp = toNum(pick(root, 'totalAmountAfterExpences', 'TotalAmountAfterExpences'));
  if (afterGst != null && afterExp != null && afterGst >= afterExp) {
    const implied = afterGst - afterExp;
    if (implied > 0.005) {
      return formatInr(implied);
    }
  }
  return '—';
}

function resolveInvoiceGst(root: Record<string, unknown>): Record<string, unknown> | undefined {
  return pick<Record<string, unknown>>(
    root,
    'invoiceGSTModel',
    'InvoiceGSTModel',
    'invoiceGstModel',
    'InvoiceGstModel'
  );
}

function sumInterstate(rows: unknown): number | null {
  if (!Array.isArray(rows) || !rows.length) {
    return null;
  }
  let t = 0;
  for (const r of rows) {
    if (r && typeof r === 'object') {
      const a = toNum(pick(r as Record<string, unknown>, 'amountToBeChargedInCurrentDuty', 'AmountToBeChargedInCurrentDuty'));
      if (a != null) {
        t += a;
      }
    }
  }
  return t > 0 ? t : null;
}

/** Match API toll/parking labels beyond exact "Toll" / "Parking" (e.g. "Fastag", "Parking fee"). */
function tollParkingRowKind(tollParkingType: string): 'toll' | 'parking' | 'other' {
  const s = tollParkingType.trim().toLowerCase();
  if (!s) {
    return 'other';
  }
  const hasPark = s.includes('park');
  const hasToll =
    s.includes('toll') || s.includes('fastag') || s.includes('fast tag') || /\btag\b/.test(s);
  if (hasPark && !hasToll) {
    return 'parking';
  }
  if (hasToll) {
    return 'toll';
  }
  return 'other';
}

function sumTollParkingByType(rows: unknown, type: 'toll' | 'parking'): number | null {
  if (!Array.isArray(rows)) {
    return null;
  }
  let t = 0;
  for (const r of rows) {
    if (r && typeof r === 'object') {
      const rec = r as Record<string, unknown>;
      const tp = String(pick(rec, 'tollParkingType', 'TollParkingType') ?? '');
      const amt = toNum(pick(rec, 'tollParkingAmount', 'TollParkingAmount'));
      if (amt != null && tollParkingRowKind(tp) === type) {
        t += amt;
      }
    }
  }
  return t > 0 ? t : null;
}

function sumTollParkingAll(rows: unknown): number | null {
  if (!Array.isArray(rows)) {
    return null;
  }
  let t = 0;
  for (const r of rows) {
    if (r && typeof r === 'object') {
      const amt = toNum(pick(r as Record<string, unknown>, 'tollParkingAmount', 'TollParkingAmount'));
      if (amt != null) {
        t += amt;
      }
    }
  }
  return t > 0 ? t : null;
}

/** One total for design row "Parking / Toll" (toll + parking lines, else combined lines, else root total). */
function parkingTollTotal(rows: unknown, root: Record<string, unknown>): number {
  let t = 0;
  const toll = sumTollParkingByType(rows, 'toll');
  const parking = sumTollParkingByType(rows, 'parking');
  if (toll != null) {
    t += toll;
  }
  if (parking != null) {
    t += parking;
  }
  if (t === 0) {
    const combined = sumTollParkingAll(rows);
    if (combined != null) {
      t += combined;
    }
  }
  if (t === 0) {
    const rootToll = toNum(pick(root, 'totalParkingTollFastagRFIDAmount', 'TotalParkingTollFastagRFIDAmount'));
    if (rootToll != null) {
      t += rootToll;
    }
  }
  return t;
}

function fgrTotal(pkgFgr: Record<string, unknown> | undefined): number | null {
  if (!pkgFgr) {
    return null;
  }
  const kmAmt = toNum(pick(pkgFgr, 'fgrKMAmount', 'FgrKMAmount')) ?? 0;
  const fixed = toNum(pick(pkgFgr, 'fgrFixedAmount', 'FgrFixedAmount')) ?? 0;
  return kmAmt + fixed;
}

function packageDescription(pkg: Record<string, unknown> | undefined): string {
  if (!pkg) {
    return '—';
  }
  const str = (v: unknown): string => (v != null && String(v).trim() !== '' ? String(v).trim() : '');
  /** DB `Package` on invoice line is the resolved package applied to this duty — show it alone. */
  const appliedPackageName = str(pick(pkg, 'package', 'Package'));
  if (appliedPackageName) {
    return appliedPackageName;
  }

  const svc = str(pick(pkg, 'serviceType', 'ServiceType'));
  const ptype = str(pick(pkg, 'packageType', 'PackageType'));
  const carCat = str(
    pick(pkg, 'customerContractCarCategory', 'CustomerContractCarCategory')
  );
  const cityTiers = str(pick(pkg, 'customerContractCityTiers', 'CustomerContractCityTiers'));
  const billing = str(pick(pkg, 'billingOption', 'BillingOption'));
  const minKm = toNum(pick(pkg, 'minimumKM', 'MinimumKM'));
  const minHr = toNum(pick(pkg, 'minimumHours', 'MinimumHours'));
  const parts: string[] = [];
  if (svc) {
    parts.push(svc);
  } else if (ptype) {
    parts.push(ptype);
  } else if (carCat) {
    parts.push(carCat);
  } else if (cityTiers) {
    parts.push(cityTiers);
  } else if (billing) {
    parts.push(billing);
  }
  if (parts.length === 0) {
    const pkgId = toNum(pick(pkg, 'packageID', 'PackageID'));
    const stId = toNum(pick(pkg, 'serviceTypeID', 'ServiceTypeID'));
    if (pkgId != null) {
      parts.push(`Package ID: ${pkgId}`);
    } else if (stId != null) {
      parts.push(`Service type ID: ${stId}`);
    }
  }
  if (minKm != null && minHr != null) {
    const hrsStr = hoursMinutesCompactStr(minHr);
    parts.push(hrsStr != null ? `${minKm} Kms / ${hrsStr} Hrs` : `${minKm} Kms`);
  } else if (ptype && parts.length === 0) {
    parts.push(ptype);
  } else if (ptype && parts.length > 0 && !parts.includes(ptype)) {
    parts.push(ptype);
  }
  return parts.length ? parts.join(' · ') : ptype || carCat || cityTiers || billing || '—';
}

/** Some gateways wrap the body in `data` / `result`. */
export function unwrapInvoiceCalculationPayload(response: unknown): Record<string, unknown> | null {
  if (response == null || typeof response !== 'object') {
    return null;
  }
  let r = response as Record<string, unknown>;
  if (Array.isArray(r) && r.length === 1) {
    r = r[0] as Record<string, unknown>;
  }
  for (const k of ['data', 'Data', 'result', 'Result', 'payload', 'Payload']) {
    const inner = r[k];
    if (inner != null && typeof inner === 'object' && !Array.isArray(inner)) {
      return inner as Record<string, unknown>;
    }
  }
  return r;
}

/** `calculate` sometimes omits nested rows; `getinvoice/{dutySlipId}` returns the full graph from SQL. */
export function invoiceCalculationNeedsFullDetailMerge(r: Record<string, unknown>): boolean {
  const gst = r['invoiceGSTModel'] ?? r['InvoiceGSTModel'] ?? r['invoiceGstModel'] ?? r['InvoiceGstModel'];
  const pkg = r['invoicePackageModel'] ?? r['InvoicePackageModel'];
  /** Empty `{}` from serializers still counts as missing — fetch full calculation to populate. */
  const hasNestedPayload = (v: unknown) =>
    v != null && typeof v === 'object' && Object.keys(v as object).length > 0;
  return !hasNestedPayload(gst) || !hasNestedPayload(pkg);
}

export function enrichInvoiceCalculationWithFullDetail(
  calc: Record<string, unknown>,
  full: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  if (full == null || typeof full !== 'object') {
    return calc;
  }
  const out: Record<string, unknown> = { ...calc };
  const takeIfMissing = (camel: string, pascal: string) => {
    const cur = out[camel] ?? out[pascal];
    const nxt = full[camel] ?? full[pascal];
    const isMissing = cur == null || (typeof cur === 'object' && Object.keys(cur as object).length === 0);
    if (isMissing && nxt != null && typeof nxt === 'object') {
      out[camel] = nxt;
    }
  };
  takeIfMissing('invoiceGSTModel', 'InvoiceGSTModel');
  takeIfMissing('invoicePackageModel', 'InvoicePackageModel');
  takeIfMissing('invoicePackageValuesModel', 'InvoicePackageValuesModel');
  return out;
}

/**
 * Maps `InvoiceCalculation/calculate/{dutySlipID}` JSON body to SummaryOfDutyData.
 * Accepts camelCase or PascalCase nested properties.
 */
export function mapInvoiceCalculationToSummaryOfDuty(response: unknown): SummaryOfDutyData | null {
  const unwrapped = unwrapInvoiceCalculationPayload(response);
  if (unwrapped == null) {
    return null;
  }
  const r = unwrapped;

  const dutySlipId = pick(r, 'dutySlipID', 'DutySlipID');
  const invoiceCalculationId = pick(r, 'invoiceCalculationID', 'InvoiceCalculationID');
  const hasRoot =
    dutySlipId != null ||
    invoiceCalculationId != null ||
    r['invoicePackageModel'] != null ||
    r['InvoicePackageModel'] != null ||
    r['invoiceGSTModel'] != null ||
    r['InvoiceGSTModel'] != null ||
    r['invoiceGstModel'] != null ||
    r['InvoiceGstModel'] != null ||
    r['invoicePackageValuesModel'] != null ||
    r['InvoicePackageValuesModel'] != null ||
    r['invoiceAddtionalKmsAndHoursModel'] != null ||
    r['InvoiceAddtionalKmsAndHoursModel'] != null ||
    r['invoiceAdditionalKmsAndHoursModel'] != null ||
    r['invoiceNightModel'] != null ||
    r['InvoiceNightModel'] != null;
  if (!hasRoot) {
    return null;
  }

  const pkg = recordFromModelNode(pick(r, 'invoicePackageModel', 'InvoicePackageModel'));
  const pkgVals = recordFromModelNode(
    pick(r, 'invoicePackageValuesModel', 'InvoicePackageValuesModel')
  );

  const gst = resolveInvoiceGst(r);
  const driver = pick<Record<string, unknown>>(r, 'invoiceDriverAllownceModel', 'InvoiceDriverAllownceModel');
  const night = recordFromModelNode(pick(r, 'invoiceNightModel', 'InvoiceNightModel'));
  const pkgFgr = pick<Record<string, unknown>>(r, 'invoicePackageFGRModel', 'InvoicePackageFGRModel');
  const tollRows = pick(r, 'invoiceTollParkingModel', 'InvoiceTollParkingModel');
  const istRows = pick(r, 'invoiceInterstateTaxModel', 'InvoiceInterstateTaxModel');

  const totalKm = pick(r, 'totalKMWithAddtionalKM', 'TotalKMWithAddtionalKM');
  const totalHrs = pick(r, 'totalHoursWithAddtionalHours', 'TotalHoursWithAddtionalHours');
  const dutyPkgAmt = pick(r, 'dutyTotalPackageAmount', 'DutyTotalPackageAmount');
  const baseFromVals = pkgVals ? pick(pkgVals, 'packageBaseRate', 'PackageBaseRate') : undefined;

  const packageDetails: SummaryOfDutyRow[] = [];
  packageDetails.push({ label: 'Total Kms', value: fmtQty(totalKm, 'Kms') });
  packageDetails.push({ label: 'Total Hrs', value: fmtDutyDurationFromMinutes(totalHrs) });
  packageDetails.push({ label: 'Package', value: packageDescription(pkg) });
  const pkgAmtNum = toNum(dutyPkgAmt) ?? toNum(baseFromVals);
  packageDetails.push({
    label: 'Package Amount',
    value: pkgAmtNum != null ? formatInr(pkgAmtNum) : '—'
  });

  /* Extra Kms / Extra Hrs (qty + amounts): duty summary uses invoicePackageValuesModel only. */
  const ekRaw = pkgVals ? pick(pkgVals, 'extraKMs', 'ExtraKMs') : undefined;
  const ekNum = toNum(ekRaw);
  const extraMinutesRaw = pkgVals ? pick(pkgVals, 'extraMinutes', 'ExtraMinutes') : undefined;
  const extraMinutesNum = toNum(extraMinutesRaw);
  const extraKmAmtRaw = pkgVals ? pick(pkgVals, 'extraKMAmount', 'ExtraKMAmount') : undefined;
  const extraMinAmtRaw = pkgVals ? pick(pkgVals, 'extraMinutesAmount', 'ExtraMinutesAmount') : undefined;

  const extraDetails: SummaryOfDutyRow[] = [
    {
      label: 'Extra Kms',
      value: ekNum == null ? '—' : fmtQty(ekRaw, 'Kms')
    },
    {
      label: 'Extra Kms Amt',
      value: formatInrOptionalZeroDash(extraKmAmtRaw)
    },
    {
      label: 'Extra Hrs',
      value: extraMinutesNum == null ? '—' : fmtDutyDurationFromMinutes(extraMinutesRaw)
    },
    {
      label: 'Extra Hrs Amt',
      value: formatInrOptionalZeroDash(extraMinAmtRaw)
    }
  ];

  const daN = driver ? toNum(pick(driver, 'totalDriverAllowanceAmount', 'TotalDriverAllowanceAmount')) : null;
  const nightN = nightChargeTotal(night);
  const fgrN = fgrTotal(pkgFgr);
  const ptTotal = parkingTollTotal(tollRows, r);
  const istLine = sumInterstate(istRows as unknown[]);
  const rootIst = toNum(pick(r, 'totalInterStateAmount', 'TotalInterStateAmount'));
  const istN = istLine ?? (rootIst != null ? rootIst : null);

  const otherCharges: SummaryOfDutyRow[] = [
    { label: 'Driver Allowance Amount', value: daN != null ? formatInr(daN) : '—' },
    { label: 'Night Amount', value: nightN != null ? formatInr(nightN) : '—' },
    { label: 'FGR', value: fgrN != null ? formatInr(fgrN) : '—' },
    { label: 'Parking / Toll', value: formatInr(ptTotal) },
    { label: 'Interstate Tax', value: istN != null ? formatInr(istN) : '—' }
  ];

  const taxDetails: SummaryOfDutyRow[] = [];
  taxDetails.push({ label: 'Chargeable Expenses GST %', value: gstPercentLabel(gst, r) });
  taxDetails.push({ label: 'GST Type', value: gstTypeLabel(gst) });
  taxDetails.push({
    label: 'GST Amount',
    value: gstAmountDisplay(gst, r)
  });

  const final = toNum(pick(r, 'totalAmountAfterGST', 'TotalAmountAfterGST'));

  return {
    packageDetails,
    extraDetails,
    otherCharges,
    taxDetails,
    finalBillLabel: 'Final Bill Amount',
    finalBillAmount: final != null ? formatInr(final) : '—'
  };
}
