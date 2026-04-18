// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAllowedCarsInCDP {
  allowedCarsInCDPID: number;
  customerGroupID: number;
  vehicleID: number;
  vehicle: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerAllowedCarsInCDP) {
    {
       this.allowedCarsInCDPID = customerAllowedCarsInCDP.allowedCarsInCDPID || -1;
       this.customerGroupID = customerAllowedCarsInCDP.customerGroupID || -1;
       this.vehicleID = customerAllowedCarsInCDP.vehicleID || '';
       this.vehicle = customerAllowedCarsInCDP.vehicle || '';
       this.activationStatus = customerAllowedCarsInCDP.activationStatus || false;
    }
  }
  
}

