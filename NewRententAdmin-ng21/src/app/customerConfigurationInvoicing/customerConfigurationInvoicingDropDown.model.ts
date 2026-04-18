// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationInvoicingDropDown {
   customerConfigurationInvoicingID: number;
   supplierContractID: string;

  constructor(customerConfigurationInvoicingDropDown) {
    {
       this.customerConfigurationInvoicingID = customerConfigurationInvoicingDropDown.customerConfigurationInvoicingID || -1;
       this.supplierContractID = customerConfigurationInvoicingDropDown.supplierContractID || '';
    }
  }
  
}

