// @ts-nocheck
import { formatDate } from '@angular/common';
export class PaymentNetworkDropDown {
   paymentNetworkID: number;
   paymentNetwork: string;

  constructor(paymentNetworkDropDown) {
    {
       this.paymentNetworkID = paymentNetworkDropDown.paymentNetworkID || -1;
       this.paymentNetwork = paymentNetworkDropDown.paymentNetwork || '';
    }
  }
  
}

