// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDropDown {
 
   customerID: number;
   customerName: string;
   customerIdentityNumber: string;
   tallyCustomerID: number;
   isCPEmailMandatry: boolean;

  constructor(customerDropDown) {
    {
       this.customerID = customerDropDown.customerID || -1;
       this.customerName = customerDropDown.customerName || '';
       this.customerIdentityNumber = customerDropDown.customerIdentityNumber || '';
       this.tallyCustomerID = customerDropDown.tallyCustomerID || 0;
       const cpEmailMandatory = customerDropDown.isCPEmailMandatry ?? customerDropDown.isCPEmailIDMandatory;
       this.isCPEmailMandatry = cpEmailMandatory === true || cpEmailMandatory === false
         ? cpEmailMandatory
         : null;
    }
  }
  
}

