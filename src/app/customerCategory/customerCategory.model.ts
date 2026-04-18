// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCategory {
   customerCategoryID: number;
   customerCategory: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID: number;

  constructor(customerCategory) {
    {
       this.customerCategoryID = customerCategory.customerCategoryID || -1;
       this.customerCategory = customerCategory.customerCategory || '';
       this.activationStatus = customerCategory.activationStatus || '';
       this.updatedBy=customerCategory.updatedBy || 10;
       this.updateDateTime = customerCategory.updateDateTime;
    }
  }
  
}

