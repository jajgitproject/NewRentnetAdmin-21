// @ts-nocheck
import { formatDate } from '@angular/common';
export class OtherDetailsDropDown {
 
   otherDetailsID: number;
   otherDetails: string;

  constructor(otherDetailsDropDown) {
    {
       this.otherDetailsID = otherDetailsDropDown.otherDetailsID || -1;
       this.otherDetails = otherDetailsDropDown.otherDetails || '';
    }
  }
  
}

