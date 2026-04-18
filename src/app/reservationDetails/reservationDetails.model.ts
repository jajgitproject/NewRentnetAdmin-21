// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationDetails {
  reservationID: number;
   customerTypeID: number; 
   customerType: string; 
   customerID: number;
   customer: string;
   customerGroupID: number;
   customerGroup: string;
   primaryBookerID: number;
   primaryBooker: string;
   primaryPassengerID: number;
   primaryPassenger: string;
   vehicleID: number;
   vehicle: string;
   vehicleCategoryID: number;
   packageTypeID: number;
   packageType: string;
   packageID: number;
   package: string;
   stateID:number;
   state:string;
   pickupCityID: number;
   pickupCity: string;
   customerDesignation: string;
   customerDepartment: string;
   pickupDate: string;

  constructor(reservationDetails) {
    {
      this.reservationID = reservationDetails.reservationID || -1;
      this.customerTypeID = reservationDetails.customerTypeID || '';
      this.customerID = reservationDetails.customerID || '';
      this.customerGroupID=reservationDetails.customerGroupID || '';
      this.primaryBookerID = reservationDetails.primaryBookerID || '';
      this.primaryPassengerID = reservationDetails.primaryPassengerID || '';
      this.vehicleID=reservationDetails.vehicleID || '';
      this.packageTypeID = reservationDetails.packageTypeID || '';
      this.packageID = reservationDetails.packageID || '';
      this.pickupCityID = reservationDetails.pickupCityID || '';
      this.vehicleCategoryID=reservationDetails.vehicleCategoryID || '';
      this.stateID=reservationDetails.stateID || '';
      this.state=reservationDetails.state || '';
      this.customerType = reservationDetails.customerType || '';
      this.customer = reservationDetails.customer || '';
      this.customerGroup=reservationDetails.customerGroup || '';
      this.primaryBooker = reservationDetails.primaryBooker || '';
      this.primaryPassenger = reservationDetails.primaryPassenger || '';
      this.vehicle=reservationDetails.vehicle || '';
      this.packageType = reservationDetails.packageType || '';
      this.package = reservationDetails.package || '';
      this.pickupCity = reservationDetails.pickupCity || '';
    }
  }
  
}

