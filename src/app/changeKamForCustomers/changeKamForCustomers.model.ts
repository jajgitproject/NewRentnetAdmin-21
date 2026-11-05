// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeKamForCustomers {
  customerKeyAccountManagerID: number;
  oldKAMID : number;
  newKAMID:number;
  newKAMActivationFromDate :Date;
  newKAMActivationToDate :Date;
  newKAMActivationToDateString:string;
  newKAMActivationFromDateString:string;
   newKAMActivationStatus: Boolean;
   oldCustomerkamEmployee:string;
   newCustomerkamEmployee:string;
employeeID: number;
  userID: number;

  constructor(changeKamForCustomers) {
    {
       this.customerKeyAccountManagerID = changeKamForCustomers.customerKeyAccountManagerID || -1;
   this.oldKAMID =
         changeKamForCustomers.oldKAMID ?? changeKamForCustomers.oldKeyAccountManagerID ?? 0;

       this.newKAMID =
         changeKamForCustomers.newKAMID ?? changeKamForCustomers.newKeyAccountManagerID ?? 0;
       this.newKAMActivationFromDateString = changeKamForCustomers.newKAMActivationFromDateString || '';
       this.newKAMActivationToDateString = changeKamForCustomers.newKAMActivationToDateString || '';
       this.newKAMActivationStatus = changeKamForCustomers.newKAMActivationStatus || '';
       this.newKAMActivationFromDate =
         changeKamForCustomers.newKAMActivationFromDate ||
         changeKamForCustomers.startDate ||
         new Date();
       this.oldCustomerkamEmployee =
         changeKamForCustomers.oldCustomerkamEmployee || changeKamForCustomers.oldKeyAccountManagerName || '';
       this.newCustomerkamEmployee =
         changeKamForCustomers.newCustomerkamEmployee || changeKamForCustomers.newKeyAccountManagerName || '';
      //  this.newKAMActivationToDate=new Date();
    }
  }
  
}

