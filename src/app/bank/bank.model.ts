// @ts-nocheck
import { formatDate } from '@angular/common';
export class Bank {
   bankID: number;
   bank: string;
   userID:number;
   activationStatus: boolean;

  constructor(bank) {
    {
       this.bankID = bank.bankID || -1;
       this.bank = bank.bank || '';
       this.activationStatus = bank.activationStatus || '';
    }
  }
  
}

