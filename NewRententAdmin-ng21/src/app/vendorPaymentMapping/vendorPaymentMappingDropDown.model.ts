// @ts-nocheck
import { formatDate } from '@angular/common';
export class PaymentModel {
  
   modeOfPaymentID:number;
   modeOfPayment: string;


  constructor(paymentModel) {
    {
    
       this.modeOfPayment = paymentModel.modeOfPayment || '';

       this.modeOfPaymentID = paymentModel.modeOfPaymentID || '';


    }
  }
  
}

