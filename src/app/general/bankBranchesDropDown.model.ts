// @ts-nocheck
import { formatDate } from '@angular/common';
export class BankBranchesDropDown {
  bankBranchID: number;
  bankBranch: string;

  constructor(bankBranchDropDown) {
    {
      this.bankBranchID = bankBranchDropDown.bankBranchID || -1;
      this.bankBranch = bankBranchDropDown.bankBranch || '';
    }
  }
  
}

