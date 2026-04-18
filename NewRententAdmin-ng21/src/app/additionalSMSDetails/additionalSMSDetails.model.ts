// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalSMSDetails {
  reservationAdditionalMessagingID: number;
  reservationID: number;
   personToBeMessaged:string;
   mobileNumber: string;
   emailID: string;
   activationStatus: boolean;
   userID:number
  constructor(additionalSMSDetails) {
    {
       this.reservationAdditionalMessagingID = additionalSMSDetails.reservationAdditionalMessagingID || -1;
       this.reservationID = additionalSMSDetails.reservationID || '';
       this.activationStatus = additionalSMSDetails.activationStatus || '';
       this.personToBeMessaged=additionalSMSDetails.personToBeMessaged || '';
       this.mobileNumber = additionalSMSDetails.mobileNumber;
       this.emailID = additionalSMSDetails.emailID;
       this.activationStatus = additionalSMSDetails.activationStatus;
    }
  }
  
}

