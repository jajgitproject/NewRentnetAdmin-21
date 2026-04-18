// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrentDuty {
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

  constructor(currentDuty) {
    {
      this.reservationID = currentDuty.reservationID || -1;
      this.customerTypeID = currentDuty.customerTypeID || '';
      this.customerID = currentDuty.customerID || '';
      this.customerGroupID=currentDuty.customerGroupID || '';
      this.primaryBookerID = currentDuty.primaryBookerID || '';
      this.primaryPassengerID = currentDuty.primaryPassengerID || '';
      this.vehicleID=currentDuty.vehicleID || '';
      this.packageTypeID = currentDuty.packageTypeID || '';
      this.packageID = currentDuty.packageID || '';
      this.pickupCityID = currentDuty.pickupCityID || '';
      this.vehicleCategoryID=currentDuty.vehicleCategoryID || '';
      this.stateID=currentDuty.stateID || '';
      this.state=currentDuty.state || '';
      this.customerType = currentDuty.customerType || '';
      this.customer = currentDuty.customer || '';
      this.customerGroup=currentDuty.customerGroup || '';
      this.primaryBooker = currentDuty.primaryBooker || '';
      this.primaryPassenger = currentDuty.primaryPassenger || '';
      this.vehicle=currentDuty.vehicle || '';
      this.packageType = currentDuty.packageType || '';
      this.package = currentDuty.package || '';
      this.pickupCity = currentDuty.pickupCity || '';
    }
  }
  
}

