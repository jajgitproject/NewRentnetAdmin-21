// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPaymentTermsCode {
  customerPaymentTermsCodeID: number;
  customerID: number;
  paymentTermCode: string;
   customerName:string;
   activationStatus:boolean;
  userID: number;
  constructor(customerPaymentTermsCode) {
    {
       this.customerPaymentTermsCodeID = customerPaymentTermsCode.customerPaymentTermsCodeID || -1;
       this.customerID = customerPaymentTermsCode.customerID || '';
       this.paymentTermCode = customerPaymentTermsCode.paymentTermCode || '';
       this.customerName = customerPaymentTermsCode.customerName || '';
       this.activationStatus = customerPaymentTermsCode.activationStatus || '';
    }
  }
  
}

