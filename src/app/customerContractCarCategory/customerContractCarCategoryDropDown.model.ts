// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractCarCategoryDropDown {
  customerContractCarCategory: string;
  customerContractCarCategoryID: number;

  constructor(customerContractCarCategoryDropDown) {
    {
      this.customerContractCarCategory = customerContractCarCategoryDropDown.customerContractCarCategory || -1;
      this.customerContractCarCategoryID = customerContractCarCategoryDropDown.customerContractCarCategoryID || '';
    }
  }
  
}

