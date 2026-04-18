// @ts-nocheck
import { formatDate } from '@angular/common';
export class TollParkingTypeDropDown {
   bankID: number;
   bank: string;

  constructor(bankDropDown) {
    {
       this.bankID = bankDropDown.bankID || -1;
       this.bank = bankDropDown.bank || '';
    }
  }
  
}

