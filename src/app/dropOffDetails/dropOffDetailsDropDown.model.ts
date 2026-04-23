// @ts-nocheck
import { formatDate } from '@angular/common';
export class DropOffDetailsDropDown {
   dropOffDetailsID: number;
   dropOffDetails: string;

  constructor(dropOffDetailsDropDown) {
    {
       this.dropOffDetailsID = dropOffDetailsDropDown.dropOffDetailsID || -1;
       this.dropOffDetails = dropOffDetailsDropDown.dropOffDetails || '';
    }
  }
  
}

