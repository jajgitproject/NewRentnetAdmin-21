export interface SupplierPayoutDutySlipSearchCriteria {
  supplierID: number;
  includePaid?: boolean;
  fromDate?: string | null;
  toDate?: string | null;
  paymentStatus?: string;
}

export interface SupplierPayoutDutySlipRow {
  dutySlipID: number;
  reservationID: number;
  customerName: string;
  dateOfDuty?: string | null;
  goodForBilling: boolean;
  payoutEcoRevenue: number;
  supplierRevenue?: number | null;
  currentEcoRevenue?: number | null;
  mismatchAmount: number;
  paymentStatus: string;
  supplierPayoutGroupID?: number | null;
  selectable: boolean;
}

export interface SupplierPayoutMarkPaidRequest {
  supplierID: number;
  groupAmount: number;
  previousGroupAdjustmentAmount: number;
  dutySlipIDs: number[];
}

export interface SupplierPayoutGroupDutyRow {
  supplierPayoutGroupDutyID: number;
  dutySlipID: number;
  reservationID: number;
  customerName: string;
  dateOfDuty?: string | null;
  goodForBilling: boolean;
  payoutEcoRevenue: number;
  currentEcoRevenue?: number | null;
  mismatchAmount: number;
  supplierAmountForDuty: number;
  paymentStatus: string;
  paymentDate: string;
}

export interface SupplierPayoutGroupSummary {
  supplierPayoutGroupID: number;
  groupNumber: string;
  groupDate: string;
  supplierID: number;
  supplierName: string;
  groupAmount: number;
  previousGroupAdjustmentAmount: number;
  netSettlementAmount: number;
  previousSupplierPayoutGroupID?: number | null;
  previousGroupNumber?: string | null;
  paymentStatus: string;
  isSquaredOff: boolean;
  dutyCount: number;
  totalMismatchAmount: number;
  lines?: SupplierPayoutGroupDutyRow[];
}

export interface SupplierPayoutHistorySearchCriteria {
  supplierID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface SupplierPayoutHistoryRow {
  supplierPayoutGroupID: number;
  groupNumber: string;
  groupDate: string;
  supplierID: number;
  supplierName: string;
  groupAmount: number;
  previousGroupAdjustmentAmount: number;
  netSettlementAmount: number;
  dutyCount: number;
  isSquaredOff: boolean;
  totalMismatchAmount: number;
}

export interface SupplierPayoutReportCriteria {
  supplierID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface SupplierPayoutPreviousGroupContext {
  previousSupplierPayoutGroupID?: number | null;
  previousGroupNumber?: string | null;
  previousGroupAdjustmentAmount: number;
}
