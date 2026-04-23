// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangeSaleForCustomers {
  customerSalesManagerID: number;
  oldSalesManagerID : number;
  newSalesManagerID:number;
  newSalesManagerActivationFromDate :Date;
  newSalesManagerActivationToDate :Date;
  newSalesManagerActivationToDateString:string;
  newSalesManagerActivationFromDateString:string;
   newSalesManagerActivationStatus: Boolean;
   oldCustomerSalesManagerEmployee:string;
   newCustomerSalesManagerEmployee:string;
employeeID: number;
  userID: number;

  constructor(changeSaleForCustomers) {
    {
       this.customerSalesManagerID = changeSaleForCustomers.customerSalesManagerID || -1;
           this.oldSalesManagerID = changeSaleForCustomers.oldSalesManagerID ?? 0;

       this.newSalesManagerID = changeSaleForCustomers.newSalesManagerID ?? 0;
       this.newSalesManagerActivationFromDateString = changeSaleForCustomers.newSalesManagerActivationFromDateString || '';
       this.newSalesManagerActivationToDateString = changeSaleForCustomers.newSalesManagerActivationToDateString || '';
       this.newSalesManagerActivationStatus = changeSaleForCustomers.newSalesManagerActivationStatus || '';
       this.newSalesManagerActivationFromDate=new Date();
      //  this.newSalesManagerActivationToDate=new Date();
    }
  }
  
}

