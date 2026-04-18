// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDetailsDropDown {
   customerPersonID: number;
   customerPersonName: string;
   phone: string;
   email: string;

  constructor(customerPersonDetailsDropDown) {
    {
       this.customerPersonID = customerPersonDetailsDropDown.customerPersonID || -1;
       this.customerPersonName = customerPersonDetailsDropDown.customerPersonName || '';
       this.phone = customerPersonDetailsDropDown.phone || '';
       this.email = customerPersonDetailsDropDown.email || '';
    }
  }
  
}

