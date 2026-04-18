// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleDropDown {
 
   vehicleID: number;
   vehicle: string;
  inventory: any;

  constructor(vehicleDropDown) {
    {
       this.vehicleID = vehicleDropDown.vehicleID || -1;
       this.vehicle = vehicleDropDown.vehicle || '';
       this.inventory = vehicleDropDown.inventory || '';
    }
  }
  
}

