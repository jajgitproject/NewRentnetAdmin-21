// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleVehicleCategoryDropDown {
 
   vehicleID: number;
   vehicle: string;
   vehicleCategoryID: number;
   vehicleCategory: string;

  constructor(vehicleVehicleCategoryDropDown) {
    {
       this.vehicleID = vehicleVehicleCategoryDropDown.vehicleID || -1;
       this.vehicle = vehicleVehicleCategoryDropDown.vehicle || '';
       this.vehicleCategoryID = vehicleVehicleCategoryDropDown.vehicleCategoryID || '';
       this.vehicleCategory = vehicleVehicleCategoryDropDown.vehicleCategory || '';
    }
  }
  
}

