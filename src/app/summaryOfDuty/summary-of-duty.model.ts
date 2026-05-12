/** Row label + formatted value for summary tables */
export interface SummaryOfDutyRow {
  label: string;
  value: string;
}

export interface SummaryOfDutyData {
  packageDetails?: SummaryOfDutyRow[];
  extraDetails?: SummaryOfDutyRow[];
  otherCharges?: SummaryOfDutyRow[];
  taxDetails?: SummaryOfDutyRow[];
  /** Shown in the Summary card (e.g. Final Bill Amount) */
  finalBillLabel?: string;
  finalBillAmount?: string;
}
