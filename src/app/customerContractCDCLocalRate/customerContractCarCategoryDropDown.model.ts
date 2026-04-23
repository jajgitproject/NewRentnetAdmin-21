// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCarCategoryDropDown {
 
   customerContractCarCategoryID: number;
   customerContractCarCategory: string;

  constructor(customerContractCarCategoryDropDown) {
    {
       this.customerContractCarCategoryID = customerContractCarCategoryDropDown.customerContractCarCategoryID || -1;
       this.customerContractCarCategory = customerContractCarCategoryDropDown.customerContractCarCategory || '';
    }
  }
  
}

