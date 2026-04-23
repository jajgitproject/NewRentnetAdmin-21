// @ts-nocheck
import { formatDate } from '@angular/common';
export class DebitTypeModel {
  debitTypeID: number;
  debitType: string;
  debitTypeAmount:number;
  userID:number;
  activationStatus: boolean;

  constructor(debitTypeModel) {
    {
       this.debitTypeID = debitTypeModel.debitTypeID || -1;
       this.debitType = debitTypeModel.debitType || '';
       this.debitTypeAmount = debitTypeModel.debitTypeAmount || '';
       this.activationStatus = debitTypeModel.activationStatus || '';
    }
  }
  
}

