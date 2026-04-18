// @ts-nocheck
import { formatDate } from '@angular/common';
export class PickupDetailsDropDown {
   pickupDetailsID: number;
   pickupDetails: string;

  constructor(pickupDetailsDropDown) {
    {
       this.pickupDetailsID = pickupDetailsDropDown.pickupDetailsID || -1;
       this.pickupDetails = pickupDetailsDropDown.pickupDetails || '';
    }
  }
  
}

