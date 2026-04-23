// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorContractCarCategoryDropDown {

   vendorContractCarCategoryID: number;
   vendorContractCarCategory: string;

  constructor(vendorContractCarCategoryDropDown) {
    {
       this.vendorContractCarCategoryID = vendorContractCarCategoryDropDown.vendorContractCarCategoryID || -1;
       this.vendorContractCarCategory = vendorContractCarCategoryDropDown.vendorContractCarCategory || '';
    }
  }
  
}

