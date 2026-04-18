// @ts-nocheck
import { formatDate } from '@angular/common';
export class TransmissionType {
   transmissionTypeID: number;
   userID:number;
   transmissionType: string;
   activationStatus: boolean;

  constructor(transmissionType) {
    {
       this.transmissionTypeID = transmissionType.transmissionTypeID || -1;
       this.transmissionType = transmissionType.transmissionType || '';
       this.activationStatus = transmissionType.activationStatus || '';
    }
  }
  
}

