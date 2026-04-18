// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillToOtherDropDown {
   billToOtherID: number;
   billToOther: string;

  constructor(billToOtherDropDown) {
    {
       this.billToOtherID = billToOtherDropDown.billToOtherID || -1;
       this.billToOther = billToOtherDropDown.billToOther || '';
    }
  }
  
}

