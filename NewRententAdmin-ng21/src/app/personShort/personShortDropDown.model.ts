// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDropDown {
 
   customerPersonID: number;
   customerPersonName: string;
   gender:string;
   importance:string;

  constructor(customerPersonDropDown) {
    {
       this.customerPersonID = customerPersonDropDown.customerPersonID || -1;
       this.customerPersonName = customerPersonDropDown.customerPersonName || '';
       this.gender = customerPersonDropDown.gender || '';
       this.importance = customerPersonDropDown.importance || '';
    }
  }
  
}

