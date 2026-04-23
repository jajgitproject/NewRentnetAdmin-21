// @ts-nocheck
import { formatDate } from '@angular/common';
export class CardProcessingCharge {
   cardProcessingChargeID: number;
   cardProcessingCharge: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
  constructor(cardProcessingCharge) {
    {
       this.cardProcessingChargeID = cardProcessingCharge.cardProcessingChargeID || -1;
       this.cardProcessingCharge = cardProcessingCharge.cardProcessingCharge || '';
       this.activationStatus = cardProcessingCharge.activationStatus || '';
       this.updatedBy=cardProcessingCharge.updatedBy || 10;
       this.updateDateTime = cardProcessingCharge.updateDateTime;
    }
  }
  
}

