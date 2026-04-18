// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerType {
   customerTypeID: number;
   customerType: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID: number;
  constructor(customerType) {
    {
       this.customerTypeID = customerType.customerTypeID || -1;
       this.customerType = customerType.customerType || '';
       this.activationStatus = customerType.activationStatus || '';
       this.updatedBy=customerType.updatedBy || 10;
       this.updateDateTime = customerType.updateDateTime;
    }
  }
  
}

