// @ts-nocheck
import { formatDate } from '@angular/common';
export class ExpenseDropDown {
  expenseID: number;
  expense: string;

  constructor(expenseDropDown) {
    {
      this.expenseID = expenseDropDown.expenseID || -1;
      this.expense = expenseDropDown.expense || '';
    }
  }
  
}


