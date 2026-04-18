// @ts-nocheck
import { formatDate } from '@angular/common';
export class TotalBookingCountDetails {
 totalBooking:number;
cancelled:number;
 unalloted:number;
 tnc:number;

  constructor(totalBookingCountDetails) {
    this.totalBooking = totalBookingCountDetails?.totalBooking || 0;
    this.cancelled = totalBookingCountDetails?.cancelled || 0;
    this.unalloted = totalBookingCountDetails?.unalloted || 0;
    this.tnc = totalBookingCountDetails?.tnc || 0;
  }
}


