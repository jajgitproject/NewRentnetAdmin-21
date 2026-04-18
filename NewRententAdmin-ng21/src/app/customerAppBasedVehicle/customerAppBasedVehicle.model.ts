// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAppBasedVehicle {
  customerAppVehicleMappingID: number;
  customerID: number;
  vehicleID:number;
  vehicle:string;
  vehicleCategoryID: number;
  vehicleCategory:string;
   customerName:string;
   activationStatus:boolean;
  userID: number;
  constructor(customerAppBasedVehicle) {
    {
       this.customerAppVehicleMappingID = customerAppBasedVehicle.customerAppVehicleMappingID || -1;
       this.customerID = customerAppBasedVehicle.customerID || '';
       this.vehicleID = customerAppBasedVehicle.vehicleID || 0;
       this.vehicleCategoryID = customerAppBasedVehicle.vehicleCategoryID || 0;
       this.vehicle = customerAppBasedVehicle.vehicle || '';
       this.vehicleCategory = customerAppBasedVehicle.vehicleCategory || '';
       this.customerName = customerAppBasedVehicle.customerName || '';
       this.activationStatus = customerAppBasedVehicle.activationStatus || '';
    }
  }
  
}

