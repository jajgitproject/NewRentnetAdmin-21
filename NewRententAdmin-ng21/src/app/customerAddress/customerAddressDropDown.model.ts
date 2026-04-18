// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAddressDropDown {
 
   customerAddressID: number;
   customerAddress: string;

  constructor(customerAddressDropDown) {
    {
       this.customerAddressID = customerAddressDropDown.customerAddressID || -1;
       this.customerAddress = customerAddressDropDown.customerAddress || '';
    }
  }
  
}

