// @ts-nocheck
import { formatDate } from '@angular/common';
export class GSTPercentageDropDown {
   gstPercentageID: number;
   gstPercentage: string;

  constructor(gSTPercentageDropDown) {
    {
       this.gstPercentageID = gSTPercentageDropDown.gstPercentageID || -1;
       this.gstPercentage = gSTPercentageDropDown.gstPercentage || '';
    }
  }
  
}

