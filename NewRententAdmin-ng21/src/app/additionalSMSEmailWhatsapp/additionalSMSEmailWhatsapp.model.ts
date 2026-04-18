// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalSMSEmailWhatsapp {
  reservationAdditionalMessagingID: number;
  reservationID: number;
   personToBeMessaged:string;
   mobileNumber: string;
   emailID: string;
   activationStatus: boolean;
  countryCodes: string;
  userID:number
  constructor(additionalSMSEmailWhatsapp) {
    {
       this.reservationAdditionalMessagingID = additionalSMSEmailWhatsapp.reservationAdditionalMessagingID || -1;
       this.reservationID = additionalSMSEmailWhatsapp.reservationID || '';
       this.activationStatus = additionalSMSEmailWhatsapp.activationStatus || '';
       this.personToBeMessaged=additionalSMSEmailWhatsapp.personToBeMessaged || '';
       this.mobileNumber = additionalSMSEmailWhatsapp.mobileNumber;
       this.emailID = additionalSMSEmailWhatsapp.emailID;
       this.activationStatus = additionalSMSEmailWhatsapp.activationStatus;
    }
  }
  
}

