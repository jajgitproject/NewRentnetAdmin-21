// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDetailsDropDown {
   customerDetailsID: number;
   customerDetails: string;

  constructor(customerDetailsDropDown) {
    {
       this.customerDetailsID = customerDetailsDropDown.customerDetailsID || -1;
       this.customerDetails = customerDetailsDropDown.customerDetails || '';
    }
  }
  
}

