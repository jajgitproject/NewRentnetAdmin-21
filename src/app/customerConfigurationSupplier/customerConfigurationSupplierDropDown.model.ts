// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationSupplierDropDown {
 
   customerConfigurationSupplierID: number;
   customerConfigurationSupplier: string;

  constructor(customerConfigurationSupplierDropDown) {
    {
       this.customerConfigurationSupplierID = customerConfigurationSupplierDropDown.customerConfigurationSupplierID || -1;
       this.customerConfigurationSupplier = customerConfigurationSupplierDropDown.customerConfigurationSupplier || '';
    }
  }
  
}

