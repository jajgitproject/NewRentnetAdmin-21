// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerTypeDropDown {
   customerTypeID: number;
   customerType: string;

  constructor(customerTypeDropDown) {
    {
       this.customerTypeID = customerTypeDropDown.customerTypeID || -1;
       this.customerType = customerTypeDropDown.customerType || '';
    }
  }
  
}

