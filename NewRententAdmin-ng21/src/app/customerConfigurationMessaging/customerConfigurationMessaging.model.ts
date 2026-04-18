// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationMessaging {
   customerConfigurationMessagingID: number;
   customerID:number;
   reservationSMSToBooker: boolean;
   allotmentSMSToBooker: boolean;
   dispatchSMSToBooker:boolean;
   reachedSMSToBooker:boolean;
   tripStartSMSToBooker:boolean;
   tripEndSMSToBooker:boolean;
   reservationEmailToBooker:boolean;
   allotmentEmailToBooker:boolean;
   dispatchEmailToBooker:boolean;
   reachedEmailToBooker:boolean;
   tripStartEmailToBooker:boolean;
   tripEndEmailToBooker:boolean;
   reservationSMSToPassenger:boolean;
   allotmentSMSToPassenger:boolean;
   dispatchSMSToPassenger:boolean;
   reachedSMSToPassenger:boolean;
   tripStartSMSToPassenger:boolean;
   tripEndSMSToPassenger:boolean;
   reservationEmailToPassenger:boolean;
   allotmentEmailToPassenger:boolean;
   dispatchEmailToPassenger:boolean;
   reachedEmailToPassenger:boolean;
   tripStartEmailToPassenger:boolean;
   tripEndEmailToPassenger:boolean;
   passengerSMSAlert:boolean;
   activationStatus: boolean;
  userID: number;

  constructor(customerConfigurationMessagings) {
    {
       this.customerConfigurationMessagingID = customerConfigurationMessagings.customerConfigurationMessagingID || -1;
       this.customerID=customerConfigurationMessagings.customerID || 1;
       this.reservationSMSToBooker=customerConfigurationMessagings.reservationSMSToBooker || true;
       this.allotmentSMSToBooker=customerConfigurationMessagings.allotmentSMSToBooker || true;
       this.dispatchSMSToBooker=customerConfigurationMessagings.dispatchSMSToBooker || true;
       this.reachedSMSToBooker=customerConfigurationMessagings.reachedSMSToBooker || true;
       this.tripStartSMSToBooker=customerConfigurationMessagings.tripStartSMSToBooker || true;
       this.tripEndSMSToBooker=customerConfigurationMessagings.tripEndSMSToBooker || true;
       this.reservationEmailToBooker=customerConfigurationMessagings.reservationEmailToBooker || true;
       this.allotmentEmailToBooker=customerConfigurationMessagings.allotmentEmailToBooker || true;
       this.dispatchEmailToBooker=customerConfigurationMessagings.dispatchEmailToBooker || true;
       this.reachedEmailToBooker=customerConfigurationMessagings.reachedEmailToBooker || true;
       this.tripStartEmailToBooker=customerConfigurationMessagings.tripStartEmailToBooker || true;
       this.tripEndEmailToBooker=customerConfigurationMessagings.tripEndEmailToBooker || true;
       this.reservationSMSToPassenger=customerConfigurationMessagings.reservationSMSToPassenger || true;
       this.allotmentSMSToPassenger=customerConfigurationMessagings.allotmentSMSToPassenger || true;
       this.dispatchSMSToPassenger=customerConfigurationMessagings.dispatchSMSToPassenger || true;
       this.reachedSMSToPassenger=customerConfigurationMessagings.reachedSMSToPassenger || true;
       this.tripStartSMSToPassenger=customerConfigurationMessagings.tripStartSMSToPassenger || true;
       this.tripEndSMSToPassenger=customerConfigurationMessagings.tripEndSMSToPassenger || true;
       this.reservationEmailToPassenger=customerConfigurationMessagings.reservationEmailToPassenger || true;
       this.allotmentEmailToPassenger=customerConfigurationMessagings.allotmentEmailToPassenger || true;
       this.dispatchEmailToPassenger=customerConfigurationMessagings.dispatchEmailToPassenger || true;
       this.reachedEmailToPassenger=customerConfigurationMessagings.reachedEmailToPassenger || true;
       this.tripStartEmailToPassenger=customerConfigurationMessagings.tripStartEmailToPassenger || true;
       this.tripEndEmailToPassenger=customerConfigurationMessagings.tripEndEmailToPassenger || true;
       this.passengerSMSAlert=customerConfigurationMessagings.passengerSMSAlert || true;
       this.activationStatus = customerConfigurationMessagings.activationStatus || true;
  
    }
  }
  
}

