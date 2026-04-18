// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationClosingDetails {
  reservationID: number;
   vehicleID: number;
   vehicle: string;
   vehicleCategoryID: number;
   dutySlipID: number;
   vehicleCategory: string;
   packageTypeID: number;
   packageType: string;
   packageID: number;
   package: string;
   pickupCityID: number;
   pickupCity: string;
   pickupDate: Date;
   pickupTime:Date;
   dropOffDate: Date;
   dropOffTime:Date;
   ticketNumber: string;
   pickupAddress: string;
   dropOffAddress: string;
   dropOffAddressDetails: string;
   emailLink: string;
  constructor(reservationClosingDetails) {
    {
      this.reservationID = reservationClosingDetails.reservationID || 147;
      this.dutySlipID=reservationClosingDetails.dutySlipID || '';
      this.packageTypeID = reservationClosingDetails.packageTypeID || '';
      this.packageID = reservationClosingDetails.packageID || '';
      this.packageID = reservationClosingDetails.packageID || '';
      this.pickupCityID = reservationClosingDetails.pickupCityID || '';
      this.vehicleCategoryID=reservationClosingDetails.vehicleCategoryID || '';
      this.vehicle=reservationClosingDetails.vehicle || '';
      this.packageType = reservationClosingDetails.packageType || '';
      this.package = reservationClosingDetails.package || '';
      this.pickupAddress = reservationClosingDetails.pickupAddress || '';
      this.dropOffAddress = reservationClosingDetails.dropOffAddress || '';
      this.dropOffAddressDetails = reservationClosingDetails.dropOffAddressDetails || '';
      this.emailLink = reservationClosingDetails.emailLink || '';
      this.ticketNumber = reservationClosingDetails.ticketNumber || '';
      this.pickupDate = reservationClosingDetails.pickupDate || '';
      this.pickupTime = reservationClosingDetails.pickupTime || '';
      this.dropOffDate = reservationClosingDetails.dropOffDate || '';
      this.dropOffTime = reservationClosingDetails.dropOffTime || '';
    }
  }
  
}

