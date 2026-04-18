// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationSupplier {
  customerConfigurationSupplierID:number;
  customerID:number;
  commissionToBeDeductedFromVendor:number;
  deductCreditCardFeesFromVendor:number;
  supplierPaymentType:string;
  supplierPercentage:number;
  activationStatus:boolean;
  
  constructor(customerConfigurationSupplier) {
    {
       this.customerConfigurationSupplierID = customerConfigurationSupplier.customerConfigurationSupplierID || -1;
       this.customerID = customerConfigurationSupplier.customerID || '';
       this.commissionToBeDeductedFromVendor = customerConfigurationSupplier.commissionToBeDeductedFromVendor || '';
       this.deductCreditCardFeesFromVendor = customerConfigurationSupplier.deductCreditCardFeesFromVendor || '';
       this.supplierPaymentType = customerConfigurationSupplier.supplierPaymentType || '';
       this.supplierPercentage = customerConfigurationSupplier.supplierPercentage || 0;
       this.activationStatus = customerConfigurationSupplier.activationStatus || '';
    }
  }
  
}

