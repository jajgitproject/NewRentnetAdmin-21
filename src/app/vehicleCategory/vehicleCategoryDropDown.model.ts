// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleCategoryDropDown {
   vehicleCategoryID: number;
   vehicleCategory: string;

  constructor(vehicleCategoryDropDown) {
    {
       this.vehicleCategoryID = vehicleCategoryDropDown.vehicleCategoryID || -1;
       this.vehicleCategory = vehicleCategoryDropDown.vehicleCategory || '';
    }
  }
  
}

