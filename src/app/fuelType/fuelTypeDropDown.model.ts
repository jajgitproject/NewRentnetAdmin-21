// @ts-nocheck
import { formatDate } from '@angular/common';
export class FuelTypeDropDown {
   fuelTypeID: number;
   fuelType: string;

  constructor(fuelTypeDropDown) {
    {
       this.fuelTypeID = fuelTypeDropDown.fuelTypeID || -1;
       this.fuelType = fuelTypeDropDown.fuelType || '';
    }
  }
  
}

