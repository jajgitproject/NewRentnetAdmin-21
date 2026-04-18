// @ts-nocheck
import { formatDate } from '@angular/common';
export class FuelType {
   fuelTypeID: number;
   fuelType: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
  constructor(fuelType) {
    {
       this.fuelTypeID = fuelType.fuelTypeID || -1;
       this.fuelType = fuelType.fuelType || '';
       this.activationStatus = fuelType.activationStatus || '';
       this.updatedBy=fuelType.updatedBy || 10;
       this.updateDateTime = fuelType.updateDateTime;
    }
  }
  
}

