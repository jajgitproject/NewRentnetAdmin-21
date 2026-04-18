// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierVerificationStatusHistory {
   //supplierVerificationStatusHistoryID: number;
   supplierID: number;
   userID:number;
   supplierVerificationStatus:string;
   supplierVerificationStatusRemark:string;
   supplierVerificationStatusByEmployeeID:number;
   supplierVerificationStatusDate: Date;
supplierName:string;
  constructor(supplierVerificationStatusHistory) {
    {
       //this.supplierVerificationStatusHistoryID = supplierVerificationStatusHistory.supplierVerificationStatusHistoryID || -1;
       this.supplierID = supplierVerificationStatusHistory.supplierID || '';
       this.supplierVerificationStatus = supplierVerificationStatusHistory.supplierVerificationStatus || '';
       this.supplierVerificationStatusRemark=supplierVerificationStatusHistory.supplierVerificationStatusRemark || '';
       this.supplierVerificationStatusByEmployeeID = supplierVerificationStatusHistory.supplierVerificationStatusByEmployeeID;
       this.supplierVerificationStatusDate = supplierVerificationStatusHistory.supplierVerificationStatusDate;
    }
  }
  
}

