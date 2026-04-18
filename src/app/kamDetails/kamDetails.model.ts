// @ts-nocheck
import { formatDate } from '@angular/common';
export class KamDetails {
   kamDetailsID: number;
   kamDetails: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;
   userID: number;
  constructor(kamDetails) {
    {
       this.kamDetailsID = kamDetails.kamDetailsID || -1;
       this.kamDetails = kamDetails.kamDetails || '';
       this.activationStatus = kamDetails.activationStatus || '';
       this.updatedBy=kamDetails.updatedBy || 10;
       this.updateDateTime = kamDetails.updateDateTime;
    }
  }
  
}

