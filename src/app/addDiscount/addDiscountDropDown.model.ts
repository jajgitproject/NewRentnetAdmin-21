// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddDiscountDropDown {
   addDiscountID: number;
   addDiscount: string;

  constructor(addDiscountDropDown) {
    {
       this.addDiscountID = addDiscountDropDown.addDiscountID || -1;
       this.addDiscount = addDiscountDropDown.addDiscount || '';
    }
  }
  
}

