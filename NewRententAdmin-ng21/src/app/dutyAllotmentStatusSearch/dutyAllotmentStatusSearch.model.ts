// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyAllotmentStatusSearch {
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

  constructor(dutyAllotmentStatusSearch: any) {
    this.reservationID = dutyAllotmentStatusSearch.reservationID || 0;
    this.vehicleCategoryID = dutyAllotmentStatusSearch.vehicleCategoryID || '';
    this.vehicleCategory = dutyAllotmentStatusSearch.vehicleCategory || '';
    this.location = dutyAllotmentStatusSearch.location || '';
    this.serviceLocationID = dutyAllotmentStatusSearch.serviceLocationID || '';
    this.city = dutyAllotmentStatusSearch.city || '';
    this.geoPointID = dutyAllotmentStatusSearch.geoPointID || '';
    this.pickupDate = dutyAllotmentStatusSearch.pickupDateString || '';
    this.activationStatus = dutyAllotmentStatusSearch.activationStatus !== undefined ? dutyAllotmentStatusSearch.activationStatus : null;
  }
}



