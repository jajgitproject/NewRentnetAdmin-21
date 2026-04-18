// @ts-nocheck
import { formatDate } from '@angular/common';
export class CardProcessingChargeDropDown {
  cardProcessingChargeID: number;
  cardProcessingCharge: string;

  constructor(cardProcessingChargeDropDown) {
    {
      this.cardProcessingChargeID = cardProcessingChargeDropDown.cardProcessingChargeID || -1;
      this.cardProcessingCharge = cardProcessingChargeDropDown.cardProcessingCharge || '';
    }
  }
  
}

