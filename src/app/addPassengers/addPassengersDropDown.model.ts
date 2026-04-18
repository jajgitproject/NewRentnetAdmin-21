// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddPassengersDropDown {
   addPassengersID: number;
   addPassengers: string;

  constructor(addPassengersDropDown) {
    {
       this.addPassengersID = addPassengersDropDown.addPassengersID || -1;
       this.addPassengers = addPassengersDropDown.addPassengers || '';
    }
  }
  
}

