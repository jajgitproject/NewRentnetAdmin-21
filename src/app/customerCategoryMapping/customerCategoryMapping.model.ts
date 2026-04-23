// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCategoryMapping {
  customerCategoryMappingID: number;
  customerID: number;
  customerCategoryID: number;
   customerName:string;
   activationStatus:boolean;
   customerCategory:string;
  userID: number;
  constructor(customerCategoryMapping) {
    {
       this.customerCategoryMappingID = customerCategoryMapping.customerCategoryMappingID || -1;
       this.customerID = customerCategoryMapping.customerID || '';
       this.customerCategoryID = customerCategoryMapping.customerCategoryID || 0;
       this.customerName = customerCategoryMapping.customerName || '';
       this.activationStatus = customerCategoryMapping.activationStatus || '';
    }
  }
  
}

