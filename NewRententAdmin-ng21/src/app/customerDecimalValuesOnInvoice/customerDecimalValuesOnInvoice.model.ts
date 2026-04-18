// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDecimalValuesOnInvoice {
  customerDecimalValuesOnInvoiceID: number;
  customerID: number;
  //corporateCompanyID:number;
  startDate: Date;
  endDate:Date;
  startDateString:string;
  endDateString:string;
   activationStatus:boolean;
   roundOffInvoiceValue:boolean
  userID: number;
  constructor(customerDecimalValuesOnInvoice) {
    {
       this.customerDecimalValuesOnInvoiceID = customerDecimalValuesOnInvoice.customerDecimalValuesOnInvoiceID || -1;
       this.customerID = customerDecimalValuesOnInvoice.customerID || '';
      // this.corporateCompanyID = customerDecimalValuesOnInvoice.corporateCompanyID || '';
       this.startDateString = customerDecimalValuesOnInvoice.startDateString || '';
       this.endDateString = customerDecimalValuesOnInvoice.endDateString || '';
        this.roundOffInvoiceValue = customerDecimalValuesOnInvoice.roundOffInvoiceValue || '';
       this.startDate=new Date();
      //  this.endDate=new Date();
       this.activationStatus = customerDecimalValuesOnInvoice.activationStatus || '';
    }
  }
  
}

