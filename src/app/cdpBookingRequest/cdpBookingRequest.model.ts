export class CdpBookingRequest {
  reservationID: number;
  reservationGroupID: number;
  customerID: number;
  customerGroupID: number;
  customerName: string;
  customerGroup: string;
  allotmentStatus: string;
  locationOutDate: string | Date | null;
  pickupDate: string | Date | null;
  pickupTime: string | Date | null;
  reservationCreatedOn: string | Date | null;
  reservationStatus: string;
  reservationSource: string;
  bookingTypeLabel: string;

  constructor(item: Partial<CdpBookingRequest> = {}) {
    this.reservationID = item.reservationID ?? 0;
    this.reservationGroupID = item.reservationGroupID ?? 0;
    this.customerID = item.customerID ?? 0;
    this.customerGroupID = item.customerGroupID ?? 0;
    this.customerName = item.customerName ?? '';
    this.customerGroup = item.customerGroup ?? '';
    this.allotmentStatus = item.allotmentStatus ?? '';
    this.locationOutDate = item.locationOutDate ?? null;
    this.pickupDate = item.pickupDate ?? null;
    this.pickupTime = item.pickupTime ?? null;
    this.reservationCreatedOn = item.reservationCreatedOn ?? null;
    this.reservationStatus = item.reservationStatus ?? '';
    this.reservationSource = item.reservationSource ?? '';
    this.bookingTypeLabel = item.bookingTypeLabel ?? '';
  }
}

export interface CdpBookingRequestListResponse {
  items: CdpBookingRequest[];
  totalCount: number;
}
