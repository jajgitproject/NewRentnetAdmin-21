// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractPercentage {
  supplierContractPercentageID: number;
  userID:number;
  supplierContractID : number;
  fromDate :Date;
  toDate :Date;
  toDateString:string;
  fromDateString:string;
  supplierPercentage :string;
   activationStatus: Boolean;
  

  constructor(supplierContractPercentage) {
    {
       this.supplierContractPercentageID = supplierContractPercentage.supplierContractPercentageID || -1;
       this.supplierContractID = supplierContractPercentage.supplierContractID || '';
       this.fromDateString = supplierContractPercentage.fromDateString || '';
       this.toDateString = supplierContractPercentage.toDateString || '';
       this.supplierPercentage = supplierContractPercentage.supplierPercentage || '';
       this.activationStatus = supplierContractPercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

