// @ts-nocheck
import { formatDate } from '@angular/common';
export class CancelInvoice {
   invoiceCancelationReason: string;
   invoiceCancelationRemark:string;
   invoiceNumberWithPrefix: string;
   cancelationByID:number;
   invoiceID:number;
  

  constructor(cancelInvoice) {
    {
      this.invoiceID = cancelInvoice.invoiceID || 0;
      this.invoiceCancelationReason = cancelInvoice.invoiceCancelationReason || ''; 
      this.invoiceCancelationRemark = cancelInvoice.invoiceCancelationRemark || '';      
      this.invoiceNumberWithPrefix = cancelInvoice.invoiceNumberWithPrefix || '';
      this.cancelationByID = cancelInvoice.cancelationByID || '';     
    }
  }
  
}


