// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCategoryDropDown {
   customerCategoryID: number;
   customerCategory: string;

  constructor(customerCategoryDropDown) {
    {
       this.customerCategoryID = customerCategoryDropDown.customerCategoryID || -1;
       this.customerCategory = customerCategoryDropDown.customerCategory || '';
    }
  }
  
}

