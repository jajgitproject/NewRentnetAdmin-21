// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDetails {
   customerDetailsID: number;
   customerDetails: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(customerDetails) {
    {
       this.customerDetailsID = customerDetails.customerDetailsID || -1;
       this.customerDetails = customerDetails.customerDetails || '';
       this.activationStatus = customerDetails.activationStatus || '';
       this.updatedBy=customerDetails.updatedBy || 10;
       this.updateDateTime = customerDetails.updateDateTime;
    }
  }
  
}

