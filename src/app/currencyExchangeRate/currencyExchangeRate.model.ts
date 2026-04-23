// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrencyExchangeRate {
   currencyExchangeRateID: number;
   currencyID: number;
   currencyName:string;
   exchangeDate: string;
   exchangeRate:string;
   source:string;
   applicableFromString:string;
   applicableFrom:Date;
   applicableToString:string;
   applicableTo:Date;
   activationStatus: boolean;
   userID:number;

  constructor(currencyExchangeRate) {
    {
       this.currencyExchangeRateID = currencyExchangeRate.currencyExchangeRateID || -1;
       this.currencyID = currencyExchangeRate.currencyID || '';
       this.exchangeDate = currencyExchangeRate.exchangeDate || '';
       this.exchangeRate = currencyExchangeRate.exchangeRate || '';
       this.source = currencyExchangeRate.source  || '';
       this.applicableFromString = currencyExchangeRate.applicableFromString  || '';
       this.activationStatus = currencyExchangeRate.activationStatus || '';
       this.applicableToString=currencyExchangeRate.applicableToString || '';
       this.applicableFrom=new Date();
       this.applicableTo=new Date();
      
    }
  }
  
}

