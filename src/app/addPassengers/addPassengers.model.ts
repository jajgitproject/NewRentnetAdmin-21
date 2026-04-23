// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddPassengers {
   addPassengersID: number;
   addPassengers: string;
   discountOn: string;
   updatedBy:number;
   updateDateTime: Date;
   userID:number
  constructor(addPassengers) {
    {
       this.addPassengersID = addPassengers.addPassengersID || -1;
       this.addPassengers = addPassengers.addPassengers || '';
       this.discountOn = addPassengers.discountOn || '';
       this.updatedBy=addPassengers.updatedBy || 10;
       this.updateDateTime = addPassengers.updateDateTime;
    }
  }
  
}

