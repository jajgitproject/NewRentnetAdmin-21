// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerAlertMessageType {
  customerAlertMessageTypeID: number;
  customerAlertMessageType: string;
  activationStatus: boolean;

  constructor(customerAlertMessageType) {
    {
       this.customerAlertMessageTypeID = customerAlertMessageType.customerAlertMessageTypeID || -1;
       this.customerAlertMessageType = customerAlertMessageType.customerAlertMessageType || '';
       this.activationStatus = customerAlertMessageType.activationStatus || '';
    }
  }
  
}

