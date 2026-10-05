export class KamAddressCorrection {
  reservationID: number;
  reservationGroupID: number;
  customerID: number;
  customerGroupID: number;
  customerName: string;
  customerGroup: string;
  pickupDate: any;
  pickupTime: any;
  pickupAddress: string;
  pickupAddressDetails: string;
  reservationStatus: string;
  reservationCreatedOn: any;

  constructor(item: Partial<KamAddressCorrection> = {}) {
    this.reservationID = item.reservationID ?? 0;
    this.reservationGroupID = item.reservationGroupID ?? 0;
    this.customerID = item.customerID ?? 0;
    this.customerGroupID = item.customerGroupID ?? 0;
    this.customerName = item.customerName ?? '';
    this.customerGroup = item.customerGroup ?? '';
    this.pickupDate = item.pickupDate ?? null;
    this.pickupTime = item.pickupTime ?? null;
    this.pickupAddress = item.pickupAddress ?? '';
    this.pickupAddressDetails = item.pickupAddressDetails ?? '';
    this.reservationStatus = item.reservationStatus ?? '';
    this.reservationCreatedOn = item.reservationCreatedOn ?? null;
  }
}

export interface KamAddressCorrectionListResponse {
  items: KamAddressCorrection[];
  totalCount: number;
}
