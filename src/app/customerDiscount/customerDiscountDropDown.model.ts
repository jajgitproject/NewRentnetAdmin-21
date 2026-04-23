// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDiscountDropDown {
 
   customerDiscountID: number;
   customerDiscount: string;

  constructor(customerDiscountDropDown) {
    {
       this.customerDiscountID = customerDiscountDropDown.customerDiscountID || -1;
       this.customerDiscount = customerDiscountDropDown.customerDiscount || '';
    }
  }
  
}

