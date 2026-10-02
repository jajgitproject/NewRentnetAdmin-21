// @ts-nocheck
export class PostPickupCallMis {
  bookingNo: number;
  serviceLocation: string;
  pickUpDate: string;
  guestName: string;
  customerName: string;
  gender: string;
  postPickupCallStatus: string;
  postPickupCallCheckedBy: string;
  postPickupCheckDatetime: string;
  postPickupRemarks: string;
}

export class PostPickupCallMisSearchCriteria {
  pickupDateFrom?: string;
  pickupDateTo?: string;
  postPickupCallFilter?: string;
  pageNumber?: number;
  orderByColumn?: string;
  order?: string;
}
