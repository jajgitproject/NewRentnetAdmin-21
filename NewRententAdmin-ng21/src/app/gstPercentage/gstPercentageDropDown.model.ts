// @ts-nocheck
import { formatDate } from '@angular/common';
export class GSTPercentageDropDown {
 
   gstPercentageID: number;
   gstPercentage: string;

  constructor(gstPercentageDropDown) {
    {
       this.gstPercentageID = gstPercentageDropDown.gstPercentageID || -1;
       this.gstPercentage = gstPercentageDropDown.gstPercentage || '';
    }
  }
  
}

