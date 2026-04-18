// @ts-nocheck
import { formatDate } from '@angular/common';
export class CardTypeDropDown {
   cardTypeID: number;
   cardType: string;

  constructor(cardTypeDropDown) {
    {
       this.cardTypeID = cardTypeDropDown.cardTypeID || -1;
       this.cardType = cardTypeDropDown.cardType || '';
    }
  }
  
}

