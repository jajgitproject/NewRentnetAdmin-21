// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCarCategory {
  customerContractCarCategoryID: number;
  customerContractID: number;
  customerContractCarCategory:string;
  customerContractName:string
   activationStatus:boolean;
   userID:number;
   vehicleCategoryID:number;
  constructor(customerContractCarCategory) {
    {
       this.customerContractCarCategoryID = customerContractCarCategory.customerContractCarCategoryID || -1;
       this.customerContractID = customerContractCarCategory.customerContractID || 0;
       this.customerContractCarCategory = customerContractCarCategory.customerContractCarCategory || '';
       this.customerContractName = customerContractCarCategory.customerContractName || '';
       this.activationStatus = customerContractCarCategory.activationStatus || '';
       this.vehicleCategoryID = customerContractCarCategory.vehicleCategoryID || 0;
       this.userID = customerContractCarCategory.userID || 0;
    }
  }
  
}

