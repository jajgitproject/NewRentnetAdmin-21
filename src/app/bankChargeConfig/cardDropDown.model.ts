// @ts-nocheck
import { formatDate } from '@angular/common';
export class CardDropDown {
  cardID: number;
  card: string;

  constructor(cardDropDown) {
    {
      this.cardID = cardDropDown.cardID || -1;
      this.card = cardDropDown.card || '';
    }
  }
  
}

