// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonAddressDropDown {
 
   customerPersonAddressID: number;
   customerPersonAddress: string;

  constructor(customerPersonAddressDropDown) {
    {
       this.customerPersonAddressID = customerPersonAddressDropDown.customerPersonAddressID || -1;
       this.customerPersonAddress = customerPersonAddressDropDown.customerPersonAddress || '';
    }
  }
  
}

