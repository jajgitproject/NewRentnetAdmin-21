// @ts-nocheck
import { formatDate } from '@angular/common';
export class CardType {
   cardTypeID: number;
   cardType: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
  constructor(cardType) {
    {
       this.cardTypeID = cardType.cardTypeID || -1;
       this.cardType = cardType.cardType || '';
       this.activationStatus = cardType.activationStatus || '';
       this.updatedBy=cardType.updatedBy || 10;
       this.updateDateTime = cardType.updateDateTime;
    }
  }
  
}

