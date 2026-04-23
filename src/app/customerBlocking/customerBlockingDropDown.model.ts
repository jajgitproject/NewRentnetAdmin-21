// @ts-nocheck
import { formatDate } from '@angular/common';
export class DepartmentDropDown {
 
   customerBlockingID: number;
   customerBlocking: string;

  constructor(customerBlockingDropDown) {
    {
       this.customerBlockingID = customerBlockingDropDown.customerBlockingID || -1;
       this.customerBlocking = customerBlockingDropDown.customerBlocking || '';
    }
  }
  
}

