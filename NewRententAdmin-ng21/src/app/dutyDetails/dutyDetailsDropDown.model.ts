// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyDetailsDropDown {
   dutyDetailsID: number;
   dutyDetails: string;

  constructor(dutyDetailsDropDown) {
    {
       this.dutyDetailsID = dutyDetailsDropDown.dutyDetailsID || -1;
       this.dutyDetails = dutyDetailsDropDown.dutyDetails || '';
    }
  }
  
}

