// @ts-nocheck
import { formatDate } from '@angular/common';
export class ExpenseModel {
   expenseID: number;
   expense: string;
   activationStatus: boolean;
   userID:number;
  constructor(expenseModel) {
    {
       this.expenseID = expenseModel.expenseID || -1;
       this.expense = expenseModel.expense || '';
       this.activationStatus = expenseModel.activationStatus || '';
    }
  }
  
}

