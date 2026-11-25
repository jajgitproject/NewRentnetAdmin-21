// @ts-nocheck
import { formatDate } from '@angular/common';
export const DEBIT_TYPE_FOR_OPTIONS = ['Incidence', 'General', 'Both'] as const;

export class DebitTypeModel {
  debitTypeID: number;
  debitType: string;
  debitTypeAmount:number;
  debitTypeFor: string;
  userID:number;
  activationStatus: boolean;

  constructor(debitTypeModel) {
    {
       this.debitTypeID = debitTypeModel.debitTypeID || -1;
       this.debitType = debitTypeModel.debitType || '';
       this.debitTypeAmount = debitTypeModel.debitTypeAmount || '';
       this.debitTypeFor = debitTypeModel.debitTypeFor || 'Both';
       this.activationStatus = debitTypeModel.activationStatus || '';
    }
  }
  
}

