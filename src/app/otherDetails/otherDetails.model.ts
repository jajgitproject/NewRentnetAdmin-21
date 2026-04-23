// @ts-nocheck
import { formatDate } from '@angular/common';
export class OtherDetails {
   reservationID: number;
  ticketNumber:string;
   attachment:string;
   emailLink:string;
   reservationSourceID:number;
   reservationSourceDetail:string;
   referenceNumber:string;
   bookingEditedBy:string;
   reservationMode:string;
   reservationSource:string;
   userID:number

  constructor(otherDetails) {
    {
       this.reservationID = otherDetails.reservationID || -1;
       this.ticketNumber = otherDetails.ticketNumber || '';
       this.attachment = otherDetails.attachment || '';
       this.emailLink=otherDetails.emailLink || '';
       this.reservationSourceID = otherDetails.reservationSourceID || '';
       this.reservationSourceDetail = otherDetails.reservationSourceDetail || '';
       this.referenceNumber = otherDetails.referenceNumber || '';
    }
  }
  
}

