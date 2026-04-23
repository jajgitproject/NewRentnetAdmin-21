// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCustomerPackageTypePercentage {
  supplierContractCustomerPackageTypePercentageID: number;
  userID:number;
  supplierContractID : number;
  packageTypeID: number;
  customerID:number;
  fromDate :Date;
  toDate :Date;
  toDateString:string;
  fromDateString:string;
  customerName:string;
  supplierPercentage :string;
  packageType:string;
   activationStatus: Boolean;
  

  constructor(supplierContractCustomerPackageTypePercentage) {
    {
       this.supplierContractCustomerPackageTypePercentageID = supplierContractCustomerPackageTypePercentage.supplierContractCustomerPackageTypePercentageID || -1;
       this.supplierContractID = supplierContractCustomerPackageTypePercentage.supplierContractID || '';
       this.packageTypeID   = supplierContractCustomerPackageTypePercentage.packageTypeID   || '';
       this.customerID   = supplierContractCustomerPackageTypePercentage.customerID   || '';
       this.fromDateString = supplierContractCustomerPackageTypePercentage.fromDateString || '';
       this.toDateString = supplierContractCustomerPackageTypePercentage.toDateString || '';
       this.supplierPercentage = supplierContractCustomerPackageTypePercentage.supplierPercentage || '';
       this.activationStatus = supplierContractCustomerPackageTypePercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

