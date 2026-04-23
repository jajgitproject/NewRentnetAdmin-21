// @ts-nocheck
import { formatDate } from '@angular/common';
export class DatewiseCarwiseBookingReport {
  reservationID: number;
  vehicleCategoryID: number;
  vehicleCategory: string;
  location: string;
  serviceLocationID: number;
  city: string;
  geoPointID: number;
  pickupDate: string;
  pickupDatestring:Date;
  activationStatus: boolean | null;

  constructor(datewiseCarwiseBookingReport: any) {
    this.reservationID = datewiseCarwiseBookingReport.reservationID || 0;
    this.vehicleCategoryID = datewiseCarwiseBookingReport.vehicleCategoryID || '';
    this.vehicleCategory = datewiseCarwiseBookingReport.vehicleCategory || '';
    this.location = datewiseCarwiseBookingReport.location || '';
    this.serviceLocationID = datewiseCarwiseBookingReport.serviceLocationID || '';
    this.city = datewiseCarwiseBookingReport.city || '';
    this.geoPointID = datewiseCarwiseBookingReport.geoPointID || '';
    this.pickupDate = datewiseCarwiseBookingReport.pickupDateString || '';
    this.activationStatus = datewiseCarwiseBookingReport.activationStatus !== undefined ? datewiseCarwiseBookingReport.activationStatus : null;
  }
}



