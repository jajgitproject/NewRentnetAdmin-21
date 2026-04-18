// @ts-nocheck
import { formatDate } from '@angular/common';
export class LutDropDown {
   lutID: number;
   lutNo: string;

  constructor(lutDropDown) {
    {
       this.lutID = lutDropDown.lutID || -1;
       this.lutNo = lutDropDown.lutNo || '';
    }
  }
  
}

