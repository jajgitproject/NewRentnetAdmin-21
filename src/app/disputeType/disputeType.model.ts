// @ts-nocheck
import { formatDate } from '@angular/common';
export class DisputeType {
   disputeTypeID: number;
   disputeType: string;
   userID:number;
   activationStatus: boolean;

  constructor(disputeType) {
    {
       this.disputeTypeID = disputeType.disputeTypeID || -1;
       this.disputeType = disputeType.disputeType || '';
       this.activationStatus = disputeType.activationStatus || '';
    }
  }
  
}

