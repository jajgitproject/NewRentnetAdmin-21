// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddDiscount {
   addDiscountID: number;
   addDiscount: string;
   discountOn: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(addDiscount) {
    {
       this.addDiscountID = addDiscount.addDiscountID || -1;
       this.addDiscount = addDiscount.addDiscount || '';
       this.discountOn = addDiscount.discountOn || '';
       this.updatedBy=addDiscount.updatedBy || 10;
       this.updateDateTime = addDiscount.updateDateTime;
    }
  }
  
}

