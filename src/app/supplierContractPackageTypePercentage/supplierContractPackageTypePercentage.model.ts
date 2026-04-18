// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractPackageTypePercentage {
  supplierContractPackageTypePercentageID: number;
  userID:number;
  supplierContractID : number;
  packageTypeID   : number;
  fromDate :Date;
  toDate :Date;
  packageType:string;
  toDateString:string;
  fromDateString:string;
  supplierPercentage :string;
   activationStatus: Boolean;
  

  constructor(supplierContractPackageTypePercentage) {
    {
       this.supplierContractPackageTypePercentageID = supplierContractPackageTypePercentage.supplierContractPackageTypePercentageID || -1;
       this.supplierContractID = supplierContractPackageTypePercentage.supplierContractID || '';
       this.packageTypeID   = supplierContractPackageTypePercentage.packageTypeID   || '';
       this.fromDateString = supplierContractPackageTypePercentage.fromDateString || '';
       this.toDateString = supplierContractPackageTypePercentage.toDateString || '';
       this.supplierPercentage = supplierContractPackageTypePercentage.supplierPercentage || '';
       this.activationStatus = supplierContractPackageTypePercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

