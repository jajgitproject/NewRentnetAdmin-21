// @ts-nocheck
export class QcMisCST {
  reservationID: number;
  pickupDate: string;
  serviceLocation: string;
  qcVerificationResult: string;
  qcVerificationRemarks: string;
  qcVerifiedByAgent: string;
}

export class QcMisCSTSearchCriteria {
  pickupDateFrom?: string;
  pickupDateTo?: string;
  locationID?: number;
  cityID?: number;
  pageNumber?: number;
  orderByColumn?: string;
  order?: string;
}
