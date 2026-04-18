// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGroup {
   customerGroupID: number;
   customerGroup: string;
   createBookingBeforeMinutes:number;
   editBookingBeforeMinutes:number;
   cancelBookingBeforeMinutes:number;
   activationStatus: boolean;
   isGSTMandatoryWithReservation:boolean;
   updatedBy:number;
   userID:number;
   updateDateTime: Date;

  constructor(customerGroup) {
    {
       this.customerGroupID = customerGroup.customerGroupID || -1;
       this.customerGroup = customerGroup.customerGroup || '';
       this.createBookingBeforeMinutes = customerGroup.createBookingBeforeMinutes || '';
       this.editBookingBeforeMinutes = customerGroup.editBookingBeforeMinutes || '';
       this.cancelBookingBeforeMinutes = customerGroup.cancelBookingBeforeMinutes || '';
       this.activationStatus = customerGroup.activationStatus || '';
       this.isGSTMandatoryWithReservation = customerGroup.isGSTMandatoryWithReservation || '';
       this.updatedBy=customerGroup.updatedBy || 10;
       this.updateDateTime = customerGroup.updateDateTime;
    }
  }
  
}

export class CustomerGroupModel{
  customerGroup: string;
  isDuplicate: boolean;
}
