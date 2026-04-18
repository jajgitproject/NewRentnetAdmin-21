// @ts-nocheck
import { formatDate } from '@angular/common';
export class VehicleCategoryTargetDropDown {
   vehicleCategoryTargetID: number;
   vehicleCategoryID: number;

  constructor(vehicleCategoryTargetDropDown) {
    {
       this.vehicleCategoryTargetID = vehicleCategoryTargetDropDown.vehicleCategoryTargetID || -1;
       this.vehicleCategoryID = vehicleCategoryTargetDropDown.vehicleCategoryID || '';
    }
  }
  
}

