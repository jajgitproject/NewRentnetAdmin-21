// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierCustomerFixedForAllPercentage {
    supplierCustomerFixedPercentageForAllID: number;
    customerID: number;
    fromDate:Date;
    customerName:string;
    fromDateString:string;
    toDate:Date;
    toDateString:string;
    supplierPercentage:number;
    activationStatus:boolean;
  constructor(supplierCustomerFixedForAllPercentage) {
    {
       this.supplierCustomerFixedPercentageForAllID = supplierCustomerFixedForAllPercentage. supplierCustomerFixedPercentageForAllID || -1;
       this.customerID = supplierCustomerFixedForAllPercentage. customerID || '';
       this.fromDateString = supplierCustomerFixedForAllPercentage. fromDateString || '';
       this.toDateString = supplierCustomerFixedForAllPercentage. toDateString || '';
       this.supplierPercentage = supplierCustomerFixedForAllPercentage. supplierPercentage || '';
       this.activationStatus =  supplierCustomerFixedForAllPercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

