// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDropDown {
   customerID: number;
   customerName: string;
   customerIdentityNumber: string;

  constructor(customerDropDown) {
    {
       this.customerID = customerDropDown.customerID || -1;
       this.customerName = customerDropDown.customerName || '';
       this.customerIdentityNumber = customerDropDown.customerIdentityNumber || '';
    }
  }
  
}

