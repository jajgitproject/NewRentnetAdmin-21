export interface GtrackRunningDetailsRow {
  dutySlipId: number;
  dutySlipNumber: string;
  reservationId: number;
  customerGroup: string;
  customerName: string;
  registrationNumber: string;
  pickup: string;
  pickupDateValue?: string;
  pickupTimeValue?: string;
  dropOff: string;
  reason: string;
  canRun: boolean;
  result?: string;
}

export interface GtrackRunningDetailsPreview {
  count: number;
  rows: GtrackRunningDetailsRow[];
}

export interface GtrackFillResult {
  dutySlipId: number;
  status: string;
  message: string;
}
