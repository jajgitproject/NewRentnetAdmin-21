// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDropDown {
   customerID: number;
   customerName: string;

  constructor(customerDropDown) {
    {
       this.customerID = customerDropDown.customerID || -1;
       this.customerName = customerDropDown.customerName || '';
    }
  }
  
}

