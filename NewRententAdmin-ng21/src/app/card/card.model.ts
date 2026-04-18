// @ts-nocheck
import { formatDate } from '@angular/common';
export class Card {
   cardID: number;
   card: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   paymentNetworkID:number;
   paymentNetwork:string;
   cardType:string;
   cardTypeID:number;
   userID:number;
  constructor(card) {
    {
       this.cardID = card.cardID || -1;
       this.card = card.card || '';
       this.paymentNetworkID = card.paymentNetworkID || '';
       this.cardTypeID = card.cardTypeID || '';
       this.activationStatus = card.activationStatus || '';
       this.updatedBy=card.updatedBy || 10;
       this.updateDateTime = card.updateDateTime;
    }
  }
  
}

