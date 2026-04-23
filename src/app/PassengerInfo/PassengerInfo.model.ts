// @ts-nocheck
import { formatDate } from '@angular/common';
export class PassengerInfo {
   PassengerInfoID: number;
   PassengerInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(PassengerInfo) {
    {
       this.PassengerInfoID = PassengerInfo.PassengerInfoID || -1;
       this.PassengerInfo = PassengerInfo.PassengerInfo || '';
       this.activationStatus = PassengerInfo.activationStatus || '';
       this.updatedBy=PassengerInfo.updatedBy || 10;
       this.updateDateTime = PassengerInfo.updateDateTime;
    }
  }
  
}

