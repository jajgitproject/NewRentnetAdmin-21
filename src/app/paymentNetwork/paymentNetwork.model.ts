// @ts-nocheck
import { formatDate } from '@angular/common';
export class PaymentNetwork {
   paymentNetworkID: number;
   userID:number;
   paymentNetwork: string;
   remark: string;
   activationStatus: boolean;

  constructor(paymentNetwork) {
    {
       this.paymentNetworkID = paymentNetwork.paymentNetworkID || -1;
       this.paymentNetwork = paymentNetwork.paymentNetwork || '';
       this.remark = paymentNetwork.remark  || '';
       this.activationStatus = paymentNetwork.activationStatus || '';
    }
  }
  
}

