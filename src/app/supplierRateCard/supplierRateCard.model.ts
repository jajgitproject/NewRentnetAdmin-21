// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierRateCard {
   supplierRateCardID: number;
   supplierRateCardName: string;
   activationStatus:boolean;
  constructor(supplierRateCard) {
    {
       this.supplierRateCardID = supplierRateCard.supplierRateCardID || -1;
       this.supplierRateCardName = supplierRateCard.supplierRateCardName || '';
       this.activationStatus = supplierRateCard.activationStatus || '';
    }
  }
  
}

