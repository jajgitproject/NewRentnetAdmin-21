// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonAlertMessages {
  customerPersonAlertMessagesID: number;
  customerPersonID: number;
  bookingAlert:string;
  carAlert:string;
  driverAlert:string;
  dispatchAlert:string;
  billingAlert:string;
   activationStatus:boolean;
   userID:number
  constructor(customerPersonAlertMessages) {
    {
       this.customerPersonAlertMessagesID = customerPersonAlertMessages.customerPersonAlertMessagesID || -1;
       this.customerPersonID = customerPersonAlertMessages.customerPersonID || '';
       this.carAlert = customerPersonAlertMessages.carAlert || '';
       this.bookingAlert = customerPersonAlertMessages.bookingAlert || '';
       this.dispatchAlert = customerPersonAlertMessages.dispatchAlert || '';
       this.driverAlert = customerPersonAlertMessages.vipStatusStartDateString || '';
       this.billingAlert = customerPersonAlertMessages.billingAlert || '';
       this.activationStatus = customerPersonAlertMessages.activationStatus || '';
    }
  }
  
}

