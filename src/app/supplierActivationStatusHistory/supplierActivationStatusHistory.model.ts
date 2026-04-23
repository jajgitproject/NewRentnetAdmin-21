// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierActivationStatusHistory {
   //supplierActivationStatusHistoryID: number;
   supplierID:number;
   userID:number;
   supplierName:string;
   supplierStatus: string;
   supplierStatusReason: string;
   supplierStatusByEmployeeID:number;
   supplierStatusDate:Date;

  constructor(supplierActivationStatusHistory) {
    {
      // this.supplierActivationStatusHistoryID = supplierActivationStatusHistory.supplierActivationStatusHistoryID || -1;
       this.supplierID = supplierActivationStatusHistory.supplierID || '';
       this.supplierStatus = supplierActivationStatusHistory.supplierStatus || '';
       this.supplierStatusReason = supplierActivationStatusHistory.supplierStatusReason || '';
       this.supplierStatusByEmployeeID = supplierActivationStatusHistory.supplierStatusByEmployeeID || '';
       this.supplierStatusDate = supplierActivationStatusHistory.supplierStatusDate || '';
    }
  }
  
}

